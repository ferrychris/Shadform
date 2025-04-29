import React, { useState } from 'react';
import { FormConfig, FormData, FormSection } from '../types/form';
import FormField from './FormField';
import ProgressBar from './ProgressBar';
import ThankYouScreen from './ThankYouScreen';
import { sendFormDataByEmail } from '../utils/emailService';

interface FormProps {
  config: FormConfig;
}

const Form: React.FC<FormProps> = ({ config }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentSection = config.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === config.sections.length - 1;

  const handleFieldChange = (id: string, value: string | string[] | boolean) => {
    setFormData({ ...formData, [id]: value });
    
    // Clear error when field is updated
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    section.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        const isEmpty = 
          value === undefined || 
          value === '' || 
          (Array.isArray(value) && value.length === 0);
          
        if (isEmpty) {
          newErrors[field.id] = 'This field is required';
          isValid = false;
        } else if (field.type === 'email' && typeof value === 'string') {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[field.id] = 'Please enter a valid email address';
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0); // Scroll to top when advancing
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex(currentSectionIndex - 1);
    window.scrollTo(0, 0); // Scroll to top when going back
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSection(currentSection)) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const success = await sendFormDataByEmail(formData);
      
      if (success) {
        setIsSubmitted(true);
      } else {
        setSubmitError('Failed to submit the form. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setCurrentSectionIndex(0);
    setIsSubmitted(false);
    setSubmitError(null);
  };

  if (isSubmitted) {
    return <ThankYouScreen formData={formData} onReset={resetForm} />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h1>
        {config.description && (
          <p className="text-gray-600 mb-6">{config.description}</p>
        )}
        
        {config.showProgressBar && (
          <ProgressBar 
            currentStep={currentSectionIndex + 1} 
            totalSteps={config.sections.length} 
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {currentSection.title}
            </h2>
            
            {currentSection.description && (
              <p className="text-gray-600 mb-6">{currentSection.description}</p>
            )}
            
            {currentSection.fields.map(field => (
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id] ?? (field.type === 'checkbox' ? false : '')}
                onChange={handleFieldChange}
                error={errors[field.id]}
              />
            ))}
          </div>
          
          {submitError && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {!isFirstSection && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Previous
              </button>
            )}
            
            <div className={`${isFirstSection ? 'ml-auto' : ''}`}>
              {isLastSection ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    config.submitButtonText
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;