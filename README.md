# 🌿 Visual AI Agent

> A cozy, privacy-first digital companion that sits quietly in your browser, capturing, understanding, and organizing your digital journey using Vision AI.

Welcome to the **Visual AI Agent**. Think of this as an automated second brain or a private diary for your screen. Instead of manually tracking what you do, this lightweight Chrome extension gently monitors your active tabs, reads the context, and uses AI to summarize your workflow in real-time. 

Whether you are deep in a coding session, researching a new project, or just relaxing on YouTube, the agent understands and quietly logs it all into a secure, local database.

---

## ✨ The Journey (How We Got Here)

This project wasn't built in a day—it was forged in a 4-hour midnight coding grind. Building a seamless background worker in Chrome's Manifest V3 architecture is notoriously tricky. We battled sleeping service workers, navigated strict browser security protocols, and even had to completely swap our AI engine mid-build when our original Vision model deprecated. 

Through persistence, debugging, and rewriting our classification logic, we emerged with a perfectly running, highly optimized system. It’s proof that the best software is built on grit.

---

## 🛠️ The Architecture (How It Works)

The system is beautifully modular. Here is how the components talk to each other:

1. **The Eyes (`capture.js` & `content.js`):** 
   Every few seconds, the extension takes a lightweight, secure snapshot of your active browser viewport. Simultaneously, it reads the room by extracting the page title and URL, completely ignoring sensitive input fields like passwords.
   
2. **The Conductor (`background.js`):** 
   This is the heartbeat of the operation. It runs on a continuous alarm, orchestrating the screen capture and passing the data forward without interrupting your browsing experience.

3. **The Brain (`classifier.js` & Groq AI):** 
   The visual snapshot and text context are sent to a blazing-fast Vision AI model (currently powered by Groq's `qwen/qwen3.6-27b`). The AI acts as an observer, analyzing the image and returning a perfectly structured JSON summary of your current activity.
   
4. **The Vault (`database.js`):** 
   Privacy is critical. The AI's insights are returned and instantly stored in your browser's local **IndexedDB**. Your data stays on your machine, neatly organized into categories.

---

## 📊 What the Output Looks Like

The AI doesn't just record URLs; it understands *context*. If you are watching a video or coding, it knows. Here is a glimpse of the raw terminal logs it generates:

> `[Visual AI Agent] Site: (5610) YouTube | Category: Entertainment | Action: YouTube: Watching a Minecraft gaming video.`
> 
> `[Visual AI Agent] Site: Gemini | Category: Productivity | Action: Gemini: Researching and building a GitHub Readme.`
> 
> `[Visual AI Agent] Site: GitHub | Category: Coding | Action: GitHub: Reviewing system architecture code.`

---

## ☕ Tech Stack

*   **Platform:** Google Chrome Extension (Manifest V3)
*   **Language:** Vanilla JavaScript (ES6 Modules)
*   **Storage:** Local IndexedDB (Privacy-first)
*   **AI Engine:** Groq Cloud API (Qwen Vision Model)
*   **UI:** Minimalist HTML/CSS Popup

---

## 🚀 Quick Setup

Want to run this yourself? Here is how to wake the agent up:

1. Clone this repository to your local machine.
2. Open `classifier.js` and paste your **Groq API Key** on line 3.
3. Open Google Chrome and go to `chrome://extensions/`.
4. Turn on **Developer mode** (top right corner).
5. Click **Load unpacked** and select this project folder.
6. Click the extension icon in your toolbar, hit **Start Agent**, and watch your console come alive!

---
*Built with grit, midnight debugging, and lots of coffee by Pubali.* ☁️✨
