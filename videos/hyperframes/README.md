# Vídeo HyperFrames — edição completa

**Arquivo final:** `video_hyperframes_completo.mp4` (1080×1920, 9:16, 25 fps, 1min21s)

## Estrutura
| Trecho | Tempo | Conteúdo |
|---|---|---|
| Início | 0:00–0:12 | Avatar (narração de abertura) + legendas animadas, relógio "tempo absurdo", tesoura cortando, zoom, contador de frames, carimbo "com os dias contados" |
| Meio | 0:12–1:05 | Motion graphics sobre a narração do meio: título HyperFrames, rolo de filme, timeline de editor sendo picotada, foto estática → quadro vivo, IA entendendo 3D/luz/rosto, continuidade entre frames, "horas → segundos" |
| Final | 1:05–1:21 | Avatar (fechamento) + card "quem corta → quem direciona a IA", pergunta para comentários, balão "comente", botão seguir |

## Como re-renderizar
A composição é uma página HTML controlada por tempo (`window.seek(t)`) e capturada quadro a quadro.

1. Extraia os quadros dos vídeos do avatar para `composicao/av/intro/%04d.jpg` e `composicao/av/outro/%04d.jpg` (`ffmpeg -i video.mp4 -q:v 3 av/intro/%04d.jpg`).
2. `COMP=$(pwd)/composicao node composicao/render.mjs range out 0 2100` (requer `playwright`).
3. Monte o áudio (início + narração do meio + final) e junte: `ffmpeg -framerate 25 -i out/%05d.jpg -i audio.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -shortest final.mp4`.

As legendas vêm de `composicao/words.js` (transcrição com tempo por palavra).
