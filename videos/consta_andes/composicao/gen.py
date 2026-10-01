# Consta nos Autos — Andes 1972: a notícia no rádio (Short 1080x1920). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/andes/'
END = 49.3
FIX = {'uruguaiu': 'uruguaio', 'rugby': 'rúgbi', '1972.': '1972.', 'para': 'pra', 'Para': 'Pra'}
W = [(FIX.get(w['text'].strip(), w['text'].strip()), w['timestamp'][0], min(w['timestamp'][1], END))
     for w in json.load(open(P + 'words.json')) if w['timestamp'][0] < END]

T = dict(S1=4.3, S2=13.6, S3=19.45, S4=26.45, S5=30.4, S6=38.5, S7=42.4, S8=46.25)
CAP_ON = [(T['S1'], END)]

J = []
def A(s): J.append(s)
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.4)"}},{t:.2f});')
def up(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{opacity:0,y:60}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6}},{{opacity:1,scale:1,duration:.2,ease:"power4.out"}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{opacity:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power1.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

# ---------- legendas ----------
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 3 or re.search(r'[.?!,:]$', w[0]) or (nx[1]-w[2] > .35):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.6, END)
    ok = [(max(s, a), min(e, b)) for a, b in CAP_ON if min(e, b) - max(s, a) > .15]
    if not ok: continue
    s, e = ok[0]
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",."))}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC233"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

def clip(id_, s, e, inner, z=''):
    return f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"{z}>{inner}</section>'

H, MEDIA = [], []
def video(id_, src, s, d):
    MEDIA.append(f'<video id="{id_}" class="clip vid" src="assets/clips/{src}" data-start="{s:.2f}" data-duration="{d:.2f}" data-track-index="5" muted playsinline style="left:0;top:0;width:1080px;height:1920px"></video>')

# ---------- GANCHO (vídeo + texto por cima) ----------
video('v_hook', 'hook.webm', 0, T['S1'])
H.append(f'''<div id="hook" class="clip ovl" data-start="0" data-duration="{T['S1']:.2f}" data-track-index="8">
<div class="abs shadeT"></div><div class="abs shadeB"></div>
<div class="abs t" style="top:130px;font-size:74px">ELES OUVIRAM<br><span class="yl">NO RÁDIO QUE</span></div>
<div id="hB" class="abs t" style="top:1200px;font-size:66px">NINGUÉM IA MAIS<br><span class="red">PROCURAR POR ELES</span></div>
<div class="abs ilu">reconstituição ilustrativa</div></div>''')
A('tl.fromTo("#hB .red",{scale:1},{scale:1.05,duration:.35,yoyo:true,repeat:5,ease:"sine.inOut"},0.1);')

# ---------- S1: a queda ----------
MTS = 'M0 520 L60 430 L120 470 L190 330 L250 420 L320 260 L390 400 L450 300 L520 430 L590 340 L660 450 L730 360 L800 470 L880 400 L960 500 L960 620 L0 620 Z'
H.append(clip('sc1', T['S1'], T['S2'], f'''
<div class="abs" style="inset:0;background:linear-gradient(#0b1530 0%,#1b2b4a 55%,#0d1424 100%)"></div>
<div id="s1d" class="abs chipC">13 · OUT · 1972</div>
<svg class="abs" style="left:60px;top:420px" width="960" height="620" viewBox="0 0 960 620">
 <path d="{MTS}" fill="#cfd8e3"/><path d="{MTS}" fill="url(#sh)" opacity=".55"/>
 <defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5d6b80"/></linearGradient></defs>
 <path id="route" d="M940 120 C 760 140 560 180 420 300" stroke="#FFC233" stroke-width="8" fill="none" stroke-dasharray="18 14"/>
 <text x="950" y="100" text-anchor="end" font-family="J" font-weight="700" font-size="34" fill="#fff">URUGUAI →</text>
 <text x="10" y="100" font-family="J" font-weight="700" font-size="34" fill="#fff">← CHILE</text>
 <g id="xmark"><circle cx="420" cy="300" r="34" fill="none" stroke="#FF4545" stroke-width="8"/><path d="M398 278L442 322M442 278L398 322" stroke="#FF4545" stroke-width="10"/></g>
</svg>
<div id="s1r" class="abs tag" style="left:50%;top:300px;transform:translateX(-50%)">TIME DE RÚGBI · URUGUAI</div>
<div id="s1a" class="abs t" style="top:1120px;font-size:96px"><span id="n45">0</span> <span style="font-size:60px">A BORDO</span></div>
'''))
up('#s1d', T['S1']+.05)
A('tl.fromTo("#route",{strokeDashoffset:900,opacity:1},{strokeDashoffset:0,duration:2.4,ease:"none"},7.5);tl.set("#route",{strokeDasharray:"18 14"},0);')
hide('#s1r', '#xmark', '#s1a'); pop('#s1r', 8.26)
A('tl.fromTo("#xmark",{opacity:0,scale:2.5,transformOrigin:"420px 300px"},{opacity:1,scale:1,duration:.25,ease:"power4.out"},9.52);')
A('tl.set("#s1a",{opacity:1},12.0);'); count('#n45', 12.0, 0, 45, .9)

