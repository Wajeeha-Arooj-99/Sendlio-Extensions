// Content script to automatically scan pages for emails
(function() {
  'use strict';

  // Check if extension context is valid
  function isExtensionContextValid() {
    try {
      return chrome.runtime && chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  // Email regex pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Function to extract emails from text
  function extractEmails(text) {
    const matches = text.match(emailRegex);
    return matches ? [...new Set(matches)] : []; // Remove duplicates
  }

  // Function to scan the entire page for emails
  function scanPageForEmails() {
    // Check if extension context is still valid
    if (!isExtensionContextValid()) {
      return;
    }

    const pageText = document.body.innerText || document.body.textContent || '';
    const emails = extractEmails(pageText);
    
    if (emails.length > 0) {
      // Get current page URL and title
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        emails: emails,
        timestamp: new Date().toISOString()
      };

      // Save to chrome.storage with error handling
      try {
        chrome.storage.local.get(['savedEmails'], (result) => {
          // Check again if context is still valid
          if (!isExtensionContextValid()) {
            return;
          }

          try {
            const savedEmails = result.savedEmails || [];
            
            // Check if this URL already exists
            const existingIndex = savedEmails.findIndex(item => item.url === pageInfo.url);
            
            if (existingIndex !== -1) {
              // Update existing entry
              savedEmails[existingIndex] = pageInfo;
            } else {
              // Add new entry
              savedEmails.push(pageInfo);
            }

            chrome.storage.local.set({ savedEmails: savedEmails }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error saving emails:', chrome.runtime.lastError);
                return;
              }
              console.log('Emails saved:', emails);
            });
          } catch (error) {
            console.error('Error processing emails:', error);
          }
        });
      } catch (error) {
        console.error('Extension context invalidated:', error);
      }
    }
  }

  // Debounce function to avoid too many scans
  let scanTimeout;
  const debouncedScan = () => {
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      if (isExtensionContextValid()) {
        scanPageForEmails();
      }
    }, 1000);
  };

  // Scan immediately when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanPageForEmails);
  } else {
    scanPageForEmails();
  }

  // Also scan when DOM changes (for dynamic content)
  if (document.body) {
    const observer = new MutationObserver(debouncedScan);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Listen for messages from popup with error handling
  try {
    if (isExtensionContextValid()) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (!isExtensionContextValid()) {
          return false;
        }

        if (request.action === 'scan') {
          scanPageForEmails();
          sendResponse({ success: true });
        }
        return true; // Keep channel open for async response
      });
    }
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
})();
