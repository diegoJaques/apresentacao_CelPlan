# Consta nos Autos — Varig 254 (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/vr/'
NARR = 54.80
END = 55.15

FIX = {'boing': 'Boeing', 'Po': 'pôr', 'Sol': 'sol', 'Plama': 'plano', 'Copa': 'copa', 'Árvores.': 'árvores.',
       'assim.': 'assim:', 'dizer,': 'dizer:', 'Oeste,': 'Oeste.', 'lugar,': 'lugar'}
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W = []
for i, (t, s, e) in enumerate(raw):
    if t in ('...', '…'): continue
    if t == 'E' and W and W[-1][0] == 'e' and abs(W[-1][1] - s) < .05: continue
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

HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · VARIG 254', p + 'tg') + '<div class="abs ring"></div>' +
                  card('hk1', 'UM <span class="y">ZERO</span><br>FORA DO LUGAR', p + 'h1') +
                  card('hk2', '3 HORAS NA<br>DIREÇÃO ERRADA', p + 'h2'))

# 0 — gancho (1º quadro = capa: cabine com o sol bem à frente)
vscene('s0', 0, 4.8, 'v1', 0.0, HOOK('a'), dark=.3)
A('tl.fromTo("#ah2",{scale:1},{scale:1.1,duration:.25,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},3.6);')
# 1 — 2º gancho: o sol na frente
vscene('s1', 4.8, 9.0, 'v1', 3.0, card('big', 'O SOL ESTAVA<br><span class="y">NA FRENTE</span>', 'g1') + card('stamp', 'NINGUÉM<br>ESTRANHOU', 'g2'), dark=.4)
hide('#g1', '#g2'); up('#g1', 5.1); slam('#g2', 8.0)
# 2 — Marabá → Belém
scene('s2', 9.0, 16.5, 'i3', card('pill', 'MARABÁ (PA) · 03.09.1989', 'd1') + card('big', 'VOO 254<br><span class="y">→ BELÉM</span>', 'd2') + card('big lower', '54 A BORDO', 'd3'), dark=.4, z=(1.0, 1.08))
hide('#d1', '#d2', '#d3'); fade('#d1', 9.3); up('#d2', 11.5); pop('#d3', 15.3)
# 3 — o plano de voo: 0 2 7 0
PLAN = ('<div id="pl" class="abs plan"><div class="ph1">PLANO DE VOO · MARABÁ → BELÉM</div><div class="ph2">RUMO</div>'
        '<div class="dg"><span id="dg0">0</span><span id="dg1">2</span><span id="dg2">7</span><span id="dg3">0</span></div>'
        '<div id="pok" class="pok">= 027,0°</div></div>')
scene('s3', 16.5, 23.0, 'i2', PLAN + card('big lower', 'O CERTO:<br><span class="g">27 GRAUS</span>', 'p2'), dark=.85, z=(1.1, 1.15))
hide('#pok', '#p2'); fade('#pl', 16.6, .4)
for k, t in enumerate([19.5, 19.8, 20.2, 20.6]):
    A(f'tl.fromTo("#dg{k}",{{color:"#111",scale:1}},{{color:"#C0392B",scale:1.25,duration:.15,yoyo:true,repeat:1,immediateRender:false}},{t:.2f});')
