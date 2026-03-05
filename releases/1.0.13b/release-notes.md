# QuickFocus 1.0.13b

- Beta release with task color/filter workflow improvements and visual grouping controls.
- Added keyboard toggle for visual grouping (`Modifier + G`) and active grouping indicator near Pomodoro controls.
- Fixed `Modifier + R` shortcut handling so `Sync Now` triggers reliably with immediate visual feedback.
- Fixed task editing focus stability by deferring heavy filter recompute while text editors are active.
- Fixed auto-filter persistence timing for newly created tasks to avoid SQLite foreign-key failures.
