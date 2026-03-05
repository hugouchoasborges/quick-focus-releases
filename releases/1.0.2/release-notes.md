# QuickFocus 1.0.2

## Added
- Added in-app update suggestion popup anchored in the app UI (bottom-right), with actions `Update to <version>`, `Cancel`, and `See Changes`.
- Added localization keys for update suggestion popup content in English and Portuguese.

## Changed
- Update auto-check now runs only when the app UI is opened for the first time after process start.
- `Settings > Updates > Check for updates` now uses the same internal app popup flow instead of Windows message box prompts.
- Header version now prioritizes `release-info.json` so published version metadata and visible app version stay aligned.

## Fixed
- Fixed update popup positioning/layout overflow issues and refined dark-theme readability.
- Fixed tray `Exit` behavior to enforce shutdown by stopping background routines, canceling sync work, and forcing process termination as fallback.
- Fixed updater suggestion logic to never suggest downgrades (older semantic version), even when remote release date is newer.