pop('#pok', 22.1); up('#p2', 22.3)
# 4 — o mapa: certo × o que ele voou
MAP = '''<svg id="map" class="abs" viewBox="0 0 1080 1100" style="left:0;top:330px;width:1080px;height:1100px">
<circle cx="760" cy="760" r="18" fill="#fff"/><text x="790" y="800" fill="#fff" font-family="J" font-size="40">MARABÁ</text>
<circle cx="860" cy="200" r="18" fill="#3DDC84"/><text x="720" y="160" fill="#3DDC84" font-family="J" font-size="40">BELÉM</text>
<path id="ok" d="M 760 760 L 852 225" fill="none" stroke="#3DDC84" stroke-width="16" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/>
<text id="okt" x="830" y="520" fill="#3DDC84" font-family="J" font-size="36">027°</text>
<path id="bad" d="M 760 760 L 90 760" fill="none" stroke="#FF4B3E" stroke-width="16" stroke-linecap="round" stroke-dasharray="680" stroke-dashoffset="680"/>
<polygon id="badh" points="70,760 120,730 120,790" fill="#FF4B3E"/>
<text id="badt" x="160" y="730" fill="#FF4B3E" font-family="J" font-size="44">270° · OESTE</text>
</svg>'''
scene('s4', 23.0, 28.4, 'i2', MAP + card('big top2', 'ELE LEU <span class="r">270</span>', 'm1') + card('big lower', 'DIRETO PARA A<br><span class="r">AMAZÔNIA</span>', 'm2'), dark=.8, z=(1.0, 1.06), left=-500)
hide('#m1', '#m2', '#okt', '#badh', '#badt')
A('tl.fromTo("#ok",{strokeDashoffset:560},{strokeDashoffset:0,duration:.8,ease:"power1.out",immediateRender:false},23.1);'); fade('#okt', 23.6, .3)
slam('#m1', 24.5)
A('tl.fromTo("#bad",{strokeDashoffset:680},{strokeDashoffset:0,duration:1.4,ease:"power1.inOut",immediateRender:false},25.0);')
fade('#badh', 26.3, .2); fade('#badt', 25.7, .3); up('#m2', 26.8)
# 5 — mudaram o formato nas férias
scene('s5', 28.4, 32.0, 'i1', card('big', 'A VARIG MUDOU<br>O FORMATO', 'f1') + card('fmt', 'ANTES: <b>027</b><br>DEPOIS: <b class="r">0270</b>', 'f2') + card('stamp st3', 'ELE ESTAVA<br>DE FÉRIAS', 'f3'), dark=.75, z=(1.2, 1.28), left=-1140)
hide('#f1', '#f2', '#f3'); up('#f1', 28.5); pop('#f2', 29.6); slam('#f3', 31.2)
# 6 — 3 horas, combustível, motores
FUEL = ('<div id="fu" class="abs fuel"><div class="lab">COMBUSTÍVEL</div><div class="tank"><div id="fill" class="fill"></div></div></div>'
        '<div id="e1" class="abs eng e1">MOTOR 1 ✕</div><div id="e2" class="abs eng e2">MOTOR 2 ✕</div>')
