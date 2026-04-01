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

function activeLanguageKey() {
  return document.documentElement.lang.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function mediaPlaceholder(kind) {
  const lang = activeLanguageKey();
  const messages = {
    images: {
      en: "Add files to /Images and list them in media-manifest.json",
      pt: "Adicione arquivos em /Images e liste em media-manifest.json"
    },
    gifs: {
      en: "Add files to /Gifs and list them in media-manifest.json",
      pt: "Adicione arquivos em /Gifs e liste em media-manifest.json"
    },
    videos: {
      en: "Add files to /Videos and list them in media-manifest.json",
      pt: "Adicione arquivos em /Videos e liste em media-manifest.json"
    }
  };

  return messages[kind]?.[lang] || messages[kind]?.en || "";
}

function renderPlaceholder(container, kind) {
  container.innerHTML = `<div class="media-frame">${mediaPlaceholder(kind)}</div>`;
}

function createItemTemplate(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) {
    return `<video class="media-thumb" src="${path}" controls preload="metadata"></video>`;
  }
  return `<img class="media-thumb" src="${path}" alt="QuickFocus media preview">`;
}

function renderItems(kind, items) {
  const container = document.querySelector(`.media-items[data-kind="${kind}"]`);
  if (!container) {
    return;
  }

  if (!items.length) {
    renderPlaceholder(container, kind);
    return;
  }

  const template = items
    .map((path) => `<div class="media-frame">${createItemTemplate(path)}</div>`)
    .join("");

  container.innerHTML = template;
}

let cachedManifest = null;

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

async function initializeMedia() {
  const hasMedia = document.querySelector(".media-items");
  if (!hasMedia) {
    return;
  }

  try {
    const manifest = await loadManifest();
    renderItems("images", manifest.images || []);
    renderItems("gifs", manifest.gifs || []);
    renderItems("videos", manifest.videos || []);
  } catch (_error) {
    renderItems("images", []);
    renderItems("gifs", []);
    renderItems("videos", []);
  }
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