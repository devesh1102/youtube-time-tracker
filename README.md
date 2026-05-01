# 📺 YouTube Time Tracker — Chrome Extension

> A lightweight Chrome Extension that automatically tracks your YouTube usage — time spent, videos watched, and daily limits — so you can stay mindful of your screen time.

---

## 🖼️ Preview

| Stats Popup | Progress Bar | Video History |
|---|---|---|
| Time spent today | Visual limit tracker | List of videos watched |

---

## ✨ Features

- ⏱️ **Automatic Time Tracking** — tracks time only when a video is actively playing and the tab is visible
- 🎬 **Video History** — logs every video title you navigate to during the day
- 📊 **Daily Stats Popup** — click the extension icon to see time spent, video count, and a progress bar
- 🔔 **Daily Limit Alerts** — get a browser notification when you exceed your set daily limit (default: 60 min)
- 🔄 **Auto Reset** — data resets every day automatically
- 💾 **Local Storage Only** — all data stays on your device, nothing is sent anywhere

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Chrome Extensions Manifest V3** | Extension framework and lifecycle |
| **chrome.storage.local** | Persistent local data storage (no server needed) |
| **chrome.runtime messaging** | Communication between content script and service worker |
| **chrome.notifications API** | Native browser notifications for limit alerts |
| **Content Scripts (JS)** | Injected into YouTube to track time and video navigation |
| **Service Worker (background.js)** | Aggregates data and manages notifications in the background |
| **YouTube SPA Event (`yt-navigate-finish`)** | Detects video navigation without page reloads |
| **HTML5 Video API** | Checks if video is playing or paused |
| **Vanilla HTML/CSS/JS** | Popup UI — no frameworks needed |

---

## 📁 Project Structure

```
chromeextention/
├── manifest.json       # MV3 manifest — permissions & entry points
├── content.js          # Injected into YouTube — tracks time & video titles
├── background.js       # Service worker — stores data, fires notifications
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic — reads storage & renders stats
├── popup.css           # Popup styles (dark YouTube-like theme)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🚀 How to Install & Use

### Step 1 — Download / Clone the repo
```bash
git clone https://github.com/devesh1102/youtube-time-tracker.git
```

### Step 2 — Open Chrome Extensions
Go to: **`chrome://extensions`** in your Chrome address bar

### Step 3 — Enable Developer Mode
Toggle **"Developer mode"** ON in the top-right corner

### Step 4 — Load the Extension
Click **"Load unpacked"** → select the `chromeextention` folder

### Step 5 — Start Using YouTube!
The extension is now active. Go to [youtube.com](https://youtube.com) and play any video — tracking starts automatically.

---

## 📊 Using the Popup

Click the extension icon in your Chrome toolbar to open the stats popup:

| Section | What it shows |
|---|---|
| **Time Today** | Total active time spent on YouTube today |
| **Videos Watched** | Count of videos navigated to today |
| **Progress Bar** | Visual indicator of usage vs. daily limit |
| **Videos List** | Titles and times of each video watched |
| **Daily Limit Setting** | Input to change your daily time limit (in minutes) |

---

## ⚙️ Configuring Daily Limit

1. Click the extension icon
2. Scroll to **"Daily Limit"** at the bottom
3. Enter your desired limit in minutes (e.g., `45`)
4. Click **"Save"**

You'll receive a **browser notification** once you exceed the limit. Tracking continues silently after that (no blocking).

---

## 🔒 Privacy

- ✅ All data is stored **locally on your device** using `chrome.storage.local`
- ✅ No analytics, no telemetry, no external servers
- ✅ No account or login required

---

## 📜 License

MIT License — free to use, modify, and distribute.
