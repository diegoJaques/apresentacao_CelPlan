# Consta nos Autos — Gol 1907 (20 anos). 1080x1920. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/gol/'
NARR = 52.30
END = 52.40
FIX = {'mato': 'Mato', 'grosso.': 'Grosso.', 'Jatinho': 'jatinho', 'aeronáutica.': 'Aeronáutica.', 'para': 'pra'}
W = [(FIX.get(x['text'].strip(), x['text'].strip()), x['timestamp'][0], min(x['timestamp'][1] or x['timestamp'][0] + .3, NARR))
     for x in json.load(open(P + 'words.json'))]
CAP_ON = [(5.1, 46.3)]

J = []
def A(s): J.append(s)
def up(sel, t, d=.5, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.6): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.3): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.5}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2.2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.4}},{{autoAlpha:1,scale:1,duration:.22,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

# legendas
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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, MEDIA = [], []
def scene(id_, s, e, inner, track=2):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="{track}"><div id="{id_}_in" class="abs inner">{inner}</div></section>')
def video(id_, s, e, ms):
    MEDIA.append(f'<video id="{id_}" class="clip vid" src="assets/clips/pouso.webm" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-media-start="{ms:.2f}" data-track-index="1" muted playsinline></video>')
def ovl(id_, s, e, inner):
    H.append(f'<div id="{id_}" class="clip ovl" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="8"><div class="abs inner">{inner}</div></div>')

HOOK = '''<div class="abs shadeT"></div><div class="abs shadeB"></div>
<div class="abs hk1">BATEU NUM BOEING<br>A <span class="y">11 MIL METROS</span></div>
<div class="abs hk2" data-layout-allow-overlap>…E POUSOU INTEIRO</div>
<div class="abs J tag">CONSTA NOS AUTOS · 2006</div>'''

# 0 — gancho (1º quadro = capa)
video('v0', 0, 9.3, 1.2)
ovl('o0', 0, 9.3, HOOK + '<div id="hd" class="abs chip">SÓ DESCOBRIRAM HORAS DEPOIS</div>')
hide('#hd'); pop('#hd', 5.6)
A('tl.fromTo("#o0 .hk2",{scale:1},{scale:1.06,duration:.35,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false},3.70);')
out('#o0 .hk1,#o0 .hk2', 5.2, .3)

# 1 — data e o voo
scene('s1', 9.3, 17.4, '''<div class="abs sky"></div>
<div id="dt" class="abs J dt">29 · 09 · 2006</div>
<div id="mt" class="abs mt">MATO GROSSO</div>
<svg id="b1" class="abs plane" viewBox="0 0 200 80"><path d="M10 40 L150 34 Q190 36 195 40 Q190 44 150 46 L10 40 Z M90 38 L60 8 L80 8 L120 37 Z M90 42 L60 72 L80 72 L120 43 Z M18 39 L8 22 L18 22 L32 38 Z" fill="#fff"/></svg>
<div id="vl" class="abs J vl">VOO 1907 · GOL</div>
<div id="pc" class="abs pc"><span id="pn">0</span><small>PESSOAS A BORDO</small></div>''')
hide('#dt', '#mt', '#vl', '#pc'); up('#dt', 9.4); up('#mt', 11.6)
A('tl.fromTo("#b1",{x:-500},{x:1200,duration:6.5,ease:"none",immediateRender:false},13.30);')
fade('#vl', 13.5, .4); pop('#pc', 15.6); count('#pn', 15.7, 0, 154, 1.0)

# 2 — mesma altitude, sentidos contrários + TCAS
scene('s2', 17.4, 28.0, '''<div class="abs sky2"></div>
<div class="abs alt"><div class="altl"></div><div class="J altt">37.000 PÉS · ~11 MIL METROS</div></div>
<svg id="pb" class="abs pl2" style="left:-300px" viewBox="0 0 200 80"><path d="M10 40 L150 34 Q190 36 195 40 Q190 44 150 46 L10 40 Z M90 38 L60 8 L80 8 L120 37 Z M90 42 L60 72 L80 72 L120 43 Z M18 39 L8 22 L18 22 L32 38 Z" fill="#fff"/></svg>
<svg id="pl" class="abs pl3" viewBox="0 0 200 80"><path d="M190 40 L60 35 Q20 37 15 40 Q20 43 60 45 L190 40 Z M110 38 L135 14 L120 14 L90 37 Z M110 42 L135 66 L120 66 L90 43 Z M182 39 L192 26 L184 26 L170 38 Z" fill="#FFC83D"/></svg>
<div id="lb1" class="abs J lb" style="left:80px;top:690px">BOEING 737 →</div>
<div id="lb2" class="abs J lb y" style="right:80px;top:880px">← LEGACY</div>
<div id="ma" class="abs big">MESMA<br>ALTITUDE</div>
<div id="tc" class="abs tcas"><div class="J tct">SISTEMA ANTICOLISÃO</div><div class="tcb">AVISA OS PILOTOS<br>E MANDA DESVIAR</div></div>''')
hide('#lb1', '#lb2', '#ma', '#tc')
A('tl.fromTo("#pb",{x:0},{x:900,duration:5,ease:"none",immediateRender:false},17.60);')
A('tl.fromTo("#pl",{x:0},{x:-900,duration:5,ease:"none",immediateRender:false},17.70);')
fade('#lb1', 17.8, .3); fade('#lb2', 18.5, .3); slam('#ma', 20.4)
out('#ma,#lb1,#lb2', 22.6, .3); up('#tc', 22.9); A('tl.fromTo("#tc .tcb",{autoAlpha:0},{autoAlpha:1,duration:.4,immediateRender:false},25.60);')

# 3 — transponder desligado, alarme mudo
scene('s3', 28.0, 33.2, '''<div class="abs panel"></div>
<div class="abs xp"><div class="J xpl">TRANSPONDER</div><div id="xpv" class="J xpv" data-layout-allow-overlap>ON</div></div>
<div id="bell" class="abs bell">🔔<div class="slash"></div></div>
<div id="am" class="abs big r">ALARME<br>MUDO</div>''')
hide('#bell', '#am')
A('tl.set("#xpv",{textContent:"OFF",color:"#FF4B3E"},28.25);')
A('tl.fromTo("#xpv",{opacity:1},{opacity:.2,duration:.25,yoyo:true,repeat:7,ease:"steps(1)",immediateRender:false},28.30);')
pop('#bell', 30.5); slam('#am', 32.2)

# 4 — a ponta da asa corta a asa
scene('s4', 33.2, 37.1, '''<div class="abs sky2"></div>
<svg class="abs" style="left:0;top:500px;width:1080px;height:700px" viewBox="0 0 1080 700">
<path id="wingA" d="M0 300 L700 360 L760 420 L0 420 Z" fill="#e8ecf2"/>
<path id="wingB" d="M700 360 L1080 392 L1080 420 L760 420 Z" fill="#e8ecf2"/>
<g id="wl"><path d="M520 40 L560 40 L600 300 L540 300 Z" fill="#FFC83D"/></g>
<path id="cut" d="M700 330 L760 450" stroke="#FF4B3E" stroke-width="10"/></svg>
<div id="fk" class="abs big">COMO UMA<br>FACA</div><div id="fl" class="abs flash"></div>''')
hide('#cut', '#fk', '#fl')
A('tl.fromTo("#wl",{x:-700,y:-80},{x:180,y:40,duration:1.4,ease:"power2.in",immediateRender:false},33.30);')
A('tl.set("#cut",{autoAlpha:1},34.70);'); A('tl.fromTo("#fl",{autoAlpha:.9},{autoAlpha:0,duration:.5,immediateRender:false},34.70);')
A('tl.to("#wingB",{x:120,y:380,rotation:28,transformOrigin:"0% 0%",duration:1.6,ease:"power2.in"},34.75);')
slam('#fk', 36.2)

# 5 — 154 vidas (sóbrio)
scene('s5', 37.1, 40.2, '''<div class="abs black"></div><img class="abs fimg" src="assets/img/floresta.jpg">
<div id="v1" class="abs big">154 VIDAS</div><div id="v2" class="abs J sub">NINGUÉM SOBREVIVEU</div>''')
hide('#v1', '#v2'); fade('#v1', 37.2, .8); fade('#v2', 38.8, .6)

# 6 — o Legacy pousa na base escondida
video('v6', 40.2, 46.4, 3.0)
ovl('o6', 40.2, 46.4, '<div class="abs shadeT"></div><div id="cb" class="abs chip">BASE AÉREA DO CACHIMBO · PARÁ</div><div id="as" class="abs J tag2">COM A ASA RASGADA</div>')
hide('#cb', '#as'); up('#as', 40.9); pop('#cb', 44.6)

# 7 — 20 anos depois → volta ao 1º quadro (loop)
video('v7', 46.4, END, 1.2)
ovl('o7', 46.4, END, HOOK.replace('class="abs hk2"', 'id="hk2b" class="abs hk2"') + '<div id="vt" class="abs chip">20 ANOS DEPOIS</div>')
hide('#vt', '#o7 .hk1', '#hk2b'); pop('#vt', 46.4); out('#vt', 48.9, .2); fade('#o7 .hk1', 49.1, .3); fade('#hk2b', 51.6, .3)

# áudio
MEDIA.append(f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.20"></audio>')
MEDIA.append('<audio id="a_s0" src="assets/audio/pouso_sfx.wav" data-start="0" data-duration="8.80" data-media-start="1.20" data-track-index="12" data-volume="0.30"></audio>')
MEDIA.append('<audio id="a_s6" src="assets/audio/pouso_sfx.wav" data-start="40.20" data-duration="6.20" data-media-start="3.00" data-track-index="12" data-volume="0.25"></audio>')
MEDIA.append(f'<audio id="a_s7" src="assets/audio/pouso_sfx.wav" data-start="46.40" data-duration="{END-46.4:.2f}" data-media-start="1.20" data-track-index="13" data-volume="0.25"></audio>')
MEDIA.append('<audio id="a_i" src="assets/audio/impacto.wav" data-start="34.70" data-duration="2.20" data-track-index="14" data-volume="0.55"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ovl{position:absolute;inset:0;z-index:4}.vid{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.y{color:#FFC83D}.r{color:#FF4B3E}
.shadeT{left:0;right:0;top:0;height:640px;background:linear-gradient(rgba(0,0,0,.82),rgba(0,0,0,0))}
.shadeB{left:0;right:0;bottom:0;height:700px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.8))}
.hk1{left:40px;right:40px;top:150px;text-align:center;font-size:84px;line-height:1.02;text-shadow:0 8px 26px rgba(0,0,0,.9)}
.hk2{left:40px;right:40px;top:1240px;text-align:center;font-size:96px;color:#FF4B3E;text-shadow:0 8px 26px rgba(0,0,0,.95);-webkit-text-stroke:3px #000;paint-order:stroke fill}
.tag{left:0;right:0;top:80px;text-align:center;font-size:28px;color:#FFC83D;letter-spacing:4px}
.tag2{left:0;right:0;top:170px;text-align:center;font-size:44px;text-shadow:0 4px 18px #000}
.chip{left:50%;transform:translateX(-50%);top:420px;white-space:nowrap;font-family:"J";font-weight:700;font-size:40px;background:#FFC83D;color:#111;padding:14px 26px;border-radius:10px}
.sky{inset:0;background:linear-gradient(#5f8fc4,#9cc3e6 60%,#d9e8f2)}
.sky2{inset:0;background:linear-gradient(#0f1f38,#29507e 70%,#4f7fae)}
.dt{left:0;right:0;top:360px;text-align:center;font-size:110px;color:#0f1f38}
.mt{left:0;right:0;top:520px;text-align:center;font-size:70px;color:#0f1f38}
.plane{left:0;top:780px;width:420px;height:170px;filter:drop-shadow(0 10px 20px rgba(0,0,0,.3))}
.vl{left:0;right:0;top:1000px;text-align:center;font-size:44px;color:#0f1f38}
.pc{left:50%;transform:translateX(-50%);top:1080px;text-align:center;background:#0f1f38;padding:18px 40px;border-radius:16px}
.pc span{display:block;font-size:120px;color:#FFC83D;line-height:1}.pc small{display:block;font-family:"J";font-size:30px;margin-top:6px}
.alt{left:0;right:0;top:800px;height:80px}.altl{position:absolute;left:0;right:0;top:38px;border-top:4px dashed rgba(255,255,255,.6)}
.altt{position:absolute;left:0;right:0;top:-60px;text-align:center;font-size:36px;color:#cfe0f5}
.pl2{top:760px;width:300px;height:120px}.pl3{left:1080px;top:770px;width:300px;height:120px}
.lb{font-size:36px}
.big{left:40px;right:40px;top:360px;text-align:center;font-size:120px;line-height:1;text-shadow:0 8px 30px rgba(0,0,0,.8)}
.tcas{left:90px;right:90px;top:1000px;text-align:center;background:rgba(10,20,40,.85);border:4px solid #3ddc84;border-radius:22px;padding:30px}
.tct{font-size:38px;color:#3ddc84}.tcb{font-size:58px;margin-top:14px;line-height:1.1}
.panel{inset:0;background:radial-gradient(ellipse at 50% 40%,#1e242e,#07090c 80%)}
.xp{left:140px;right:140px;top:360px;background:#000;border:6px solid #333;border-radius:20px;padding:30px;text-align:center}
.xpl{font-size:44px;color:#aab}.xpv{font-size:200px;color:#3ddc84;line-height:1.15;margin-top:24px}
.bell{left:50%;margin-left:-110px;top:820px;width:220px;height:220px;font-size:180px;text-align:center;line-height:220px}
.slash{position:absolute;left:-10px;top:100px;width:240px;height:16px;background:#FF4B3E;transform:rotate(-40deg);border-radius:8px}
.big.r{top:1080px}
.flash{inset:0;background:#fff}
.black{inset:0;background:#000}.fimg{left:0;top:500px;width:1080px;height:900px;object-fit:cover;opacity:.55}
#v1{top:700px}.sub{left:0;right:0;top:880px;text-align:center;font-size:48px;color:#ddd}
#caps{position:absolute;left:40px;right:40px;top:1480px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:76px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Gol 1907</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