# ---------- S2: o frio ----------
H.append(clip('sc2', T['S2'], T['S3'], '''
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 40%,#16324f,#050a14 75%)"></div>
<div id="thermo" class="abs thermo"><div id="merc" class="merc"></div><div class="bulb"></div></div>
<div id="tv" class="abs J tval"><span id="deg">0</span>°C</div>
<div id="c1" class="abs pill" style="top:1000px">☀ roupa de verão</div>
<div id="c2" class="abs pill" style="top:1110px">quase nada pra comer</div>
'''))
up('#thermo', T['S2']+.05)
A('tl.fromTo("#merc",{height:"62%"},{height:"12%",duration:1.4,ease:"power2.in"},15.2);tl.to("#merc",{background:"#5fd0ff",duration:.4},15.9);')
count('#deg', 15.2, 0, -20, 1.4)
hide('#c1', '#c2'); up('#c1', 16.8); up('#c2', 17.9)

# ---------- S3: a notícia (vídeo) ----------
video('v_desp', 'desp.webm', T['S3'], T['S4'] - T['S3'])
H.append(f'''<div id="ov3" class="clip ovl" data-start="{T['S3']:.2f}" data-duration="{T['S4']-T['S3']:.2f}" data-track-index="8">
<div class="abs shadeT"></div>
<div id="d10" class="abs chipC" style="top:140px">DIA 10 · RADINHO DE PILHA</div>
<div id="canc" class="abs stampR" style="top:320px">BUSCAS CANCELADAS</div>
<div id="soz" class="abs t" style="top:580px;font-size:110px">SOZINHOS</div>
<div class="abs ilu">reconstituição ilustrativa</div></div>''')
up('#d10', 19.6); hide('#canc', '#soz'); slam('#canc', 22.86); slam('#soz', 24.94)

# ---------- S4: a decisão ----------
H.append(clip('sc4', T['S4'], T['S5'], '''
<div class="abs" style="inset:0;background:#000"></div>
<div id="dec" class="abs t" style="top:700px;font-size:70px;color:#ddd">A DECISÃO<br>MAIS DIFÍCIL<br>DE SUAS VIDAS</div>
'''))
A(f'tl.fromTo("#dec",{{opacity:0,scale:1.15}},{{opacity:1,scale:1,duration:1.6,ease:"power2.out"}},{T["S4"]+.3:.2f});')

