# Consta nos Autos — Linate (Short ≤60s)

Segue `REGRAS_DE_RETENCAO.md` e a fórmula do `videos/analises/dossie_gol1907_short.md` (paradoxo, 2º gancho aos 5–8s, data só na tela, escada, loop). 57,9s.
Publicar em **08/10/2026** (25 anos).

## Fatos (2 fontes, salvo indicação)
Fontes: Wikipedia (2001 Linate Airport runway collision); Il Post (08/10/2021); Sky TG24; busca sobre os sensores (meteogiornale, aerospacecue, atas do processo no comitato8ottobre.com).
- 08/10/2001, ~8h10, aeroporto de Linate (Milão). Neblina densa: RVR abaixo de 200 m; visibilidade ~100 m (Il Post).
- SAS 686, MD-87 SE-DMA, Milão → Copenhague: 110 a bordo (104 passageiros e 6 tripulantes).
- Cessna Citation CJ2 D-IEVX: 4 a bordo (2 pilotos e 2 passageiros).
- O Cessna recebeu ordem de taxiar pelo R5 e entrou no R6, que cruza a pista 36R. A sinalização estava gasta e fora do padrão.
- O piloto do Cessna parou na marca S4 e informou a posição corretamente; o controlador desconsiderou porque a S4 não estava nos mapas dele. ⚠️ **1 fonte** (Wikipedia, citando o relatório da ANSV).
- Sem radar de solo funcionando (o antigo foi desativado em 1999; o novo não estava operando).
- Os sensores de invasão de pista estavam desativados por excesso de falsos alarmes (animais, veículos). O detalhe das **lebres** só aparece no Il Post, por isso a fala diz "até com bicho".
- Colisão a ~270–280 km/h. O MD-87 perdeu um motor, chegou a subir ~10 m e bateu num galpão de bagagens no fim da pista.
- 118 mortos: 110 no MD-87, 4 no Cessna e 4 no galpão (mais 4 feridos em terra). É o pior acidente aéreo da Itália.

## Ganchos (escolhido o 1)
1. "O alarme que podia salvar cento e dezoito pessoas… estava desligado de propósito." **(escolhido)**
2. "A torre não via a pista. E a pista não tinha radar."
3. "O piloto do jatinho disse exatamente onde estava. A torre achou que ele estava errado." (virou o 2º gancho)

## Narração (ElevenLabs v4, voz Carlos, 1 take; pós: silêncio 0,3s, atempo 1,07)
[firme] O alarme que podia salvar cento e dezoito pessoas… estava desligado de propósito.
[intrigado] E o piloto do jatinho avisou onde estava. A torre não acreditou.
[sério] Manhã de neblina em Milão. Não se via cem metros à frente.
[sério] Um MD oitenta e sete da SAS, com cento e dez pessoas, vai decolar para Copenhague.
[intrigado] Um jatinho recebe ordem de taxiar pelo caminho R cinco. Entra no R seis… o que cruza a pista.
[sério] Ele para numa marca no chão e avisa: S quatro. O controlador ignora. Essa marca nem estava no mapa dele.
[firme] Não havia radar de solo funcionando. E os sensores da pista estavam desligados: disparavam à toa, até com bicho.
[sério] O MD acelera a duzentos e setenta por hora. Os pilotos só veem o jatinho quando já é tarde.
[sério] A batida arranca um motor. O avião ainda sai do chão… mas volta e desliza até um galpão de bagagens.
[emocionado] Cento e dezoito pessoas morreram. Cento e dez no avião, quatro no jatinho, quatro no galpão.
[firme] Vinte e cinco anos depois, ainda é o pior acidente aéreo da Itália. E tudo porque…

(o loop volta para "O alarme que podia salvar…")

## Visual
- Imagens Seedream:
  - i1: sensor e luzes da pista na neblina (gancho, capa e loop);
  - i2: torre com o controlador de costas;
  - i3: jatinho na marca amarela;
  - i4: jato de motores traseiros acelerando;
  - i5: memorial com velas.
- Animações em CSS/SVG:
  - mapa R5 × R6 cruzando a pista;
  - placa "S4";
  - painel "RADAR DE SOLO: SEM SINAL / SENSORES: DESLIGADOS";
  - velocímetro até 270 km/h;
  - batida com flash e tremor, sem imagem de colisão nem destroços.
- Créditos: 5 imagens, ~1.060 créditos. A narração mostrou 0 crédito.

## v2 com Gemini (opcional)
Prompts em `PROMPTS_GEMINI.txt`. Os clipes entram na abertura e no loop (sensor + luzes apagando) e na cena da corrida (35–41s).

### v2 montada (04/10/2026)
- `clipes/veo1_luzes.mp4`: as luzes da pista apagando e o jato surgindo na neblina. Entra na abertura (0–4,8s, as luzes apagam junto com "desligado"), na cena da neblina (8,8–12,1s, trecho 5–8,3s) e no loop final.
- `clipes/veo2_corrida.mp4`: o jato de motores traseiros acelerando. Entra no "110 a bordo" (12,1–17s, trecho 5–9,9s) e nos 270 km/h (35,2–40,6s, do início).
- O Gemini entregou os dois já na vertical (720×1280), então só foram ampliados para 1080×1920 e convertidos em webm VP9, sem recorte.
- `capa_short.jpg`: quadro de 3,8s, com as luzes já apagadas e o jato ao fundo.
