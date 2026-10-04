# Consta nos Autos — Linate (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/li/'
NARR = 57.57
END = 57.90

FIX = {'Jatinho': 'jatinho', 'Torre': 'torre', 'Neblina': 'neblina', 'avisa.': 'avisa:', 'S4,': 'S4.',
       'vêm': 'veem', 'kmh.': 'KM/H.', 'propósito,': 'propósito.', 'Milão,': 'Milão.'}
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W = []
for i, (t, s, e) in enumerate(raw):
    if t in ('...', '…'): continue
    if t == '-87': W[-1] = ('MD-87', W[-1][1], e); continue
    t = FIX.get(t, t)
    W.append((t, s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.4, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.5): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.35): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.5}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2.2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.2}},{{autoAlpha:1,scale:1,duration:.22,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

# legendas palavra a palavra (máx. 3)
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 3 or re.search(r'[.?!,:]$', w[0]) or (nx[1]-w[2] > .35):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.6, END)
    if e - s < .15: continue
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",."))}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H = []
POS = {'i1': -380, 'i2': -600, 'i3': -480, 'i4': -1000, 'i5': -1166}
def scene(id_, s, e, img, inner='', dark=.45, z=(1.0, 1.08), left=None):
    l = POS[img] if left is None else left
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">'
             f'<img id="{id_}_img" class="abs ph" style="left:{l}px" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>{inner}</div></section>')
    A(f'tl.fromTo("#{id_}_img",{{scale:{z[0]}}},{{scale:{z[1]},transformOrigin:"50% 50%",duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
VMEDIA = []
def vscene(id_, s, e, clip, ms, inner='', dark=.35):
    VMEDIA.append(f'<video id="{id_}_v" class="clip vid" src="assets/clips/{clip}.webm" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-media-start="{ms:.2f}" data-track-index="1" muted playsinline></video>')
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">'
             f'<div class="abs vig" style="opacity:{dark}"></div>{inner}</div></section>')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'

HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · LINATE', p + 'tg') + '<div class="abs ring"></div>' +
                  card('hk1', 'O ALARME QUE SALVARIA<br><span class="y">118 VIDAS</span>', p + 'h1') +
                  card('hk2', 'ESTAVA DESLIGADO', p + 'h2'))

# 0 — gancho (1º quadro = capa: o sensor e as luzes da pista apagados)
vscene('s0', 0, 4.8, 'v1', 0.0, HOOK('a'), dark=.35)
A('tl.fromTo("#ah2",{scale:1},{scale:1.12,duration:.25,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},3.4);')
# 1 — 2º gancho: avisou onde estava, a torre não acreditou
scene('s1', 4.8, 8.8, 'i2', card('radio', '📻 “ESTOU NO S4”', 'g1') + card('stamp', 'A TORRE NÃO<br>ACREDITOU', 'g2'), dark=.5, z=(1.12, 1.2))
hide('#g1', '#g2'); pop('#g1', 5.9); slam('#g2', 7.6)
# 2 — neblina em Milão (pan até o avião)
vscene('s2', 8.8, 12.1, 'v1', 5.0, card('pill', 'MILÃO · LINATE · 08.10.2001', 'd1') + card('big', 'NEBLINA<br><span class="y" style="font-size:72px">MENOS DE 100 M DE VISÃO</span>', 'd2'), dark=.35)
hide('#d1', '#d2'); fade('#d1', 9.0); up('#d2', 10.4, y=40)
# 3 — o MD-87
vscene('s3', 12.1, 17.0, 'v2', 5.0, card('pill', 'MD-87 · SAS', 'e1') + card('big', '110<br><span class="y" style="font-size:80px">A BORDO</span>', 'e2') + card('big lower', 'MILÃO → COPENHAGUE', 'e3'), dark=.4)
hide('#e1', '#e2', '#e3'); fade('#e1', 12.3); slam('#e2', 14.4); up('#e3', 15.7)
# 4 — o mapa: ordem R5, entrou no R6
MAP = '''<svg id="map" class="abs" viewBox="0 0 1080 1100" style="left:0;top:300px;width:1080px;height:1100px">
<rect x="470" y="0" width="140" height="1100" fill="#2b2f36" stroke="#fff" stroke-width="4"/>
<line x1="540" y1="20" x2="540" y2="1080" stroke="#fff" stroke-width="6" stroke-dasharray="40 30"/>
<text x="500" y="1070" fill="#fff" font-family="J" font-size="34" transform="rotate(-90 540 1060)">PISTA 36R</text>
<path id="r5" d="M 60 260 L 380 260 L 380 120 L 460 120" fill="none" stroke="#3DDC84" stroke-width="22" stroke-linecap="round"/>
<text x="70" y="230" fill="#3DDC84" font-family="J" font-size="44">R5 (ORDEM)</text>
<path id="r6" d="M 60 640 L 1020 640" fill="none" stroke="#FF4B3E" stroke-width="22" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000"/>
<text id="r6t" x="70" y="720" fill="#FF4B3E" font-family="J" font-size="44">R6 (ENTROU)</text>
<circle id="cj" cx="60" cy="640" r="30" fill="#FFC83D" stroke="#000" stroke-width="5"/>
<circle id="xr" cx="540" cy="640" r="70" fill="none" stroke="#FF2D20" stroke-width="10"/>
</svg>'''
scene('s4', 17.0, 22.8, 'i3', MAP + card('big top2', 'O JATINHO', 'm1') + card('bigx', 'CRUZOU<br><span class="r">A PISTA</span>', 'm2'), dark=.85, z=(1.0, 1.04))
hide('#m1', '#m2', '#r6t', '#xr', '#cj'); fade('#m1', 17.1); fade('#cj', 17.3)
A('tl.fromTo("#r6",{strokeDashoffset:1000},{strokeDashoffset:0,duration:1.6,ease:"power1.inOut",immediateRender:false},20.4);')
A('tl.fromTo("#cj",{attr:{cx:60}},{attr:{cx:540},duration:1.9,ease:"power1.inOut",immediateRender:false},20.4);')
fade('#r6t', 20.5, .3); pop('#xr', 22.2); slam('#m2', 21.9)
# 5 — S4: a marca que não estava no mapa
scene('s5', 22.8, 28.9, 'i3', '<div class="abs ring2"></div>' + card('s4', 'S4', 'f1') + card('stamp st2', 'CONTROLADOR<br>IGNORA', 'f2') + card('pill pbot', 'ESSA MARCA NEM ESTAVA NO MAPA DELE', 'f3'), dark=.45, z=(1.05, 1.12))
hide('#f1', '#f2', '#f3'); slam('#f1', 24.9); slam('#f2', 25.9); fade('#f3', 27.1)
# 6 — painel: radar e sensores desligados
PANEL = ('<div id="pn" class="abs panel">'
         '<div class="row" id="pr1"><span class="dot off"></span>RADAR DE SOLO<b class="r">SEM SINAL</b></div>'
         '<div class="row" id="pr2"><span class="dot off"></span>SENSORES DA PISTA<b class="r">DESLIGADOS</b></div></div>')
