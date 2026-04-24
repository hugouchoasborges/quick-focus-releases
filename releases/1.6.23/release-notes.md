# QuickFocus 1.6.23

## Highlights

- Dynamic workspace ordering com seguranca de hierarquia: raiz permanece em projecao local e subtarefas passam a persistir ordem apenas no parent original.
- Duplicacao de tarefa agora copia conteudo completo (notes, URLs e attachments) em toda a arvore duplicada, com novos IDs para todas as entidades.
- Correcao de persistencia da duplicacao para evitar erro SQLite de chave estrangeira (`FOREIGN KEY constraint failed`).
