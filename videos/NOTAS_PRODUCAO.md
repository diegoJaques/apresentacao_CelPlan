# Notas de produção de vídeos

> Manual técnico completo e atualizado: `videos/MANUAL_TECNICO.md`.

Referência para as próximas produções (preferências e aprendizados já validados).

## Canais
- **Consta nos Autos**: casos reais, arquivos e mistérios (ex.: Operação Prato). Estética de dossiê: papel datilografado, carimbos, tarjas, granulação de filme.
- **Rebobina**: nostalgia anos 80/90 (memórias de família, regras da casa, homenagens). Estética retrô planejada: VHS, pixel art, chiado de TV, efeito de rebobinar.
- Vídeo sobre HyperFrames (IA na edição): perfil pessoal / LinkedIn.

## Narração no ElevenLabs (validado)
- Modelo usado: **Eleven v4**.
- **Marcadores de emoção em PORTUGUÊS funcionam** (em inglês não funcionaram na interface do usuário).
  Exemplos testados: `[intrigado]`, `[pausa]`, `[pausa longa]`, `[curioso]`, `[dramático]`,
  `[surpreso]`, `[sarcástico]`, `[ri]`, `[sério]`, `[misterioso]`, `[animado]`, `[pensativo]`, `[amigável]`.
- v4 **não** aceita SSML (`<break time>`); usar `[pausa]` / `[pausa longa]`.
- v4 não tem sliders de Style/Speed; só **Stability** (usar ~35–45%).
- Boas práticas de texto: números por extenso, reticências para suspense, MAIÚSCULAS para ênfase,
  linguagem falada ("pra", "aí", "comenta aqui"), no máximo um marcador por frase.
- **Gerar só 1 take** (`generations_count: 1`); regenerar só o parágrafo com problema e só se o Diego pedir.
- Nada de `[sussurra]`: ele não gosta; voz firme desde o 1º segundo.

## Vídeo (técnica)
- Formato Shorts/Reels: 1080×1920, **no máximo 60s**.
- Composição em HTML animada por tempo (`window.seek(t)`), renderizada quadro a quadro com Playwright/Chromium
  e montada com ffmpeg. Legendas palavra a palavra a partir da transcrição (Whisper local).
- Avatar: fundo cinza-claro pode ser recortado (`cutout.py`) e colocado sobre cenários da história.
- Avatar só pode aparecer falando se o vídeo dele tiver sido gerado com a MESMA narração (senão a boca fica fora de sincronia).
- Documentos simulados na tela levam a marca "reprodução ilustrativa".

## Capas
- Temas de mistério/curiosidade: objeto da história (disco voador, ET, cartucho) atrai mais que o rosto.
- Estrutura: faixa de contexto no topo + título grande + frase-gancho + elemento visual central.

## Limites de entrega
- Envio direto de arquivo na conversa: até 30 MB (mandar prévia comprimida).
- GitHub: arquivos até 100 MB (originais maiores ficam só locais, fora do versionamento).

## Pautas em andamento
- Rebobina — "O jogo que foi ENTERRADO no deserto": vídeo e capa prontos em `videos/rebobina_et_enterrado/`.
- Consta nos Autos — Violet Jessop (3 desastres: 1 colisão + 2 naufrágios): pronto em `videos/consta_violet_jessop/`.
- Consta nos Autos — Tsutomu Yamaguchi (duas bombas): pronto em `videos/consta_hiroshima_nagasaki/`.
- Vídeo longo 16:9 "HyperFrames — bastidores" (5 min): pronto em `videos/hyperframes_bastidores/` (vídeo, capa, SRT, capítulos).

## Retenção (aprendizado)
- Não abrir com introdução lenta (chiado/contexto). Abrir no clímax (flash-forward) com texto-gancho no 1º quadro.
- Encurtar pausas e acelerar a fala ~8% (atempo) melhora o ritmo sem soar artificial.
- Terminar seco, sem fade, para favorecer o replay em loop.