scene('s6', 28.9, 35.2, 'i2', PANEL + card('al a2', '⚠ DISPARAVAM À TOA (ATÉ COM BICHO)', 'q3'), dark=.8, z=(1.15, 1.22))
hide('#pr1', '#pr2', '#q3'); up('#pr1', 29.4); up('#pr2', 31.1); pop('#q3', 33.3)
# 7 — acelera a 270 km/h
vscene('s7', 35.2, 40.6, 'v2', 0.0, card('alt', '<div class="lab">VELOCIDADE</div><div class="num" id="spd">0 KM/H</div>', 'k1') + card('big lower', 'SÓ VIRAM O JATINHO<br><span class="r">TARDE DEMAIS</span>', 'k2'), dark=.45)
hide('#k2'); count('#spd', 35.8, 0, 270, 1.6, 'Math.round(v)+" KM/H"'); up('#k2', 38.1)
# 8 — a batida (flash + tremor, sem imagem de destroço)
scene('s8', 40.6, 46.9, 'i4', '<div id="fl" class="abs flash"></div>' + card('big', 'ARRANCOU<br><span class="r">UM MOTOR</span>', 'c1') + card('big low', 'SAIU DO CHÃO…<br><span class="y">E DESLIZOU ATÉ O GALPÃO</span>', 'c2'), dark=.6, z=(1.2, 1.3))
hide('#c1', '#c2')
A('tl.fromTo("#fl",{opacity:1},{opacity:0,duration:.5,ease:"power2.out",immediateRender:false},40.8);')
A('tl.fromTo("#s8_in",{x:0},{x:26,duration:.05,yoyo:true,repeat:9,ease:"none",immediateRender:false},40.8);')
slam('#c1', 41.3); up('#c2', 43.0)
A('tl.fromTo("#s8_img",{rotation:0},{rotation:-4,duration:2,ease:"power2.in",immediateRender:false},43.0);')
# 9 — 118 vidas
scene('s9', 46.9, 52.8, 'i5', card('huge', '118<span class="sm">VIDAS</span>', 'v1') + card('pill2', '110 NO AVIÃO · 4 NO JATINHO<br>4 NO GALPÃO DE BAGAGENS', 'v2'), dark=.45, z=(1.0, 1.06))
hide('#v1', '#v2'); slam('#v1', 47.1); fade('#v2', 49.2)
# 10 — 25 anos
scene('s10', 52.8, 56.4, 'i1', card('big', '25 ANOS', 'z1') + card('big low', 'O PIOR ACIDENTE<br><span class="y">AÉREO DA ITÁLIA</span>', 'z2'), dark=.55, z=(1.1, 1.15), left=-1860)
hide('#z1', '#z2'); slam('#z1', 52.9); up('#z2', 54.3)
# 11 — loop
vscene('s11', 56.4, END, 'v1', 0.0, HOOK('b'), dark=.35)
hide('#bh1', '#bh2', '#btg'); fade('#btg', 56.45, .2); up('#bh1', 56.5); slam('#bh2', 57.3)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>',
         '<audio id="a_i" src="assets/audio/impacto.wav" data-start="40.80" data-duration="1.40" data-track-index="12" data-volume="0.5"></audio>']
