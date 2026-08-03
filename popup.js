// FIXED: Auto-load existing API key when popup opens
chrome.storage.local.get("apiKey", (data) => {
  if (data.apiKey) {
    document.getElementById('apiKey').value = data.apiKey;
  }
});

document.getElementById('toggleBtn').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKey').value;
  if (apiKey) {
    await chrome.storage.local.set({ apiKey });
  }
  const statusBadge = document.getElementById('statusBadge');
  const toggleBtn = document.getElementById('toggleBtn');
  
  if (toggleBtn.classList.contains('btn-start')) {
    chrome.runtime.sendMessage({ action: "START_MONITORING" }, () => {
      statusBadge.textContent = "Status: Running";
      statusBadge.className = "status-badge active";
      toggleBtn.textContent = "Stop Agent";
      toggleBtn.className = "btn-stop";
    });
  } else {
    chrome.runtime.sendMessage({ action: "STOP_MONITORING" }, () => {
      statusBadge.textContent = "Status: Stopped";
      statusBadge.className = "status-badge inactive";
      toggleBtn.textContent = "Start Agent";
      toggleBtn.className = "btn-start";
    });
  }
});

chrome.runtime.sendMessage({ action: "GET_STATUS" }, (response) => {
  if (response && response.isMonitoring) {
    const statusBadge = document.getElementById('statusBadge');
    const toggleBtn = document.getElementById('toggleBtn');
    statusBadge.textContent = "Status: Running";
    statusBadge.className = "status-badge active";
    toggleBtn.textContent = "Stop Agent";
    toggleBtn.className = "btn-stop";
  }
});