# QuickFocus 1.6.11b

## Highlights

- Otimizacao de indexacao externa para ignorar arquivos nao suportados antes de iniciar extracao e remocao do log recorrente `External text indexing skipped`.
- Checagem de sync em foreground com janela de intervalo para reduzir criacao repetida de sessao Google Drive; telemetria de criacao de sessao movida para nivel `Debug`.
- Modo minimal com comportamento mais previsivel: no hover, apenas o icone de olho reaparece para sair do modo minimal, sem reveal do topo completo e sem resize ligado a essa interacao.
- Correcao visual ao reabrir em minimal, removendo flash de cabecalho e deslocamento vertical do painel de tarefas.
