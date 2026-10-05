# Fábrica de aulas (curso passo a passo com prints reais)

Pipeline para gravar aulas de tutorial sem gravar tela: o navegador abre o site, tira um print por passo,
e o vídeo é montado com zoom no ponto certo, cursor, clique, legenda e narração com a voz clonada.

## 1. Roteiro (`videos/curso_<tema>/aulaNN/roteiro.json`)
Cada passo tem uma ação e, se for virar cena, uma `fala`:
- `abrir` (`url`, `espera` em ms): abre a página.
- `destacar`: marca um elemento. O alvo pode ser `seletor` (CSS, o mais confiável), `papel` + `texto`, ou só `texto`.
- `clicar` e `digitar` (`valor`): o print sai ANTES da ação.
- `rolar` (`pixels`).
- Campos opcionais para a montagem:
  - `rotulo`: selo no canto inferior esquerdo;
  - `codigo`: cartão de comando, com `\n` para quebrar linha;
  - `clique: true`: anima o clique.
- Campos do topo do roteiro: `aula`, `titulo`, `titulo_curto`, `curso`, `proxima` e `legenda_troca` (pares que trocam o que foi falado pelo que aparece escrito, por exemplo "ene pê xis" → "npx").

## 2. Captura
```
node ferramentas/curso/captura.mjs videos/curso_x/aula01/roteiro.json videos/curso_x/aula01/telas
node ferramentas/curso/captura.mjs --explorar <url> <pasta>       # print + lista de links/botões
node ferramentas/curso/captura.mjs --sondar <url> "<texto>"        # onde o texto aparece (para achar seletor)
```
- Rodar sempre da raiz do repositório, exatamente nesse formato: é o que a regra de permissão libera.
- A sessão NÃO pode estar no modo Auto, que bloqueia o navegador.
- Conferir os prints antes de narrar.
  - Sites mudam: a home do HyperFrames alterna entre duas versões.
  - Páginas pesadas às vezes falham ("upstream request failed"). Recapture só aquele passo.

## 3. Narração
- Juntar as falas num texto só (`narracao/texto_tts.txt`), escrevendo comandos do jeito que se falam ("ene pê xis").
- Voz "Diego 2 (ganchos)" `1v8pxWyweWrjrQy0dKUr`, eleven_v4, **1 take**.
- Tratar o áudio: silenceremove 0,6s, atempo 1,03, loudnorm -16. Salvar como `narracao/aulaNN.mp3`.
- Transcrever com Whisper: `narracao/words.json`.

## 4. Montagem e render
```
python3 ferramentas/curso/montar.py videos/curso_x/aula01 <pasta_projeto>
```
- A pasta do projeto precisa ter `gsap.min.js`, `hyperframes.json`, `package.json` e `assets/fonts`; copie de um projeto anterior.
- Depois rode `hyperframes check`, `snapshot` e `render`.
- O script também gera `aulaNN.srt` (legenda para o YouTube).
