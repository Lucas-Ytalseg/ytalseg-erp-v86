# RESUMO DO PROJETO — ERP YTALSEG (atualizado pós-V15, Agosto/2026)

> Cole este resumo no início de uma conversa nova com o Claude (chat) para retomar o trabalho com todo o contexto, sem gastar tokens relendo conversas antigas. (Substitui o RESUMO V13.)

---

## QUEM SOU E COMO TRABALHO
- Sou o Lucas, dono da **YTALSEG** (segurança do trabalho). **Iniciante** em programação.
- Uso **Windows + PowerShell**, notebook (Chrome) e iPhone (Safari).
- Fluxo de trabalho estabelecido: o Claude do chat prepara **PROMPTS MESTRES** detalhados → eu colo no **Claude Code** (instalado, com login feito) → ele constrói, testa, valida e faz o deploy sozinho.
- **Não quero tentativa e erro**: tudo testado antes de subir.
- Push direto autorizado ao Claude Code DESDE QUE: backup em `_backups_modules/` antes de editar; `npm run build` com zero erros; testes do backend passando (⚠️ ver pendência dos testes desatualizados abaixo); build copiado para `app/backend/app/static/` (ver PROCEDIMENTO DE DEPLOY); testado local antes de subir. PROIBIDO: `push --force`; apagar/recriar banco ou arquivos do Volume `/data`; alterar variáveis do Railway; migrações não-aditivas.

## O QUE É O ERP
- Sistema interno "YTALSEG ERP": relatórios de horas, financeiro, clientes, equipe, nota fiscal, histórico de PDFs, cobrança, usuários/login seguro.
- **Backend:** FastAPI (Python) em `app/backend/app/main.py`. **Frontend:** React + Vite em `frontend/`.
- **No ar:** https://web-production-2b576.up.railway.app (Railway, plano **Hobby pago ativo**, projeto "acceptable-essence", serviço "web").
- **GitHub:** github.com/Lucas-Ytalseg/ytalseg-erp-v86 (2FA ativo no GitHub e Railway).
- **Pasta local:** `C:\Users\lucas\Downloads\YTALSEG-ERP-V86-RAILWAY\ytalseg`
- **Banco persistente:** SQLite no Volume Railway montado em `/data` (`DATA_DIR=/data`, banco em `/data/YTALSEG/ytalseg_erp.db`, uploads em `/data/YTALSEG/uploads/`). Dados NÃO somem em redeploy.
- Função central do backend: `conectar_db()` (acesso ao SQLite) — é o núcleo de quase toda a lógica.

## FERRAMENTAS CONFIGURADAS
- **Claude Code** instalado (`C:\Users\lucas\.local\bin\claude.exe`, no PATH). Login: lucasberg25@gmail.com.
- **Graphify** instalado: mapeia o projeto em grafo (`graphify-out/`). Rodar `/graphify . --update` após cada mudança grande (incremental; extração de código por AST é de graça, só imagens/docs custam tokens). Saídas: `graph.html` (abrir no navegador), `GRAPH_REPORT.md`, `graph.json`. **Já atualizado com tudo até a V15.**
- **`.claudeignore`** e **`.gitignore`**: contêm `graphify-out/`; `.claudeignore` também `_backups_modules/`.

## PROCEDIMENTO PADRÃO DE DEPLOY (desde a V9 — por causa do lazy-load)
```powershell
cd C:\Users\lucas\Downloads\YTALSEG-ERP-V86-RAILWAY\ytalseg\frontend
npm run build
# LIMPAR a pasta de assets antiga por completo (o lazy-load gera VÁRIOS .js com hash)
if (Test-Path ..\app\backend\app\static\assets) { Remove-Item ..\app\backend\app\static\assets\* -Force -Recurse }
xcopy dist\* ..\app\backend\app\static\ /E /I /Y
cd .. ; git add -A ; git commit -m "msg" ; git push origin main
# Railway builda em ~1-4 min; testar com Ctrl+Shift+R
```
- Para fix **só de backend** (sem tocar frontend): não precisa rodar `npm run build` nem mexer em `static/` — só editar `app/backend/app/main.py`, testar local (subir com `uvicorn` num `DATA_DIR` temporário) e dar `git push`. Confirmar o deploy novo checando o header `Last-Modified` do site (muda a cada build).
- A regra antiga de "deixar só 1 .js" NÃO vale mais (lazy-load gera vários chunks). NÃO editar o `index.html` gerado à mão.
- `.npmrc` do frontend: `legacy-peer-deps=true`. Aviso "chunks larger than 500 kB" é normal.
- Estáticos servidos por `app.mount("/", StaticFiles(...))` — já serve `/favicon.ico` e afins sem catch-all atrapalhando.

