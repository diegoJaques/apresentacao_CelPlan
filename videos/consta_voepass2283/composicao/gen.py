# Consta nos Autos — Voepass 2283 (parafuso chato). 1080x1920. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/vp/'
NARR = 72.55
END = 72.55
FIX = {'Voepaz,': 'Voepass,', 'Cascabel': 'Cascavel', 'de': 'de', 'para': 'pra'}
raw = json.load(open('/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/asr/vp.words.json'))
W = []
for x in raw:
    t = FIX.get(x['text'].strip(), x['text'].strip())
    W.append((t, x['timestamp'][0], min(x['timestamp'][1] or x['timestamp'][0] + .3, NARR)))
# "de gelo" -> "degelo"
for i in range(len(W) - 1):
    if W[i] and W[i+1] and W[i][0] == 'de' and W[i+1][0] == 'gelo' and 61.9 < W[i][1] < 62.4:
        W[i] = ('degelo', W[i][1], W[i+1][2]); W[i+1] = None
W = [w for w in W if w]
CAP_ON = [(8.8, 66.2)]

J = []
def A(s): J.append(s)
def up(sel, t, d=.5, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.6): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.3): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.5}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2.2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.4}},{{autoAlpha:1,scale:1,duration:.22,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{document.querySelector("{sel}").textContent=Math.round(o.v)}}}},{t:.2f});}})();')
def blink(sel, t, n=5, d=.22): A(f'tl.fromTo("{sel}",{{opacity:1}},{{opacity:.25,duration:{d},yoyo:true,repeat:{n},ease:"steps(1)",immediateRender:false}},{t:.2f});')

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
def video(id_, s, e, ms, src='spin'):
    MEDIA.append(f'<video id="{id_}" class="clip vid" src="assets/clips/{src}.webm" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-media-start="{ms:.2f}" data-track-index="1" muted playsinline></video>')
def ovl(id_, s, e, inner):
    H.append(f'<div id="{id_}" class="clip ovl" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="8"><div class="abs inner">{inner}</div></div>')

HOOK = '''<div class="abs shadeT"></div><div class="abs shadeB"></div>
<div class="abs hk1">62 PESSOAS.<br>CAIU <span class="y">GIRANDO</span></div>
<div class="abs hk2" data-layout-allow-overlap>…SEM SAIR DO LUGAR</div>
<div class="abs J tag">CONSTA NOS AUTOS · VOO 2283</div>'''
PLANE_TOP = '<path d="M100 8 Q106 8 107 30 L108 80 L190 96 L190 108 L108 104 L106 160 L130 174 L130 182 L100 178 L70 182 L70 174 L94 160 L92 104 L10 108 L10 96 L92 80 L93 30 Q94 8 100 8 Z" fill="#fff"/>'

# 0 — gancho (1º quadro = capa)
video('v0', 0, 8.80, 0.0)
ovl('o0', 0, 8.80, HOOK + '<div id="al" class="abs chip amber">⚠ O ALARME AVISOU</div>')
hide('#al'); pop('#al', 5.3); blink('#al', 5.8, 7)
out('#o0 .hk1,#o0 .hk2', 5.0, .3)

# 1 — data e rota
scene('s1', 8.80, 14.10, '''<div class="abs sky"></div>
<div id="dt" class="abs J dt">09 · 08 · 2024</div>
<svg class="abs route" viewBox="0 0 1000 600"><path id="rt" d="M120 420 Q500 120 880 300" stroke="#0f1f38" stroke-width="8" stroke-dasharray="20 16" fill="none"/>
<circle cx="120" cy="420" r="18" fill="#0f1f38"/><circle cx="880" cy="300" r="18" fill="#0f1f38"/></svg>
<div id="c1" class="abs J city" style="left:60px;top:1140px">CASCAVEL · PR</div>
<div id="c2" class="abs J city" style="right:60px;top:830px">GUARULHOS · SP</div>
<svg id="pr" class="abs pr" viewBox="0 0 200 190">''' + PLANE_TOP.replace('#fff', '#FF4B3E') + '''</svg>
<div id="vl" class="abs J vl">VOO 2283 · ATR 72</div>''')
hide('#dt', '#c1', '#c2', '#vl', '#pr'); up('#dt', 8.9); fade('#vl', 10.9, .4); fade('#c1', 12.4, .3); fade('#c2', 13.2, .3)
A('tl.fromTo("#pr",{autoAlpha:1,x:0,y:0,rotation:55},{x:560,y:-210,rotation:95,duration:3.0,ease:"none",immediateRender:false},11.00);')

