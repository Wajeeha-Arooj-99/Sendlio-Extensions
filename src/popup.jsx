import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

function Popup() {
  const [savedEmails, setSavedEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedEmails();
  }, []);

  const loadSavedEmails = () => {
    chrome.storage.local.get(['savedEmails'], (result) => {
      const emails = result.savedEmails || [];
      setSavedEmails(emails);
      setLoading(false);
    });
  };

  const clearAllEmails = () => {
    if (confirm('Are you sure you want to clear all saved emails?')) {
      chrome.storage.local.set({ savedEmails: [] }, () => {
        setSavedEmails([]);
      });
    }
  };

  const deleteEmail = (index) => {
    const updated = savedEmails.filter((_, i) => i !== index);
    chrome.storage.local.set({ savedEmails: updated }, () => {
      setSavedEmails(updated);
    });
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert(`Copied: ${email}`);
  };

  if (loading) {
    return (
      <div className="popup-container">
        <div className="header">
          <h1>📧 Sendlio Email Hunter</h1>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h1>📧 Sendlio Email Hunter</h1>
        {savedEmails.length > 0 && (
          <button className="clear-btn" onClick={clearAllEmails}>
            Clear All
          </button>
        )}
      </div>

      <div className="stats">
        <p>Total Pages Scanned: {savedEmails.length}</p>
        <p>Total Emails Found: {savedEmails.reduce((sum, item) => sum + item.emails.length, 0)}</p>
      </div>

      <div className="emails-list">
        {savedEmails.length === 0 ? (
          <div className="empty-state">
            <p>No emails found yet.</p>
            <p className="hint">Visit any webpage and emails will be automatically detected!</p>
          </div>
        ) : (
          savedEmails.map((item, index) => (
            <div key={index} className="email-item">
              <div className="email-header">
                <h3 className="page-title">{item.title || 'Untitled Page'}</h3>
                <button className="delete-btn" onClick={() => deleteEmail(index)}>
                  ✕
                </button>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="page-url">
                {item.url}
              </a>
              <div className="emails-found">
                <strong>Emails ({item.emails.length}):</strong>
                <ul>
                  {item.emails.map((email, emailIndex) => (
                    <li key={emailIndex} className="email-address">
                      <span>{email}</span>
                      <button className="copy-btn" onClick={() => copyEmail(email)}>
                        Copy
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="timestamp">
                Found: {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);
