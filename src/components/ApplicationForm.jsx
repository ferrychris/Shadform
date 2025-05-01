import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appwriteService } from '../utils/appwrite';
import '../styles.css';

const ApplicationForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    ssn: '',
    age: '',
    position: '',
    experience: '',
    availability: '',
    dlFront: null,
    dlBack: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const totalSections = 3;
  
  // File info state
  const [fileInfo, setFileInfo] = useState({
    dlFront: 'No file selected',
    dlBack: 'No file selected'
  });
  
  // Update progress bar
  useEffect(() => {
    const percentage = ((currentSection + 1) / totalSections) * 100;
    const progressBar = document.getElementById('progress');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `Step ${currentSection + 1} of ${totalSections}`;
    }
  }, [currentSection]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        
        // Update file info
        const size = formatFileSize(file.size);
        setFileInfo(prev => ({
          ...prev,
          [name]: `${file.name} (${size})`
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name.split('-')[0]]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Validate a section
  const validateSection = (sectionIndex) => {
    const sectionErrors = {};
    let isValid = true;
    
    // Section 1: Personal Information
    if (sectionIndex === 0) {
      if (!formData.name) {
        sectionErrors.name = 'Name is required';
        isValid = false;
      }
      
      if (!formData.email) {
        sectionErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        sectionErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      if (!formData.phone) {
        sectionErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^[0-9\s\-\+\(\)]{10,15}$/.test(formData.phone)) {
        sectionErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
      
      if (!formData.address) {
        sectionErrors.address = 'Address is required';
        isValid = false;
      }
      
      if (!formData.city) {
        sectionErrors.city = 'City is required';
        isValid = false;
      }
      
      if (!formData.state) {
        sectionErrors.state = 'State is required';
        isValid = false;
      }
      
      if (!formData.zip) {
        sectionErrors.zip = 'ZIP code is required';
        isValid = false;
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
        sectionErrors.zip = 'Please enter a valid ZIP code';
        isValid = false;
      }
      
      if (!formData.ssn) {
        sectionErrors.ssn = 'SSN is required';
        isValid = false;
      } else if (!/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn) && !/^\d{9}$/.test(formData.ssn)) {
        sectionErrors.ssn = 'Please enter a valid SSN (XXX-XX-XXXX)';
        isValid = false;
      }
      
      if (!formData.age) {
        sectionErrors.age = 'Age is required';
        isValid = false;
      } else if (parseInt(formData.age) < 18) {
        sectionErrors.age = 'You must be at least 18 years old';
        isValid = false;
      }
      
      if (!formData.dlFront) {
        sectionErrors.dlFront = 'Driver\'s license front image is required';
        isValid = false;
      }
      
      if (!formData.dlBack) {
        sectionErrors.dlBack = 'Driver\'s license back image is required';
        isValid = false;
      }
    }
    
    // Section 2: Position Information
    else if (sectionIndex === 1) {
      if (!formData.position) {
        sectionErrors.position = 'Position is required';
        isValid = false;
      }
      
      if (!formData.experience) {
        sectionErrors.experience = 'Experience is required';
        isValid = false;
      }
      
      if (!formData.availability) {
        sectionErrors.availability = 'Availability is required';
        isValid = false;
      }
    }
    
    // Section 3: Additional Information
    else if (sectionIndex === 2) {
      if (!formData.terms) {
        sectionErrors.terms = 'You must agree to the terms';
        isValid = false;
      }
    }
    
    setErrors(prev => ({
      ...prev,
      ...sectionErrors
    }));
    
    return isValid;
  };
  
  // Go to next section
  const goToNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSection < totalSections - 1) {
        setCurrentSection(currentSection + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // Go to previous section
  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all sections
    let isValid = true;
    for (let i = 0; i < totalSections; i++) {
      if (!validateSection(i)) {
        isValid = false;
        setCurrentSection(i);
        break;
      }
    }
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to Appwrite
      const response = await appwriteService.createApplication(formData);
      console.log('Application submitted successfully:', response);
      
      // Redirect to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Show error modal
      setErrorMessage(error.message || 'There was an error submitting your application. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };
  
  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1>AKG Consulting Job Application</h1>
          <p>Join our team and be part of something great</p>
        </div>
      </header>

      <div className="container">
        <div className="company-info">
          <details>
            <summary>About AKG Consulting</summary>
            <div className="info-content">
              <h3>Company Overview</h3>
              <p>AKG Consulting is a leading provider of innovative solutions in the transportation and logistics industry. With over 15 years of experience, we help businesses optimize their operations and achieve sustainable growth.</p>
              
              <h3>Our Mission</h3>
              <p>To provide exceptional consulting services that empower our clients to overcome challenges and achieve their business goals through innovative strategies and solutions.</p>
              
              <h4>What We Offer</h4>
              <p>Competitive salary, comprehensive benefits package, professional development opportunities, and a collaborative work environment.</p>
            </div>
          </details>
        </div>

        <div className="form">
          <div className="progress-bar">
            <div className="progress" id="progress"></div>
          </div>
          <span className="progress-text" id="progress-text">Step 1 of 3</span>

          <form id="application-form" onSubmit={handleSubmit}>
            {/* Section 1: Personal Information */}
            <div className={`form-section ${currentSection === 0 ? 'active' : ''}`}>
              <h2>Personal Information</h2>
              <p>Please provide your contact and personal details</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Enter your full name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className={errors.name ? 'error' : ''}
                    required 
                  />
                  {errors.name && <div className="error-message visible">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter your email address" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className={errors.email ? 'error' : ''}
                    required 
                  />
                  {errors.email && <div className="error-message visible">{errors.email}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="Enter your phone number" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className={errors.phone ? 'error' : ''}
                    required 
                  />
                  {errors.phone && <div className="error-message visible">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    min="18" 
                    max="100" 
                    placeholder="Enter your age" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                    className={errors.age ? 'error' : ''}
                    required 
                  />
                  {errors.age && <div className="error-message visible">{errors.age}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  placeholder="Enter your street address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className={errors.address ? 'error' : ''}
                  required 
                />
                {errors.address && <div className="error-message visible">{errors.address}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    placeholder="Enter your city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className={errors.city ? 'error' : ''}
                    required 
                  />
                  {errors.city && <div className="error-message visible">{errors.city}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    placeholder="Enter your state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    className={errors.state ? 'error' : ''}
                    required 
                  />
                  {errors.state && <div className="error-message visible">{errors.state}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zip">ZIP Code <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="zip" 
                    name="zip" 
                    placeholder="Enter your ZIP code" 
                    value={formData.zip} 
                    onChange={handleInputChange} 
                    className={errors.zip ? 'error' : ''}
                    required 
                  />
                  {errors.zip && <div className="error-message visible">{errors.zip}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="ssn">Social Security Number <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="ssn" 
                    name="ssn" 
                    placeholder="XXX-XX-XXXX" 
                    value={formData.ssn} 
                    onChange={handleInputChange} 
                    className={errors.ssn ? 'error' : ''}
                    required 
                  />
                  {errors.ssn && <div className="error-message visible">{errors.ssn}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dlFront">Driver's License - Front <span className="required">*</span></label>
                <input 
                  type="file" 
                  id="dlFront" 
                  name="dlFront" 
                  accept="image/*" 
                  onChange={handleInputChange} 
                  className={errors.dlFront ? 'error' : ''}
                  required 
                />
                <span className="file-info">{fileInfo.dlFront}</span>
                {errors.dlFront && <div className="error-message visible">{errors.dlFront}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="dlBack">Driver's License - Back <span className="required">*</span></label>
                <input 
                  type="file" 
                  id="dlBack" 
                  name="dlBack" 
                  accept="image/*" 
                  onChange={handleInputChange} 
                  className={errors.dlBack ? 'error' : ''}
                  required 
                />
                <span className="file-info">{fileInfo.dlBack}</span>
                {errors.dlBack && <div className="error-message visible">{errors.dlBack}</div>}
              </div>
            </div>

            {/* Section 2: Position Information */}
            <div className={`form-section ${currentSection === 1 ? 'active' : ''}`}>
              <h2>Position Information</h2>
              <p>Tell us about the position you're applying for</p>

              <div className="form-group">
                <label htmlFor="position">Position <span className="required">*</span></label>
                <select 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange} 
                  className={errors.position ? 'error' : ''}
                  required
                >
                  <option value="" disabled>Select a position</option>
                  <option value="Driver">Driver</option>
                  <option value="Logistics">Logistics Coordinator</option>
                  <option value="Warehouse">Warehouse Associate</option>
                  <option value="Admin">Administrative Assistant</option>
                  <option value="Manager">Operations Manager</option>
                </select>
                {errors.position && <div className="error-message visible">{errors.position}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience <span className="required">*</span></label>
                <select 
                  id="experience" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleInputChange} 
                  className={errors.experience ? 'error' : ''}
                  required
                >
                  <option value="" disabled>Select years of experience</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                {errors.experience && <div className="error-message visible">{errors.experience}</div>}
              </div>

              <div className="form-group">
                <label>Availability <span className="required">*</span></label>
                <div className="radio-group">
                  <label className="radio">
                    <input 
                      type="radio" 
                      name="availability-option" 
                      value="Full-time" 
                      checked={formData.availability === 'Full-time'} 
                      onChange={handleInputChange} 
                      required 
                    /> 
                    Full-time
                  </label>
                  <label className="radio">
                    <input 
                      type="radio" 
                      name="availability-option" 
                      value="Part-time" 
                      checked={formData.availability === 'Part-time'} 
                      onChange={handleInputChange} 
                    /> 
                    Part-time
                  </label>
                  <label className="radio">
                    <input 
                      type="radio" 
                      name="availability-option" 
                      value="Contract" 
                      checked={formData.availability === 'Contract'} 
                      onChange={handleInputChange} 
                    /> 
                    Contract
                  </label>
                  <label className="radio">
                    <input 
                      type="radio" 
                      name="availability-option" 
                      value="Temporary" 
                      checked={formData.availability === 'Temporary'} 
                      onChange={handleInputChange} 
                    /> 
                    Temporary
                  </label>
                </div>
                {errors.availability && <div className="error-message visible">{errors.availability}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="start-date">Earliest Start Date</label>
                <input 
                  type="date" 
                  id="start-date" 
                  name="startDate" 
                  value={formData.startDate || ''} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Desired Salary (USD)</label>
                <input 
                  type="number" 
                  id="salary" 
                  name="salary" 
                  placeholder="Enter your desired salary" 
                  value={formData.salary || ''} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="referral">How did you hear about us?</label>
                <select 
                  id="referral" 
                  name="referral" 
                  value={formData.referral || ''} 
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Job Board">Job Board</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Employee Referral">Employee Referral</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Section 3: Additional Information */}
            <div className={`form-section ${currentSection === 2 ? 'active' : ''}`}>
              <h2>Additional Information</h2>
              <p>Please provide any additional information that may be relevant to your application</p>

              <div className="form-group">
                <label htmlFor="skills">Relevant Skills</label>
                <textarea 
                  id="skills" 
                  name="skills" 
                  placeholder="List your relevant skills and qualifications" 
                  value={formData.skills || ''} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="certifications">Certifications</label>
                <textarea 
                  id="certifications" 
                  name="certifications" 
                  placeholder="List any relevant certifications or licenses" 
                  value={formData.certifications || ''} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="additional-info">Additional Information</label>
                <textarea 
                  id="additional-info" 
                  name="additionalInfo" 
                  placeholder="Any additional information you'd like to share" 
                  value={formData.additionalInfo || ''} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="checkbox">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    name="terms" 
                    checked={formData.terms || false} 
                    onChange={handleInputChange} 
                    className={errors.terms ? 'error' : ''}
                    required 
                  />
                  <span>I certify that all information provided is true and complete to the best of my knowledge. I understand that false information may result in the rejection of my application or termination of employment.</span>
                </label>
                {errors.terms && <div className="error-message visible">{errors.terms}</div>}
              </div>
            </div>

            <div className="form-navigation">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={goToPrevSection} 
                disabled={currentSection === 0}
              >
                Previous
              </button>
              
              {currentSection < totalSections - 1 ? (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={goToNextSection}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay visible">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="modal-title">Error</h3>
            </div>
            <div className="modal-body">
              {errorMessage}
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button primary" 
                onClick={closeErrorModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 AKG Consulting. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            <a href="/admin/login">::::</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ApplicationForm;
