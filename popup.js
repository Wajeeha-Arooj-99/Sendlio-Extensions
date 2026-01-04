// popup.js - Basic starter code

console.log("Basic Chrome Extension loaded");

// Button click detect
document.addEventListener("DOMContentLoaded", function() {
    const scanButton = document.getElementById("scanButton");
    if (scanButton) {
        scanButton.addEventListener("click", function() {
            // Current tab ka URL get karna
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const currentTab = tabs[0];
                console.log("Current Page URL:", currentTab.url);
            });

            console.log("Scan Page button clicked");
        });
    }
});
