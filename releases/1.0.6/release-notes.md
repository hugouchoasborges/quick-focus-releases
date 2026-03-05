# QuickFocus 1.0.6

## Added
- Added release-index based updater lookup so the app can evaluate multiple available releases instead of only `latest.json`.

## Changed
- Updated update candidate selection to always evaluate eligible channels and offer the highest valid version among stable/beta/alpha preferences.
- Updated same-base channel priority in selection to prefer `stable`, then `beta`, then `alpha`.

## Fixed
- Fixed fallback behavior where stable updates could be ignored when `latest.json` pointed to a disallowed alpha version.
- Fixed stale update checks by keeping no-cache manifest requests and adding clearer selection behavior in updater checks.
