# QuickFocus 1.1.28a

## Highlights

- Sync Google Drive agora reutiliza sessao unica de `DriveService` por execucao de sincronizacao.
- Upload de sync com concorrencia centralizada (`default=8`, `max=12`) para reduzir latencia agregada.
- Entidades de tarefas/notas passaram a ser publicadas em shards (`batch`) por projeto para reduzir volume de requests em contas com muitos itens.
