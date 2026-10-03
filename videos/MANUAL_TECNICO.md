# Manual técnico de produção (out/2026)

Esta é a memória completa de como os vídeos são feitos hoje. **Leia antes de produzir**, junto com
`REGRAS_DE_RETENCAO.md` (roteiro, título, capa) e `videos/NOTAS_PRODUCAO.md` (histórico de aprendizados).

Projetos de referência para copiar:

| Formato | Projeto | Gerador |
|---|---|---|
| Short 9:16 com imagens IA | `videos/consta_aeroperu603/` | `composicao/gen.py` |
| Longo 16:9 com imagens IA (~5 min) | `videos/consta_gol1907/` | `composicao/gen.py` |
| Homenagem 16:9 + Short recortado do longo | `videos/rebobina_homenagem_rick/` | `composicao/gen_longo.py`, `gen_short.py` |
| Homenagem com clipes de vídeo | `videos/homenagem_lito_sousa/` | `composicao_short/` |

Ferramentas reaproveitáveis ficam em `ferramentas/video/` (transcrição, capa, trilha).

---

## 1. Fluxo completo (ordem de trabalho)

1. **Pauta**: checar se o tema já foi publicado (lista no `CLAUDE.md`). Datas redondas (20, 30, 50 anos) rendem mais.
2. **Fatos**: 2 fontes por fato. O que tiver 1 fonte só fica marcado e **não vira número na fala**.
   - Em acidentes, **citar todas as vítimas** pelo nome e função, não só a pessoa famosa.
3. **Roteiro** (`ROTEIRO.md` ou `LONGO_ROTEIRO.md`):
   - Montar com as regras de `REGRAS_DE_RETENCAO.md`: dois ganchos, escada, ano fora da fala, final seco em loop.
   - Usar tags do ElevenLabs em português.
   - O mesmo arquivo leva os fatos, o roteiro e os textos de publicação (PT e, se pedir, EN).
4. **Narração**: ElevenLabs, **1 take só** (ver seção 2), depois pós-processar com ffmpeg.
5. **Transcrição**: Whisper local gera os tempos de cada palavra (`words.json`).
6. **Imagens**: Seedream no ElevenLabs (ver seção 3) ou fotos enviadas pelo Diego.
7. **Trilha**: sintetizada em numpy (`ferramentas/video/trilha.py`), sem direitos autorais.
8. **Composição**: um `gen.py` gera o `index.html` do HyperFrames. Depois rodar `check`, `snapshot` (conferir os quadros) e `render`.
9. **Capas**:
   - YouTube 1920×1080 (até 3 para o "Testar e comparar").
   - TikTok/Short 1080×1920.
   - Gerar com HTML e `capa.mjs`.
10. **Entrega**:
    - Arquivos no repositório: vídeo, capas e `TEXTOS_PARA_COPIAR.txt`, que o Diego copia porque não consegue selecionar texto no chat.
    - Prévia comprimida enviada no chat.
    - Commit e push.
11. **Medição**: depois de 2–3 dias, ler CTR e retenção pelo MCP `youtube-metricas`.

Pastas de um projeto:
```
videos/<canal>_<tema>/
  ROTEIRO.md                (fatos + roteiro + publicação)
  TEXTOS_PARA_COPIAR.txt    (título, descrição, comentário fixado, tags em texto puro)
  <tema>.mp4                (final) · capa_short.jpg · capa_tiktok.jpg · capa_youtube*.jpg
  narracao/                 (take bruto + narracao.mp3 editado)
  imagens_ia/               (i1..iN.jpg)
  composicao/               (gen.py + capa*.html: o suficiente para refazer)
```
O projeto HyperFrames de trabalho fica na scratchpad (`$S/hf/<sigla>/`), que é apagada quando a sessão acaba.
Por isso o `gen.py` e as capas são copiados para `composicao/`.

---

## 2. Narração (ElevenLabs, conector MCP)

- Ferramenta: `creative_generate_speech`, modelo **eleven_v4**.
  - Voz **Carlos – Resonant & Majestic Storyteller**, `NFmEzNOony1UsEJGXLth`.
  - **`generations_count: 1`**. Outro take só se o Diego pedir, porque gasta os créditos dele.