# 2 — gelo na asa (clipe Veo 2)
video('v2', 14.10, 19.70, 3.0, 'gelo')
ovl('o2', 14.10, 19.70, '<div id="ag" class="abs big top">ÁGUA<br>GELADA</div><div id="gn" class="abs chip ice">❄ GELO NAS ASAS</div>')
hide('#ag', '#gn'); up('#ag', 15.1); out('#ag', 17.3, .2); pop('#gn', 17.7)

# 3 — bota de degelo (esquema)
scene('s3', 19.70, 25.30, '''<div class="abs dark"></div>
<div id="bt" class="abs J lbl">BORRACHA NA ASA (BOTA DE DEGELO)</div>
<svg class="abs foil" viewBox="0 0 1000 400">
<path d="M120 200 Q120 120 260 110 L900 170 L900 190 L260 290 Q120 280 120 200 Z" fill="#dfe6ee"/>
<path id="boot" d="M150 200 Q150 135 260 125 L300 125 L300 275 L260 275 Q150 265 150 200 Z" fill="#1a1a1a"/>
<g id="ice"><path d="M40 200 Q40 90 230 70 L250 100 Q130 110 128 200 Q130 290 250 300 L230 330 Q40 310 40 200 Z" fill="#e8f6ff" opacity=".95"/>
<path d="M60 160 L90 150 M55 220 L85 232 M150 85 L170 100 M150 315 L172 300" stroke="#9fd3f5" stroke-width="5"/></g>
<g id="crk" stroke="#0b1220" stroke-width="5" fill="none"><path d="M70 120 L110 170 L90 210 L120 260"/><path d="M180 82 L170 120"/><path d="M170 318 L180 285"/></g></svg>
<div id="inf" class="abs big low">INFLA E<br>RACHA</div>''')
hide('#bt', '#crk', '#inf')
fade('#bt', 20.6, .4)
A('tl.fromTo("#ice",{scale:.6,transformOrigin:"90% 50%",autoAlpha:.3},{scale:1,autoAlpha:1,duration:2.2,ease:"power1.out",immediateRender:false},20.00);')
A('tl.fromTo("#boot",{scale:1},{scale:1.12,transformOrigin:"100% 50%",duration:.35,yoyo:true,repeat:1,ease:"power2.inOut",immediateRender:false},23.55);')
A('tl.set("#crk",{autoAlpha:1},24.05);'); slam('#inf', 24.1)

# 4 — degelo liga/desliga
scene('s4', 25.30, 30.40, '''<div class="abs panel"></div>
<div class="abs sw"><div class="J swl">DEGELO</div><div id="swv" class="J swv" data-layout-allow-overlap>ON</div></div>
<div id="df" class="abs chip red">DAVA DEFEITO</div>
<div id="gf" class="abs big low">O GELO<br><span class="ice2">FICOU</span></div>''')
hide('#df', '#gf'); pop('#df', 26.1)
for k, t in enumerate([26.8, 27.25, 27.5, 27.95, 28.2, 28.6, 29.1]):
    A(f'tl.set("#swv",{{textContent:"{"OFF" if k % 2 == 0 else "ON"}",color:"{"#FF4B3E" if k % 2 == 0 else "#3ddc84"}"}},{t:.2f});')
out('#df', 28.9, .2); slam('#gf', 29.6)

# 5 — perde sustentação, alerta
scene('s5', 30.40, 36.10, '''<div class="abs dark"></div>
<div class="abs gauge"><div class="J gl">SUSTENTAÇÃO</div><div class="gb"><div id="gfill" class="gfill"></div></div></div>
<div class="abs gauge g2"><div class="J gl">VELOCIDADE</div><div class="gb"><div id="vfill" class="gfill"></div></div></div>
<div id="lw" class="abs big low">FICANDO<br>LENTO</div>
<div id="aw" class="abs chip amber" style="top:900px">⚠ ALERTA DE NOVO</div>''')
hide('#lw', '#aw')
A('tl.fromTo("#gfill",{width:"92%",backgroundColor:"#3ddc84"},{width:"38%",backgroundColor:"#FFC83D",duration:2.4,ease:"power1.in",immediateRender:false},30.90);')
A('tl.fromTo("#vfill",{width:"88%",backgroundColor:"#3ddc84"},{width:"22%",backgroundColor:"#FF4B3E",duration:3.0,ease:"power1.in",immediateRender:false},32.60);')
up('#lw', 33.2); out('#lw', 34.3, .2); pop('#aw', 34.5); blink('#aw', 34.9, 5)

