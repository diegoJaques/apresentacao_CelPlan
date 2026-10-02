# MCP gratuito de métricas do YouTube

Servidor MCP próprio (Python puro, sem dependências) que lê as métricas dos canais
pela **YouTube Data API v3** e pela **YouTube Analytics API**. As duas são gratuitas
(cota padrão de 10.000 unidades/dia, mais que suficiente).

## Ferramentas
| Ferramenta | O que traz |
|---|---|
| `canais` | Canais configurados |
| `resumo_canal` | Totais + views, minutos, duração média, % assistida, inscritos no período |
| `videos_recentes` | Últimos vídeos com views/likes/comentários |
| `top_videos` | Ranking do período com retenção média |
| `metricas_video` | Métricas de um vídeo + origem do tráfego (feed de Shorts, busca, sugeridos) |
| `retencao_video` | Curva de retenção (onde o público sai) |

## Configuração (uma vez, ~15 min, tudo grátis)
1. **Google Cloud** — https://console.cloud.google.com → criar projeto "youtube-metricas".
2. **Ativar APIs** — em "APIs e serviços → Biblioteca": *YouTube Data API v3* e *YouTube Analytics API*.
3. **Tela de consentimento OAuth** — tipo *Externo*; adicione seu e-mail como *usuário de teste*.
   Escopos: `youtube.readonly` e `yt-analytics.readonly`.
4. **Credenciais → Criar ID do cliente OAuth** — tipo *Aplicativo da Web*; em "URIs de redirecionamento
   autorizados" coloque `https://developers.google.com/oauthplayground`. Guarde o *Client ID* e o *Client secret*.
5. **Gerar o refresh token (sem programar)** — https://developers.google.com/oauthplayground
   - Engrenagem ⚙ → marque *Use your own OAuth credentials* → cole Client ID e secret.
   - Em "Input your own scopes" cole:
     `https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly`
   - *Authorize APIs* → entre com a conta e **escolha o canal** (Rebobina) → *Exchange authorization code for tokens*.
   - Copie o **Refresh token**. Repita escolhendo o canal Consta nos Autos para ter o segundo token.
6. **Guardar como segredos do ambiente** (nunca cole no chat): menu do ambiente na barra de título da
   sessão → *Edit* → variáveis de ambiente:
   - `YT_CLIENT_ID`
   - `YT_CLIENT_SECRET`
   - `YT_REFRESH_TOKEN_REBOBINA`
   - `YT_REFRESH_TOKEN_CONSTA`
7. Abra uma **sessão nova**. O Claude Code carrega o `.mcp.json` da raiz do repositório e as ferramentas
   aparecem como `youtube-metricas`.

> Dica: com o app OAuth em modo "Teste", o Google expira o refresh token em 7 dias. Para não expirar,
> clique em **Publicar aplicativo** na tela de consentimento (uso pessoal, não precisa de verificação
> para escopos somente leitura do próprio canal; o Google só mostra um aviso de "app não verificado").

## Teste rápido no terminal
```
python3 ferramentas/youtube_mcp/server.py cli canais
python3 ferramentas/youtube_mcp/server.py cli top_videos '{"canal":"rebobina","dias":28}'
```