- **Limite de 5000 caracteres por prompt.** Texto maior: dividir em blocos e juntar com o concat do ffmpeg.
- Tags em português, no máximo uma por frase: `[firme]`, `[sério]`, `[intrigado]`, `[pausa]`, `[emocionado]`.
  - **Nada de `[sussurra]`**: voz firme desde o 1º segundo.
- Escrever números por extenso: "Boeing sete três sete", "seiscentos e três", "dezenove zero sete".
- Acompanhar com `creative_get_flow_run_status` até terminar. Baixar com `curl -L "<master_url>" -o narracao/take1.mp3`.
- Pós-processamento (resultado em `narracao.mp3`):
  ```bash
  ffmpeg -i take1.mp3 -af "silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-40dB,atempo=1.05,loudnorm=I=-14:TP=-1.5" -ar 44100 narr.mp3
  ```
  - `stop_duration`: 0.5–0.6.
  - `atempo`: 1.03–1.07.
  - Loudness: I=-14 em Shorts, -16 em longos e homenagens.
  - Em homenagens, menos `atempo` e pausas um pouco maiores.

## 3. Imagens (ElevenLabs `creative_generate_image`)

- Modelo **Seedream 5 Lite**: cerca de **212 créditos por imagem**.
  - Sai em 2560×1440 e é **sempre 16:9**, mesmo que o prompt peça vertical.
  - No Short, a imagem é recortada por deslocamento horizontal (ver seção 5).
- Prompt: cena realista "documental", luz e câmera descritas, e "sem texto, sem logotipos".
- **Nunca gerar rosto de pessoa real.** Pessoas reais só com fotos enviadas pelo Diego.
- **Colisão, queda ou acidente explícito é bloqueado pelos termos de uso.** A geração falha, mas mostra preço.
  - Alternativa: "dois aviões em rota frontal, quase se tocando" e o choque feito em CSS (flash branco e tremor).
- Homenagens: nada de destroços, fotos de agência ou imagem do acidente. Usar fotos de vida, palco e céu.
- Pré-escala com ffmpeg (lanczos):
  - 16:9: `2112x1188`, que dá margem para o Ken Burns sem pesar o render.
  - 9:16: altura `1920`, ou seja, `3413x1920`, com `left` negativo para escolher o enquadramento.
- Clipes do Gemini/Veo (quando houver créditos):
  - Prompt com cenário, personagens detalhados, ação segundo a segundo, câmera, luz, som e lista "NÃO INCLUIR".
  - Converter para **webm VP9** antes de usar, porque H.264 falha no headless shell.

## 4. Transcrição (Whisper local)

```bash
cd ferramentas/video && npm i            # 1ª vez na sessão (modelo vem do pacote sts-whisper-small)
ffmpeg -i narr.mp3 -ac 1 -ar 16000 -f f32le narr.raw
node transcrever.mjs narr.raw words.json
```
- Saída: `[{text, timestamp:[ini,fim]}]` por palavra.
- O Whisper erra nomes próprios. Corrigir no `gen.py` com um mapa de correções, como no `consta_aeroperu603/composicao/gen.py`:
  - juntar `Aero` + `Peru` em `Aeroperú`;
  - trocar `gente` por `rente`.

## 5. Composição no HyperFrames

### Ambiente (rodar em toda sessão)
```bash
export PATH=$HOME/bin:$PATH        # ffmpeg/ffprobe em ~/bin
export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
export HYPERFRAMES_SKIP_SKILLS=1
npx --yes hyperframes@0.8.91 check
npx --yes hyperframes@0.8.91 snapshot --at 0.5,4,10,30 --no-end -o snaps --describe false
npx --yes hyperframes@0.8.91 render -o saida.mp4 --crf 20 --workers auto
```
- O projeto precisa de `gsap.min.js` local, porque o CDN é bloqueado no render.
- Assets ficam em `assets/img`, `assets/audio` e `assets/fonts`. Fontes Montserrat 900 e JetBrains Mono 700 vêm do `@fontsource`.
- Velocidade de render: cerca de 750–880 quadros por minuto.
  - Short de 56s: cerca de 2 min.
  - Longo de 5 min: cerca de 10 min. Rodar em background.