## LOGIN SEGURO (desde a V13 — completo, em produção)
Antes da V13 o login era **cosmético**: usuários/senhas em texto puro no `localStorage` do navegador, com backdoor `admin/123` sempre ativo, e o backend **sem nenhuma autenticação** — qualquer um com a URL acessava os dados financeiros direto pela API. Isso foi substituído por um sistema completo:

- **Backend:** tabelas `usuarios` (senha com hash PBKDF2-HMAC-SHA256 + salt por usuário, stdlib, sem dependência nova) e `sessoes` (token). Rotas `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/recuperar-admin` (recuperação por **código mestre** — vários códigos de uso único, gerados no primeiro startup e mostrados só uma vez no log, guardados com hash). Toda rota de leitura exige sessão válida; toda rota de escrita exige perfil **admin**. `/health` continua público (usado pelo Railway).
- **Só 2 perfis:** `admin` (Lucas — vê e edita tudo, inclusive Financeiro, gerencia usuários) e `visualizacao` (vê tudo, inclusive Financeiro, mas **só leitura** — sem editar/criar/excluir).
- **Gestão de usuários:** aba "Usuários" (só admin) — criar/excluir usuário, redefinir senha. Rotas `GET/POST /usuarios`, `DELETE /usuarios/{id}`, `PATCH /usuarios/{id}/senha`, `POST /auth/trocar-senha`. Protegido contra excluir o único admin do sistema.
- **Frontend:** `services/auth.ts` (login/logout/sessão atual/recuperação, interceptor que injeta `Authorization: Bearer <token>` automático em toda chamada `fetch` já existente, sem precisar editar módulo por módulo). `LoginSistema.tsx` chama o backend de verdade, com tela de recuperação por código mestre. `App.tsx` verifica sessão no carregamento antes de mostrar qualquer tela.
- **Credenciais de produção:** usuário/senha admin e os códigos mestre de recuperação já foram gerados e entregues ao Lucas — **eu (Claude) não tenho e não devo ter essas credenciais.**

## NOVIDADES V14 / V14.1 / V15 (desde o RESUMO V13)

**V14 — corrige 401 ao abrir notas e relatórios** (commit `2060394`):
- O `services/auth.ts` injeta o token automaticamente em toda chamada `fetch`, mas `window.open()`/`<a href>` (usados pra abrir/baixar arquivos) iam direto pra API sem passar por esse interceptor — o navegador buscava o arquivo sem header de autenticação, dando 401 "Não autenticado" ao tentar ver/baixar nota fiscal ou relatório.
- Corrigido com 3 helpers novos em `services/auth.ts`: `abrirArquivoAutenticado`, `baixarArquivoAutenticado`, `obterBlobUrlAutenticado` — buscam o arquivo via `fetch` (que já manda o token) e abrem/baixam a partir de um blob, com fallback pro bloqueador de pop-up do Safari e mensagens amigáveis (sessão expirada / sem permissão / não encontrado).
- Aplicado nos 6 pontos afetados em `HistoricoPDFs.tsx`, `NotaFiscal.tsx` e `NotasFiscaisEmitidas.tsx`.

**V14.1 — corrige vínculo nota↔relatório perdido** (commits `71d1246`, `0ca189a`, `4c3a82e`):
- Dois bugs reais no backend, que já existiam antes da V14 mas causavam exatamente o sintoma relatado (vínculo "sumindo"):
  1. `_cascade_excluir_vinculos_de()`: ao excluir uma nota OU um relatório, apagava a linha **inteira** de `vinculos`, derrubando junto o outro lado. Corrigido pra só limpar o lado correspondente, preservando o resto.
  2. `salvar_financeiro()` (POST `/financeiro` com `historicoId`): quando o lançamento já tinha vínculo (ex.: já vinculado a uma nota), pulava a gravação do vínculo com o relatório **em silêncio**, sem erro nenhum. Corrigido pra mesclar o `historico_id` na mesma linha.
- Opção nova "Vincular nota" / "Vincular relatório" na tela de Nota Fiscal (`NotaFiscal.tsx`), que antes só existia antes do primeiro vínculo — agora aparece sempre que aquele lado específico ainda estiver faltando, com seletor de candidatos (usa `GET /vinculos/sugestoes`, com fallback pra lista completa).
- Filtro pra só listar candidatos que **têm arquivo de verdade** anexado (existem registros só-com-dados sem PDF, de uma origem 'auto') — vincular um desses parecia funcionar mas o botão "Ver relatório"/"Ver nota" nunca aparecia depois, por não ter arquivo pra abrir.

