const THEME_KEY = "quickfocus-theme";
const themeSelect = document.getElementById("theme-select");

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

function renderPlaceholder(container, label) {
  container.innerHTML = `<div class="media-frame">Add files to /${label} and list them in media-manifest.json</div>`;
}

function createImageElement(path) {
  return `<img class="media-thumb" src="${path}" alt="QuickFocus media">`;
}

function createVideoElement(path) {
  return `<video class="media-thumb" src="${path}" controls preload="metadata"></video>`;
}

function renderItems(kind, items) {
  const container = document.querySelector(`.media-items[data-kind="${kind}"]`);
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    renderPlaceholder(container, kind === "images" ? "Images" : kind === "gifs" ? "Gifs" : "Videos");
    return;
  }

  const template = items
    .map((path) => {
      if (kind === "videos") {
        return createVideoElement(path);
      }
      return createImageElement(path);
    })
    .join("");

  container.innerHTML = template;
}

async function initializeMedia() {
  try {
    const response = await fetch("media-manifest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Manifest unavailable");
    }

    const manifest = await response.json();
    renderItems("images", manifest.images || []);
    renderItems("gifs", manifest.gifs || []);
    renderItems("videos", manifest.videos || []);
  } catch {
    renderItems("images", []);
    renderItems("gifs", []);
    renderItems("videos", []);
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
initializeTheme();
initializeMedia();
