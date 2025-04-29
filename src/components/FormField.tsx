import React from 'react';
import { FormField as FormFieldType } from '../types/form';

interface FormFieldProps {
  field: FormFieldType;
  value: string | string[] | boolean;
  onChange: (id: string, value: string | string[] | boolean) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    let newValue: string | boolean = target.value;
    
    if (field.type === 'checkbox') {
      newValue = (target as HTMLInputElement).checked;
    }
    
    onChange(field.id, newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field.validation) {
      const validationError = field.validation(e.target.value);
      if (validationError) {
        onChange(field.id, e.target.value); // This will trigger error display
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start mb-1">
        <label 
          htmlFor={field.id} 
          className="block text-gray-700 font-medium mb-1"
        >
          {field.question}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {field.type === 'text' || field.type === 'email' ? (
        <input
          type={field.type}
          id={field.id}
          name={field.id}
          value={value as string}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          className={`w-full px-4 py-2 rounded-md border ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
          required={field.required}
        />
      ) : field.type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          value={value as string}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          rows={4}
          className={`w-full px-4 py-2 rounded-md border ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
          required={field.required}
        />
      ) : field.type === 'select' ? (
        <select
          id={field.id}
          name={field.id}
          value={value as string}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-md border ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
          required={field.required}
        >
          <option value="">{field.placeholder || 'Select an option'}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'radio' ? (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`${field.id}-${option}`}
                name={field.id}
                value={option}
                checked={value === option}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 transition duration-200"
                required={field.required}
              />
              <label 
                htmlFor={`${field.id}-${option}`} 
                className="ml-2 block text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      ) : field.type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={field.id}
            name={field.id}
            checked={value as boolean}
            onChange={handleChange}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 transition duration-200"
            required={field.required}
          />
          <label 
            htmlFor={field.id} 
            className="ml-2 block text-gray-700"
          >
            {field.question}
          </label>
        </div>
      ) : null}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;