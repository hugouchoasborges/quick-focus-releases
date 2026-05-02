const MANUAL_FILE = "manual_en.md";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || "section";
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function parseMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const headings = [];
  const html = [];
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const id = slugify(title);
      headings.push({ level, title, id });
      html.push(`<h${level} id="${id}">${renderInline(title)}</h${level}>`);
      continue;
    }

    const listMatch = /^-\s+(.+)$/.exec(line);
    if (listMatch) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInline(listMatch[1])}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (!line.trim()) {
      html.push("");
    } else {
      html.push(`<p>${renderInline(line)}</p>`);
    }
  }

  if (inList) {
    html.push("</ul>");
  }

  return { html: html.join("\n"), headings };
}

function renderToc(headings) {
  const toc = document.getElementById("manual-toc-list");
  if (!toc) {
    return;
  }
  toc.innerHTML = headings
    .map((item) => `<a class="level-${item.level}" href="#${item.id}">${escapeHtml(item.title)}</a>`)
    .join("");
}

function bindActiveSection() {
  const links = Array.from(document.querySelectorAll("#manual-toc-list a"));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  function update() {
    let activeId = sections[0] ? sections[0].id : "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 120) {
        activeId = section.id;
      }
    }
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
}

async function initializeManual() {
  const container = document.getElementById("manual-content");
  if (!container) {
    return;
  }

  try {
    const response = await fetch(MANUAL_FILE, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("manual_not_found");
    }
    const markdown = await response.text();
    const parsed = parseMarkdown(markdown);
    container.innerHTML = parsed.html;
    renderToc(parsed.headings);
    bindActiveSection();
  } catch (_error) {
    container.innerHTML = "<p>Unable to load manual at this time.</p>";
  }
}

initializeManual();