**V15 — permite guardar o PDF do relatório no servidor, sem regerar** (commit `f0b3e4b`):
- O PDF do relatório é gerado via `window.print()` (diálogo nativo do navegador) — não existe um blob em memória pra reaproveitar, então não dava pra subir o arquivo automaticamente sem risco de regerar o documento (proibido, muda o conteúdo).
- Solução aprovada pelo Lucas (Opção B): depois de "Salvar PDF Cliente/Interno", aparece um passo **opcional** pedindo pra selecionar o PDF que acabou de ser salvo — o mesmo arquivo, escolhido pelo usuário, sobe pro servidor. Garante identidade byte-a-byte (é literalmente o mesmo arquivo). Nunca bloqueia nem atrasa a geração do PDF; falha no upload só mostra aviso amigável, o PDF continua baixando local normalmente.
- Backend: rota nova `POST /historico-pdfs/{id}/arquivo` (admin) que **anexa** um PDF a um registro já existente, sem criar duplicata — recusa com 409 se o registro já tiver arquivo.
- Frontend: botão "Anexar PDF" no Histórico de PDFs, visível só em registros sem arquivo — usado pra completar os 5 relatórios antigos (Mi Projetos, Lutz Precision, Enprin, Sistek, Bargetech) sem duplicar registro.

## ESTADO ATUAL DOS MÓDULOS (tudo implantado e funcionando)

**Menu (`App.tsx`):** grupos Principal (dashboard) / Operação (relatorios, historico-pdfs) / Gestão (clientes, financeiro, equipe, notafiscal, **cobranca**, **usuarios**) / Dados e Segurança (banco-local, backup) / Sistema (config-sistema, auditoria, configuracoes). Aba "Usuários" só aparece pro perfil admin. Lazy-load nas telas pesadas. `<title>` = "YTALSEG ERP". Favicon/logo YTALSEG na aba e favoritos.

**Relatórios (`Relatorios.tsx`):** geração de PDF A4 — FUNCIONANDO, **NÃO MEXER** na lógica de geração/layout. Relatório gerado vai automático pro Histórico de PDFs. Desde a V15, passo opcional pra também subir o PDF salvo pro servidor. Cartão YTALSEG banner. Relatório serve de **conferência**; a cobrança de fato é a NOTA (ou o relatório, pra clientes sem nota fiscal formal).

**Histórico de PDFs (`HistoricoPDFs.tsx`):** relatórios auto-salvos + importados; visualizar/baixar/reimprimir/excluir (agora com download autenticado via blob, V14); botão "Anexar PDF" pra completar registros antigos sem arquivo (V15); filtros mês/ano/cliente e busca. Arquivos em `/data/YTALSEG/uploads/`.

**Nota Fiscal (`NotaFiscal.tsx` + `NotasFiscaisEmitidas.tsx`):** pré-emissão + Notas Fiscais Emitidas (upload NFS-e com extração automática do padrão SP, status Em aberto/Recebida/Cancelada + "Em atraso" automático). Desde a V14.1, opção de completar vínculo nota/relatório faltante direto na tela, filtrando só candidatos com arquivo.

**Financeiro (`Financeiro.tsx`):** lançamentos (cliente, mês ref, valor, **N°F** = número da nota ou "S/N" pra marcar "sem nota fiscal formal", data de envio, checkbox **notaEnviada**, vencimento, data prometida, data de recebimento, obs). Status possíveis: Pendente / Nota enviada / Cobrado / Prometeu pagar / Em negociação / Aprovado / Recebido / Nota cancelada + Vencido (calculado). Visão mensal + "Todos os meses".

**Sincronização Financeiro ↔ Nota ↔ Histórico (vínculos):** tabela `vinculos` liga lançamento (`lancamento_id`), nota (`nota_id`) e histórico/relatório (`historico_id`) como "a mesma cobrança". Vínculo manual (sistema sugere por cliente+valor+mês/ano via `_buscar_candidatos`, eu confirmo). Status propaga nos dois lados; conflito abre diálogo (`shared/ConflitoVinculoDialog.tsx`). Bugs de exclusão em cascata e merge silencioso corrigidos na V14.1.

**Cobrança (`Cobranca.tsx`, grupo Gestão):**
- Aba principal: baseada nas Notas Fiscais emitidas em aberto/atraso. Janela 7/15/30 dias + Vencidos; agrupamento por cliente com total; WhatsApp individual/consolidado; Copiar mensagem/Copiar tudo; Registrar cobrança com desfecho.
- Aba "Pendentes de nota": lista lançamentos do Financeiro que genuinamente ainda precisam de nota fiscal/relatório emitido e vinculado, com validação em várias camadas (vínculo formal, status recebido, cross-check nota real, contra-checagem nota_enviada+N°F).

**Dashboard (aba Principal):** 100% pelas NOTAS e status próprios. Painel "Atenção" (vencidas + vencem em 7 dias). Números do mês + "Todos os meses". Gráfico 12 meses. Resumo anual por cliente (% pago).

## O QUE SINCRONIZA ENTRE APARELHOS (via banco)
Clientes, financeiro, equipe, notas fiscais, histórico de PDFs (com arquivos), vínculos, usuários e sessões. NÃO sincronizam: rascunhos de relatório (localStorage).

