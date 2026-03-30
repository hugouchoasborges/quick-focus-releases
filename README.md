# QuickFocus Landing (GitHub Pages / gh-pages)

This branch (`gh-pages`) hosts only the public website.

## Publish setup

1. Open repository: `hugouchoasborges/quick-focus-releases`.
2. Go to `Settings` > `Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `gh-pages`.
5. Folder: `/ (root)`.
6. Save and wait for deployment.

## Operational model

- `main` branch: updater metadata (`latest.json`, `releases-index.json`) and release artifacts metadata.
- `gh-pages` branch: static landing page only.

## Update website

1. Checkout `gh-pages` in the submodule.
2. Edit `index.html` and `assets/*`.
3. Commit and push inside submodule repository.
4. In dev repo, commit the updated submodule pointer only if you want to pin a specific site commit.

## Download and upgrade links

- Download (stable asset name):
  - `https://github.com/hugouchoasborges/quick-focus-releases/releases/latest/download/QuickFocus-Setup.exe`
- Upgrade:
  - `https://hugouchoasborges.notion.site/`

## Installer asset stability

Release flow keeps fixed asset name `QuickFocus-Setup.exe`:

- dev repo script: `scripts/ensure-release-installer.ps1`
- releases repo workflow: `.github/workflows/release-from-tag.yml`

Both validate/use `releases/<version>/QuickFocus-Setup.exe`.