### Padrão do `gen.py` (Python gera o `index.html`)
- Tudo é escrito como `tl.fromTo(...)` em uma timeline GSAP pausada (`window.__timelines["main"]`).
- Helpers (copiar de `consta_aeroperu603/composicao/gen.py`):
  - `up`: sobe e aparece.
  - `fade`: aparece.
  - `out`: some.
  - `pop`: escala com "back".
  - `slam`: entra de escala 2.2 para 1, para impacto.
  - `blink`: pisca, para alarmes.
  - `hide`: esconde no t=0.
  - `count`: contador numérico.
- Funções de cena:
  - `scene(id, ini, fim, img, inner, dark, z)`: cena com foto, vinheta e **Ken Burns na `<img>` interna** (escala 1.0 → 1.08).
  - `card(classe, texto, id)`: texto na tela.
- Cada cena é um `<section class="clip">` com `data-start`, `data-duration` e `data-track-index`.
- Áudio: `<audio>` com `data-start`, `data-duration`, `data-volume`.
  - Narração em volume 1.
  - Drone ou pad em 0.15–0.2.
  - Efeitos (alerta) em 0.2.

### Regras do lint e armadilhas (todas já aconteceram)
- **Nunca** animar `autoAlpha` no próprio elemento `.clip`. Animar um div interno.
- `fromTo` tardio precisa de `immediateRender:false`.
- **IDs não podem repetir.** Exemplo real: o card `#s1` conflitou com a seção `#s1` e foi renomeado para `se1`.
- Sobreposição proposital leva `data-layout-allow-overlap`.
- Números grandes levam `white-space:nowrap` e `line-height` explícito.
- Texto que estoura: quebrar com `<br>` ("RENTE<br>AO MAR").
- Elementos dentro de um container com transform (colagem, Ken Burns): recalcular as posições de flash e anel considerando o deslocamento.
- **Nunca usar `filter: blur` ao vivo sobre vídeo ou foto grande**: o render fica extremamente lento.
  - Fundo desfocado é pré-composto no ffmpeg:
    ```bash
    ffmpeg -i in.mp4 -filter_complex "[0]scale=1920:1080,boxblur=30[b];[0]scale=-2:1080[f];[b][f]overlay=(W-w)/2:0" -c:v libvpx-vp9 -b:v 0 -crf 32 out169.webm
    ```
- Para matar um render travado, não usar `pkill -f hyperframes`: o padrão casa com o próprio shell. Usar o PID.

### Legendas palavra a palavra
- Agrupar palavras: quebra em pontuação, pausa maior que 0.35s ou limite de palavras.
  - **Short**: no máximo 3 palavras, 68px, MAIÚSCULAS, contorno de 4px, a ~1530px do topo, fora da faixa dos botões.
  - **16:9**: no máximo 6 palavras, 46px, embaixo.
- A palavra falada no momento fica amarela (`#FFC83D`) via `tl.set`.
- Cada palavra é um `<span>` com **`margin:0 7–10px`**. Sem margem, as palavras grudam.

### Estrutura de retenção dentro do vídeo
- **1º quadro = capa.** Mostra o que a 1ª frase cita, com o título-gancho grande, tag do canal no topo e anel vermelho no objeto.
- Virada visual a cada 4–5s no Short (troca de cena, card novo, slam, alarme) e a cada 30–45s no longo.
- **Final em loop**: a última cena repete o gancho (`HOOK('b')`). `END` = última palavra + 0.3–0.6s. Sem fade e sem CTA falado.
- Datas e anos só na tela (pill `LIMA · 02.10.1996`), nunca na fala.
- Short com **no máximo 60s** (mirar 45–59s). Se passar, cortar a narração, não acelerar além de 1.07.

### Short a partir de um longo
1. Escolher trechos pelo `words.json` do longo.
2. Recortar e juntar a narração:
   ```bash
   ffmpeg -i narr.mp3 -filter_complex "[0]atrim=12.3:20.1,asetpts=N/SR/TB,afade=t=in:d=0.03,afade=t=out:st=7.7:d=0.1,apad=pad_dur=0.15[a0];...;[a0][a1]...concat=n=K:v=0:a=1" short.mp3
   ```
3. Remapear o tempo das palavras: `novo_t = t - ini_trecho + offset_acumulado`. Reposicionar as cenas da mesma forma.
4. Exemplo pronto: `videos/rebobina_homenagem_rick/composicao/gen_short.py`, que passou de 1m10 para 59.4s.