vscene('s6', 32.0, 37.9, 'v2', 2.0, card('big top2', '3 HORAS DEPOIS', 'h1') + FUEL, dark=.45)
hide('#h1', '#fu', '#e1', '#e2'); slam('#h1', 32.2); fade('#fu', 33.3, .3)
A('tl.fromTo("#fill",{width:"100%"},{width:"0%",duration:1.2,ease:"power2.in",immediateRender:false},34.0);')
slam('#e1', 36.0); slam('#e2', 37.2)
# 7 — no escuro, sobre as árvores
scene('s7', 37.9, 41.2, 'i4', card('big', 'NO ESCURO', 'n1') + card('big lower', 'SOBRE A COPA<br><span class="y">DAS ÁRVORES</span>', 'n2') + '<div id="bk" class="abs blk"></div>', dark=.3, z=(1.0, 1.25), left=-1110)
hide('#n1', '#n2'); up('#n1', 38.0); up('#n2', 39.4)
A('tl.fromTo("#bk",{opacity:0},{opacity:1,duration:.3,immediateRender:false},40.85);')
# 8 — 12 vidas
scene('s8', 41.2, 43.4, 'i4', card('huge', '12<span class="sm">VIDAS</span>', 'x1'), dark=.7, z=(1.25, 1.3), left=-1110)
hide('#x1'); slam('#x1', 41.4)
# 9 — 42 sobreviventes, 2 dias, a fazenda
scene('s9', 43.4, 48.7, 'i5', card('big', '<span class="g" style="font-size:150px">42</span><br>SOBREVIVERAM', 'v1') + card('pill2 pv', '2 DIAS NA SELVA', 'v2') + card('big lower', '4 ACHARAM<br><span class="y">UMA FAZENDA</span>', 'v3'), dark=.4, z=(1.0, 1.08), left=-1350)
hide('#v1', '#v2', '#v3'); up('#v1', 43.5); pop('#v2', 45.2); up('#v3', 47.0)
# 10 — 21 pilotos, 15 erraram
GRID = '<div id="gr" class="abs grid">' + ''.join(f'<div id="pp{k}" class="pp">✈</div>' for k in range(21)) + '</div>'
scene('s10', 48.7, 53.3, 'i1', card('big top2', 'TESTE COM<br><span class="y">21 PILOTOS</span>', 't1') + GRID + card('big lower', '<span class="r">15</span> ERRARAM IGUAL', 't2'), dark=.85, z=(1.2, 1.25), left=-1140)
hide('#t1', '#t2', '#gr'); up('#t1', 48.9); fade('#gr', 50.4, .3)
for k in range(15):
    A(f'tl.set("#pp{k}",{{background:"#FF4B3E",color:"#fff"}},{52.1 + k*.03:.2f});')
slam('#t2', 52.2)
# 11 — loop
vscene('s11', 53.3, END, 'v1', 0.0, HOOK('b'), dark=.3)
hide('#bh1', '#bh2', '#btg'); fade('#btg', 53.35, .2); up('#bh1', 53.4); slam('#bh2', 54.5)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>',
         '<audio id="a_i" src="assets/audio/impacto.wav" data-start="40.85" data-duration="1.40" data-track-index="12" data-volume="0.45"></audio>']
for k, t in enumerate([8.0, 19.5, 24.5, 31.2, 36.0, 37.2, 52.1]):
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
.g{color:#3DDC84}
.ring{left:200px;top:600px;width:460px;height:460px}
.hk1{font-size:100px!important}.hk2{top:470px!important;font-size:84px!important}
.plan{left:90px;right:90px;top:420px;padding:40px 30px;background:#F3EAD3;color:#111;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.8);transform:rotate(-2deg);text-align:center}
.ph1{font-family:"J";font-size:30px;letter-spacing:2px;border-bottom:3px dashed #555;padding-bottom:16px}
.ph2{font-family:"J";font-size:40px;margin-top:24px;color:#444}
.dg{font-family:"J";font-size:220px;line-height:1.1;letter-spacing:10px}.dg span{display:inline-block}
.pok{font-family:"M";font-size:90px;color:#1E8E4E}
.fmt{left:120px;right:120px;top:640px;text-align:center;font-family:"J";font-size:64px;line-height:1.5;background:rgba(0,0,0,.75);border-radius:16px;padding:20px}
.stamp.st3{top:980px}
.eng{left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"J";font-size:56px;background:#FF2D20;color:#fff;padding:14px 28px;border-radius:12px}
.e1{top:1020px}.e2{top:1160px}
.fuel{left:120px;right:120px;top:700px;text-align:center}
.tank{margin-top:16px;height:70px;border:6px solid #fff;border-radius:14px;padding:6px;background:rgba(0,0,0,.5)}
.fill{height:100%;width:100%;background:linear-gradient(90deg,#FF2D20,#FFC83D);border-radius:6px}
.blk{inset:0;background:#000;opacity:0}
.pv{top:760px;font-size:52px}
.grid{left:110px;right:110px;top:640px;display:flex;flex-wrap:wrap;justify-content:center;gap:22px}
.pp{width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.18);border:4px solid #fff;color:#fff;font-size:56px;line-height:104px;text-align:center}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Varig 254</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
