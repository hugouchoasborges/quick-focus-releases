const THEME_KEY = "quickfocus-theme";
const LATEST_DOWNLOAD_FILENAME = "QuickFocus-Setup.zip";
const LATEST_DOWNLOAD_URL = `https://github.com/hugouchoasborges/quick-focus-releases/releases/latest/download/${LATEST_DOWNLOAD_FILENAME}`;
const MEDIA_FOLDERS = new Set(["Images", "Gifs", "Videos"]);

function resolveTheme(selectedTheme) {
  if (selectedTheme === "dark") {
    return "dark";
  }
  if (selectedTheme === "light") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function languageKey(inputLanguage) {
  return String(inputLanguage || "").toLowerCase().startsWith("pt") ? "pt" : "en";
}

function currentLanguage() {
  return document.documentElement.lang || (window.QuickFocusI18n && window.QuickFocusI18n.getPreferredLanguage && window.QuickFocusI18n.getPreferredLanguage()) || "en";
}

function currentTheme() {
  const effectiveTheme = document.documentElement.getAttribute("data-theme");
  if (effectiveTheme === "dark") {
    return "dark";
  }
  return "light";
}

function currentVariant() {
  const themeKey = currentTheme() === "dark" ? "dark" : "white";
  return `${themeKey}-${languageKey(currentLanguage())}`;
}

function mediaVariantFallbacks() {
  const variant = currentVariant();
  const [themeKey, language] = variant.split("-");
  const fallbackTheme = themeKey === "dark" ? "white" : "dark";
  const ordered = [
    variant,
    `${themeKey}-en`,
    `${fallbackTheme}-${language}`,
    "white-en"
  ];
  return ordered.filter((value, index) => ordered.indexOf(value) === index);
}

function candidatePathsFor(path) {
  const split = String(path || "").split("/");
  const folder = split[0];
  if (!MEDIA_FOLDERS.has(folder) || split.length < 2) {
    return [path];
  }
  const file = split.slice(1).join("/");
  const candidates = [
    ...mediaVariantFallbacks().map((variant) => `${variant}/${folder}/${file}`),
    path
  ];
  return candidates.filter((value, index) => candidates.indexOf(value) === index);
}

const assetAvailabilityCache = new Map();

async function assetExists(path) {
  if (assetAvailabilityCache.has(path)) {
    return assetAvailabilityCache.get(path);
  }
  let exists = false;
  try {
    const response = await fetch(path, { method: "HEAD", cache: "no-store" });
    exists = response.ok;
  } catch (_error) {
    exists = false;
  }
  assetAvailabilityCache.set(path, exists);
  return exists;
}

async function resolveMediaPath(path) {
  const candidates = candidatePathsFor(path);
  for (const candidate of candidates) {
    if (await assetExists(candidate)) {
      return candidate;
    }
  }
  return path;
}

function applyTheme(selectedTheme) {
  const effectiveTheme = resolveTheme(selectedTheme);
  document.documentElement.setAttribute("data-theme", effectiveTheme);
  window.dispatchEvent(new CustomEvent("quickfocus:theme-changed", { detail: { theme: effectiveTheme } }));
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
let mediaRenderCycle = 0;

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

async function resolveMediaItems(items) {
  const resolvedPaths = await Promise.all(items.map((item) => resolveMediaPath(item.path)));
  return items.map((item, index) => ({ ...item, path: resolvedPaths[index] }));
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

  const currentCycle = ++mediaRenderCycle;
  const lightbox = document.querySelector("[data-media-lightbox]");
  if (lightbox) {
    lightbox.hidden = true;
  }
  document.body.classList.remove("media-lightbox-open");

  try {
    const manifest = await loadManifest();
    const items = createMediaItems(manifest);
    mediaItems = await resolveMediaItems(items);
  } catch (_error) {
    mediaItems = [];
  }

  if (currentCycle !== mediaRenderCycle) {
    return;
  }

  renderMediaGrid(mediaItems);
  bindMediaEvents();
}

async function initializeHeroMedia() {
  const images = document.querySelectorAll("[data-media-asset]");
  if (!images.length) {
    return;
  }
  const updates = [];
  images.forEach((image) => {
    if (image instanceof HTMLImageElement) {
      updates.push(resolveMediaPath(image.getAttribute("data-media-asset") || "").then((path) => {
        if (path) {
          image.src = path;
        }
      }));
    }
  });
  await Promise.all(updates);
}

function initializeLatestDownloadLinks() {
  const links = document.querySelectorAll("[data-latest-download]");
  links.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      link.href = LATEST_DOWNLOAD_URL;
    }
  });
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
  initializeHeroMedia();
});

window.addEventListener("quickfocus:theme-changed", () => {
  initializeMedia();
  initializeHeroMedia();
});

initializeTheme();
initializeLanguage();
initializeLatestDownloadLinks();
initializeMedia();
initializeHeroMedia();
initializeYear();