# ---------- S5: a travessia ----------
H.append(clip('sc5', T['S5'], T['S6'], f'''
<div class="abs" style="inset:0;background:linear-gradient(#0b1530 0%,#1b2b4a 55%,#0d1424 100%)"></div>
<div id="nm1" class="abs card2" style="left:60px;width:460px;top:150px">NANDO<br>PARRADO</div>
<div id="nm2" class="abs card2" style="left:560px;width:460px;top:150px">ROBERTO<br>CANESSA</div>
<svg class="abs" style="left:60px;top:420px" width="960" height="620" viewBox="0 0 960 620">
 <path d="{MTS}" fill="#cfd8e3"/><path d="{MTS}" fill="url(#sh2)" opacity=".55"/>
 <defs><linearGradient id="sh2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#5d6b80"/></linearGradient></defs>
 <circle cx="420" cy="300" r="20" fill="#FF4545"/>
 <path id="walk" d="M420 300 C 370 250 310 300 250 330 C 180 365 110 400 40 440" stroke="#FFC233" stroke-width="10" fill="none" stroke-dasharray="4 18" stroke-linecap="round"/>
</svg>
<div id="noeq" class="abs tag" style="left:50%;top:1060px;transform:translateX(-50%)">SEM EQUIPAMENTO</div>
<div id="days" class="abs t" style="top:1170px;font-size:80px">DIA <span id="dd" class="yl">1</span> DE CAMINHADA</div>
'''))
hide('#nm1', '#nm2', '#noeq', '#days'); up('#nm1', 31.48); up('#nm2', 32.42)
A('tl.fromTo("#walk",{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:4.5,ease:"none"},33.4);')
pop('#noeq', 35.8); A('tl.set("#days",{opacity:1},36.8);'); count('#dd', 36.8, 1, 10, 1.4)

# ---------- S6: o homem a cavalo ----------
H.append(clip('sc6', T['S6'], T['S7'], '''
<div class="abs" style="inset:0;background:linear-gradient(#26364f 0%,#4b5d73 50%,#2b3a2e 50%,#1a2419 100%)"></div>
<div id="river" class="abs river"></div>
<div id="rider" class="abs rider"><i class="hb"></i><i class="hh"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><i class="pb"></i><i class="ph"></i></div>
<div id="hc" class="abs t" style="top:260px;font-size:84px">UM HOMEM<br><span class="yl">A CAVALO</span></div>
<div id="dt" class="abs chipC" style="top:150px">20 · DEZ · 1972</div>
'''))
A('tl.fromTo("#river",{backgroundPositionX:"0px"},{backgroundPositionX:"-500px",duration:4,ease:"none"},38.5);')
hide('#rider', '#hc'); A('tl.fromTo("#rider",{opacity:0,x:120},{opacity:1,x:0,duration:1.2,ease:"power2.out"},40.6);'); slam('#hc', 40.84); up('#dt', 38.7)

# ---------- S7: 16 voltaram ----------
DOTS = ''.join(f'<i id="p{k}"></i>' for k in range(45))
H.append(clip('sc7', T['S7'], T['S8'], f'''
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 40%,#1d2d48,#050a14 75%)"></div>
<div id="d72" class="abs t J" style="top:180px;font-size:120px;color:#FFC233"><span id="n72">0</span> DIAS</div>
<div id="dots" class="abs dots">{DOTS}</div>
<div id="v16" class="abs t" style="top:1130px;font-size:100px"><span class="yl">16</span> VOLTARAM</div>
'''))
up('#d72', T['S7']+.05); count('#n72', 42.5, 0, 72, 1.0)
A('tl.fromTo("#dots i",{opacity:0,scale:0},{opacity:1,scale:1,duration:.08,stagger:.015},42.6);')
A('tl.to("#dots i:nth-child(n+17)",{background:"#2a3346",duration:.4,stagger:.01},44.6);')
A('tl.to("#dots i:nth-child(-n+16)",{background:"#FFC233",boxShadow:"0 0 18px #FFC233",duration:.3},44.84);')
hide('#v16'); slam('#v16', 44.84)

# ---------- S8: volta ao rádio (loop) ----------
video('v_fim', 'fim.webm', T['S8'], END - T['S8'])
H.append(f'<div id="iluF" class="clip abs ilu" data-start="{T["S8"]:.2f}" data-duration="{END-T["S8"]:.2f}" data-track-index="8">reconstituição ilustrativa</div>')

SFX = [('radio', 0.0, 2.5, .35), ('whump', 9.52, .5, .55), ('whump', 12.0, .5, .4), ('radio', 20.6, 2.5, .4), ('whump', 22.86, .5, .6),
       ('whump', 24.94, .5, .5), ('whump', 40.84, .5, .45), ('whump', 44.84, .5, .6), ('radio', 47.0, 2.3, .35)]
