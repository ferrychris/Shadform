// Import Appwrite service
import { appwriteService } from './utils/appwrite.js';

// Form elements
const form = document.getElementById('application-form');
const sections = document.querySelectorAll('.form-section');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

// Modal elements
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const closeModalBtn = document.getElementById('close-modal');

// Form state
let currentSection = 0;
const totalSections = sections.length;

// Initialize form
function initForm() {
  updateProgress();
  setupFileInputs();
  setupFormNavigation();
  setupFormValidation();
}

// Setup file input handlers
function setupFileInputs() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  
  fileInputs.forEach(input => {
    const infoElement = document.getElementById(`${input.id}-info`);
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Format file size
        const size = formatFileSize(file.size);
        infoElement.textContent = `${file.name} (${size})`;
      } else {
        infoElement.textContent = 'No file selected';
      }
    });
  });
}

// Format file size to human-readable format
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Setup form navigation
function setupFormNavigation() {
  prevBtn.addEventListener('click', goToPrevSection);
  nextBtn.addEventListener('click', goToNextSection);
  
  // Close modal button
  closeModalBtn.addEventListener('click', () => {
    errorModal.classList.remove('visible');
  });
}

// Go to previous section
function goToPrevSection() {
  if (currentSection > 0) {
    sections[currentSection].classList.remove('active');
    currentSection--;
    sections[currentSection].classList.add('active');
    updateProgress();
    updateButtons();
  }
}

// Go to next section
function goToNextSection() {
  if (validateSection(currentSection)) {
    if (currentSection < totalSections - 1) {
      sections[currentSection].classList.remove('active');
      currentSection++;
      sections[currentSection].classList.add('active');
      updateProgress();
      updateButtons();
    }
  } else {
    showSectionErrors(currentSection);
  }
}

// Update progress bar and text
function updateProgress() {
  const percentage = ((currentSection + 1) / totalSections) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `Step ${currentSection + 1} of ${totalSections}`;
}

// Update navigation buttons
function updateButtons() {
  prevBtn.disabled = currentSection === 0;
  
  if (currentSection === totalSections - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }
}

// Setup form validation
function setupFormValidation() {
  form.addEventListener('submit', handleSubmit);
  
  // Add input validation on blur
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorElement = document.getElementById(`${input.id}-error`);
      if (errorElement) {
        errorElement.classList.remove('visible');
      }
    });
  });
}

// Validate a specific form section
function validateSection(sectionIndex) {
  const section = sections[sectionIndex];
  const inputs = section.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Validate a single input
function validateInput(input) {
  // Skip validation for optional fields
  if (!input.required && !input.value) {
    return true;
  }
  
  const errorElement = document.getElementById(`${input.id}-error`);
  let isValid = true;
  
  // Basic validation
  if (input.required && !input.value) {
    isValid = false;
  } else if (input.type === 'email' && input.value) {
    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  } else if (input.type === 'tel' && input.value) {
    isValid = /^[0-9\s\-\+\(\)]{10,15}$/.test(input.value);
  } else if (input.id === 'ssn' && input.value) {
    // Basic SSN validation (XXX-XX-XXXX)
    isValid = /^\d{3}-\d{2}-\d{4}$/.test(input.value) || /^\d{9}$/.test(input.value);
  } else if (input.id === 'zip' && input.value) {
    isValid = /^\d{5}(-\d{4})?$/.test(input.value);
  } else if (input.type === 'file' && input.required) {
    isValid = input.files.length > 0;
  } else if (input.type === 'checkbox' && input.required) {
    isValid = input.checked;
  } else if (input.type === 'radio' && input.required) {
    const radioGroup = document.getElementsByName(input.name);
    isValid = Array.from(radioGroup).some(radio => radio.checked);
  }
  
  // Update UI based on validation
  if (!isValid && errorElement) {
    input.classList.add('error');
    errorElement.classList.add('visible');
  } else if (errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('visible');
  }
  
  return isValid;
}

// Show errors for a specific section
function showSectionErrors(sectionIndex) {
  const section = sections[sectionIndex];
  const inputs = section.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    validateInput(input);
  });
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  // Validate all sections before submission
  let isValid = true;
  for (let i = 0; i < totalSections; i++) {
    if (!validateSection(i)) {
      isValid = false;
      currentSection = i;
      sections.forEach(section => section.classList.remove('active'));
      sections[currentSection].classList.add('active');
      updateProgress();
      updateButtons();
      showSectionErrors(i);
      break;
    }
  }
  
  if (!isValid) {
    return;
  }
  
  // Disable submit button to prevent multiple submissions
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  try {
    // Collect form data
    const formData = {
      name: document.getElementById('name')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      address: document.getElementById('address')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      zip: document.getElementById('zip')?.value || '',
      ssn: document.getElementById('ssn')?.value || '',
      age: document.getElementById('age')?.value || '',
      position: document.getElementById('position')?.value || '',
      experience: document.getElementById('experience')?.value || '',
      availability: document.querySelector('input[name="availability"]:checked')?.value || '',
      dlFront: document.getElementById('dlFront')?.files[0] || null,
      dlBack: document.getElementById('dlBack')?.files[0] || null,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Submitting application with data:', formData);
    
    // Submit to Appwrite
    const response = await appwriteService.createApplication(formData);
    console.log('Application submitted successfully:', response);
    
    // Redirect to thank you page
    window.location.href = '/thank-you.html';
    
  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Show error modal
    errorMessage.textContent = error.message || 'There was an error submitting your application. Please try again.';
    errorModal.classList.add('visible');
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
  }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', initForm);