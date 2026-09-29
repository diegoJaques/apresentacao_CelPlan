# Consta nos Autos — Mamonas Assassinas: a curva para o lado errado (Short 1080x1920). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/mamonas/'
END = 34.6
FIX = {'11': 'onze', '.15': 'e quinze', 'a': None, 'remete.': None, 'Torre': 'torre', '96,': '96'}
raw = json.load(open(P + 'words.json'))
W = []
for i, w in enumerate(raw):
    t = w['text'].strip(); s, e = w['timestamp']
    if s >= END or t == '...': continue
    if t == 'a' and i+1 < len(raw) and raw[i+1]['text'].strip() == 'remete.':
        W.append(('arremete.', s, raw[i+1]['timestamp'][1])); continue
    if t == 'remete.': continue
    W.append((FIX.get(t, t) if t in FIX and FIX[t] else t, s, e))

H0, S1, S2, S3, S4, S5, LOOP = 0, 4.8, 11.4, 16.6, 26.2, 30.4, 33.4
CAP_ON = [(S1 + .1, LOOP)]

J = []
def A(s): J.append(s)
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.4)"}},{t:.2f});')
def up(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{opacity:0,y:60}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6}},{{opacity:1,scale:1,duration:.2,ease:"power4.out"}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def hide(sel, t=0): A(f'tl.set("{sel}",{{opacity:0}},{t:.2f});')
def draw(sel, t, d): A(f'tl.fromTo("{sel}",{{strokeDashoffset:1400}},{{strokeDashoffset:0,duration:{d},ease:"power1.inOut"}},{t:.2f});')

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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFD400"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

def clip(id_, s, e, inner):
    return f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2">{inner}</section>'

H = []
# ---------- GANCHO (quadro 0 = capa; volta no fim para o loop) ----------
H.append('''<div id="hook">
<div id="hTop" class="abs t" style="top:120px;font-size:66px">OS MAMONAS MORRERAM</div>
<div id="hPh" class="abs photo" style="left:130px;top:250px;width:820px;height:820px;transform:rotate(-2deg)"><img src="assets/img/banda1.jpg"></div>
<div id="hBot" class="abs t" style="top:1120px;font-size:72px">POR CAUSA DE<br><span class="red" style="font-size:118px">← UMA CURVA</span></div>
</div>''')
A('tl.fromTo("#hPh img",{scale:1},{scale:1.06,duration:4.8,ease:"none"},0);')
A('tl.fromTo("#hBot .red",{x:0},{x:-18,duration:.3,yoyo:true,repeat:7,ease:"sine.inOut"},0.2);')
A(f'tl.set("#hook",{{autoAlpha:0}},{S1:.2f});')
A(f'tl.fromTo("#hook",{{autoAlpha:0}},{{autoAlpha:1,duration:.25,immediateRender:false}},{LOOP:.2f});')
A(f'tl.fromTo("#hPh img",{{scale:1.06}},{{scale:1,duration:.3,immediateRender:false}},{LOOP:.2f});')

# ---------- S1: último show ----------
H.append(clip('sc1', S1, S2, '''
<div id="s1d" class="abs chipC">02 · MAR · 1996</div>
<div id="s1p" class="abs photo" style="left:60px;top:300px;width:960px;height:720px"><img src="assets/img/banda2.jpg"></div>
<div id="s1s" class="abs tag" style="left:100px;top:930px">ÚLTIMO SHOW · BRASÍLIA</div>
<div id="s1j" class="abs strip" style="top:1110px">✈ LEARJET 25D · BRASÍLIA → GUARULHOS</div>
'''))
up('#s1d', S1+.1); A(f'tl.fromTo("#s1p img",{{scale:1.12,x:30}},{{scale:1,x:0,duration:{S2-S1:.2f},ease:"none"}},{S1:.2f});')
hide('#s1s'); hide('#s1j'); pop('#s1s', 7.28); up('#s1j', 9.06)

# ---------- S2: 23h15 e a arremetida ----------
H.append(clip('sc2', S2, S3, '''
<div id="s2c" class="abs t J" style="top:170px;font-size:130px;color:#FFD400">23:15</div>
<div id="s2f" class="abs vframe" style="left:0;top:450px;width:1080px;height:608px"></div>
<div id="s2l" class="abs tag" style="left:40px;top:1080px;background:#111;color:#bbb;border:2px solid #444;font-size:26px">imagem ilustrativa · arremetida</div>
<div id="s2a" class="abs t" style="top:340px;font-size:64px;color:#fff">ARREMETEU ↗</div>
'''))
up('#s2c', S2+.05); hide('#s2a'); slam('#s2a', 15.6)

# ---------- S3: o mapa ----------
MAP = '''<svg class="abs" style="left:40px;top:250px" width="1000" height="980" viewBox="0 0 1000 980">
<defs><pattern id="g" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="2"/></pattern>
<marker id="ag" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#2EE66B"/></marker>
<marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#FF3B3B"/></marker></defs>
<rect width="1000" height="980" rx="28" fill="#0b1118"/><rect width="1000" height="980" rx="28" fill="url(#g)"/>
<g id="serra"><path d="M0 330 L70 220 L130 280 L210 150 L290 250 L360 170 L450 290 L470 330 Z" fill="#2a3d2a"/><path d="M0 330 L70 220 L130 280 L210 150 L290 250 L360 170 L450 290 L470 330" fill="none" stroke="#6f9b6f" stroke-width="4"/></g>
<text id="serraT" x="40" y="120" font-family="M" font-weight="900" font-size="46" fill="#9fc79f">SERRA DA CANTAREIRA</text>
<rect x="360" y="560" width="400" height="34" rx="6" fill="#3a4450"/><path d="M380 577 H740" stroke="#fff" stroke-width="4" stroke-dasharray="26 18"/>
<text x="560" y="650" text-anchor="middle" font-family="J" font-weight="700" font-size="34" fill="#c7d0da">AEROPORTO DE GUARULHOS</text>
<path id="appr" d="M40 577 H520" stroke="#fff" stroke-width="6" stroke-dasharray="14 12" fill="none" opacity=".7"/>
<path id="pg" d="M600 577 C780 577 870 640 890 860" stroke="#2EE66B" stroke-width="12" fill="none" stroke-dasharray="1400" marker-end="url(#ag)"/>
<path id="pr" d="M600 577 C760 577 800 440 660 360 C540 290 400 300 300 290" stroke="#FF3B3B" stroke-width="12" fill="none" stroke-dasharray="1400" marker-end="url(#ar)"/>
<circle id="boom" cx="285" cy="288" r="30" fill="#FF3B3B"/>
</svg>'''
H.append(clip('sc3', S3, S4, f'''
{MAP}
<div id="s3t" class="abs chipC" style="top:150px;background:#2EE66B">TORRE: VIRE À DIREITA</div>
<div id="s3g" class="abs lab" style="left:660px;top:990px;color:#2EE66B">DIREITA<br><small>área livre</small></div>
<div id="s3r" class="abs lab" style="left:610px;top:470px;color:#FF6161">ESQUERDA</div>
<div id="s3b" class="abs chipC" style="top:1250px;background:#FF3B3B;color:#fff">ABAIXO DA ALTITUDE MÍNIMA</div>
<div id="s3dk" class="abs" style="inset:0;background:radial-gradient(ellipse at 28% 30%,rgba(0,0,0,0) 0,rgba(0,0,0,.75) 45%)"></div>
'''))
for s in ['#s3t', '#s3g', '#s3r', '#s3b', '#s3dk', '#boom']: hide(s)
A('tl.set("#pg",{strokeDashoffset:1400,opacity:0},0);tl.set("#pr",{strokeDashoffset:1400,opacity:0},0);tl.set("#pg",{opacity:1},17.3);tl.set("#pr",{opacity:1},19.5);tl.set("#serraT",{opacity:.35},0);')
pop('#s3t', 16.84); draw('#pg', 17.3, 1.0); up('#s3g', 17.9)
out('#s3t', 19.2); draw('#pr', 19.5, 1.4); slam('#s3r', 20.28)
up('#s3b', 21.04); out('#s3b', 22.6)
A('tl.fromTo("#s3dk",{opacity:0},{opacity:1,duration:.6},22.7);')
A('tl.to("#serraT",{opacity:1,fill:"#ffffff",duration:.3},24.88);')
A('tl.fromTo("#boom",{opacity:0,scale:.2,transformOrigin:"50% 50%"},{opacity:1,scale:2.2,duration:.35,ease:"power2.out"},25.9);')

# ---------- S4: 23h16 ----------
H.append(clip('sc4', S4, S5, '''
<div id="s4f" class="abs" style="inset:0;background:#fff"></div>
<div id="s4c" class="abs t J" style="top:160px;font-size:130px;color:#FF3B3B">23:16</div>
<div id="s4m" class="abs t" style="top:340px;font-size:150px">9 MORTOS</div>
<div id="s4p" class="abs photo gray" style="left:250px;top:560px;width:580px;height:580px"><img src="assets/img/banda1.jpg"></div>
<div id="s4b" class="abs tag" style="left:50%;top:1090px;transform:translateX(-50%);white-space:nowrap">A BANDA INTEIRA</div>
'''))
A(f'tl.fromTo("#s4f",{{opacity:.9}},{{opacity:0,duration:.35}},{S4+.12:.2f});')
slam('#s4c', 26.34)
for s in ['#s4m', '#s4p', '#s4b']: hide(s)
slam('#s4m', 28.04); up('#s4p', 29.0); pop('#s4b', 29.34)

# ---------- S5: Cenipa ----------
H.append(clip('sc5', S5, LOOP, '''
<div id="s5c" class="abs chipC" style="top:260px">RELATÓRIO DO CENIPA</div>
<div id="s5a" class="abs t" style="top:520px;font-size:104px">TRIPULAÇÃO<br><span class="red">EXAUSTA</span></div>
<div id="s5b" class="abs t" style="top:860px;font-size:58px;color:#ccc">+ UMA CURVA PRO<br>LADO ERRADO</div>
'''))
up('#s5c', S5+.1); hide('#s5a'); hide('#s5b'); slam('#s5a', 32.5); up('#s5b', 32.9)

SFX = [('whump', .03, .5, .45), ('whump', 20.28, .5, .5), ('static', 25.9, .9, .35), ('whump', 26.34, .5, .7), ('whump', 28.04, .5, .5), ('whump', 32.5, .5, .5), ('whump', LOOP, .5, .45)]
media = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<video id="v_arr" class="clip vid" src="assets/clips/arremete.webm" data-start="{S2:.2f}" data-duration="{S3-S2:.2f}" data-track-index="5" muted playsinline style="left:0;top:450px;width:1080px;height:608px"></video>',
         f'<audio id="a_mot" src="assets/audio/motor.wav" data-start="{S2-.2:.2f}" data-duration="8.40" data-track-index="14" data-volume="0.45"></audio>']
