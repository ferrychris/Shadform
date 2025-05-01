import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const ThankYou = () => {
  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1>Application Submitted</h1>
          <p>Thank you for applying to AKG Consulting</p>
        </div>
      </header>

      <div className="container">
        <div className="form" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="animate-fade-in">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ margin: '0 auto 2rem', color: 'var(--success)' }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            
            <h2>Application Successfully Submitted!</h2>
            <p>Thank you for applying to AKG Consulting. We have received your application and will review it shortly.</p>
            
            <div style={{ margin: '2rem 0' }}>
              <p>Our team will contact you at the email address you provided to discuss next steps.</p>
              <p>If you have any questions, please contact us at <a href="mailto:careers@akgconsulting.com">careers@akgconsulting.com</a>.</p>
            </div>
            
            <Link to="/" className="btn btn-primary">Return to Homepage</Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 AKG Consulting. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ThankYou;
