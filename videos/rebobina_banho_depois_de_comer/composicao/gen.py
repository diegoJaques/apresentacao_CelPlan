# Rebobina — "Nada de piscina depois de comer" (versão emocional, 1080x1920). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/piscina/'
END = 37.8
FIX = {'cruz': 'Cruz', 'vermelha': 'Vermelha', 'para': 'pra'}
W = [(FIX.get(w['text'].strip(), w['text'].strip()), w['timestamp'][0], min(w['timestamp'][1], END))
     for w in json.load(open(P + 'words.json')) if w['timestamp'][0] < END]

T = dict(S1=3.9, S2=6.5, S3=10.2, S4=17.9, S5=22.8, S6=27.9, S7=32.27, LOOP=35.6)
CAP_ON = [(T['S1'], T['LOOP'])]

J = []
def A(s): J.append(s)
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.4)"}},{t:.2f});')
def up(sel, t, d=.5): A(f'tl.fromTo("{sel}",{{opacity:0,y:50}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6}},{{opacity:1,scale:1,duration:.2,ease:"power4.out"}},{t:.2f});')
def fade(sel, t, d=.8): A(f'tl.fromTo("{sel}",{{opacity:0}},{{opacity:1,duration:{d}}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{opacity:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power1.inOut",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFD45C"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, MEDIA = [], []
def video(id_, src, s, d):
    MEDIA.append(f'<video id="{id_}" class="clip vid" src="assets/clips/{src}" data-start="{s:.2f}" data-duration="{d:.2f}" data-track-index="5" muted playsinline style="left:0;top:0;width:1080px;height:1920px"></video>')
def ovl(id_, s, e, inner):
    H.append(f'<div id="{id_}" class="clip ovl" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="8">{inner}</div>')

HOOK = '''<div class="abs shadeT"></div><div class="abs shadeB"></div>
<div class="abs t" style="top:150px;font-size:80px">ACABOU DE<br>ALMOÇAR?</div>
<div class="abs t big" style="top:1180px;font-size:96px"><span class="red">NADA DE<br>PISCINA!</span></div>'''

# ---------- GANCHO ----------
video('v_hook', 'hook.webm', 0, T['S1'])
ovl('hk', 0, T['S1'], HOOK)
A('tl.fromTo("#hk .big",{scale:1},{scale:1.06,duration:.3,yoyo:true,repeat:5,ease:"sine.inOut"},0.1);')

# ---------- S1/S2: na borda + relógio ----------
video('v_sit', 'sit.webm', T['S1'], T['S2'] - T['S1'])
video('v_clock', 'clock.webm', T['S2'], T['S3'] - T['S2'])
ovl('o2', T['S2'], T['S3'], '<div id="clk" class="abs chipC" style="top:230px">⏱ <span id="hh">0:00</span> DE ESPERA</div>')
up('#clk', T['S2'] + .1)
count('#hh', 6.9, 0, 120, 2.6, '`${Math.floor(v/60)}:${String(Math.round(v%60)).padStart(2,"0")}`')

# ---------- S3: o estudo ----------
H.append(f'''<section id="sc3" class="clip scene" data-start="{T['S3']:.2f}" data-duration="{T['S4']-T['S3']:.2f}" data-track-index="2">
<div class="abs paperBg"></div>
<div id="doc" class="abs doc">
 <div class="J dt">REVISÃO CIENTÍFICA</div>
 <div class="J ds">Cruz Vermelha americana · conselho científico</div>
 <div class="ln"></div><div class="ln s"></div><div class="ln"></div><div class="ln s"></div><div class="ln"></div>
 <div class="J q">"comer antes de nadar não é fator de risco<br>para afogamento"</div>
</div>
<div id="cnt" class="abs cnt" data-layout-allow-overlap><div class="J cl" data-layout-allow-overlap>CASOS ENCONTRADOS</div><div id="cn" class="cv" data-layout-allow-overlap>137</div></div>
<div id="mito" class="abs stamp" data-layout-allow-overlap>MITO</div>
</section>''')
up('#doc', T['S3'] + .1)
hide('#cnt', '#mito'); up('#cnt', 13.5)
count('#cn', 13.7, 137, 0, 2.2)
slam('#mito', 17.26)

# ---------- S4/S5: emoção ----------
video('v_mom', 'mom.webm', T['S4'], T['S5'] - T['S4'])
ovl('o4', T['S4'], T['S5'], '<div class="abs shadeB"></div><div id="ent" class="abs t soft" style="top:1080px;font-size:72px">ENTENDIAM<br><span class="gold">DE VOCÊ</span></div>')
hide('#ent'); fade('#ent', 22.2, .6)
video('v_close', 'close.webm', T['S5'], T['S6'] - T['S5'])

# ---------- S6: a foto ----------
H.append(f'''<section id="sc6" class="clip scene" data-start="{T['S6']:.2f}" data-duration="{T['S7']-T['S6']:.2f}" data-track-index="2">
<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 40%,#3b2a1a,#120c07 75%)"></div>
<div id="pol" class="abs polaroid"><img src="assets/img/foto.jpg"><div class="J pc">verão de 96</div></div>
</section>''')
A(f'tl.fromTo("#pol",{{opacity:0,y:80,rotation:-8,scale:1.1}},{{opacity:1,y:0,rotation:-3,scale:1,duration:1.4,ease:"power2.out"}},{T["S6"]+.1:.2f});')
A(f'tl.to("#pol",{{scale:1.06,duration:{T["S7"]-T["S6"]-1.4:.2f},ease:"none"}},{T["S6"]+1.5:.2f});')
A(f'tl.fromTo("#pol img",{{filter:"saturate(1)"}},{{filter:"saturate(.35)",duration:3.5,ease:"none"}},{T["S6"]+.3:.2f});')

# ---------- S7: volta pra borda (loop) ----------
video('v_fim', 'fim.webm', T['S7'], END - T['S7'])
ovl('hk2', T['LOOP'], END, HOOK)
hide('#hk2 .big'); A(f'tl.set("#hk2 .big",{{opacity:1}},36.9);')

# ---------- VHS por cima de tudo ----------
H.append(f'''<div id="vhs" class="abs vhs"><div class="scan"></div>
<div class="J rec">▶ PLAY</div><div class="J date">JAN 14 1996</div></div>''')
A(f'tl.fromTo(".scan",{{backgroundPositionY:"0px"}},{{backgroundPositionY:"{int(END*60)}px",duration:{END},ease:"none"}},0);')

MEDIA.insert(0, f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append('<audio id="a_c" src="assets/audio/cigarras.wav" data-start="0" data-duration="19.00" data-track-index="15" data-volume="0.18"></audio>')
MEDIA.append(f'<audio id="a_p" src="assets/audio/piano.wav" data-start="{T["S4"]:.2f}" data-duration="{END-T["S4"]:.2f}" data-track-index="16" data-volume="0.32"></audio>')
MEDIA.append('<audio id="fx0" src="assets/audio/whump.wav" data-start="17.26" data-duration="0.50" data-track-index="11" data-volume="0.5"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#120c07}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#120c07;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0}
.ovl{position:absolute;inset:0;z-index:4}.vid{position:absolute;object-fit:cover}
.shadeT{left:0;right:0;top:0;height:520px;background:linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,0))}
.shadeB{left:0;right:0;bottom:0;height:900px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.85))}
.red{color:#FF5C4C}.gold{color:#FFD45C}
.t{left:30px;right:30px;text-align:center;text-transform:uppercase;line-height:1.02;white-space:nowrap;text-shadow:0 8px 26px rgba(0,0,0,.9)}
.soft{font-weight:900}
.chipC{left:50%;transform:translateX(-50%);font-family:"J";font-weight:700;font-size:44px;background:#FFD45C;color:#1a1208;padding:12px 26px;border-radius:10px;white-space:nowrap}
.paperBg{inset:0;background:radial-gradient(ellipse at 50% 30%,#f6ead2,#d9c39b 80%)}
.doc{left:120px;right:120px;top:260px;height:700px;background:#fffaf0;border-radius:6px;box-shadow:0 30px 70px rgba(60,40,10,.35);padding:56px 50px;transform:rotate(-2deg);color:#2a2116}
.dt{font-size:44px;color:#2a2116}.ds{font-size:24px;color:#7a6a52;margin-top:10px}
.ln{height:18px;background:#e7dcc6;border-radius:9px;margin-top:34px;width:92%}.ln.s{width:64%}
.q{margin-top:44px;font-size:30px;line-height:1.4;color:#5a4a33}
.cnt{left:50%;transform:translateX(-50%);top:1000px;width:620px;text-align:center;background:#2a2116;border-radius:18px;padding:20px 0}
.cl{font-size:30px;color:#d9c39b}.cv{font-size:120px;color:#FFD45C;line-height:1.15;margin-top:8px}
.stamp{left:50%;margin-left:-280px;width:560px;top:520px;text-align:center;font-size:170px;color:#D63A2A;border:14px solid #D63A2A;border-radius:24px;transform:rotate(-12deg);background:rgba(255,250,240,.6)}
.polaroid{left:150px;top:260px;width:780px;padding:30px 30px 120px;background:#fbf7ee;box-shadow:0 40px 90px rgba(0,0,0,.7)}
.polaroid img{display:block;width:720px;height:900px;object-fit:cover}
.pc{position:absolute;left:0;right:0;bottom:36px;text-align:center;font-size:44px;color:#4a3b28}
.vhs{inset:0;z-index:7;pointer-events:none}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.10) 0 2px,rgba(0,0,0,0) 2px 5px);mix-blend-mode:multiply}
.rec{position:absolute;left:44px;top:48px;font-size:34px;color:#fff;background:rgba(0,0,0,.55);padding:4px 12px;border-radius:6px;text-shadow:0 0 8px rgba(0,0,0,.8)}
.date{position:absolute;right:44px;top:48px;font-size:34px;color:#FFD45C;background:rgba(0,0,0,.55);padding:4px 12px;border-radius:6px;text-shadow:0 0 8px rgba(0,0,0,.8)}
#caps{position:absolute;left:30px;right:30px;top:1380px;height:200px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:72px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Rebobina — nada de piscina</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