for k, t in enumerate([7.6, 24.9, 25.9, 29.4, 31.1]):
    MEDIA.append(f'<audio id="a_c{k}" src="assets/audio/clique.wav" data-start="{t:.2f}" data-duration="0.12" data-track-index="{13+k}" data-volume="0.35"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ph{top:0;width:3413px;height:1920px}
.vig{inset:0;background:linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,0) 28%,rgba(0,0,0,0) 62%,rgba(0,0,0,.85))}
.y{color:#FFC83D}.r{color:#FF4B3E}
.tag{left:50%;transform:translateX(-50%);top:80px;white-space:nowrap;font-family:"J";font-size:30px;color:#FFC83D;letter-spacing:4px;background:rgba(0,0,0,.78);padding:8px 18px;border-radius:8px}
.hk1{left:30px;right:30px;top:160px;text-align:center;font-size:84px;line-height:1.04;text-shadow:0 8px 30px #000}
.hk2{left:20px;right:20px;top:445px;text-align:center;font-size:92px;line-height:1.02;color:#FF4B3E;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 8px 30px #000}
.ring{left:280px;top:820px;width:520px;height:700px;border:14px solid #FF2D20;border-radius:50%;box-shadow:0 0 40px rgba(255,45,32,.85)}
.big{left:40px;right:40px;top:300px;text-align:center;font-size:110px;line-height:1.02;text-shadow:0 8px 30px #000}
.big.low{top:1100px;font-size:84px}.big.lower{top:1250px;font-size:76px}
.vid{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}.big.top2{top:180px;font-size:80px}
.bigx{left:40px;right:40px;top:1240px;text-align:center;font-size:96px;line-height:1.02;text-shadow:0 8px 30px #000}
.pill{left:50%;transform:translateX(-50%);top:220px;white-space:nowrap;font-family:"J";font-size:40px;color:#eee;background:rgba(0,0,0,.85);padding:12px 24px;border-radius:10px}
.pbot{top:1340px;font-size:34px}
.radio{left:50%;transform:translateX(-50%);top:300px;white-space:nowrap;font-family:"J";font-size:60px;color:#111;background:#FFC83D;padding:18px 30px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.7)}
.al{left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"J";font-size:38px;background:#FFB020;color:#111;padding:16px 26px;border-radius:12px}
.al.a2{top:1180px}
.stamp{left:50%;margin-left:-380px;top:760px;width:760px;text-align:center;font-size:84px;line-height:1.05;color:#FF2D20;border:8px solid #FF2D20;padding:16px 10px;transform:rotate(-7deg);background:rgba(0,0,0,.65)}
.stamp.st2{top:300px;font-size:72px}
.s4{left:360px;top:880px;width:360px;text-align:center;font-family:"J";font-size:170px;color:#111;background:#FFC83D;border:8px solid #111;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.8)}
.ring2{left:300px;top:830px;width:480px;height:340px;border:12px solid #FF2D20;border-radius:50%;box-shadow:0 0 40px rgba(255,45,32,.85)}
.panel{left:60px;right:60px;top:520px;padding:30px;border:4px solid rgba(255,255,255,.5);border-radius:20px;background:rgba(8,14,20,.85)}
.row{display:flex;align-items:center;justify-content:space-between;font-family:"J";font-size:36px;white-space:nowrap;color:#ddd;padding:28px 10px}
.row b{font-family:"M";font-size:52px;margin-left:20px}
.dot{width:40px;height:40px;border-radius:50%;margin-right:20px;flex:0 0 40px}.dot.off{background:#333;border:4px solid #FF2D20}
.alt{left:80px;right:80px;top:420px;text-align:center}
.lab{font-family:"J";font-size:44px;color:#fff;text-shadow:0 4px 14px #000;letter-spacing:6px}.num{font-size:150px;line-height:1.1;white-space:nowrap;text-shadow:0 8px 30px #000}
.huge{left:0;right:0;top:330px;text-align:center;font-size:330px;line-height:1;color:#fff;text-shadow:0 10px 40px #000}
.huge .sm{display:block;font-size:90px;color:#FFC83D;letter-spacing:6px}
.pill2{left:60px;right:60px;top:900px;text-align:center;font-family:"J";font-size:38px;line-height:1.5;color:#eee;background:rgba(0,0,0,.65);padding:14px 10px;border-radius:12px}
.flash{inset:0;background:#fff;opacity:0;z-index:3}
#caps{position:absolute;left:40px;right:40px;top:1530px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Linate</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(MEDIA)}{''.join(VMEDIA)}
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
print('ok', len(W), 'palavras', len(cap), 'legendas')
