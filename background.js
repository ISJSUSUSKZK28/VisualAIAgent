import { captureActiveTab } from './capture.js';
import { saveActivity } from './database.js';
import { classifyActivity } from './classifier.js';

// Listen to alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "VISUAL_AI_MONITOR") {
    const data = await chrome.storage.local.get("isMonitoring");
    if (data.isMonitoring) {
      await runMonitoringCycle();
    }
  }
});

async function runMonitoringCycle() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

    // 1. Capture screen
    const screenshot = await captureActiveTab();

    // 2. Query content script for metadata (with fallback if content script isn't loaded on restricted pages)
    let domContext = { title: tab.title, url: tab.url };
    try {
      domContext = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_DOM" });
    } catch (e) {
      // Ignore if content script is not injected yet
    }

    // 3. Fetch API Key from chrome storage
    const { apiKey } = await chrome.storage.local.get("apiKey");

    // 4. Run AI Classification
    const aiResult = await classifyActivity(screenshot, domContext, apiKey);

    // 5. Store record locally
    const record = {
      timestamp: new Date().toISOString(),
      url: tab.url,
      title: tab.title,
      screenshot: screenshot,
      category: aiResult.category,
      summary: aiResult.summary
    };

    await saveActivity(record);
    console.log(`[Visual AI Agent] Site: ${record.title} | Category: ${record.category} | Action: ${record.summary}`);
  } catch (error) {
  console.error("[Visual AI Agent] Cycle Error Message:", error.message);
  console.error("[Visual AI Agent] Stack Trace:", error.stack);
}
}

// Handle control requests from popup UI with persistent storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_MONITORING") {
    chrome.storage.local.set({ isMonitoring: true }, () => {
      // Set to trigger every 0.2 minutes (every 12 seconds) for fast testing
      chrome.alarms.create("VISUAL_AI_MONITOR", { periodInMinutes: 0.2 });
      sendResponse({ status: "running" });
    });
  } else if (message.action === "STOP_MONITORING") {
    chrome.storage.local.set({ isMonitoring: false }, () => {
      chrome.alarms.clear("VISUAL_AI_MONITOR");
      sendResponse({ status: "stopped" });
    });
  } else if (message.action === "GET_STATUS") {
    chrome.storage.local.get("isMonitoring", (data) => {
      sendResponse({ isMonitoring: !!data.isMonitoring });
    });
  }
  return true;
});