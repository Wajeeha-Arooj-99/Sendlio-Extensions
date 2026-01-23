import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

function Popup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [mode, setMode] = useState('login');

  const [savedEmails, setSavedEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    chrome.storage.local.get(['authToken'], (result) => {
      if (result.authToken) {
        setIsLoggedIn(true);
        setToken(result.authToken);
        loadSavedEmails();
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    const url =
      mode === 'login'
        ? 'http://localhost:3000/auth/login'
        : 'http://localhost:3000/auth/signup';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || 'Authentication failed');
        return;
      }

      if (mode === 'signup') {
        setMode('login');
        setAuthError('Account created successfully. Please log in.');
        return;
      }

      chrome.storage.local.set({ authToken: data.access_token }, () => {
        setIsLoggedIn(true);
        setToken(data.access_token);
        loadSavedEmails();
      });
    } catch (error) {
      setAuthError('Server not reachable');
      console.error(error);
    } finally {
      setIsAuthLoading(false);
    }
  };


  const handleLogout = () => {
    chrome.storage.local.remove(['authToken'], () => {
      setIsLoggedIn(false);
      setToken(null);
      setSavedEmails([]);
    });
  };


  const loadSavedEmails = () => {
    chrome.storage.local.get(['savedEmails'], (result) => {
      setSavedEmails(result.savedEmails || []);
      setLoading(false);
    });
  };

  const deleteEmail = (index) => {
    const updated = savedEmails.filter((_, i) => i !== index);
    chrome.storage.local.set({ savedEmails: updated }, () => {
      setSavedEmails(updated);
    });
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };



  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <form className="auth-card" onSubmit={handleAuth}>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authError && (
            <p
              className={`auth-msg ${
                authError.includes('successfully') ? 'success' : 'error'
              }`}
            >
              {authError}
            </p>
          )}

          <button className="auth-btn" disabled={isAuthLoading}>
            {isAuthLoading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>
                Don’t have an account?
                <span onClick={() => setMode('signup')}> Sign up</span>
              </>
            ) : (
              <>
                Already have an account?
                <span onClick={() => setMode('login')}> Log in</span>
              </>
            )}
          </p>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading…</div>;
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h1>📧 Sendlio Email Hunter</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {savedEmails.length === 0 ? (
        <p className="hint">Visit any page — emails will auto-detect ✨</p>
      ) : (
        savedEmails.map((item, index) => (
          <div key={index} className="email-item">
            <h3>{item.title || 'Untitled Page'}</h3>
            <small>{item.url}</small>

            <ul>
              {item.emails.map((email, i) => (
                <li key={i}>
                  {email}
                  <button onClick={() => copyEmail(email)}>Copy</button>
                </li>
              ))}
            </ul>

            <button className="delete-btn" onClick={() => deleteEmail(index)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}


const root = createRoot(document.getElementById('root'));
root.render(<Popup />);
