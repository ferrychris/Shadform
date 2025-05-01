import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ApplicationForm from './components/ApplicationForm';
import ThankYou from './components/ThankYou';
import Admin from './components/Admin';
import './styles.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/radmin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