for i, (f, t, d, v) in enumerate(SFX):
    media.append(f'<audio id="fx{i}" src="assets/audio/{f}.wav" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="{11+i%3}" data-volume="{v}"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#07090c}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#1a1f28 0%,#07090c 70%);font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0}
#hook{position:absolute;inset:0}
.red{color:#FF4545}
.t{left:30px;right:30px;text-align:center;text-transform:uppercase;line-height:1.02;white-space:nowrap;text-shadow:0 10px 30px #000}
.photo{overflow:hidden;border:8px solid #fff;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.7)}
.photo img{display:block;width:100%;height:100%;object-fit:cover}
.gray img{filter:grayscale(1) contrast(1.1)}
.chipC{left:50%;transform:translateX(-50%);top:170px;font-family:"J";font-weight:700;font-size:40px;background:#FFD400;color:#111;padding:12px 26px;border-radius:10px;white-space:nowrap}
.tag{font-weight:900;font-size:40px;background:#FFD400;color:#111;padding:10px 22px;border-radius:10px}
.strip{left:50%;transform:translateX(-50%);font-family:"J";font-weight:700;font-size:34px;border:3px solid rgba(255,255,255,.6);padding:10px 22px;border-radius:10px;white-space:nowrap;background:rgba(0,0,0,.5)}
.vframe{border-top:6px solid #FFD400;border-bottom:6px solid #FFD400}
.vid{position:absolute;object-fit:cover}
.lab{font-weight:900;font-size:56px;line-height:1;text-shadow:0 6px 20px #000}
.lab small{font-size:34px;font-weight:700}
#caps{position:absolute;left:30px;right:30px;top:1370px;height:200px}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:76px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Mamonas — a curva errada</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(H)}
{''.join(media)}
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