## Desempenho do Consta nos Autos (set/2026)
- Melhores: Titanic/binóculos (1.753), avião da Varig (1.490), Mona Lisa (995), Alcatraz (874) — assunto famoso + detalhe estranho, 40s–1min.
- Piores: vídeos de 1:27–1:31 e títulos sem gancho ("OPERAÇÃO PRATO", "A palavra nasceu em Porto Rico").
- (Revisado em out/2026 pela retenção real) Título em AFIRMAÇÃO com protagonista + paradoxo ("Ele sobreviveu…", "Ficou 5.000 anos… e ninguém viu") retém ~76% contra ~50% de "Por que…?". Descrição começa pelo fato.
- Evitar material com direitos autorais (ex.: gráficos BBC/RMS Titanic Inc.); preferir fotos em domínio público ou ilustração própria.

## Checagem de fatos (aprendizado)
- Textos de tela, capa e título precisam da MESMA precisão da narração. Erro real: "3 naufrágios" para Violet Jessop — o Olympic não afundou (colisão com o HMS Hawke em 1911; navegou até 1935). Correto: "3 desastres".
- Antes de publicar, conferir cada número/verbo forte (afundou, morreu, único, primeiro) contra a fonte.
- Se um comentário apontar erro verdadeiro: agradecer, corrigir título/descrição e fixar a resposta (não apagar o vídeo).

## HyperFrames oficial (HeyGen) — instalação neste ambiente
- `npm i hyperframes` (CLI v0.8.91) + `npx hyperframes telemetry disable`
- FFmpeg: binário do imageio-ffmpeg em `~/bin/ffmpeg`; FFprobe: `npm i ffprobe-static` → link em `~/bin/ffprobe`
- Navegador: `npx hyperframes browser ensure`
- Skills oficiais: `npx hyperframes skills` (instala em ~/.claude/skills: hyperframes, talking-head-recut, faceless-explainer, general-video…)
- GSAP pelo CDN é bloqueado no render: `npm i gsap` e referenciar `gsap.min.js` local.
- Render: `npx hyperframes render -o saida.mp4`

## Vídeo longo 16:9 (aprendizado)
- Avatar com fundo branco parece "gerado por IA": recortar (webm VP9 com alfa) e colocar à direita sobre o fundo das cenas do HyperFrames, com cartões à esquerda.
- Um único áudio com vários blocos de narração funciona: cada bloco entra como `<audio data-media-start>`.
- No headless shell, clipes H.264 falham na checagem: converter para webm VP9.

## Continuações (aprendizado)
- Antes de roteirizar uma "Parte 2", assistir/transcrever a Parte 1 inteira. Erro real: a Parte 2 do Varig 967 repetia a Parte 1 (comandante, Paris, cebolas, 153 quadros). A Parte 2 deve responder ao gancho que a Parte 1 deixou aberto.
- Se a frase de abertura cita uma pessoa ("esse comandante"), o primeiro quadro precisa mostrar essa pessoa.
- No Consta nos Autos, imagens com cara de real (fotos de época, ilustrações realistas) seguram mais que gráficos vetoriais.

## Pipeline atual (out/2026)
- Áudio: `silenceremove` (stop_duration ~0.3) + `atempo` 1.03–1.12; transcrição Whisper local (transformers.js) para legendas palavra a palavra (máx. 3 palavras no Short, 4 no 16:9).
- HyperFrames: lint pede `autoAlpha` para esconder, `immediateRender:false` em fromTo tardios, nunca animar autoAlpha no próprio clip (usar um div interno), overlays com z-index, `data-layout-allow-overlap` em sobreposições intencionais.
- Clipes de vídeo em webm VP9; fotos ampliadas 2x (lanczos) + fundo desfocado pré-gerado com ffmpeg.
- Trilha: piano original sintetizado em numpy (sem direitos autorais).
- Short a partir de vídeo longo: recortar trechos da narração por timestamps e remontar em 9:16 (ex.: `videos/homenagem_lito_sousa/composicao_short/`).
- Capas 9:16: texto fora da faixa inferior e da lateral direita (botões do TikTok/Shorts).
