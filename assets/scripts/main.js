const THEME_KEY = "quickfocus-theme";
const LATEST_DOWNLOAD_FILENAME = "QuickFocus-Setup.zip";
const LATEST_DOWNLOAD_URL = `https://github.com/hugouchoasborges/quick-focus-releases/releases/latest/download/${LATEST_DOWNLOAD_FILENAME}`;
const LATEST_MANIFEST_URL = "https://raw.githubusercontent.com/hugouchoasborges/quick-focus-releases/main/latest.json";
const DEFAULT_STORE_URL = "https://quicklabs.lemonsqueezy.com/checkout/buy/a0847e64-36db-461c-b79d-958d2a3e85e1?enabled=1491098";
const MEDIA_FOLDERS = new Set(["Images", "Gifs", "Videos"]);
const MEDIA_TREE_API_URL = "https://api.github.com/repos/hugouchoasborges/quick-focus-releases/git/trees/gh-pages?recursive=1";
const MEDIA_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".avif", ".svg"]);
const MEDIA_VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);

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
  const extensionIndex = lower.lastIndexOf(".");
  if (extensionIndex < 0) {
    return false;
  }
  return MEDIA_VIDEO_EXTENSIONS.has(lower.slice(extensionIndex));
}

function mediaExtension(path) {
  const lower = String(path || "").toLowerCase();
  const extensionIndex = lower.lastIndexOf(".");
  if (extensionIndex < 0) {
    return "";
  }
  return lower.slice(extensionIndex);
}

function isSupportedVariantMediaPath(path, variant) {
  if (!path || !path.startsWith(`${variant}/`)) {
    return false;
  }
  const segments = path.split("/");
  if (segments.length < 3) {
    return false;
  }
  const folder = segments[1];
  if (!MEDIA_FOLDERS.has(folder)) {
    return false;
  }
  const filename = segments.slice(2).join("/");
  if (!filename || filename.startsWith(".") || filename.toLowerCase() === "readme.md") {
    return false;
  }
  const extension = mediaExtension(filename);
  if (!extension) {
    return false;
  }
  if (folder === "Videos") {
    return MEDIA_VIDEO_EXTENSIONS.has(extension);
  }
  return MEDIA_IMAGE_EXTENSIONS.has(extension);
}

function pathWeight(path) {
  const normalized = String(path || "").toLowerCase();
  if (normalized.includes("/images/preview.")) {
    return 0;
  }
  if (normalized.includes("/images/")) {
    return 1;
  }
  if (normalized.includes("/gifs/")) {
    return 2;
  }
  return 3;
}

let cachedRepoTreePaths = null;
let mediaItems = [];
let mediaIndex = 0;
let mediaEventsBound = false;
let mediaRenderCycle = 0;

async function loadRepoTreePaths() {
  if (cachedRepoTreePaths) {
    return cachedRepoTreePaths;
  }

  const response = await fetch(MEDIA_TREE_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Repository tree unavailable");
  }

  const payload = await response.json();
  const tree = Array.isArray(payload && payload.tree) ? payload.tree : [];
  cachedRepoTreePaths = tree
    .filter((entry) => entry && entry.type === "blob" && typeof entry.path === "string")
    .map((entry) => entry.path);
  return cachedRepoTreePaths;
}

async function loadVariantMediaItems(variant) {
  const treePaths = await loadRepoTreePaths();
  const variantPaths = treePaths
    .filter((path) => isSupportedVariantMediaPath(path, variant))
    .sort((left, right) => {
      const byWeight = pathWeight(left) - pathWeight(right);
      if (byWeight !== 0) {
        return byWeight;
      }
      return left.localeCompare(right, undefined, { sensitivity: "base" });
    });

  return variantPaths.map((path) => ({
    path,
    kind: isVideo(path) ? "video" : "image"
  }));
}

function toggleMediaSection(hasItems) {
  const section = document.getElementById("media");
  if (!section) {
    return;
  }
  section.hidden = !hasItems;
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
  const grid = document.querySelector("[data-media-grid]");
  if (!grid) {
    return;
  }

  const currentCycle = ++mediaRenderCycle;
  const lightbox = document.querySelector("[data-media-lightbox]");
  if (lightbox) {
    lightbox.hidden = true;
  }
  document.body.classList.remove("media-lightbox-open");

  try {
    mediaItems = await loadVariantMediaItems(currentVariant());
  } catch (_error) {
    mediaItems = [];
  }

  if (currentCycle !== mediaRenderCycle) {
    return;
  }

  renderMediaGrid(mediaItems);
  toggleMediaSection(mediaItems.length > 0);
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

async function initializeStoreLinks() {
  const links = document.querySelectorAll("[data-store-link]");
  if (!links.length) {
    return;
  }

  let storeUrl = DEFAULT_STORE_URL;
  try {
    const separator = LATEST_MANIFEST_URL.includes("?") ? "&" : "?";
    const response = await fetch(`${LATEST_MANIFEST_URL}${separator}ts=${Date.now()}`, { cache: "no-store" });
    if (response.ok) {
      const manifest = await response.json();
      if (manifest && typeof manifest.storeUrl === "string" && manifest.storeUrl.trim().length > 0) {
        storeUrl = manifest.storeUrl.trim();
      }
    }
  } catch (_error) {
    storeUrl = DEFAULT_STORE_URL;
  }

  links.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      link.href = storeUrl;
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
initializeStoreLinks();
initializeMedia();
initializeHeroMedia();
initializeYear();
