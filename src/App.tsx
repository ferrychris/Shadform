import React from 'react';
import Form from './components/Form';
import { formConfig } from './data/formConfig';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-12">
        <Form config={formConfig} />
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Your Company Name. All rights reserved.</p>
          <p className="mt-1">
            <a href="#privacy" className="text-purple-600 hover:underline mr-4">Privacy Policy</a>
            <a href="#terms" className="text-purple-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;