// Tracks active YouTube time and video navigation, sends data to background.js

let tickInterval = null;
let lastTrackedUrl = "";

function getVideoElement() {
  return document.querySelector("video");
}

function isVideoPlaying() {
  const video = getVideoElement();
  return video && !video.paused && !video.ended && video.readyState > 2;
}

function isOnVideoPage() {
  return window.location.pathname === "/watch";
}

function startTicking() {
  if (tickInterval) return;
  tickInterval = setInterval(() => {
    if (!document.hidden && isVideoPlaying()) {
      chrome.runtime.sendMessage({ type: "TIME_TICK" });
    }
  }, 1000);
}

function stopTicking() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

// Count a video when the URL changes to a /watch page
function checkForNewVideo() {
  const currentUrl = window.location.href;
  if (isOnVideoPage() && currentUrl !== lastTrackedUrl) {
    lastTrackedUrl = currentUrl;
    const title = document.title.replace(" - YouTube", "").trim();
    chrome.runtime.sendMessage({
      type: "VIDEO_WATCHED",
      title: title || "Unknown Video",
      watchedAt: new Date().toISOString()
    });
  }
}

// YouTube is a SPA — this event fires on every internal navigation
window.addEventListener("yt-navigate-finish", () => {
  checkForNewVideo();
});

// Pause ticking when tab is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTicking();
  }
});

// Start ticking; video play/pause state is checked inside the interval
startTicking();

// Handle initial page load (e.g., direct link to a video)
window.addEventListener("load", () => {
  checkForNewVideo();
});
