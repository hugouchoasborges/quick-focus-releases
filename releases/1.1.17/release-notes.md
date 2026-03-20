# QuickFocus 1.1.17

## Highlights

- Correcao da auto-minimizacao por perda de foco: quando o foreground for `quickpen.exe` ou `quickpenhelper.exe`, o QuickFocus permanece visivel.
- Fluxo atual de minimizacao para tray foi preservado para todos os demais aplicativos.
- Adicionados logs estruturados de diagnostico no `OnDeactivated` com processo/titulo alvo e decisao (`ignore_quickpen`, `hide_to_tray`, `keep_visible_policy`).
