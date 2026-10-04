# Canal EUA — vídeos longos para o público mais velho (55+)

Definido com o Diego em 04/10/2026.
- **Objetivo:** vídeos longos, calmos e aprofundados para americanos mais velhos.
- **Ritmo:** o oposto do vício do TikTok. Sem cortes frenéticos e sem legendas piscando.
- **Temas:** não só aviação. Segunda Guerra, Hollywood antiga, Americana dos anos 40–70 e grandes histórias reais.
- **Nome escolhido: The Archive Room.** A arte final é `logo_the_archive_room.png` e `banner_the_archive_room.jpg`; os arquivos "Final Report" ficam como rascunho antigo.

## Nome (sugestões)
| Nome | Por quê |
|---|---|
| **The Archive Room** (recomendado) | Cabe Segunda Guerra, filmes antigos e casos reais; sugere material de arquivo de verdade |
| Fireside History | Acolhedor, "história contada perto da lareira", combina com vídeo longo e calmo |
| Back Then | Simples, nostálgico, fácil de falar e de buscar |
| Echoes of Yesterday | Emocional, para nostalgia e histórias de família |
| The Old Reel | Forte para cinema antigo, mais limitado para guerra |

## Formato (diferente do Consta)
- **Duração:** 15–30 min, mirando 20–25, com capítulos na descrição.
- **Abertura:** gancho calmo, uma pergunta ou um fato curioso nos primeiros 30–60s. Depois, a história em ordem, com "perguntas abertas" que só se resolvem mais adiante.
- **Narração:**
  - voz americana madura e acolhedora, de contador de histórias;
  - velocidade normal, **sem atempo** (0,95–1,0);
  - **manter as pausas**, sem `silenceremove` agressivo.
- **Imagem:**
  - **material de arquivo real e em domínio público** sempre que possível:
    - US National Archives (NARA);
    - Library of Congress;
    - fotos militares dos EUA;
    - Wikimedia Commons (PD);
    - filmes do Prelinger Archive;
  - imagem de IA só para preencher, e nunca com rosto de pessoa real;
  - Ken Burns lento, tom sépia ou p&b quando a fonte for antiga.
- **Texto na tela:** pouco, grande e legível na TV (muito público 55+ assiste pela TV). Sem legenda palavra por palavra queimada no vídeo. Legenda em arquivo .srt (CC).
- **Trilha:** piano ou orquestra suave e baixa. Sem efeitos sonoros altos.
- **Capa:**
  - 1 foto de arquivo forte (rosto ou objeto), 3–5 palavras, fonte serifada grande, alto contraste;
  - pensar na leitura na tela da TV.
- **Frequência:** 1–2 vídeos por semana. A qualidade vale mais que o volume.
- **Bônus:** vídeos longos contam para as 4.000 horas de monetização, e o público americano paga mais por anúncio que o brasileiro.

## Primeiras pautas (fatos a checar com 2 fontes antes do roteiro)
**Segunda Guerra**
1. **The Ghost Army**: a unidade americana que enganou os alemães com tanques infláveis e efeitos de som.
2. **Operation Mincemeat**: o cadáver com documentos falsos que desviou a invasão da Sicília.
3. **Desmond Doss**: o soldado que se recusou a carregar arma e salvou dezenas em Okinawa.
4. **Navajo Code Talkers**: o código que os japoneses nunca quebraram.

**Hollywood antiga**
5. **Os perigos dos bastidores de "O Mágico de Oz"**: o primeiro Homem de Lata foi parar no hospital, e a Bruxa se queimou em cena.
6. **"Casablanca"**: o filme que foi escrito enquanto era filmado.

**Primeira Guerra e grandes histórias**
7. **A Trégua de Natal de 1914**: soldados inimigos jogando futebol na terra de ninguém.
8. **Titanic**: as histórias dos sobreviventes.

**Americana**
9. **As casas de catálogo da Sears**: casas inteiras vendidas pelo correio.
10. **Apollo 13**: contada com calma, com os diálogos reais da NASA (domínio público).

## Próximos passos
1. O Diego escolhe o nome.
2. Refazer o logo e o banner no estilo "arquivo / sépia".
3. Escolher a voz em inglês no ElevenLabs. Testar com 1 parágrafo antes do roteiro inteiro.
4. Fazer o 1º vídeo, sugerido: The Ghost Army, ~20 min.

## Voz e custo (teste de 04/10/2026)
Testes em `teste_vozes/`, todos com eleven_multilingual_v2, 1 take e o mesmo trecho:
- A, Michael Moody (`PerZoH0r6nxBZXCoIPpv`): avô caloroso, ~130 palavras/min;
- B, Spartan (`S75jVZ0i3J6Xa5BbK8CE`): barítono de história militar, ~150 palavras/min;
- C, Leo (`cOHUo8FosWk7BqQhx8nk`): locutor veterano, ~160 palavras/min.

**Custo:** vozes da biblioteca gastam **~1 crédito por caractere**, tanto no v2 quanto no v4. Um roteiro de ~13 mil caracteres (~17 min) custa ~13 mil créditos.

**Fotos de arquivo:** commons.wikimedia.org e catalog.archives.gov estão bloqueados pela rede deste ambiente. Liberar em Network access (Custom → Allowed domains: commons.wikimedia.org, upload.wikimedia.org, catalog.archives.gov, loc.gov, tile.loc.gov) ou o Diego envia as fotos.

## O que esse público quer sentir (ideia do Diego, 04/10/2026)
- **Herói americano + rival enganado ou surpreso.** O americano de 55+ gosta de ver o próprio lado vencer com astúcia, e ver o inimigo (por exemplo, os alemães) chocado, confuso ou derrotado.
- **Na capa:** o rosto do rival surpreso (personagem fictício, nunca uma pessoa real) mais a "prova" da esperteza americana (o tanque inflável).
- **No título:** o herói e o rival enganado. Ex.: "How American Artists Fooled the German Army With Rubber Tanks".
- **No roteiro:** dar espaço à reação do inimigo ("the Germans never suspected…", "German intelligence reported…"), sempre com fatos confirmados.
- **Monetização:** evitar suásticas e símbolos nazistas na capa e nas imagens. Prejudicam a monetização e podem gerar restrição de idade.
