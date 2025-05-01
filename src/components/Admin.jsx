import React, { useState, useEffect } from 'react';
import { Client, Account, Databases, Storage } from 'appwrite';
import '../styles.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Initialize Appwrite
  const client = new Client();
  client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('681312ad0000dd31f180');

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  // Database and collection IDs
  const DATABASE_ID = '681316040007bdd30eee';
  const APPLICATIONS_COLLECTION_ID = '681316d6000e0b4c2985';
  const STORAGE_BUCKET_ID = '68131e98002e14afc25f';

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          setIsLoggedIn(true);
          loadApplications();
        }
      } catch (error) {
        console.log('No active session');
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await account.createEmailSession(loginForm.email, loginForm.password);
      setIsLoggedIn(true);
      loadApplications();
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setIsLoggedIn(false);
      setApplications([]);
      setSelectedApp(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Load applications from Appwrite
  const loadApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Loading applications from database:', DATABASE_ID, 'collection:', APPLICATIONS_COLLECTION_ID);
      const response = await databases.listDocuments(
        DATABASE_ID,
        APPLICATIONS_COLLECTION_ID
      );
      
      console.log('Applications loaded:', response);
      setApplications(response.documents);
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View application details
  const viewApplicationDetails = async (appId) => {
    setLoading(true);
    setError(null);

    try {
      const app = applications.find(app => app.$id === appId);
      if (!app) {
        throw new Error('Application not found');
      }
      
      setSelectedApp(app);
    } catch (error) {
      console.error('Error viewing application details:', error);
      setError('Failed to load application details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close application details modal
  const closeDetails = () => {
    setSelectedApp(null);
  };

  // Render application details
  const renderApplicationDetails = (app) => {
    // Format date
    const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A';
    
    // Generate DL front preview URL if available
    let dlFrontPreview = '';
    if (app.dlFrontId) {
      try {
        const previewUrl = storage.getFilePreview(STORAGE_BUCKET_ID, app.dlFrontId);
        dlFrontPreview = (
          <div className="detail-group">
            <div className="detail-label">Driver's License - Front</div>
            <div className="detail-value">
              <img src={previewUrl} alt="DL Front" className="image-preview" />
              <a 
                href={storage.getFileDownload(STORAGE_BUCKET_ID, app.dlFrontId)} 
                target="_blank" 
                rel="noreferrer" 
                className="view-button" 
                style={{ marginTop: '0.5rem', display: 'inline-block' }}
              >
                Download
              </a>
            </div>
          </div>
        );
      } catch (error) {
        console.error('Error generating DL front preview:', error);
        dlFrontPreview = (
          <div className="detail-group">
            <div className="detail-label">Driver's License - Front</div>
            <div className="detail-value">
              <p>Error loading image. File ID: {app.dlFrontId}</p>
            </div>
          </div>
        );
      }
    }
    
    // Generate DL back preview URL if available
    let dlBackPreview = '';
    if (app.dlBackId) {
      try {
        const previewUrl = storage.getFilePreview(STORAGE_BUCKET_ID, app.dlBackId);
        dlBackPreview = (
          <div className="detail-group">
            <div className="detail-label">Driver's License - Back</div>
            <div className="detail-value">
              <img src={previewUrl} alt="DL Back" className="image-preview" />
              <a 
                href={storage.getFileDownload(STORAGE_BUCKET_ID, app.dlBackId)} 
                target="_blank" 
                rel="noreferrer" 
                className="view-button" 
                style={{ marginTop: '0.5rem', display: 'inline-block' }}
              >
                Download
              </a>
            </div>
          </div>
        );
      } catch (error) {
        console.error('Error generating DL back preview:', error);
        dlBackPreview = (
          <div className="detail-group">
            <div className="detail-label">Driver's License - Back</div>
            <div className="detail-value">
              <p>Error loading image. File ID: {app.dlBackId}</p>
            </div>
          </div>
        );
      }
    }
    
    // Safely get values with fallbacks
    const getValueSafely = (value) => value || 'N/A';
    
    // Handle name as an array
    const nameDisplay = Array.isArray(app.name) ? app.name.join(', ') : (app.name || 'N/A');
    
    return (
      <div className="application-details">
        <div className="detail-group">
          <div className="detail-label">Name</div>
          <div className="detail-value">{nameDisplay}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Email</div>
          <div className="detail-value">{getValueSafely(app.email)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Phone</div>
          <div className="detail-value">{getValueSafely(app.phone)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Address</div>
          <div className="detail-value">{getValueSafely(app.address)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">City</div>
          <div className="detail-value">{getValueSafely(app.city)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">State</div>
          <div className="detail-value">{getValueSafely(app.state)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">ZIP</div>
          <div className="detail-value">{getValueSafely(app.zip)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">SSN</div>
          <div className="detail-value">{getValueSafely(app.ssn)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Age</div>
          <div className="detail-value">{getValueSafely(app.age)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Position</div>
          <div className="detail-value">{getValueSafely(app.position)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Experience</div>
          <div className="detail-value">{getValueSafely(app.experience)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Availability</div>
          <div className="detail-value">{getValueSafely(app.availability)}</div>
        </div>
        
        <div className="detail-group">
          <div className="detail-label">Submitted At</div>
          <div className="detail-value">{submittedDate}</div>
        </div>
        
        {dlFrontPreview}
        {dlBackPreview}
      </div>
    );
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <header className="header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Please log in to access the admin dashboard</p>
          </div>
        </header>
        
        <div className="container">
          <div className="form" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <h2>Admin Login</h2>
            
            {error && (
              <div className="error-alert" style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius)', 
                marginBottom: '1rem' 
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={loginForm.email} 
                  onChange={handleLoginChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={loginForm.password} 
                  onChange={handleLoginChange} 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
        
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2025 AKG Consulting. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage job applications</p>
        </div>
      </header>
      
      <div className="container">
        <div className="admin-actions" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <h2>Applications</h2>
          <div>
            <button 
              className="btn btn-secondary" 
              onClick={loadApplications} 
              disabled={loading}
              style={{ marginRight: '0.5rem' }}
            >
              Refresh
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-alert" style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="applications-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map(app => {
                    const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A';
                    const nameDisplay = Array.isArray(app.name) ? app.name.join(', ') : (app.name || 'N/A');
                    
                    return (
                      <tr key={app.$id}>
                        <td>{nameDisplay}</td>
                        <td>{app.email || 'N/A'}</td>
                        <td>{app.position || 'N/A'}</td>
                        <td>{submittedDate}</td>
                        <td>
                          <button 
                            className="view-button" 
                            onClick={() => viewApplicationDetails(app.$id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {selectedApp && (
        <div className="modal-overlay visible">
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h3 className="modal-title">Application Details</h3>
              <button 
                onClick={closeDetails} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer' 
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              {renderApplicationDetails(selectedApp)}
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button primary" 
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 AKG Consulting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
