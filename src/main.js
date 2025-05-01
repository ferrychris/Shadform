document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('applicationForm');
  const sections = document.querySelectorAll('.form-section');
  const progress = document.getElementById('formProgress');
  const currentStepSpan = document.getElementById('currentStep');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorModal = document.getElementById('errorModal');
  const errorModalMessage = document.getElementById('errorModalMessage');
  const errorModalClose = document.getElementById('errorModalClose');

  // Modal functions
  function showErrorModal(message) {
    if (message) {
      errorModalMessage.textContent = message;
    }
    errorModal.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
  }

  function hideErrorModal() {
    errorModal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Add event listener to close modal
  errorModalClose.addEventListener('click', hideErrorModal);

  // Add file size information display for file inputs
  document.querySelectorAll('input[type="file"]').forEach(fileInput => {
    fileInput.addEventListener('change', function() {
      const fileInfo = this.nextElementSibling;
      if (fileInfo && fileInfo.classList.contains('file-info')) {
        if (this.files.length > 0) {
          const fileSizeMB = (this.files[0].size / (1024 * 1024)).toFixed(2);
          fileInfo.textContent = `Selected file: ${this.files[0].name} (${fileSizeMB} MB)`;
        } else {
          fileInfo.textContent = 'No file size limit. Upload any size image.';
        }
      }
    });
  });

  let currentSection = 0;
  const totalSections = sections.length;

  function updateProgress() {
    const progressPercentage = ((currentSection + 1) / totalSections) * 100;
    progress.style.width = `${progressPercentage}%`;
    currentStepSpan.textContent = currentSection + 1;
  }

  function showSection(index) {
    sections.forEach((section, i) => {
      section.classList.toggle('active', i === index);
    });

    prevBtn.disabled = index === 0;
    nextBtn.style.display = index === totalSections - 1 ? 'none' : 'block';
    submitBtn.style.display = index === totalSections - 1 ? 'block' : 'none';

    updateProgress();
  }

  // Clear all error messages in a section
  function clearErrorMessages(sectionEl) {
    const errorMessages = sectionEl.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
      msg.classList.remove('visible');
    });
    
    const errorInputs = sectionEl.querySelectorAll('.error');
    errorInputs.forEach(input => {
      input.classList.remove('error');
    });
  }

  // Show error message for a specific input
  function showErrorMessage(input, message) {
    input.classList.add('error');
    
    // Check if error message element already exists
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      // Create new error message element
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.insertBefore(errorElement, input.nextElementSibling);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }

  // Validate a single input
  function validateInput(input) {
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (input.required && !input.value) {
        showErrorMessage(input, 'This field is required');
        return false;
      } else if (input.value && !emailRegex.test(input.value)) {
        showErrorMessage(input, 'Please enter a valid email address');
        return false;
      }
    } else if (input.type === 'tel') {
      if (input.required && !input.value) {
        showErrorMessage(input, 'This field is required');
        return false;
      } else if (input.value && !/^\d{10,15}$/.test(input.value.replace(/[^0-9]/g, ''))) {
        showErrorMessage(input, 'Please enter a valid phone number');
        return false;
      }
    } else if (input.id === 'ssn') {
      if (input.required && !input.value) {
        showErrorMessage(input, 'This field is required');
        return false;
      } else if (input.value && !/^\d{3}-\d{2}-\d{4}$/.test(input.value)) {
        showErrorMessage(input, 'Please enter a valid SSN in format XXX-XX-XXXX');
        return false;
      }
    } else if (input.type === 'file') {
      if (input.required && (!input.files || input.files.length === 0)) {
        showErrorMessage(input, 'Please upload a file');
        return false;
      }
    } else if (input.type === 'number') {
      if (input.required && !input.value) {
        showErrorMessage(input, 'This field is required');
        return false;
      } else if (input.id === 'age' && input.value < 18) {
        showErrorMessage(input, 'You must be at least 18 years old');
        return false;
      }
    } else if (input.type === 'radio') {
      // For radio buttons, we need to check if any in the group is checked
      if (input.required) {
        const name = input.name;
        const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
        const isChecked = Array.from(radioGroup).some(radio => radio.checked);
        if (!isChecked) {
          showErrorMessage(input, 'Please select an option');
          return false;
        }
      }
    } else if (input.type === 'checkbox') {
      if (input.required && !input.checked) {
        showErrorMessage(input, 'This checkbox is required');
        return false;
      }
    } else {
      // Text, textarea, select, etc.
      if (input.required && !input.value.trim()) {
        showErrorMessage(input, 'This field is required');
        return false;
      }
    }
    
    return true;
  }

  prevBtn.addEventListener('click', () => {
    if (currentSection > 0) {
      currentSection--;
      showSection(currentSection);
    }
  });

  nextBtn.addEventListener('click', () => {
    const currentSectionEl = sections[currentSection];
    const inputs = currentSectionEl.querySelectorAll('input[required], select[required], textarea[required]');
    
    // Clear all previous error messages
    clearErrorMessages(currentSectionEl);
    
    let isValid = true;

    // Validate each required input
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });

    if (isValid && currentSection < totalSections - 1) {
      currentSection++;
      showSection(currentSection);
      window.scrollTo(0, 0);
    } else if (!isValid) {
      // Scroll to the first error
      const firstError = currentSectionEl.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate the final section
    const finalSectionEl = sections[currentSection];
    const finalInputs = finalSectionEl.querySelectorAll('input[required], select[required], textarea[required]');
    
    clearErrorMessages(finalSectionEl);
    
    let isValid = true;
    finalInputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      const firstError = finalSectionEl.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
      // Collect form data for the thank you page
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
        ssn: document.getElementById('ssn').value,
        // We don't store the actual file data in localStorage for privacy reasons
        dlFrontUploaded: !!document.getElementById('dlFront').files.length,
        dlBackUploaded: !!document.getElementById('dlBack').files.length
      };
      
      // Store form data in localStorage for the thank you page
      localStorage.setItem('formData', JSON.stringify(formData));
      
      // Create a new form without the file inputs for EmailJS
      // This is because EmailJS has a 50KB limit on variables
      const emailForm = new FormData();
      
      // Add all form fields except files
      for (const pair of new FormData(form)) {
        const [name, value] = pair;
        // Skip file inputs - we'll handle them separately
        if (!(value instanceof File)) {
          emailForm.append(name, value);
        }
      }
      
      // Add file metadata instead of actual files
      const dlFront = document.getElementById('dlFront').files[0];
      const dlBack = document.getElementById('dlBack').files[0];
      
      if (dlFront) {
        emailForm.append('dlFrontName', dlFront.name);
        emailForm.append('dlFrontSize', formatFileSize(dlFront.size));
      }
      
      if (dlBack) {
        emailForm.append('dlBackName', dlBack.name);
        emailForm.append('dlBackSize', formatFileSize(dlBack.size));
      }
      
      // Helper function to format file size
      function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
      }
      
      // Create a temporary form element for EmailJS
      const tempForm = document.createElement('form');
      for (const [name, value] of emailForm.entries()) {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.value = value;
        tempForm.appendChild(input);
      }
      
      // Add a note about files
      const fileNote = document.createElement('input');
      fileNote.type = 'text';
      fileNote.name = 'fileNote';
      fileNote.value = 'Files were too large to send via email. Please contact the applicant to obtain the files.';
      tempForm.appendChild(fileNote);
      
      // Configure EmailJS to handle the form without large files
      emailjs.sendForm(
        "service_bmrfqqn",
        "template_zij5nm9",
        tempForm,
        "6kO0awWz7xlAdFWlf"  // Public key
      ).then(function(response) {
        if (response.status === 200) {
          // Redirect to thank you page
          window.location.href = '/thank-you.html';
        } else {
          throw new Error(`Failed to submit form: ${response.text}`);
        }
      }).catch(function(error) {
        console.error('Error submitting form:', error);
        
        // Show error in modal
        let errorMessage = 'There was an error submitting the form. Please try again.';
        
        // Check for specific error types
        if (error.status === 413) {
          errorMessage = 'The files you uploaded are too large for our system to process. Only file information will be included in your submission.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showErrorModal(errorMessage);
      }).finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      });
    } catch (error) {
      console.error('Error preparing form submission:', error);
      
      // Show error in modal
      showErrorModal(error.message || 'There was an error preparing your form. Please try again.');
      
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

  // Add input event listeners to clear errors when user starts typing
  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorMessage = this.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          errorMessage.classList.remove('visible');
        }
      }
    });
  });

  // Initialize first section
  showSection(currentSection);
});