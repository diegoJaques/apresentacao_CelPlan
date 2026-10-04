# Consta nos Autos — TAM 402 (Short ≤60s)

Segue `REGRAS_DE_RETENCAO.md` e a fórmula do `videos/analises/dossie_gol1907_short.md`:
- paradoxo com protagonista;
- 2º gancho entre 4s e 8s;
- data só na tela;
- escada;
- loop;
- 56,6s.
- Melhor data para publicar: perto de **31/10/2026** (30 anos).

## Fatos
Fontes: Wikipedia (TAM Flight 402); FAA "Lessons Learned" (PT-MRK); BAAA; SBT News (25 anos).
- 31/10/1996, quinta-feira, por volta das 8h27.
  - Fokker 100 PT-MRK da TAM, voo 402, Congonhas (São Paulo) → Santos Dumont (Rio).
- Na hora em que as rodas saíram do chão, a manete do motor direito foi sozinha para a marcha lenta.
  - O reversor direito tinha destravado e aberto **sem nenhum aviso** no painel, por falhas elétricas no travamento e no alerta.
  - A manete voltando para a lenta era a proteção funcionando.
- Os pilotos acharam que era pane do controle automático de potência e empurraram a manete para frente **três vezes**.
- Na última vez, rompeu-se uma ligação de segurança que os pilotos não sabiam que existia. O motor foi à potência máxima com o reversor aberto.
- O avião estolou, girou mais de 90°, bateu num prédio e caiu sobre casas do Jabaquara. O impacto foi **25 segundos** depois da decolagem.
- 99 mortos: 95 a bordo (89 passageiros e 6 tripulantes) e 4 no chão.

## Ganchos (escolhido o 1)
1. "Os pilotos lutaram contra o próprio avião… e perderam em vinte e cinco segundos." **(escolhido)**
2. "O piloto empurrava a manete pra frente… e o avião puxava de volta."
3. "Uma peça que freia o avião no pouso abriu sozinha na decolagem."

## Narração (ElevenLabs v4, voz Carlos, 1 take)
[firme] Os pilotos lutaram contra o próprio avião… e perderam em vinte e cinco segundos.
[intrigado] O avião estava tentando salvar todo mundo. E nenhum alarme contou isso a eles.
[sério] Manhã de quinta-feira, em São Paulo. O Fokker cem da TAM decola de Congonhas para o Rio.
[sério] No instante em que as rodas saem do chão, a manete do motor direito volta sozinha para a marcha lenta.
[intrigado] Os pilotos acham que é uma pane no controle automático de potência. E empurram a manete de volta.
[sério] Mas o problema era outro. O reversor do motor direito, a peça que freia o avião no pouso… tinha aberto em pleno voo. Sem nenhum aviso no painel.
[firme] A manete recuava para proteger o avião. Eles empurravam. Ela voltava. Três vezes.
[pausa] Na terceira, uma trava de segurança que eles nem sabiam que existia… se rompeu.
[sério] O motor foi para a potência máxima… freando. O avião tomba de lado sobre as casas do Jabaquara.
[emocionado] Noventa e nove pessoas morreram. Noventa e cinco a bordo e quatro no chão.
[firme] Até hoje, é difícil acreditar:

(o loop volta para "Os pilotos lutaram contra o próprio avião…")

## Visual
- Manete animada (MÁX/LENTA) mostrando a briga: volta sozinha, os pilotos empurram, volta, três vezes.
- Imagens Seedream:
  - i2: mão na manete (gancho e capa);
  - i3: decolagem entre prédios;
  - i4: reversor aberto;
  - i5: bairro;
  - i6: memorial com velas.
- Sem queda e sem destroços.
- A imagem da cabine com os pilotos (i1) foi bloqueada pelos termos do ElevenLabs.

## Entregas
- `tam402.mp4`: Short 9:16 de 56,6s.
- Capas:
  - `capa_tiktok.jpg`: "LUTARAM CONTRA O PRÓPRIO AVIÃO", com setas piloto ↑ / avião ↓ e o reversor em destaque;
  - `capa_short.jpg`: 1º quadro do vídeo, usado no YouTube.
- Créditos do ElevenLabs:
  - 5 imagens geradas, ~1.060 créditos;
  - 1 imagem bloqueada, que mostra preço e talvez tenha sido cobrada.

## v2 com clipes do Gemini (Veo)
- `clipes/veo1_manete.mp4`: mão empurrando a manete. Entra na abertura (0–5s), na cena "volta sozinha" (14,6–19,9s) e no loop final.
- `clipes/veo2_reversor.mp4`: o reversor abrindo sobre a cidade (26,4–33,4s).
- Os dois saem do Gemini em 16:9 (1280×720). Foram recortados em 9:16 (crop de 405×720, depois ampliados com lanczos e unsharp) e convertidos em webm VP9.
- O clipe 2 tem a marca "24 fps" no canto, que ficou fora do recorte.
