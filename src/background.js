// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Sendlio Extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveEmails') {
    chrome.storage.local.get(['savedEmails'], (result) => {
      const savedEmails = result.savedEmails || [];
      savedEmails.push(request.data);
      chrome.storage.local.set({ savedEmails: savedEmails });
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
});
