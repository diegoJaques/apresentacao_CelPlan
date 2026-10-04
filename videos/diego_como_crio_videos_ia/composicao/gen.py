# Diego Jaques — "Como eu crio vídeos com IA" (longo 16:9). Gera index.html.
import json, html, re, unicodedata
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/dj/'
AB = 10.68            # avatar abertura
M0 = 11.0             # início da narração principal
NARR = 262.43
EN0 = M0 + NARR + 0.4  # avatar encerramento
EN = 8.89
END = EN0 + EN + 0.6

def norm(s): return unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode().strip('.,:;!?…"“”')
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
FIX = {'TAN': 'TAM', 'TAN,': 'TAM,', 'tan': 'TAM', 'Cloud': 'Claude', 'Jatinho': 'jatinho', 'PASSO': 'Passo', 'ROTEIRO': 'roteiro.',
       'Casos': 'casos', 'Reais': 'reais', 'Montagem': 'montagem.', 'poutrona.': 'à poltrona.', 'short': 'Short', 'youtube': 'YouTube', 'acelera': 'acelero'}
W = []
for t, s, e in raw:
    if t in ('...', '…'): continue
    if W and (t.startswith('.') or t.startswith('%')):
        W[-1] = (W[-1][0] + t, W[-1][1], min(e, NARR) + M0); continue
    if W and W[-1][0] == 'Hyper' and t.startswith('Frames'): W[-1] = ('HyperFrames' + t[6:], W[-1][1], min(e, NARR) + M0); continue
    if W and W[-1][0] == '11' and t.startswith('Labs'): W[-1] = ('ElevenLabs' + t[4:], W[-1][1], min(e, NARR) + M0); continue
    if t == 'o' and W and W[-1][0] == 'Caso': continue
    W.append((FIX.get(t, t), s + M0, min(e, NARR) + M0))
NW = [norm(w[0]) for w in W]

def at(phrase, after=0.0):
    ws = [norm(x) for x in phrase.split()]
    for i in range(len(W) - len(ws) + 1):
        if W[i][1] >= after and NW[i:i+len(ws)] == ws: return W[i][1]
    raise SystemExit(f'não achei: {phrase} depois de {after}')

