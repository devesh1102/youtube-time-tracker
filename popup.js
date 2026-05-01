// Reads chrome.storage.local and renders today's stats

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

function formatWatchedAt(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderStats(today, settings) {
  const totalSeconds = today.totalSeconds || 0;
  const videoCount = today.videoCount || 0;
  const videos = today.videos || [];
  const limitMinutes = settings.dailyLimitMinutes || 60;
  const limitSeconds = limitMinutes * 60;

  // Stats
  document.getElementById("timeSpent").textContent = formatTime(totalSeconds);
  document.getElementById("videoCount").textContent = videoCount;

  // Progress bar
  const percent = Math.min(100, Math.round((totalSeconds / limitSeconds) * 100));
  document.getElementById("progressLabel").textContent =
    `${Math.floor(totalSeconds / 60)} / ${limitMinutes} min`;
  document.getElementById("progressPercent").textContent = `${percent}%`;

  const fill = document.getElementById("progressFill");
  fill.style.width = `${percent}%`;
  fill.className = "progress-fill" + (percent >= 100 ? " over-limit" : percent >= 75 ? " near-limit" : "");

  // Video list
  const list = document.getElementById("videoList");
  if (videos.length === 0) {
    list.innerHTML = '<li class="empty">No videos watched yet today.</li>';
  } else {
    list.innerHTML = [...videos].reverse().map((v) =>
      `<li>
        <span class="video-title">${escapeHtml(v.title)}</span>
        <span class="video-time">${formatWatchedAt(v.watchedAt)}</span>
      </li>`
    ).join("");
  }

  // Settings input
  document.getElementById("limitInput").value = limitMinutes;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function loadData() {
  const key = getTodayKey();
  chrome.storage.local.get([key, "settings"], (result) => {
    const today = result[key] || { totalSeconds: 0, videoCount: 0, videos: [] };
    const settings = result["settings"] || { dailyLimitMinutes: 60 };
    renderStats(today, settings);
  });
}

document.getElementById("saveLimit").addEventListener("click", () => {
  const val = parseInt(document.getElementById("limitInput").value, 10);
  if (!val || val < 1) return;

  chrome.storage.local.get("settings", (result) => {
    const settings = result["settings"] || {};
    settings.dailyLimitMinutes = val;
    chrome.storage.local.set({ settings }, () => {
      const msg = document.getElementById("saveMsg");
      msg.textContent = "✓ Saved!";
      setTimeout(() => (msg.textContent = ""), 2000);
      loadData();
    });
  });
});

loadData();
