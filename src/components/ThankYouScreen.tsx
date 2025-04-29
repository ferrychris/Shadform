import React from 'react';
import { FormData } from '../types/form';

interface ThankYouScreenProps {
  formData: FormData;
  onReset: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ formData }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
      <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-full mb-6">
        <svg 
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Thank you for your interest in joining AKG Consulting. We have received your application and will review it shortly.
      </p>
      <div className="bg-purple-50 p-6 rounded-lg max-w-2xl">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">What's Next?</h3>
        <ul className="text-left text-purple-700 space-y-2">
          <li>• Our team will review your application within 2-3 business days</li>
          <li>• You will receive an email confirmation at {formData.email}</li>
          <li>• If your qualifications match our needs, we'll contact you to schedule an interview</li>
        </ul>
      </div>
      <p className="mt-8 text-gray-500">
        You may now close this window or return to our{' '}
        <a href="/" className="text-purple-600 hover:text-purple-800 underline">
          homepage
        </a>
      </p>
    </div>
  );
};

export default ThankYouScreen;