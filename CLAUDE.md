# Contexto do Diego (lido automaticamente em toda sessão)

Diego Jaques cria conteúdo com IA. Responda em **português**. Este repositório guarda vídeos, roteiros,
capas e ferramentas. Detalhes técnicos: **`videos/MANUAL_TECNICO.md`** (pipeline completo, leia antes de produzir), ferramentas em `ferramentas/video/`,
aprendizados em `videos/NOTAS_PRODUCAO.md`.

## Canais
- **Consta nos Autos** (YouTube): casos reais, acidentes aéreos, mistérios. ~96% do tráfego vem do feed de Shorts.
  Retenção (out/2026, `videos/analises/retencao_consta.md`): títulos-afirmação com protagonista + paradoxo (~76% assistido) vencem
  títulos "Por que…?" (~50%). A queda principal é entre 4s e 8s: a 2ª frase deve abrir nova pergunta, contexto só depois de 10s.
  **Maior sucesso: Short Gol 1907 (12,5 mil em 36h). Fórmula em `videos/analises/dossie_gol1907_short.md`: ler antes de cada Short.**
  Short com no máximo 60s (mirar 45–59s), virada a cada 4–5s. Terminar na frase que liga ao início (loop), sem respiro final.
- **Rebobina** (YouTube): nostalgia anos 80/90. O que mais funciona: memórias de família e regras da casa
  (festas de aniversário 2.364 views, internet discada 1.893, domingo 1.514, telefone com cadeado 1.178, TV saía do ar 1.105).
  Explicação de objeto vai mal (caneta na fita K7 180, queimar filme 0, vó do espelho 16). Tom emocional (vó, mãe, saudade) funciona.
- **LinkedIn / newsletter "Ninguém Está Lendo"**: autoridade em arquitetura de software com IA. Checar temas já publicados antes de propor.
- Trabalho na **CelPlan** (portfólio em `portfolio_celplan/`).

## Já publicado / produzido (não repetir tema)
Consta: Varig 967 (partes 1 e 2), Mamonas Assassinas, Harrison Okene, Andes (rádio), Violet Jessop, Yamaguchi, Operação Prato,
homenagem **Lito Sousa "O Aviador"** (longo 16:9 + Short, `videos/homenagem_lito_sousa/`).
Rebobina: piscina depois de comer (emocional), ET enterrado, vó do espelho; cartucho (roteiro em reserva).
Também produzidos: Gol 1907 (Short + longo), Aeroperú 603, Voepass 2283, Chapecoense, TAM 402 (Short pronto, publicar perto de 31/10). Pauta: Dia das Crianças (12/10).

## Regras de roteiro (aprendidas com ele)
- **Antes de qualquer roteiro, título ou capa, ler `REGRAS_DE_RETENCAO.md`** (dois ganchos, ano fora da fala, escada, final seco).
- Voz **firme desde o 1º segundo**; nada de sussurro na abertura (ele não gosta de sussurro).
- **1º quadro = capa** e mostra quem/o que a 1ª frase cita.
- Virada a cada 4–5s; final em loop, sem CTA falado (a pergunta vai no comentário fixado).
- Sempre entregar: roteiro com tags do ElevenLabs em português ([sério], [pausa], [emocionado]...), título, descrição, comentário fixado, tags e, se pedir, versão em inglês.
- Checar fatos com 2 fontes; marcar o que tiver 1 fonte só. Homenagens: tom respeitoso, nunca sensacionalista.
- Prompts Veo/Gemini: cenário, personagens descritos em detalhe, ação segundo a segundo, câmera, luz, som e lista "NÃO INCLUIR" (logos, texto, pessoas reais). Nunca gerar rosto de pessoa real.
- Antes de uma "Parte 2", reler a Parte 1.

## Ferramentas disponíveis
- **ElevenLabs** (conector MCP): narração direto daqui. **Gerar só 1 take** (`generations_count: 1`); outro só se ele pedir. Voz usada: "Carlos - Resonant & Majestic Storyteller" (`NFmEzNOony1UsEJGXLth`). Gasta créditos dele.
- **MCP de métricas do YouTube** (próprio, gratuito): `ferramentas/youtube_mcp/` + `.mcp.json`. Lê as variáveis
  `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN_<CANAL>` (ambiente "Default"). Ferramentas: canais, resumo_canal,
  videos_recentes, top_videos, metricas_video, retencao_video. Tokens: rebobina=Rebobina, sotrechaco=Só Trechaço, bonus=Fase Bônus; consta=Consta nos Autos (conta diegojaques@aplicaiaapp.com). Ao iniciar, confirmar qual canal cada token abre.
- **Aplica AI** (conector): publica no YouTube/Facebook/Instagram e edita título/descrição, mas para YouTube só traz totais.
  **Para métricas do YouTube use sempre as ferramentas `youtube-metricas`** (retenção, período, tráfego), não o Aplica AI.
- **HyperFrames CLI 0.8.91** para montar vídeos (detalhes em `videos/NOTAS_PRODUCAO.md`).
- **Rotina diária de pautas** (7h23 Brasília) roda na sessão original (trigger `trig_013RdsM1YYApRYvmjminAhJN`).

## Segurança
Nunca pedir para colar tokens/chaves no chat; credenciais ficam nas variáveis do ambiente.