## PENDÊNCIAS CONHECIDAS (não urgentes)
1. **Testes automatizados do backend desatualizados** (`app/backend/tests/test_vinculos.py`, `test_cobranca.py`) — escritos antes do login seguro, não mandam token de autenticação, então falham com 401 mesmo quando a lógica está correta. Não bloqueiam deploy (validação é feita manualmente com servidor local + banco temporário), mas valeria um dia atualizar os testes pra logar antes de cada chamada.
2. **`Clientes.tsx` sem endpoint de backend próprio** — único módulo mantido sem API dedicada.
3. **Nome da empresa com grafias levemente diferentes** entre notas fiscais — o match por cliente na Cobrança usa substring nos dois sentidos por causa disso, mas nomes MUITO diferentes ainda podem não bater.
4. **`_backups_modules/` grande**: histórico de versões antigas fora do build/git; arquivar um dia se incomodar. Também foram encontrados alguns arquivos de backup datados de 2026-07-15 (Dashboard, NotaFiscal, NotasFiscaisEmitidas, main.py) com conteúdo que não bate com nenhuma mudança real registrada — parecem sobra de uma sessão antiga; foram só commitados como estão pra limpar a árvore de trabalho, sem afetar nada em produção.
5. OCR (POPPLER/TESSERACT) no `main.py` aponta caminhos Windows — não roda no Railway; Lucas não usa; sem impacto.

## PENDÊNCIAS JÁ RESOLVIDAS
- ~~Login cosmético em texto puro + backend sem autenticação~~ → login seguro completo com hash+sessão+perfis+recuperação por código mestre (V13).
- ~~"Pendentes de nota" mostrando itens já resolvidos~~ → validação em várias camadas (V13).
- ~~401 ao abrir nota/relatório (window.open sem token)~~ → helpers autenticados via blob (V14).
- ~~Vínculo nota↔relatório sumindo em exclusão parcial ou merge silencioso~~ → corrigido no backend + opção de completar vínculo na tela (V14.1).
- ~~Sem jeito de guardar no servidor o PDF já gerado localmente~~ → upload opcional do mesmo arquivo salvo, sem regerar (V15).
- ~~Sem favicon (globo genérico)~~ → logo YTALSEG na aba/favoritos (V12).

## HISTÓRICO DE VERSÕES JÁ IMPLANTADAS
- **V1–V7:** Histórico de PDFs; Financeiro profissional; cartão banner; Notas Fiscais Emitidas; Dashboard pelas notas.
- **V8:** camada de vínculos Financeiro↔Nota↔Histórico; propagação bidirecional com diálogo de conflito.
- **V9 (faxina):** App.tsx 2.628→664 linhas; menu enxuto; lazy-load; deploy ajustado.
- **V10 (aba Cobrança):** nova aba baseada nas notas em aberto/atraso; WhatsApp; registrar cobrança.
- **V11:** botões copiar; seção "Pendentes de nota" (versão inicial, só vínculo formal).
- **V12:** favicon/logo/theme-color.
- **V13 (login seguro + fix Cobrança):** tabelas `usuarios`/`sessoes`, rotas `/auth/*`, recuperação por código mestre; proteção de rotas por perfil; gestão de usuários; login novo no frontend; remoção do cartaz antigo `PermissoesSistema.tsx`; 5 commits sucessivos de fix na Cobrança "Pendentes de nota".
- **V14:** corrige 401 ao abrir notas/relatórios (helpers autenticados via blob).
- **V14.1:** corrige vínculo nota↔relatório perdido (2 bugs no backend) + opção de completar vínculo faltante + filtro de candidatos sem arquivo.
- **V15:** upload opcional do PDF de relatório já salvo pro servidor, sem regerar; botão "Anexar PDF" pra completar registros antigos.

## COMO RETOMAR (V16 em diante)
"Claude, quero continuar as melhorias no meu ERP YTALSEG. Segue o resumo do projeto: [colar este documento]. A melhoria que quero fazer agora é: ______."

O Claude do chat monta o PROMPT MESTRE V16 no padrão (contexto + autorização de deploy com as travas + tarefas detalhadas + testes obrigatórios + entrega) e eu colo no Claude Code. Após mudanças grandes: rodar `/graphify . --update`.

## IDEIAS DE PRÓXIMOS PASSOS (em aberto)
- Atualizar os testes automatizados do backend pra autenticar antes de cada chamada (pendência conhecida #1 acima).
- Atribuir **responsável** por cobrança/pendência (pra dividir no grupo quem cobra o quê).
- Padronizar o nome da empresa nas notas (typo/variações que o grafo detectou).
- Arquivar duplicação histórica em `_backups_modules/` se quiser projeto ainda menor.
