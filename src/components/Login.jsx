import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import '../styles.css';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize Appwrite
  const client = new Client();
  client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('681312ad0000dd31f180');

  const account = new Account(client);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          // If already logged in, redirect to admin
          navigate('/admin');
        }
      } catch (error) {
        console.log('No active session');
      }
    };

    checkSession();
  }, [navigate]);

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await account.createEmailSession(loginForm.email, loginForm.password);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 AKG Consulting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
