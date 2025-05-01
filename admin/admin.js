document.addEventListener('DOMContentLoaded', function() {
  // Appwrite configuration
  const client = new Appwrite.Client();
  
  client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('681312ad0000dd31f180');
  
  const account = new Appwrite.Account(client);
  const databases = new Appwrite.Databases(client);
  const storage = new Appwrite.Storage(client);
  
  // Database and collection IDs
  const DATABASE_ID = '681316040007bdd30eee';
  const APPLICATIONS_COLLECTION_ID = '681316d6000e0b4c2985';
  const STORAGE_BUCKET_ID = '68131e98002e14afc25f';
  
  // DOM elements
  const loginContainer = document.getElementById('loginContainer');
  const adminContainer = document.getElementById('adminContainer');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutButton = document.getElementById('logoutButton');
  const applicationsContainer = document.getElementById('applicationsContainer');
  const applicationsTableBody = document.getElementById('applicationsTableBody');
  const loadingElement = document.getElementById('loading');
  const applicationModal = document.getElementById('applicationModal');
  const applicationDetails = document.getElementById('applicationDetails');
  const closeModalButton = document.getElementById('closeModalButton');
  
  // Check if user is already logged in
  checkSession();
  
  // Event listeners
  loginForm.addEventListener('submit', handleLogin);
  logoutButton.addEventListener('click', handleLogout);
  closeModalButton.addEventListener('click', closeModal);
  
  // Check current session
  async function checkSession() {
    try {
      const user = await account.get();
      if (user) {
        showAdminDashboard();
        loadApplications();
      } else {
        showLoginForm();
      }
    } catch (error) {
      console.error('Session check error:', error);
      showLoginForm();
    }
  }
  
  // Handle login form submission
  async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      loginError.style.display = 'none';
      const session = await account.createEmailSession(email, password);
      showAdminDashboard();
      loadApplications();
    } catch (error) {
      console.error('Login error:', error);
      loginError.textContent = 'Invalid email or password';
      loginError.style.display = 'block';
    }
  }
  
  // Handle logout
  async function handleLogout() {
    try {
      await account.deleteSession('current');
      showLoginForm();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  // Show login form
  function showLoginForm() {
    loginContainer.style.display = 'block';
    adminContainer.style.display = 'none';
  }
  
  // Show admin dashboard
  function showAdminDashboard() {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
  }
  
  // Load applications
  async function loadApplications() {
    try {
      loadingElement.style.display = 'flex';
      applicationsContainer.style.display = 'none';
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID
      );
      
      console.log('Fetched applications:', response);
      
      renderApplications(response.documents);
      
      loadingElement.style.display = 'none';
      applicationsContainer.style.display = 'block';
    } catch (error) {
      console.error('Error loading applications:', error);
      loadingElement.style.display = 'none';
      
      // Show error message in the applications container
      applicationsContainer.style.display = 'block';
      applicationsContainer.innerHTML = `
        <div class="error-message" style="padding: 2rem; text-align: center;">
          <h3>Error Loading Applications</h3>
          <p>${error.message || 'There was an error loading the applications. Please check your Appwrite configuration.'}</p>
          <p>Please ensure that:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>The database "${DATABASE_ID}" exists</li>
            <li>The collection "${APPLICATIONS_COLLECTION_ID}" exists</li>
            <li>You have proper permissions to access the collection</li>
          </ul>
        </div>
      `;
    }
  }
  
  // Render applications table
  function renderApplications(applications) {
    applicationsTableBody.innerHTML = '';
    
    if (!applications || applications.length === 0) {
      applicationsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem;">No applications found</td>
        </tr>
      `;
      return;
    }
    
    applications.forEach(app => {
      const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A';
      
      // Handle name as an array
      const nameDisplay = Array.isArray(app.name) ? app.name.join(', ') : (app.name || 'N/A');
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nameDisplay}</td>
        <td>${app.email || 'N/A'}</td>
        <td>${app.position || 'N/A'}</td>
        <td>${submittedDate}</td>
        <td>
          <button class="view-button" data-id="${app.$id}">View Details</button>
        </td>
      `;
      
      applicationsTableBody.appendChild(row);
      
      // Add event listener to view button
      row.querySelector('.view-button').addEventListener('click', () => {
        viewApplicationDetails(app.$id);
      });
    });
  }
  
  // View application details
  async function viewApplicationDetails(id) {
    try {
      const application = await databases.getDocument(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID,
        id
      );
      
      renderApplicationDetails(application);
      openModal();
    } catch (error) {
      console.error('Error fetching application details:', error);
      alert('Error loading application details: ' + error.message);
    }
  }
  
  // Render application details in modal
  function renderApplicationDetails(app) {
    // Format date
    const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A';
    
    // Generate DL front preview URL if available
    let dlFrontPreview = '';
    if (app.dlFrontId) {
      try {
        const previewUrl = storage.getFilePreview(STORAGE_BUCKET_ID, app.dlFrontId);
        dlFrontPreview = `
          <div class="detail-group">
            <div class="detail-label">Driver's License - Front</div>
            <div class="detail-value">
              <img src="${previewUrl}" alt="DL Front" class="image-preview">
              <a href="${storage.getFileDownload(STORAGE_BUCKET_ID, app.dlFrontId)}" target="_blank" class="view-button" style="margin-top: 0.5rem; display: inline-block;">Download</a>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error generating DL front preview:', error);
        dlFrontPreview = `
          <div class="detail-group">
            <div class="detail-label">Driver's License - Front</div>
            <div class="detail-value">
              <p>Error loading image. File ID: ${app.dlFrontId}</p>
            </div>
          </div>
        `;
      }
    }
    
    // Generate DL back preview URL if available
    let dlBackPreview = '';
    if (app.dlBackId) {
      try {
        const previewUrl = storage.getFilePreview(STORAGE_BUCKET_ID, app.dlBackId);
        dlBackPreview = `
          <div class="detail-group">
            <div class="detail-label">Driver's License - Back</div>
            <div class="detail-value">
              <img src="${previewUrl}" alt="DL Back" class="image-preview">
              <a href="${storage.getFileDownload(STORAGE_BUCKET_ID, app.dlBackId)}" target="_blank" class="view-button" style="margin-top: 0.5rem; display: inline-block;">Download</a>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error generating DL back preview:', error);
        dlBackPreview = `
          <div class="detail-group">
            <div class="detail-label">Driver's License - Back</div>
            <div class="detail-value">
              <p>Error loading image. File ID: ${app.dlBackId}</p>
            </div>
          </div>
        `;
      }
    }
    
    // Safely get values with fallbacks
    const getValueSafely = (value) => value || 'N/A';
    
    // Handle name as an array
    const nameDisplay = Array.isArray(app.name) ? app.name.join(', ') : (app.name || 'N/A');
    
    // Render all application details
    applicationDetails.innerHTML = `
      <div class="detail-group">
        <div class="detail-label">Name</div>
        <div class="detail-value">${nameDisplay}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Email</div>
        <div class="detail-value">${getValueSafely(app.email)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${getValueSafely(app.phone)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Address</div>
        <div class="detail-value">${getValueSafely(app.address)}, ${getValueSafely(app.city)}, ${getValueSafely(app.state)} ${getValueSafely(app.zip)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">SSN</div>
        <div class="detail-value">${getValueSafely(app.ssn)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Age</div>
        <div class="detail-value">${getValueSafely(app.age)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Position</div>
        <div class="detail-value">${getValueSafely(app.position)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Experience</div>
        <div class="detail-value">${getValueSafely(app.experience)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Availability</div>
        <div class="detail-value">${getValueSafely(app.availability)}</div>
      </div>
      
      <div class="detail-group">
        <div class="detail-label">Submitted</div>
        <div class="detail-value">${submittedDate}</div>
      </div>
      
      ${dlFrontPreview}
      
      ${dlBackPreview}
    `;
  }
  
  // Open modal
  function openModal() {
    applicationModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  
  // Close modal
  function closeModal() {
    applicationModal.classList.remove('visible');
    document.body.style.overflow = '';
  }
});
