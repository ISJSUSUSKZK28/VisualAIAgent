// Safely extract non-sensitive page context
function getPageContext() {
  // Omit password input contents or credential forms
  const sensitiveInputs = document.querySelectorAll('input[type="password"], input[autocomplete*="cc-"]');
  
  return {
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname,
    headings: Array.from(document.querySelectorAll('h1, h2, h3'))
      .slice(0, 5)
      .map(el => el.innerText.trim())
      .filter(Boolean),
    hasSensitiveInputs: sensitiveInputs.length > 0,
    timestamp: new Date().toISOString()
  };
}

// Respond to background service worker inquiries
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_DOM") {
    sendResponse(getPageContext());
  }
  return true;
});