## 6. Trilha e efeitos (`ferramentas/video/trilha.py`)
- `python3 trilha.py pad 60 pad.wav`: piano/pad Am-F-C-G para homenagem.
  - Com `--tensao 20 35` entra um batimento cardíaco entre 20s e 35s.
- Também gera `alerta` (alarme de cabine), `clique` e `gelo` (efeitos curtos).
- Mixar baixo: a narração manda.

## 7. Capas (`ferramentas/video/capa.mjs`)
```bash
node ferramentas/video/capa.mjs capa.html capa_youtube.jpg 1920 1080
node ferramentas/video/capa.mjs capa916.html capa_tiktok.jpg 1080 1920
```
- O HTML tem um `<div id="c">` do tamanho da capa. O script tira o print só dele.
- Texto grosso (Montserrat 900) com contorno `-webkit-text-stroke:6px #000; paint-order:stroke fill`.
- **O que dá clique** (o Rick estava com 2% de CTR antes da troca):
  - rosto grande ou objeto central com anel ou seta vermelha;
  - **no máximo 4–6 palavras**, com paradoxo ("UMA FITA ADESIVA DERRUBOU UM BOEING");
  - número forte ("154", "5 VIDAS");
  - homenagem leva a tag **LUTO**, em tom respeitoso.
- Fazer 3 variações (A/B/C) para o "Testar e comparar" do YouTube.
- 9:16: texto fora da faixa de baixo e da lateral direita, onde ficam os botões.
- Mistério/objeto: o objeto atrai mais que um rosto. Homenagem: o rosto da pessoa.

## 8. Entrega e limites
- **SendUserFile aceita até 30 MiB.** Gerar uma prévia comprimida na scratchpad:
  ```bash
  ffmpeg -i final.mp4 -c:v libx264 -crf 26 -preset slow -tune stillimage -c:a aac -b:a 128k previa.mp4
  ```
  Usar crf 24–30 conforme o tamanho.
- GitHub: avisa acima de 50 MB e recusa acima de 100 MB. O longo do Gol (86 MB) entrou; maior que isso, fica fora do repositório.
- Textos sempre também em `TEXTOS_PARA_COPIAR.txt` (texto puro), porque o Diego não consegue selecionar no chat.
- Pacote de publicação:
  - título;
  - descrição (começa pelo fato, fontes, "Imagens ilustrativas geradas por IA");
  - capítulos no longo;
  - comentário fixado com a pergunta;
  - tags;
  - versão EN se pedir.

## 9. Métricas (MCP `youtube-metricas`, `ferramentas/youtube_mcp/`)
- Ferramentas: `canais`, `resumo_canal`, `videos_recentes`, `top_videos`, `metricas_video`, `retencao_video`.
- **Horas qualificadas** (as que contam para monetizar, sem Shorts). Em Python, de dentro de `ferramentas/youtube_mcp/`:
  ```python
  import server
  server.report('consta', 'estimatedMinutesWatched', '2025-10-03', '2026-10-03', dimensions='creatorContentType')
  # linha videoOnDemand = horas qualificadas (minutos/60); linha shorts não conta
  ```
- Situação em 03/10/2026 (365 dias):
  - Consta: 41,0 h qualificadas de 4.000 (mais 77,8 h de Shorts) e 206 inscritos.
  - Rebobina: 0 h e 26 inscritos.
  - Só Trechaço: 14 inscritos.
  - Fase Bônus: 9 inscritos.
- A API atrasa 2–3 dias. O número do dia está no Studio.
  - Print de 03/10, 28 dias: **161,7 h no total**, com Shorts incluídos.
  - Desse total, 70 h vieram do longo do Lito Sousa.
- **Os vídeos longos são o caminho das horas qualificadas.** Homenagem longa a uma pessoa querida, logo depois da notícia, foi o que mais rendeu.

## 10. Ética (inegociável)
- Homenagens: tom respeitoso. Nada de sensacionalismo, destroços ou imagem do acidente.
- Citar **todas** as vítimas.
- Nunca gerar rosto de pessoa real com IA. Documentos simulados levam "reprodução ilustrativa".
- Descrição sempre avisa: "Imagens ilustrativas geradas por IA; não mostram os aviões/pessoas reais".
- Se um comentário apontar um erro verdadeiro: corrigir título e descrição e fixar a resposta.
- Nada é publicado sem pedido explícito do Diego.
