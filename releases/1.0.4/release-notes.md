# QuickFocus 1.0.4

## Changed
- Updated updater check flow to support immediate check when enabling Alpha/Beta channels in Settings.
- Updated manual check flow in `Settings > Updates` to bring the main window to foreground before showing update suggestion popup.
- Updated update popup visual polish (title emphasis/centering, tighter layout spacing, localized popup labels).

## Fixed
- Fixed updater local version resolution by validating `release-info.json` against assembly version and falling back safely when mismatched.
- Fixed update feed requests to bypass stale cache (`no-cache` headers + timestamp query).
- Added explicit logs explaining why a remote update was ignored (channel disabled, older remote version, invalid version format, etc.).
- Fixed `Release Date` field in `Settings > Updates` to display the installed release date from `release-info.json` instead of `N/A`.
- Fixed `Stop Sync` button availability in `Settings > Backup` to remain actionable while sync is running.
- Improved tray `Exit` reliability by forcing cancellation of background routines and adding process-kill fallback on shutdown failure.
