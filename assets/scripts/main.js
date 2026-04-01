const THEME_KEY = "quickfocus-theme";

function resolveTheme(selectedTheme) {
  if (selectedTheme === "dark") {
    return "dark";
  }
  if (selectedTheme === "light") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(selectedTheme) {
  const effectiveTheme = resolveTheme(selectedTheme);
  document.documentElement.setAttribute("data-theme", effectiveTheme);
}

function initializeTheme() {
  const themeSelect = document.getElementById("theme-select");
  if (!themeSelect) {
    return;
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "system";
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;
    localStorage.setItem(THEME_KEY, selectedTheme);
    applyTheme(selectedTheme);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const selectedTheme = localStorage.getItem(THEME_KEY) || "system";
    if (selectedTheme === "system") {
      applyTheme("system");
    }
  });
}

function isVideo(path) {
  const lower = path.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm");
}

function createMediaItems(manifest) {
  return [
    ...(manifest.images || []),
    ...(manifest.gifs || []),
    ...(manifest.videos || [])
  ].map((path) => ({ path, kind: isVideo(path) ? "video" : "image" }));
}

let cachedManifest = null;
let mediaItems = [];
let mediaIndex = 0;
let mediaEventsBound = false;

async function loadManifest() {
  if (cachedManifest) {
    return cachedManifest;
  }

  const response = await fetch("media-manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Manifest unavailable");
  }

  cachedManifest = await response.json();
  return cachedManifest;
}

function renderMediaCard(item, index) {
  const preview = item.kind === "video"
    ? `<video class="media-thumb" src="${item.path}" muted playsinline preload="metadata"></video>`
    : `<img class="media-thumb" src="${item.path}" alt="QuickFocus media preview">`;

  return `<button class="media-frame media-card-btn" data-media-open="${index}" type="button">${preview}</button>`;
}

function renderMediaGrid(items) {
  const grid = document.querySelector("[data-media-grid]");
  if (!grid) {
    return;
  }

  grid.innerHTML = items.map((item, index) => renderMediaCard(item, index)).join("");
}

function renderLightboxItem() {
  const viewer = document.querySelector("[data-media-viewer]");
  if (!viewer || !mediaItems.length) {
    return;
  }

  const item = mediaItems[mediaIndex];
  if (item.kind === "video") {
    viewer.innerHTML = `<video class="media-lightbox-media" src="${item.path}" controls autoplay playsinline preload="metadata"></video>`;
  } else {
    viewer.innerHTML = `<img class="media-lightbox-media" src="${item.path}" alt="QuickFocus media preview">`;
  }
}

function openLightbox(index) {
  if (!mediaItems.length) {
    return;
  }

  mediaIndex = index;
  const lightbox = document.querySelector("[data-media-lightbox]");
  if (!lightbox) {
    return;
  }

  renderLightboxItem();
  lightbox.hidden = false;
  document.body.classList.add("media-lightbox-open");
}

function closeLightbox() {
  const lightbox = document.querySelector("[data-media-lightbox]");
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("media-lightbox-open");
}

function shiftLightbox(step) {
  if (!mediaItems.length) {
    return;
  }

  mediaIndex = (mediaIndex + step + mediaItems.length) % mediaItems.length;
  renderLightboxItem();
}

function bindMediaEvents() {
  if (mediaEventsBound) {
    return;
  }

  mediaEventsBound = true;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const opener = target.closest("[data-media-open]");
    if (opener instanceof HTMLElement) {
      const value = Number(opener.getAttribute("data-media-open"));
      if (Number.isInteger(value)) {
        openLightbox(value);
      }
      return;
    }

    if (target.closest("[data-media-close]")) {
      closeLightbox();
      return;
    }

    if (target.closest("[data-media-prev]")) {
      shiftLightbox(-1);
      return;
    }

    if (target.closest("[data-media-next]")) {
      shiftLightbox(1);
      return;
    }

    if (target.matches("[data-media-lightbox]")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    const lightbox = document.querySelector("[data-media-lightbox]");
    if (!lightbox || lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      shiftLightbox(-1);
    } else if (event.key === "ArrowRight") {
      shiftLightbox(1);
    }
  });
}

async function initializeMedia() {
  const hasMedia = document.querySelector("[data-media-grid]");
  if (!hasMedia) {
    return;
  }

  const lightbox = document.querySelector("[data-media-lightbox]");
  if (lightbox) {
    lightbox.hidden = true;
  }
  document.body.classList.remove("media-lightbox-open");

  try {
    const manifest = await loadManifest();
    mediaItems = createMediaItems(manifest);
  } catch (_error) {
    mediaItems = [];
  }

  renderMediaGrid(mediaItems);
  bindMediaEvents();
}

function initializeYear() {
  const year = document.getElementById("year");
  if (!year) {
    return;
  }
  year.textContent = new Date().getFullYear();
}

function initializeLanguage() {
  if (!window.QuickFocusI18n || !window.QuickFocusI18n.initialize) {
    return;
  }
  window.QuickFocusI18n.initialize();
}

window.addEventListener("quickfocus:language-changed", () => {
  initializeMedia();
});

initializeTheme();
initializeLanguage();
initializeMedia();
initializeYear();
