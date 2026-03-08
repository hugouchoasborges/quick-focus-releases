# QuickFocus 1.0.29

## Summary

- Added local task attachments management (reference-only paths) with lightweight popup actions.
- Added task-row paperclip indicator with count tooltip and improved attachment popup interaction/closing flows.
- Updated URL indicator icon to globe and refined attachment visual semantics for light/dark themes.

## Technical Notes

- Attachments store only local absolute file paths; no file copy/upload/preview or content sync is performed.
- Persistence and UI integration were implemented incrementally with low idle overhead.
