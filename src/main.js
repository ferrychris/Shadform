document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('applicationForm');
  const sections = document.querySelectorAll('.form-section');
  const progress = document.getElementById('formProgress');
  const currentStepSpan = document.getElementById('currentStep');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

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
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Collect form data for the thank you page
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
      };
      
      // Store form data in localStorage for the thank you page
      localStorage.setItem('formData', JSON.stringify(formData));
      
      // Use EmailJS's sendForm method which directly sends the form
      // This ensures all form fields are sent as they are
      const response = await emailjs.sendForm(
        "service_bmrfqqn",
        "template_zij5nm9",
        form,
        "6kO0awWz7xlAdFWlf"  // Public key
      );
      
      if (response.status === 200) {
        // Redirect to thank you page
        window.location.href = '/thank-you.html';
      } else {
        throw new Error(`Failed to submit form: ${response.text}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Create an error notification
      const notification = document.createElement('div');
      notification.className = 'notification error';
      notification.innerHTML = `
        <div class="notification-content">
          <strong>Error!</strong> ${error.message || 'There was an error submitting the form. Please try again.'}
          <button class="close-notification">&times;</button>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 5000);
      
      // Add close button functionality
      notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      });
    } finally {
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