# 6 — parafuso chato (clipe Veo 1)
video('v6', 36.10, 40.10, 3.0)
ovl('o6', 36.10, 40.10, '<div class="abs shadeB"></div><div id="pc" class="abs big top r">PARAFUSO<br>CHATO</div>')
hide('#pc'); slam('#pc', 39.0)

# 7 — mergulho x giro deitado
scene('s7', 40.10, 44.60, '''<div class="abs sky2"></div>
<div class="abs col" style="left:40px"><div class="J colt">O ESPERADO</div>
<svg id="dv" class="abs dv" viewBox="0 0 200 190">''' + PLANE_TOP + '''</svg><div id="xx" class="abs xx">✕</div></div>
<div class="abs col" style="right:40px"><div class="J colt y">O QUE ACONTECEU</div>
<svg id="sp" class="abs spn" viewBox="0 0 200 190">''' + PLANE_TOP.replace('#fff', '#FFC83D') + '''</svg></div>
<div id="fo" class="abs big low">COMO UMA<br>FOLHA</div>''')
hide('#xx', '#fo')
A('tl.fromTo("#dv",{y:0,rotation:180},{y:300,rotation:180,duration:1.2,ease:"power2.in",immediateRender:false},40.30);')
A('tl.set("#xx",{autoAlpha:1},41.55);')
A('tl.fromTo("#sp",{rotation:0,y:0},{rotation:1080,y:420,duration:4.3,ease:"none",immediateRender:false},40.20);')
up('#fo', 43.4)

# 8 — o vento vem de baixo
scene('s8', 44.60, 49.90, '''<div class="abs dark"></div>
<svg class="abs foil2" viewBox="0 0 1000 700">
<path d="M150 300 Q150 250 260 240 L880 290 L880 305 L260 370 Q150 360 150 300 Z" fill="#dfe6ee"/>
<g id="fw" stroke="#9fb3c8" stroke-width="10" opacity=".9"><path d="M-40 260 L110 260"/><path d="M-40 300 L110 300"/><path d="M-40 340 L110 340"/></g>
<path id="fwx" d="M10 210 L120 390 M120 210 L10 390" stroke="#FF4B3E" stroke-width="14"/>
<g id="bw" stroke="#FF4B3E" stroke-width="12" fill="#FF4B3E"><path d="M330 660 L330 420"/><path d="M520 660 L520 430"/><path d="M710 660 L710 440"/>
<path d="M305 440 L330 395 L355 440 Z"/><path d="M495 450 L520 405 L545 450 Z"/><path d="M685 460 L710 415 L735 460 Z"/></g></svg>
<div id="vb" class="abs J lbl">VENTO POR BAIXO, NÃO PELA FRENTE</div>
<div id="cn" class="abs big low">COMANDOS<br>QUASE INÚTEIS</div>''')
hide('#fwx', '#bw', '#vb', '#cn')
A('tl.set("#fwx",{autoAlpha:1},46.90);')
A('tl.fromTo("#bw",{autoAlpha:0,y:120},{autoAlpha:1,y:0,duration:.6,ease:"power2.out",immediateRender:false},45.70);')
fade('#vb', 45.9, .4); up('#cn', 48.2)

# 9 — cerca de um minuto, Vinhedo
video('v9', 49.90, 54.10, 5.0)
ovl('o9', 49.90, 54.10, '<div class="abs shadeT"></div><div class="abs mn"><span id="mn">0</span><small>SEGUNDOS GIRANDO · ≈ 1 MIN</small></div><div id="vh" class="abs chip">VINHEDO · SP</div>')
hide('#vh'); count('#mn', 50.2, 0, 60, 1.6); pop('#vh', 53.2)

