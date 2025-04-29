export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'radio' | 'checkbox' | 'textarea';
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: (value: string) => string | null;
}

export interface FormData {
  [key: string]: string | string[] | boolean;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormConfig {
  title: string;
  description?: string;
  sections: FormSection[];
  submitButtonText: string;
  showProgressBar: boolean;
}