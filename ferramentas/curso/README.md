# Fábrica de aulas (curso passo a passo com prints reais)

Pipeline para gravar aulas de tutorial sem gravar tela: o navegador abre o site, tira um print por passo,
e o vídeo é montado com zoom no ponto certo, cursor, clique, legenda e narração com a voz clonada.

## 1. Roteiro (`videos/curso_<tema>/aulaNN/roteiro.json`)
Cada passo tem uma ação e, se for virar cena, uma `fala`:
- `abrir` (`url`, `espera` em ms): abre a página.
- `destacar`: marca um elemento. O alvo pode ser `seletor` (CSS, o mais confiável), `papel` + `texto`, ou só `texto`.
- `clicar` e `digitar` (`valor`): o print sai ANTES da ação.
- `clicarxy` (`x`, `y`): clica numa posição da tela, por exemplo a régua da timeline do Studio. O destaque fica no ponto clicado.
- `rolar` (`pixels`).
- Campos opcionais para a montagem (além dos abaixo):
  - `caixa_fixa` ({x,y,w,h}, em pixels do print): destaque manual quando o elemento achado é grande demais;
  - `video` (caminho dentro da pasta da aula) e `video_inicio` (s): a cena mostra esse vídeo tocando no lugar do print.
  - `rotulo`: selo no canto inferior esquerdo;
  - `codigo`: cartão de comando, com `\n` para quebrar linha;
  - `clique: true`: anima o clique.
- Campos do topo do roteiro: `aula`, `titulo`, `titulo_curto`, `curso`, `proxima` e `legenda_troca` (pares que trocam o que foi falado pelo que aparece escrito, por exemplo "ene pê xis" → "npx").

## 2. Telas de terminal
`python3 ferramentas/curso/terminal.py fontes/t1.html "~/pasta" "comando" saida_real.txt` gera um terminal em HTML com a saída REAL do comando.
- Abra-o no roteiro com `"url": "file:///caminho/absoluto/t1.html"`.
- Cada linha vira `[data-l="N"]` e cada comando `.cmd[data-c="N"]`, para destacar.

## 2b. Studio do HyperFrames (prévia local)
- Rodar `npx hyperframes@latest preview --port 3002 --background --no-open` no projeto de demonstração.
- Se o projeto puxa GSAP do CDN, trocar por cópia local com caminho RELATIVO (`gsap.min.js`); com `/gsap.min.js` o Studio quebra.
- O Studio só escuta em localhost. Para o navegador de captura carregar fontes e vídeos externos pelo proxy, crie uma ponte de porta (net.createServer de IP:3003 → 127.0.0.1:3002) e use `http://<IP>:3003/#project/<nome>` no roteiro.
- O `captura.mjs` já deixa o IP da máquina fora do proxy e liga WebGL por software, que a prévia precisa.
- Dicas:
  - espere ~15 s depois de abrir;
  - a régua da timeline fica em y≈803, com o segundo s em x ≈ 268 + 91,4·s;
  - no código, clique em "Maximize panel" e, depois, no botão de restaurar (1876, 62).

## 2c. Captura
```
node ferramentas/curso/captura.mjs videos/curso_x/aula01/roteiro.json videos/curso_x/aula01/telas
node ferramentas/curso/captura.mjs --explorar <url> <pasta>       # print + lista de links/botões
node ferramentas/curso/captura.mjs --sondar <url> "<texto>"        # onde o texto aparece (para achar seletor)
node ferramentas/curso/captura.mjs --sondar <url> @console          # erros do console / requisições que falharam
node ferramentas/curso/captura.mjs roteiro.json telas 14-25         # só uma faixa de passos (o resto do passos.json é mantido)
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