# 10 — 62 vidas
scene('s10', 54.10, 58.50, '''<div class="abs black"></div>
<div id="n62" class="abs n62">62</div><div id="nb" class="abs J sub">NINGUÉM A BORDO SOBREVIVEU</div>
<div id="nc" class="abs J sub2">NO CHÃO, NENHUM MORADOR SE FERIU</div>''')
hide('#n62', '#nb', '#nc'); fade('#n62', 54.15, .7); fade('#nb', 54.8, .5); fade('#nc', 56.2, .5)

# 11 — relatório final, 19 fatores
scene('s11', 58.50, 66.30, '''<div class="abs paper"></div>
<div class="abs doc"><div class="J dh">RELATÓRIO FINAL · CENIPA</div>
<div class="dn"><span id="nf">0</span> FATORES</div>
<div id="f1" class="J fi">❄ GELO SEVERO</div><div id="f2" class="J fi">⚙ DEGELO COM DEFEITO</div>
<div id="f3" class="J fi">👨‍✈️ TRIPULAÇÃO</div><div id="f4" class="J fi">🏢 A EMPRESA</div><div id="f5" class="J fi">🔍 A FISCALIZAÇÃO</div></div>''')
hide('#f1', '#f2', '#f3', '#f4', '#f5')
count('#nf', 59.4, 0, 19, 1.1)
for k, t in enumerate([61.4, 62.1, 63.3, 64.4, 65.1]): up(f'#f{k+1}', t, .35, 24)

# 12 — 2 anos depois → volta ao 1º quadro (loop)
video('v12', 66.30, END, 0.0)
ovl('o12', 66.30, END, HOOK.replace('class="abs hk1"', 'id="hk1b" class="abs hk1"').replace('class="abs hk2"', 'id="hk2b" class="abs hk2"') + '<div id="vt" class="abs chip">2 ANOS DEPOIS</div>')
hide('#vt', '#hk1b', '#hk2b'); pop('#vt', 66.35); out('#vt', 68.9, .2); fade('#hk1b', 69.3, .3); fade('#hk2b', 71.9, .2)

