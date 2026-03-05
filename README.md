# quick-focus-releases

Public release feed for QuickFocus auto-update.

## Layout

- `latest.json`: manifest consumed by the app updater.
- `releases/<version>/release-info.json`: release metadata copy for traceability.
- `releases/<version>/release-notes.md`: markdown release notes.

## Publish process

1. Generate new installer `QuickFocus-Setup.exe`.
2. Compute installer SHA-256.
3. Create/update `releases/<version>/release-info.json` and `release-notes.md`.
4. Update `latest.json` with new `version`, `releaseDateUtc`, `installerUrl`, `installerSha256`, `releaseNotesUrl`.
5. Commit and push this repository.
6. Create GitHub Release in this repo with installer asset.
