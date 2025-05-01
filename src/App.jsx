import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ApplicationForm from './components/ApplicationForm';
import ThankYou from './components/ThankYou';
import Admin from './components/Admin';
import './styles.css';

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<ApplicationForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />
        {/* Fallback routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