J = []
def A(s): J.append(s)
def up(sel, t, d=.45, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.5): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:1.8}},{{autoAlpha:1,scale:1,duration:.25,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

# legendas (até 6 palavras, embaixo)
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 6 or re.search(r'[.?!:]$', w[0]) or (nx[1]-w[2] > .45):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.7)
    if e - s < .15: continue
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0])}</span>' for j, x in enumerate(gr))
    cap.append(f'<div class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, VM = [], []
def sec(id_, s, e, inner, label=None):
    hd = f'<div class="hdr"><span>{label[0]}</span>{label[1]}</div>' if label else ''
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div class="grid"></div>{hd}{inner}</section>')
def vid(id_, src, s, e, ms, cls, track):
    VM.append(f'<video id="{id_}" class="clip {cls}" src="assets/{src}" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-media-start="{ms:.2f}" data-track-index="{track}" muted playsinline></video>')
def card(cls, txt, id_, style=''): return f'<div id="{id_}" class="abs {cls}" style="{style}">{txt}</div>'
def phone(id_, x, y): return f'<div id="{id_}" class="abs phone" style="left:{x}px;top:{y}px"></div>'

# ---------- marcos ----------
T1 = at('Passo 1.'); T2 = at('Passo 2'); T3 = at('Passo 3'); T4 = at('Passo 4.')
T5 = at('Passo 5.'); T6 = at('Passo 6.'); T7 = at('Passo 7.'); TR = at('Resumindo'); TT = at('Agora estou')

# 0 — abertura com o avatar
sec('s0', 0, AB,
    card('ttl', 'ONZE MIL VIEWS<br><span class="y">EM 8 HORAS</span>', 'a1', 'left:90px;top:250px') +
    card('chips', '<span>sem gravar</span><span>sem editor</span><span>100% IA</span>', 'a2', 'left:90px;top:560px'))
vid('v_av0', 'av/abertura.webm', 0, AB, 0, 'avatar', 3)
hide('#a1', '#a2'); up('#a1', .3); fade('#a2', 3.4)

# 1 — os números
NUMS = ('<div class="kpis">'
        '<div class="kpi" id="k1"><b id="kv1">0</b><i>views em 8 horas</i></div>'
        '<div class="kpi" id="k2"><b>400–1.000</b><i>o normal do canal</i></div>'
        '<div class="kpi" id="k3"><b>0:57</b><i>duração média · vídeo de 0:56</i></div>'
        '<div class="kpi hot" id="k4"><b>77,9%</b><i>não deslizaram</i></div></div>')
sec('s1', M0, T1, NUMS + phone('ph1', 1390, 140) + card('q', 'O QUE FAZ ALGUÉM<br><span class="y">NÃO DESLIZAR?</span>', 'n5', 'left:90px;top:640px'), ('', 'O RESULTADO'))
vid('v_ph1', 'clips/tam.webm', M0, T1, 0, 'phv', 4); A(f'tl.set("#v_ph1",{{left:1394,top:144}},{M0:.2f});')
hide('#k1', '#k2', '#k3', '#k4', '#n5')
up('#k1', M0 + .2); count('#kv1', M0 + .3, 0, 11000, 1.6, '(Math.round(v)).toLocaleString("pt-BR")')
up('#k2', at('normal', M0)); up('#k3', at('duração', M0)); up('#k4', at('quase', M0)); up('#n5', at('Então a pergunta', M0))

# 2 — passo 1: o tema
sec('s2', T1, T2, card('pair', '<div class="cs" id="c1"><b>TAM 402</b>o avião tentava<br><span class="y">salvar todo mundo</span></div>'
                   '<div class="cs" id="c2"><b>GOL 1907</b>o jatinho bateu no Boeing<br><span class="y">e pousou inteiro</span></div>', 'pr', 'left:90px;top:230px') +
    card('big', 'O QUE AQUI<br><span class="y">PARECE MENTIRA?</span>', 'm1', 'left:90px;top:640px') +
    card('bars', '<div class="bar"><span>🇧🇷 TAM 402</span><div class="bf" id="b1"></div><em>11 mil</em></div>'
                 '<div class="bar"><span>🇮🇹 Linate</span><div class="bf red" id="b2"></div><em>1,4 mil</em></div>', 'br', 'left:90px;top:640px') +
    phone('ph2', 1390, 140), ('1', 'O TEMA'))
tg = at('Gol', T1); tit = at('Itália', T1)
vid('v_ph2a', 'clips/tam.webm', T1, tg, 3, 'phv', 4); vid('v_ph2b', 'clips/gol.webm', tg, tit, 0, 'phv', 5); vid('v_ph2c', 'clips/lin.webm', tit, T2, 0, 'phv', 6)
for k in ('a', 'b', 'c'): A(f'tl.set("#v_ph2{k}",{{left:1394,top:144}},0);')
hide('#c1', '#c2', '#m1', '#br'); up('#c1', at('No caso', T1)); up('#c2', tg)
up('#m1', at('Eu procuro', T1)); A(f'tl.to("#m1",{{autoAlpha:0,duration:.3}},{at("E uma lição", T1):.2f});')
fade('#br', at('brasileiro', T1))
A(f'tl.fromTo("#b1",{{width:0}},{{width:820,duration:1,ease:"power2.out",immediateRender:false}},{at("brasileiro", T1)+.2:.2f});')
A(f'tl.fromTo("#b2",{{width:0}},{{width:104,duration:1,ease:"power2.out",immediateRender:false}},{at("parou", T1):.2f});')

# 3 — passo 2: o roteiro (linha do tempo do Short)
TL = ('<div class="tl"><div class="tlbar"></div>'
      '<div class="seg s1" id="g1"><b>0–3s</b>FATO IMPOSSÍVEL</div>'
      '<div class="seg s2" id="g2"><b>4–8s</b>2º GANCHO</div>'
      '<div class="seg s3" id="g3"><b>8–55s</b>ESCADA · virada a cada 4–5s</div>'
      '<div class="seg s4" id="g4"><b>FIM</b>LOOP ↺</div>'
      '<div class="drop" id="g5">−40% do público<br>era aqui</div></div>')
sec('s3', T2, T3, TL + card('big', 'NADA DE<br><span class="r">“VOCÊ SABIA”</span>', 'r1', 'left:90px;top:620px') +
    card('big', 'DURAÇÃO MÉDIA<br><span class="g">&gt; 100%</span>', 'r2', 'left:1100px;top:620px'), ('2', 'O ROTEIRO'))
hide('#g1', '#g2', '#g3', '#g4', '#g5', '#r1', '#r2')
up('#g1', T2 + .8); up('#r1', at('Nada de', T2)); A(f'tl.to("#r1",{{autoAlpha:0,duration:.3}},{at("Entre 4", T2)-.2:.2f});')
up('#g2', at('Entre 4', T2)); pop('#g5', at('Era exatamente', T2)); up('#g3', at('Depois, cada', T2) if True else 0)
up('#g4', at('E o final', T2)); up('#r2', at('É por isso', T2))

# 4 — passo 3: fatos
sec('s4', T3, T4, card('src', '<div class="sc" id="f1">📄 Fonte 1 <span class="ok">✓</span></div><div class="sc" id="f2">📄 Fonte 2 <span class="ok">✓</span></div>', 'fs', 'left:90px;top:260px') +
    card('big', 'CREDIBILIDADE<br><span class="y">É TUDO</span>', 'f3', 'left:1050px;top:300px') +
    card('note', '⚠ 1 fonte só → marco no roteiro ou corto', 'f4', 'left:90px;top:700px'), ('3', 'OS FATOS'))
hide('#f1', '#f2', '#f3', '#f4'); up('#f1', T3 + 1.2); up('#f2', at('duas fontes', T3)); up('#f3', at('Canal de casos', T3)); up('#f4', at('O que tem', T3))

# 5 — passo 4: a voz
SCR = ('<div class="code"><div class="cl"><i>[firme]</i> Os pilotos lutaram contra o próprio avião…</div>'
       '<div class="cl"><i>[intrigado]</i> O avião estava tentando salvar todo mundo.</div>'
       '<div class="cl"><i>[sério]</i> Manhã de quinta-feira, em São Paulo…</div>'
       '<div class="cl"><i>[emocionado]</i> Noventa e nove pessoas morreram.</div></div>')
WAVE = '<div class="wave" id="wv">' + ''.join(f'<span style="height:{20+int(70*abs(__import__("math").sin(k*1.7)))}px"></span>' for k in range(48)) + '</div>'
sec('s5', T4, T5, card('', SCR, 'v1', 'left:90px;top:230px;width:980px') + card('', WAVE, 'v2', 'left:90px;top:560px') +
    card('chips', '<span>1 take</span><span>− silêncios</span><span>+5% velocidade</span><span>≤ 60s</span>', 'v3', 'left:90px;top:700px') +
    card('huge', '1:13<br><span class="r">13 VIEWS</span>', 'v4', 'left:1150px;top:300px'), ('4', 'A VOZ'))
hide('#v1', '#v2', '#v3', '#v4'); up('#v1', at('Escrevo', T4)); fade('#v2', at('gero um', T4)); up('#v3', at('Depois tiro', T4)); slam('#v4', at('Um vídeo meu', T4))
A(f'tl.fromTo("#wv span",{{scaleY:.3}},{{scaleY:1,duration:.25,yoyo:true,repeat:21,stagger:.03,ease:"sine.inOut",immediateRender:false}},{at("gero um", T4):.2f});')

# 6 — passo 5: imagens e clipes
PR = ('<div class="code sm"><div class="cl">Documentary photograph, early morning, extremely thick fog…</div>'
      '<div class="cl">Cold blue-grey light, cinematic, 35mm, realistic.</div>'
      '<div class="cl r">NÃO INCLUIR: logos · texto · rostos reais</div></div>')
IMGS = '<div class="imgs" id="im">' + ''.join(f'<img src="assets/img/{n}.jpg">' for n in ('tam_i3', 'lin_i1', 'var_i1', 'jul_i3')) + '</div>'
sec('s6', T5, T6, card('', PR, 'i1', 'left:90px;top:220px;width:1000px') + card('', IMGS, 'i2', 'left:1130px;top:220px') +
    card('big', '1º QUADRO =<br><span class="y">MOVIMENTO</span>', 'i3', 'left:90px;top:620px'), ('5', 'IMAGENS E CLIPES'))
tg5 = at('Eu gero', T5)
vid('v_g1', 'clips/manete169.webm', tg5, tg5 + 4.0, 0, 'g169', 4); vid('v_g2', 'clips/anjo169.webm', tg5 + 4.0, T6, 0, 'g169', 5)
hide('#i1', '#i2', '#i3'); up('#i1', at('prompt de documentário', T5) - .3); fade('#i2', T5 + 1.0); up('#i3', at('E o primeiro quadro', T5))
A(f'tl.to("#i2",{{autoAlpha:0,duration:.3}},{tg5-.1:.2f});')

# 7 — passo 6: montagem em código
CODE = ('<div class="code"><div class="cl"><i># cena 3 — a manete volta sozinha</i></div>'
        '<div class="cl">vscene(<s>"s3"</s>, 14.6, 19.9, <s>"v1"</s>)</div>'
        '<div class="cl">lever(<s>"L3"</s>); knob(<s>"L3"</s>, 17.9, down=True)</div>'
        '<div class="cl">slam(<s>"VOLTA SOZINHA"</s>, 18.2)</div>'
        '<div class="cl"><i># legendas palavra por palavra</i></div>'
        '<div class="cl">for palavra in transcricao: destaca(palavra)</div>'
        '<div class="cl ok">$ npx hyperframes render  →  short.mp4 ✓</div></div>')
sec('s7', T6, T7, card('', CODE, 'm1', 'left:90px;top:220px;width:1120px') + phone('ph7', 1390, 140) +
    card('chips', '<span>HyperFrames · HTML → MP4</span><span>Claude Code</span>', 'm2', 'left:90px;top:720px') +
    card('big', 'SEM EDITOR<br><span class="y">DE VÍDEO</span>', 'm3', 'left:90px;top:620px'), ('6', 'A MONTAGEM'))
vid('v_ph7', 'clips/var.webm', T6, T7, 0, 'phv', 4); A(f'tl.set("#v_ph7",{{left:1394,top:144}},0);')
hide('#m1', '#m2', '#m3'); up('#m3', at('eu não abro', T6)); A(f'tl.to("#m3",{{autoAlpha:0,duration:.3}},{at("O vídeo inteiro", T6):.2f});')
up('#m1', at('O vídeo inteiro', T6)); A(f'tl.fromTo("#m1 .cl",{{autoAlpha:0,x:-20}},{{autoAlpha:1,x:0,duration:.25,stagger:.45,immediateRender:false}},{at("O vídeo inteiro", T6)+.2:.2f});')
up('#m2', at('HyperFrames,', T6))

# 8 — passo 7: publicação
PUB = ('<div class="yt"><div class="ytt" id="p1">Os pilotos lutaram contra o próprio avião… e perderam em 25 segundos</div>'
       '<div class="ytc" id="p2">📌 De quem foi a culpa: dos pilotos, do avião ou de quem não avisou ninguém?</div>'
       '<div class="ytb" id="p3">📈 Mais compartilhado do que o normal</div></div>')
sec('s8', T7, TR, card('', PUB, 'pb', 'left:90px;top:220px;width:1150px') + phone('ph8', 1390, 140) +
    card('note', 'Título: protagonista + paradoxo · nunca pergunta', 'p0', 'left:90px;top:760px'), ('7', 'A PUBLICAÇÃO'))
vid('v_ph8', 'clips/tam.webm', T7, TR, 0, 'phv', 4); A(f'tl.set("#v_ph8",{{left:1394,top:144}},0);')
hide('#p0', '#p1', '#p2', '#p3'); up('#p1', T7 + 1.0); fade('#p0', at('nunca uma', T7)); up('#p2', at('comentário fixado', T7)); pop('#p3', at('O Short da', T7))

# 9 — resumo
ITEMS = ['detalhe impossível', 'dois ganchos', 'escada', 'final em loop', 'fatos checados', 'voz', 'movimento no 1º segundo', 'montagem em código', 'dilema no comentário']
CHK = '<div class="chk">' + ''.join(f'<div id="ck{k}">✓ {t}</div>' for k, t in enumerate(ITEMS)) + '</div>'
sec('s9', TR, TT, card('', CHK, 'ck', 'left:90px;top:200px'), ('✓', 'RESUMO'))
for k in range(len(ITEMS)): A(f'tl.set("#ck{k}",{{autoAlpha:0}},0);')
for k, t in enumerate(['detalhe', 'dois', 'escada', 'final', 'fatos', 'voz', 'movimento', 'montagem', 'dilema']): up(f'#ck{k}', at(t, TR), .3, 20)

# 10 — o próximo teste (Juliane)
sec('s10', TT, EN0, card('big', 'PRÓXIMO TESTE:<br><span class="y">EMOÇÃO UNIVERSAL</span>', 'j1', 'left:90px;top:260px') +
    card('big', 'CAIU DE 3 MIL METROS…<br><span class="g">E SOBREVIVEU</span>', 'j2', 'left:90px;top:600px') + phone('ph10', 1390, 140))
vid('v_ph10', 'clips/jul.webm', TT, EN0, 0, 'phv', 4); A(f'tl.set("#v_ph10",{{left:1394,top:144}},0);')
hide('#j1', '#j2'); up('#j1', TT + .2); up('#j2', at('menina', TT))

# 11 — encerramento com o avatar + inscrição
sec('s11', EN0, END, card('ttl', 'COMENTA<br><span class="y">“PROMPTS”</span>', 'e1', 'left:90px;top:250px') +
    card('sub', '<span class="bell">🔔</span> INSCREVER-SE', 'e2', 'left:90px;top:600px'))
vid('v_av1', 'av/encerramento.webm', EN0, EN0 + EN, 0, 'avatar', 3)
hide('#e1', '#e2'); up('#e1', EN0 + .5); pop('#e2', EN0 + 4.5)
A(f'tl.fromTo("#e2",{{scale:1}},{{scale:.92,duration:.12,yoyo:true,repeat:1,immediateRender:false}},{EN0+6.2:.2f});')
A(f'tl.set("#e2",{{background:"#444"}},{EN0+6.45:.2f});')

MEDIA = [f'<audio id="a_ab" src="assets/audio/abertura.mp3" data-start="0" data-duration="{AB:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="{M0:.2f}" data-duration="{NARR:.2f}" data-track-index="11" data-volume="1"></audio>',
         f'<audio id="a_en" src="assets/audio/encerramento.mp3" data-start="{EN0:.2f}" data-duration="{EN:.2f}" data-track-index="12" data-volume="1"></audio>',
         f'<audio id="a_bg" src="assets/audio/piano.wav" data-start="0" data-duration="{min(END,299):.2f}" data-track-index="13" data-volume="0.07"></audio>']

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M7";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0f1c}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(1200px 700px at 30% 20%,#16213b,#0a0f1c);font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.scene{position:absolute;inset:0;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:60px 60px}
.y{color:#FFC83D}.r{color:#FF4B3E}.g{color:#3DDC84}
.hdr{position:absolute;left:90px;top:70px;font-family:"J";font-size:34px;color:#cfd6e6;letter-spacing:4px;display:flex;align-items:center;gap:18px}
.hdr span{display:inline-block;min-width:64px;height:64px;line-height:64px;text-align:center;border-radius:14px;background:#FFC83D;color:#111;font-family:"M";font-size:38px}
.hdr span:empty{display:none}
.ttl{font-size:110px;line-height:1.02}
.big{font-size:84px;line-height:1.05}
.huge{font-size:170px;line-height:1;text-align:center}
.huge span{font-size:90px}
.q{font-size:76px;line-height:1.05}
.chips{display:flex;gap:18px;flex-wrap:wrap;max-width:1100px}
.chips span{font-family:"J";font-size:34px;background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.35);padding:12px 22px;border-radius:40px}
.phone{width:420px;height:745px;border-radius:46px;border:10px solid #1d2433;box-shadow:0 30px 80px rgba(0,0,0,.6);background:#000}
.phv{position:absolute;width:412px;height:732px;object-fit:cover;border-radius:38px;z-index:3}
.avatar{position:absolute;right:120px;top:90px;width:688px;height:900px;object-fit:cover;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.6);z-index:3}
.kpis{position:absolute;left:90px;top:200px;display:grid;grid-template-columns:600px 600px;gap:26px}
.kpi{background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.14);border-radius:22px;padding:24px 30px}
.kpi b{display:block;font-size:76px;line-height:1.05}.kpi i{font-style:normal;font-family:"M7";font-size:30px;color:#b9c2d6}
.kpi.hot{border-color:#3DDC84}.kpi.hot b{color:#3DDC84}
.pair{display:flex;gap:30px}
.cs{width:560px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.14);border-radius:22px;padding:26px 30px;font-family:"M7";font-size:40px;line-height:1.25}
.cs b{display:block;font-family:"J";font-size:30px;color:#FFC83D;margin-bottom:10px}
.bars{width:1150px}.bar{display:flex;align-items:center;gap:20px;margin:18px 0;font-family:"J";font-size:34px}
.bar span{width:260px}.bf{height:60px;border-radius:10px;background:#3DDC84}.bf.red{background:#FF4B3E}.bar em{font-style:normal;font-family:"M";font-size:44px}
.tl{position:absolute;left:90px;right:90px;top:220px;height:330px}
.tlbar{position:absolute;left:0;right:0;top:150px;height:14px;border-radius:7px;background:rgba(255,255,255,.18)}
.seg{position:absolute;top:0;padding:16px 20px;border-radius:16px;font-family:"M7";font-size:30px;background:rgba(255,255,255,.08);border:3px solid}
.seg b{display:block;font-family:"J";font-size:28px}
.seg.s1{left:0;width:250px;border-color:#FF4B3E}.seg.s2{left:280px;width:250px;border-color:#FFC83D}
.seg.s3{left:560px;width:740px;border-color:#7FDBFF}.seg.s4{left:1330px;width:390px;border-color:#3DDC84}
.drop{position:absolute;left:280px;top:200px;font-family:"J";font-size:30px;color:#FF4B3E;border-left:6px solid #FF4B3E;padding-left:16px}
.src{display:flex;gap:30px}.sc{font-family:"M7";font-size:44px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.14);border-radius:20px;padding:30px 40px}
.ok{color:#3DDC84}
.note{font-family:"J";font-size:36px;color:#FFC83D}
.code{background:#0d1117;border:2px solid #30363d;border-radius:18px;padding:30px 34px;font-family:"J";font-size:32px;line-height:1.6;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.code.sm{font-size:28px}.code i{color:#8b949e;font-style:normal}.code s{text-decoration:none;color:#a5d6ff}.code .r{color:#FF7B72}.code .ok{color:#3DDC84}
.wave{display:flex;align-items:center;gap:8px;height:100px}.wave span{display:block;width:12px;border-radius:6px;background:#FFC83D;transform-origin:50% 50%}
.imgs{display:grid;grid-template-columns:330px 330px;gap:16px}.imgs img{width:330px;height:186px;object-fit:cover;border-radius:14px}
.g169{position:absolute;left:1130px;top:220px;width:700px;height:394px;object-fit:cover;border-radius:18px;z-index:3;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.yt{font-family:"M7"}.ytt{font-size:52px;line-height:1.2;font-family:"M";margin-bottom:30px}
.ytc{font-size:38px;background:rgba(255,255,255,.06);border-left:8px solid #FFC83D;padding:20px 26px;border-radius:12px;margin-bottom:24px}
.ytb{display:inline-block;font-size:38px;background:#3DDC84;color:#111;padding:14px 26px;border-radius:40px}
.chk{display:grid;grid-template-columns:780px 780px;gap:18px 40px;font-family:"M7";font-size:50px}
.chk div{color:#fff}.chk div::first-letter{color:#3DDC84}
.sub{display:flex;align-items:center;gap:18px;font-size:58px;background:#FF0033;padding:22px 44px;border-radius:70px}
#caps{position:absolute;left:0;right:0;top:960px;height:90px;z-index:9;text-align:center}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 9px;font-size:44px;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 4px 14px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>Como eu crio vídeos com IA</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}">
{''.join(MEDIA)}{''.join(VM)}
{''.join(H)}
<div id="caps">{''.join(cap)}</div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
{chr(10).join(cj)}
window.__timelines["main"] = tl;
</script></body></html>'''
open(P + 'index.html', 'w').write(page)
print('ok', len(W), 'palavras', len(cap), 'legendas', 'fim', round(END, 2), 'passos', [round(x, 1) for x in (T1, T2, T3, T4, T5, T6, T7, TR, TT)])