# áudio
MEDIA.append(f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>')
MEDIA.append('<audio id="a_s0" src="assets/audio/spin_sfx.wav" data-start="0" data-duration="8.80" data-track-index="12" data-volume="0.30"></audio>')
MEDIA.append('<audio id="a_s6" src="assets/audio/spin_sfx.wav" data-start="36.10" data-duration="4.00" data-media-start="3.00" data-track-index="12" data-volume="0.30"></audio>')
MEDIA.append('<audio id="a_s9" src="assets/audio/spin_sfx.wav" data-start="49.90" data-duration="4.20" data-media-start="5.00" data-track-index="12" data-volume="0.25"></audio>')
MEDIA.append(f'<audio id="a_s12" src="assets/audio/spin_sfx.wav" data-start="66.30" data-duration="{END-66.3:.2f}" data-track-index="13" data-volume="0.25"></audio>')
MEDIA.append('<audio id="a_al" src="assets/audio/alerta.wav" data-start="5.30" data-duration="1.60" data-track-index="14" data-volume="0.22"></audio>')
MEDIA.append('<audio id="a_al2" src="assets/audio/alerta.wav" data-start="34.50" data-duration="1.60" data-track-index="14" data-volume="0.22"></audio>')
MEDIA.append('<audio id="a_g" src="assets/audio/gelo.wav" data-start="24.05" data-duration="0.50" data-track-index="15" data-volume="0.50"></audio>')
for k, t in enumerate([26.8, 27.25, 27.5, 27.95, 28.2, 28.6, 29.1]):
    MEDIA.append(f'<audio id="a_c{k}" src="assets/audio/clique.wav" data-start="{t:.2f}" data-duration="0.12" data-track-index="{16 + k % 2}" data-volume="0.45"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ovl{position:absolute;inset:0;z-index:4}.vid{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.y{color:#FFC83D}.r{color:#FF4B3E}
.shadeT{left:0;right:0;top:0;height:640px;background:linear-gradient(rgba(0,0,0,.8),rgba(0,0,0,0))}
.shadeB{left:0;right:0;bottom:0;height:760px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.82))}
.hk1{left:40px;right:40px;top:150px;text-align:center;font-size:96px;line-height:1.02;text-shadow:0 8px 26px rgba(0,0,0,.9)}
.hk2{left:30px;right:30px;top:1250px;text-align:center;font-size:84px;color:#FF4B3E;text-shadow:0 8px 26px rgba(0,0,0,.95);-webkit-text-stroke:3px #000;paint-order:stroke fill}
.tag{left:0;right:0;top:80px;text-align:center;font-size:28px;color:#FFC83D;letter-spacing:4px}
.chip{left:50%;transform:translateX(-50%);top:420px;white-space:nowrap;font-family:"J";font-weight:700;font-size:44px;background:#FFC83D;color:#111;padding:14px 26px;border-radius:10px}
.chip.amber{background:#FFB020}.chip.red{background:#FF4B3E;color:#fff;top:300px}.chip.ice{background:#bfe6ff;top:1150px}
.big{left:40px;right:40px;top:360px;text-align:center;font-size:120px;line-height:1;text-shadow:0 8px 30px rgba(0,0,0,.85)}
.big.top{top:250px}.big.low{top:1090px}
.sky{inset:0;background:linear-gradient(#5f8fc4,#9cc3e6 60%,#d9e8f2)}
.sky2{inset:0;background:linear-gradient(#0f1f38,#29507e 70%,#4f7fae)}
.dark{inset:0;background:radial-gradient(ellipse at 50% 35%,#1d2633,#06080b 80%)}
.panel{inset:0;background:radial-gradient(ellipse at 50% 40%,#1e242e,#07090c 80%)}
.black{inset:0;background:#000}.paper{inset:0;background:#0d1117}
.dt{left:0;right:0;top:300px;text-align:center;font-size:110px;color:#0f1f38}
.route{left:40px;top:640px;width:1000px;height:600px}
.city{font-size:40px;color:#0f1f38}
.pr{left:110px;top:980px;width:130px;height:124px}
.vl{left:0;right:0;top:500px;text-align:center;font-size:48px;color:#0f1f38}
.lbl{left:40px;right:40px;top:330px;text-align:center;font-size:40px;color:#9fd3f5}
.foil{left:40px;top:540px;width:1000px;height:400px}
.sw{left:180px;right:180px;top:500px;background:#000;border:6px solid #333;border-radius:20px;padding:30px;text-align:center}
.swl{font-size:48px;color:#aab}.swv{font-size:200px;color:#3ddc84;line-height:1.15;margin-top:24px}
.ice2{color:#9fd3f5}
.gauge{left:120px;right:120px;top:380px}.gauge.g2{top:640px}
.gl{font-size:42px;color:#cfd8e3;margin-bottom:18px}.gb{height:70px;border:5px solid #445;border-radius:14px;overflow:hidden;background:#111}
.gfill{height:100%;width:90%;background:#3ddc84}
.col{top:300px;width:480px;height:1000px;text-align:center}.colt{font-size:42px;color:#cfe0f5}
.dv{left:90px;top:110px;width:300px;height:285px}.spn{left:90px;top:110px;width:300px;height:285px}
.xx{left:150px;top:420px;font-size:180px;color:#FF4B3E;line-height:1}
.foil2{left:40px;top:420px;width:1000px;height:700px}
#vb{top:300px;color:#FF8A80}
.mn{left:0;right:0;top:220px;text-align:center}.mn span{display:block;font-size:200px;line-height:1;color:#FFC83D;text-shadow:0 8px 30px #000}
.mn small{display:block;font-family:"J";font-size:44px;margin-top:10px;text-shadow:0 4px 18px #000}
#vh{top:640px}
.n62{left:0;right:0;top:420px;text-align:center;font-size:360px;line-height:1}
.sub{left:0;right:0;top:860px;text-align:center;font-size:46px;color:#ddd}
.sub2{left:0;right:0;top:1010px;text-align:center;font-size:40px;color:#9fd3f5}
.doc{left:90px;right:90px;top:220px;background:#f3f1ea;color:#111;border-radius:14px;padding:44px 50px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.dh{font-size:36px;color:#555;border-bottom:4px solid #111;padding-bottom:14px}
.dn{font-size:130px;line-height:1.1;margin:18px 0 10px}.dn span{color:#C62828}
.fi{font-size:46px;margin:14px 0}
#caps{position:absolute;left:40px;right:40px;top:1480px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:76px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Voepass 2283</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
