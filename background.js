// Service worker: aggregates usage data and fires daily limit notifications

const DEFAULT_LIMIT_MINUTES = 60;

function getTodayKey() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

async function getTodayData() {
  const key = getTodayKey();
  return new Promise((resolve) => {
    chrome.storage.local.get([key, "settings"], (result) => {
      const today = result[key] || { totalSeconds: 0, videoCount: 0, videos: [] };
      const settings = result["settings"] || { dailyLimitMinutes: DEFAULT_LIMIT_MINUTES, notifiedToday: false };
      resolve({ key, today, settings });
    });
  });
}

async function saveTodayData(key, today) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: today }, resolve);
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, resolve);
  });
}

async function checkAndNotify(totalSeconds, settings) {
  const limitSeconds = settings.dailyLimitMinutes * 60;

  // Reset notification flag at start of new day
  if (settings.lastNotifiedDate !== getTodayKey()) {
    settings.notifiedToday = false;
    settings.lastNotifiedDate = getTodayKey();
    await saveSettings(settings);
  }

  if (!settings.notifiedToday && totalSeconds >= limitSeconds) {
    const minutes = settings.dailyLimitMinutes;
    chrome.notifications.create("yt-limit-reached", {
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "YouTube Daily Limit Reached!",
      message: `You've spent ${minutes} minutes on YouTube today.`
    });
    settings.notifiedToday = true;
    settings.lastNotifiedDate = getTodayKey();
    await saveSettings(settings);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "TIME_TICK") {
    getTodayData().then(async ({ key, today, settings }) => {
      today.totalSeconds += 1;
      await saveTodayData(key, today);
      await checkAndNotify(today.totalSeconds, settings);
    });
  }

  if (message.type === "VIDEO_WATCHED") {
    getTodayData().then(async ({ key, today }) => {
      today.videoCount += 1;
      today.videos.push({
        title: message.title,
        watchedAt: message.watchedAt
      });
      await saveTodayData(key, today);
    });
  }
});
