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

  prevBtn.addEventListener('click', () => {
    if (currentSection > 0) {
      currentSection--;
      showSection(currentSection);
    }
  });

  nextBtn.addEventListener('click', () => {
    const currentSectionEl = sections[currentSection];
    const inputs = currentSectionEl.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value || (input.type === 'radio' && !input.checked)) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (isValid && currentSection < totalSections - 1) {
      currentSection++;
      showSection(currentSection);
      window.scrollTo(0, 0);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Use EmailJS's sendForm method which directly sends the form
      // This ensures all form fields are sent as they are
      const response = await emailjs.sendForm(
        "service_bmrfqqn",
        "template_zij5nm9",
        form,
        "6kO0awWz7xlAdFWlf"  // Public key
      );
      
      if (response.status === 200) {
        alert('Form submitted successfully! We will contact you soon.');
        form.reset();
        currentSection = 0;
        showSection(currentSection);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

  // Initialize first section
  showSection(currentSection);
});