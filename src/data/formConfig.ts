import { FormConfig } from '../types/form';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const formConfig: FormConfig = {
  title: 'AKG Consulting Job Application Form',
  description: 'Please complete this form to apply for available positions. We value your interest in joining our team.',
  sections: [
    {
      title: 'Contact Information',
      description: 'Please provide your contact details',
      fields: [
        {
          id: 'name',
          type: 'text',
          question: 'Name',
          required: true,
          placeholder: 'Your full name',
          validation: (value) => {
            if (value.length < 2) return 'Name must be at least 2 characters long';
            if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens and apostrophes';
            return null;
          }
        },
        {
          id: 'email',
          type: 'email',
          question: 'Email',
          required: true,
          placeholder: 'Your email address',
          validation: (value) => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
            return null;
          }
        },
        {
          id: 'phone',
          type: 'text',
          question: 'Phone Number',
          required: true,
          placeholder: 'Your phone number',
          validation: (value) => {
            if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
              return 'Please enter a valid phone number (e.g., 123-456-7890)';
            }
            return null;
          }
        },
        {
          id: 'address',
          type: 'text',
          question: 'Full Address (Include Apartment Numbers)',
          required: true,
          placeholder: 'Street address, apt/unit number',
          validation: (value) => value.length < 5 ? 'Please enter a complete address' : null
        },
        {
          id: 'city',
          type: 'text',
          question: 'City',
          required: true,
          placeholder: 'City',
          validation: (value) => value.length < 2 ? 'Please enter a valid city name' : null
        },
        {
          id: 'state',
          type: 'select',
          question: 'State',
          required: true,
          options: US_STATES,
          placeholder: 'Select your state'
        },
        {
          id: 'zipCode',
          type: 'text',
          question: 'Zip Code',
          required: true,
          placeholder: '12345',
          validation: (value) => {
            if (!/^\d{5}(-\d{4})?$/.test(value)) return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
            return null;
          }
        },
        {
          id: 'bankName',
          type: 'text',
          question: 'Bank Name',
          required: false,
          placeholder: 'Bank name (optional)'
        },
        {
          id: 'gender',
          type: 'radio',
          question: 'Gender',
          required: true,
          options: ['Male', 'Female', 'Prefer not to say']
        },
        {
          id: 'age',
          type: 'text',
          question: 'Age',
          required: true,
          placeholder: 'Your age',
          validation: (value) => {
            const age = parseInt(value);
            if (isNaN(age) || age < 18 || age > 100) return 'Please enter a valid age between 18 and 100';
            return null;
          }
        }
      ]
    },
    {
      title: 'Position Details',
      description: 'Please select the position you\'re interested in and provide additional information',
      fields: [
        {
          id: 'positionType',
          type: 'select',
          question: 'What position are you applying for?',
          required: true,
          options: [
            'Temporary Employee',
            'Permanent Employee',
            'Administrative Assistant'
          ]
        },
        {
          id: 'experience',
          type: 'textarea',
          question: 'Please describe your relevant experience',
          required: true,
          placeholder: 'Share your experience related to the position...',
          validation: (value) => value.length < 50 ? 'Please provide at least 50 characters describing your experience' : null
        },
        {
          id: 'availability',
          type: 'text',
          question: 'When can you start?',
          required: true,
          placeholder: 'Your earliest available start date'
        }
      ]
    },
    {
      title: 'Additional Information',
      description: 'Please provide any additional information that might be relevant to your application',
      fields: [
        {
          id: 'resume',
          type: 'text',
          question: 'LinkedIn Profile or Portfolio URL (Optional)',
          required: false,
          placeholder: 'https://',
          validation: (value) => {
            if (value && !/^https?:\/\/.*/.test(value)) return 'Please enter a valid URL starting with http:// or https://';
            return null;
          }
        },
        {
          id: 'additionalInfo',
          type: 'textarea',
          question: 'Is there anything else you\'d like us to know?',
          required: false,
          placeholder: 'Additional information...'
        },
        {
          id: 'acknowledgment',
          type: 'checkbox',
          question: 'I acknowledge that I have read and understand AKG Consulting\'s core values of delighting customers and delivering results, and I am committed to upholding these values.',
          required: true
        }
      ]
    }
  ],
  submitButtonText: 'Submit Application',
  showProgressBar: true
};