MEDIA.insert(0, f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_v" src="assets/audio/vento.wav" data-start="0" data-duration="{END:.2f}" data-track-index="15" data-volume="0.3"></audio>')
for i, (f, t, d, v) in enumerate(SFX):
    MEDIA.append(f'<audio id="fx{i}" src="assets/audio/{f}.wav" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="{11+i%3}" data-volume="{v}"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#050a14}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#050a14;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0}
.ovl{position:absolute;inset:0;z-index:4}.vid{position:absolute;object-fit:cover}
.shadeT{left:0;right:0;top:0;height:560px;background:linear-gradient(rgba(0,0,0,.85),rgba(0,0,0,0))}
.shadeB{left:0;right:0;bottom:0;height:900px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.92))}
.yl{color:#FFC233}.red{color:#FF5A5A}
.t{left:30px;right:30px;text-align:center;text-transform:uppercase;line-height:1.02;white-space:nowrap;text-shadow:0 10px 30px #000}
.ilu{left:30px;top:40px;font-family:"J";font-weight:700;font-size:22px;color:rgba(255,255,255,.75);background:rgba(0,0,0,.5);padding:6px 12px;border-radius:6px;z-index:5}
.chipC{left:50%;transform:translateX(-50%);top:150px;font-family:"J";font-weight:700;font-size:40px;background:#FFC233;color:#111;padding:12px 24px;border-radius:10px;white-space:nowrap}
.tag{font-weight:900;font-size:38px;background:rgba(0,0,0,.55);border:3px solid #FFC233;color:#FFC233;padding:10px 22px;border-radius:12px;white-space:nowrap}
.stampR{left:50%;margin-left:-450px;width:900px;text-align:center;font-weight:900;font-size:80px;color:#FF5A5A;border:9px solid #FF5A5A;border-radius:16px;padding:10px 0;background:rgba(0,0,0,.5);transform:rotate(-4deg)}
.thermo{left:470px;top:250px;width:140px;height:640px;border-radius:70px;background:#0b1828;border:8px solid #dfe8f0}
.merc{position:absolute;left:38px;right:38px;bottom:80px;height:62%;background:#FF5A5A;border-radius:30px}
.bulb{position:absolute;left:10px;bottom:-30px;width:104px;height:104px;border-radius:50%;background:#5fd0ff}
.tval{left:640px;top:520px;font-size:110px;color:#5fd0ff}
.pill{left:50%;transform:translateX(-50%);font-weight:900;font-size:50px;background:rgba(255,255,255,.1);border:3px solid rgba(255,255,255,.4);padding:12px 30px;border-radius:999px;white-space:nowrap}
.card2{text-align:center;font-weight:900;font-size:58px;line-height:1.05;background:rgba(0,0,0,.5);border:3px solid #FFC233;border-radius:18px;padding:18px 0}
.river{left:0;right:0;top:930px;height:120px;background:repeating-linear-gradient(90deg,#3d7ab8 0 60px,#5a95cf 60px 120px);opacity:.9}
.rider{left:560px;top:700px;width:300px;height:240px}.rider i{position:absolute;display:block;background:#0c0f12}
.rider .hb{left:40px;top:100px;width:200px;height:80px;border-radius:40px}
.rider .hh{left:210px;top:50px;width:70px;height:90px;border-radius:30px 30px 10px 10px;transform:rotate(25deg)}
.rider .l1{left:60px;top:170px;width:16px;height:70px}.rider .l2{left:100px;top:170px;width:16px;height:70px}
.rider .l3{left:190px;top:170px;width:16px;height:70px}.rider .l4{left:220px;top:170px;width:16px;height:70px}
.rider .pb{left:110px;top:30px;width:50px;height:90px;border-radius:20px}
.rider .ph{left:115px;top:-20px;width:40px;height:40px;border-radius:50%}
.dots{left:150px;right:150px;top:470px;display:grid;grid-template-columns:repeat(9,1fr);gap:22px}
.dots i{display:block;width:62px;height:62px;border-radius:50%;background:#dfe8f0}
#caps{position:absolute;left:30px;right:30px;top:1380px;height:200px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:74px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Andes 1972 — a notícia no rádio</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(MEDIA)}
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
