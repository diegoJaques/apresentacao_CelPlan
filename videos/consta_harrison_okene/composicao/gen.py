# Consta nos Autos — Harrison Okene: 60 horas no fundo do mar (Short 1080x1920). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/okene/'
END = 56.05
raw = [(w['text'].strip(), w['timestamp'][0], w['timestamp'][1]) for w in json.load(open(P + 'words.json'))]
FIX = {'adorou': 'agarrou', 'para': 'pra', 'NIGERIA': 'Nigéria,', 'exprimido': 'espremido', 'Gas': 'gás', 'sobre': 'sob'}
W = []
i = 0
while i < len(raw):
    t, s, e = raw[i]
    if t == 'O' and i+1 < len(raw) and raw[i+1][0].startswith("'Kane"):
        W.append(('Okene,', s, raw[i+1][2])); i += 2; continue
    if t == 'envenená' and i+1 < len(raw) and raw[i+1][0] == '-lo.':
        W.append(('envenená-lo.', s, raw[i+1][2])); i += 2; continue
    W.append((FIX.get(t, t), s, min(e, END))); i += 1

T = dict(S1=4.45, S2=14.45, S3=23.4, S4=31.0, S5=41.6, S6=46.2, S7=52.7)
CAP_ON = [(T['S1'], END)]

J = []
def A(s): J.append(s)
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.4)"}},{t:.2f});')
def up(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{opacity:0,y:60}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6}},{{opacity:1,scale:1,duration:.2,ease:"power4.out"}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{opacity:0}},0);')
def count(sel, t, frm, to, d, fmt='v'):
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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#3DE8FF"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

def clip(id_, s, e, inner):
    return f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2">{inner}</section>'

H = []
MEDIA = []
# ---------- GANCHO (quadro 0 = aperto de mão) ----------
H.append(f'''<div id="hook">
<img id="hImg" class="abs full" src="assets/img/grip.jpg">
<div class="abs shadeT"></div><div class="abs shadeB"></div>
<div id="hTop" class="abs t" style="top:140px;font-size:70px">ELE DESCEU PRA<br><span class="cy">BUSCAR CORPOS</span></div>
<div id="hBot" class="abs t" style="top:1230px;font-size:76px">UMA MÃO<br><span class="cy">AGARROU A DELE</span></div>
<div class="abs ilu">reconstituição ilustrativa</div>
</div>''')
MEDIA.append('<video id="v_hook" class="clip vid" src="assets/clips/hook.webm" data-start="2.70" data-duration="1.69" data-track-index="5" muted playsinline style="left:0;top:0;width:1080px;height:1920px"></video>')
A('tl.fromTo("#hImg",{scale:1.0},{scale:1.08,duration:2.7,ease:"none"},0);')
A('tl.fromTo("#hBot .cy",{scale:1},{scale:1.06,duration:.35,yoyo:true,repeat:5,ease:"sine.inOut"},0.1);')
A('tl.set("#hImg",{autoAlpha:0},2.70);tl.set("#hImg",{autoAlpha:1,scale:1},4.39);')
A(f'tl.set("#hook",{{autoAlpha:0}},{T["S1"]:.2f});')
A(f'tl.fromTo("#hook",{{autoAlpha:0}},{{autoAlpha:1,duration:.12,immediateRender:false}},{END-.12:.2f});')

# ---------- S1: Nigéria, o rebocador ----------
TUG = '''<div class="tug"><i class="cab"></i><i class="cab2"></i><i class="stk"></i><i class="hull"></i></div>'''
CREW = ''.join(f'<i id="cr{k}" class="crew"></i>' for k in range(12))
H.append(clip('sc1', T['S1'], T['S2'], f'''
<div class="abs" style="inset:0;background:linear-gradient(#0b1a2e 0%,#0b1a2e 37%,#06314a 37%,#021520 100%)"></div>
<div id="sea" class="abs"></div>
<div id="s1c" class="abs chipC">NIGÉRIA · GOLFO DA GUINÉ · 2013</div>
<div id="tugW" class="abs" style="left:330px;top:560px;width:420px;height:200px">{TUG}</div>
<div id="dep" class="abs depth"><div class="J" style="font-size:28px;color:#8fd">PROFUNDIDADE</div><div><span id="depN">0</span> m</div></div>
<div id="crew" class="abs crewRow">{CREW}</div>
<div id="s1m" class="abs t" style="top:1130px;font-size:60px"><span class="red">11 MORREM</span> · <span class="cy">1 ESCAPA</span></div>
'''))
up('#s1c', T['S1']+.05)
A(f'tl.fromTo("#tugW",{{y:0,rotation:-3}},{{y:-8,rotation:3,duration:.7,yoyo:true,repeat:3,ease:"sine.inOut"}},{T["S1"]:.2f});')
A('tl.to("#tugW",{rotation:180,y:40,duration:.9,ease:"power2.in"},7.34);')
A('tl.to("#tugW",{y:560,scale:.7,duration:2.6,ease:"power1.in"},8.28);')
hide('#dep'); up('#dep', 9.6); count('#depN', 9.7, 0, 30, 1.3, 'Math.round(v)')
hide('#crew', '#s1m')
A('tl.set("#crew",{opacity:1},12.02);tl.fromTo("#crew i",{opacity:0,scale:0},{opacity:1,scale:1,duration:.12,stagger:.03},12.02);')
A('tl.to("#crew i:not(#cr11)",{background:"#4a1515",opacity:.45,duration:.3,stagger:.04},12.6);')
A('tl.to("#cr11",{background:"#3DE8FF",boxShadow:"0 0 30px #3DE8FF",scale:1.3,duration:.3},13.56);')
up('#s1m', 13.6)

# ---------- S2: o sobrevivente e o bolsão ----------
H.append(clip('sc2', T['S2'], T['S3'], '''
<div id="s2n" class="abs card2" style="top:150px">HARRISON OKENE · 29 ANOS<br><small>cozinheiro do rebocador</small></div>
<div id="s2b" class="abs tag" style="left:50%;top:395px;transform:translateX(-50%)">estava no banheiro quando o barco virou</div>
<div id="room" class="abs">
 <div class="ceil"></div><i class="desk"></i><i class="chair"></i><i class="pipe"></i>
 <div id="air" class="air"></div>
 <div id="head" class="head"></div>
 <div id="water" class="water"></div>
 <div id="ruler" class="ruler"><span>~1,2 m</span></div>
</div>
<div id="dark" class="abs" style="inset:0;background:radial-gradient(circle at 50% 62%,rgba(0,0,0,0) 0,rgba(0,0,0,0) 110px,rgba(0,0,0,.94) 260px)"></div>
<div id="s2a" class="abs t" style="top:1130px;font-size:62px">BOLSÃO DE AR</div>
'''))
up('#s2n', 15.5); hide('#s2b'); pop('#s2b', 17.0)
hide('#dark', '#ruler', '#s2a')
A('tl.fromTo("#dark",{opacity:0},{opacity:1,duration:.4},17.8);')
A('tl.fromTo("#dark",{backgroundPosition:"0px 0px"},{backgroundPosition:"0px 0px",duration:.1},17.8);')
A('tl.fromTo("#dark",{x:-260,y:-80},{x:220,y:40,duration:1.6,ease:"sine.inOut",yoyo:true,repeat:1},18.9);')
A('tl.to("#dark",{opacity:0,duration:.5},21.2);')
A('tl.fromTo("#air",{boxShadow:"inset 0 0 0 0 rgba(61,232,255,0)"},{boxShadow:"inset 0 0 60px 10px rgba(61,232,255,.55)",duration:.5},21.3);')
up('#ruler', 22.3); slam('#s2a', 21.3)
A('tl.fromTo("#water",{backgroundPositionX:"0px"},{backgroundPositionX:"-400px",duration:9,ease:"none"},14.45);')

# ---------- S3: a física (pressão 4x) ----------
DOTS1 = ''.join('<i></i>' for _ in range(9))
DOTS4 = ''.join('<i></i>' for _ in range(36))
H.append(clip('sc3', T['S3'], T['S4'], f'''
<div id="s3h" class="abs chipC" style="top:150px">A FÍSICA</div>
<div id="gauge" class="abs gauge"><div class="gface"></div><div id="needle" class="needle"></div><div class="gl J">PRESSÃO</div><div class="gv J"><span id="atm">1</span> atm</div></div>
<div id="box1" class="abs mbox" style="left:120px">{DOTS1}<b>SUPERFÍCIE</b></div>
<div id="box4" class="abs mbox dense" style="left:580px">{DOTS4}<b>30 METROS</b></div>
<div id="s3x" class="abs t" style="top:1210px;font-size:84px"><span class="cy">4×</span> MAIS OXIGÊNIO</div>
'''))
up('#s3h', T['S3']+.05); up('#gauge', 24.3)
A('tl.fromTo("#needle",{rotation:-120},{rotation:60,duration:1.6,ease:"power2.out"},25.1);')
count('#atm', 25.1, 1, 4, 1.6, 'Math.round(v)')
hide('#box1', '#box4', '#s3x'); up('#box1', 27.8); up('#box4', 28.3)
A('tl.fromTo("#box4 i",{opacity:0,scale:0},{opacity:1,scale:1,duration:.1,stagger:.02},28.4);')
slam('#s3x', 29.4)

# ---------- S4: gás carbônico ----------
H.append(clip('sc4', T['S4'], T['S5'], '''
<div id="s4p" class="abs t" style="top:170px;font-size:84px"><span class="red">MAS TINHA<br>UM PROBLEMA</span></div>
<div id="meter" class="abs meter"><div id="fill" class="fill"></div><div class="lim"><span>5% · TÓXICO</span></div><div class="ml J">CO₂</div><div class="mv J"><span id="co2">0,0</span>%</div></div>
<div id="s4g" class="abs t" style="top:1120px;font-size:72px">GÁS <span class="red">CARBÔNICO</span></div>
<div id="s4c" class="abs tag" style="left:50%;top:1130px;transform:translateX(-50%)">segundo cientistas</div>
<div id="rip" class="abs rip"></div>
<div id="s4t" class="abs t" style="top:1120px;font-size:84px"><span class="cy">+ TEMPO</span></div>
'''))
slam('#s4p', 31.12)
hide('#meter', '#s4g', '#s4c', '#rip', '#s4t')
up('#meter', 32.2)
A('tl.fromTo("#fill",{height:"0%"},{height:"88%",duration:3.0,ease:"power1.in"},32.4);')
count('#co2', 32.4, 0, 4.4, 3.0, 'v.toFixed(1).replace(".",",")')
A('tl.to("#fill",{background:"#FF4545",duration:.3},34.9);')
slam('#s4g', 35.06); out('#s4g', 36.05)
pop('#s4c', 36.16); out('#s4c', 37.2)
A('tl.fromTo("#rip",{opacity:0,scale:.4},{opacity:.9,scale:1.4,duration:1.2,repeat:2,ease:"power1.out"},37.3);')
A('tl.to("#fill",{height:"55%",background:"#3DE8FF",duration:2.2,ease:"power2.out"},38.4);')
count('#co2', 38.4, 4.4, 2.8, 2.2, 'v.toFixed(1).replace(".",",")')
slam('#s4t', 40.68)

# ---------- S5: 60 horas / não pode subir ----------
H.append(clip('sc5', T['S5'], T['S6'], '''
<div class="abs" style="inset:0;background:#000"></div>
<div id="clk" class="abs t J" style="top:560px;font-size:170px;color:#3DE8FF">00h</div>
<div id="s5l" class="abs t" style="top:790px;font-size:52px;color:#9ab">NO ESCURO</div>
<div id="s5r" class="abs chipC" style="top:260px;background:#3DE8FF">🔦 O RESGATE CHEGA</div>
<div id="s5n" class="abs t" style="top:980px;font-size:96px"><span class="red">✗ NÃO PODE<br>SUBIR</span></div>
'''))
count('#clk', 41.86, 0, 60, 1.4, 'String(Math.round(v)).padStart(2,"0")+"h"')
up('#s5l', 42.6)
hide('#s5r', '#s5n'); pop('#s5r', 43.84); slam('#s5n', 45.26)

# ---------- S6: descompressão ----------
H.append(clip('sc6', T['S6'], T['S7'], '''
<div id="s6h" class="abs t" style="top:170px;font-size:66px">SUBIR DIRETO<br><span class="red">PODIA MATAR</span></div>
<div id="bub" class="abs bubs">''' + ''.join(f'<i style="left:{40+k*70}px;animation:none"></i>' for k in range(10)) + '''</div>
<div id="cham" class="abs chamber"><div class="port"></div><div class="J lbl">CÂMARA DE DESCOMPRESSÃO</div></div>
<div id="s6d" class="abs t" style="top:1120px;font-size:96px"><span class="cy">+3 DIAS</span></div>
'''))
up('#s6h', 46.5)
A('tl.fromTo("#bub i",{y:0,opacity:0},{y:-260,opacity:1,duration:1.4,stagger:.08,ease:"power1.out"},47.4);')
hide('#cham', '#s6d'); up('#cham', 49.9); slam('#s6d', 50.48)

# ---------- S7: a luz na água (vídeo) → loop ----------
MEDIA.append(f'<video id="v_fim" class="clip vid" src="assets/clips/fim.webm" data-start="{T["S7"]:.2f}" data-duration="{END-T["S7"]:.2f}" data-track-index="5" muted playsinline style="left:0;top:0;width:1080px;height:1920px"></video>')
H.append('<div id="iluF" class="clip abs ilu" data-start="%.2f" data-duration="%.2f" data-track-index="6">reconstituição ilustrativa</div>' % (T['S7'], END - T['S7']))

SFX = [('whump', 2.72, .5, .55), ('whump', 7.34, .5, .6), ('whump', 12.02, .5, .45), ('whump', 21.3, .5, .35), ('whump', 29.4, .5, .5),
       ('whump', 31.12, .5, .55), ('static', 35.0, .9, .3), ('whump', 40.68, .5, .45), ('ping', 43.84, .35, .35), ('whump', 45.26, .5, .6), ('whump', 50.48, .5, .5)]
MEDIA.insert(0, f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_bed" src="assets/audio/bed.wav" data-start="0" data-duration="{END:.2f}" data-track-index="15" data-volume="0.35"></audio>')
for i, (f, t, d, v) in enumerate(SFX):
    MEDIA.append(f'<audio id="fx{i}" src="assets/audio/{f}.wav" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="{11+i%3}" data-volume="{v}"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#020a10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#08243a 0%,#020a10 70%);font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0}
#hook{position:absolute;inset:0;z-index:3}.full{left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.shadeT{left:0;right:0;top:0;height:520px;background:linear-gradient(rgba(0,0,0,.85),rgba(0,0,0,0))}
.shadeB{left:0;right:0;bottom:0;height:820px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.9))}
.cy{color:#3DE8FF}.red{color:#FF5A5A}
.t{left:30px;right:30px;text-align:center;text-transform:uppercase;line-height:1.02;white-space:nowrap;text-shadow:0 10px 30px #000}
.ilu{left:30px;top:40px;font-family:"J";font-weight:700;font-size:22px;color:rgba(255,255,255,.75);background:rgba(0,0,0,.5);padding:6px 12px;border-radius:6px}
.vid{position:absolute;object-fit:cover}
.chipC{left:50%;transform:translateX(-50%);top:150px;font-family:"J";font-weight:700;font-size:38px;background:#FFD400;color:#111;padding:12px 24px;border-radius:10px;white-space:nowrap}
.tag{font-weight:700;font-size:36px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.35);color:#fff;padding:10px 22px;border-radius:12px;white-space:nowrap}
.card2{left:90px;right:90px;text-align:center;font-weight:900;font-size:56px;line-height:1.1;background:rgba(6,30,46,.9);border:3px solid #3DE8FF;border-radius:20px;padding:22px}
.card2 small{font-size:34px;font-weight:700;color:#9cc}
#sea{left:0;right:0;top:700px;height:40px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 60px,transparent 60px 120px);opacity:.5}
.tug{position:relative;width:420px;height:200px}.tug i{position:absolute;display:block}
.tug .hull{left:0;top:110px;width:420px;height:80px;background:#C8452A;clip-path:polygon(0 0,100% 0,88% 100%,6% 100%)}
.tug .cab{left:150px;top:40px;width:170px;height:72px;background:#eef2f4;border-radius:6px}
.tug .cab2{left:190px;top:4px;width:100px;height:40px;background:#dfe6ea;border-radius:6px}
.tug .stk{left:120px;top:20px;width:26px;height:90px;background:#222}
.depth{right:60px;top:760px;width:250px;text-align:center;font-weight:900;font-size:90px;color:#fff;background:rgba(0,0,0,.45);border:3px solid rgba(136,255,221,.5);border-radius:18px;padding:14px 0}
.crewRow{left:90px;right:90px;top:960px;display:flex;justify-content:center;gap:18px}
.crew{display:block;width:52px;height:110px;border-radius:26px 26px 10px 10px;background:#dfe9ef;opacity:0}
#room{left:90px;top:470px;width:900px;height:620px;border:6px solid #3a4a55;border-radius:10px;overflow:hidden;background:#0a1a24}
.ceil{position:absolute;left:0;right:0;top:0;height:26px;background:#2c3a44}
.desk{position:absolute;left:120px;top:26px;width:260px;height:70px;background:#3b4a55}
.chair{position:absolute;left:560px;top:26px;width:80px;height:110px;background:#34434e}
.pipe{position:absolute;left:0;right:0;top:120px;height:14px;background:#51616c}
.air{position:absolute;left:0;right:0;top:0;height:230px}
.head{position:absolute;left:410px;top:150px;width:90px;height:110px;border-radius:45px 45px 40px 40px;background:#1b1210;box-shadow:0 0 0 3px rgba(61,232,255,.25)}
.water{position:absolute;left:0;right:0;top:230px;bottom:0;background:linear-gradient(#0e5a7a,#042536);background-size:400px 100%;border-top:6px solid rgba(160,230,255,.6)}
.ruler{position:absolute;right:40px;top:26px;width:10px;height:204px;background:#3DE8FF}
.ruler span{position:absolute;right:24px;top:70px;font-family:"J";font-weight:700;font-size:40px;color:#3DE8FF;white-space:nowrap}
.gauge{left:340px;top:330px;width:400px;height:400px}
.gface{position:absolute;inset:0;border-radius:50%;border:10px solid #3DE8FF;background:radial-gradient(circle,#0b2a3a,#041018)}
.needle{position:absolute;left:195px;top:40px;width:10px;height:160px;background:#FF5A5A;border-radius:5px;transform-origin:50% 100%}
.gl{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:30px;color:#9cc}
.gv{position:absolute;left:0;right:0;top:290px;text-align:center;font-size:56px;color:#fff}
.mbox{top:760px;width:380px;height:300px;border:4px solid #3DE8FF;border-radius:16px;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:14px;padding:20px;background:rgba(61,232,255,.06)}
.mbox i{display:block;width:30px;height:30px;border-radius:50%;background:#3DE8FF}
.mbox.dense i{width:18px;height:18px}
.mbox b{position:absolute;left:0;right:0;bottom:-54px;text-align:center;font-size:32px;color:#9cc}
.meter{left:420px;top:380px;width:240px;height:640px;border:6px solid #fff;border-radius:30px;overflow:hidden;background:#07161f}
.fill{position:absolute;left:0;right:0;bottom:0;height:0;background:#FFD400}
.lim{position:absolute;left:0;right:0;top:12%;height:6px;background:#FF5A5A}
.lim span{position:absolute;left:250px;top:-22px;font-family:"J";font-weight:700;font-size:30px;color:#FF5A5A;white-space:nowrap}
.ml{position:absolute;left:40px;right:40px;top:250px;text-align:center;font-size:40px;background:rgba(0,0,0,.75);border-radius:10px}
.mv{position:absolute;left:20px;right:20px;top:310px;text-align:center;font-size:58px;background:rgba(0,0,0,.75);border-radius:10px}
.rip{left:240px;top:1300px;width:600px;height:120px;border-radius:50%;border:6px solid rgba(61,232,255,.8)}
.bubs{left:160px;top:620px;width:760px;height:400px}
.bubs i{position:absolute;bottom:0;display:block;width:34px;height:34px;border-radius:50%;border:4px solid #FF5A5A}
.chamber{left:190px;top:520px;width:700px;height:420px;border-radius:210px;background:linear-gradient(#c9d3da,#7d8a93);border:8px solid #5b6770}
.port{position:absolute;left:290px;top:120px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#3DE8FF,#0b3a4a);border:10px solid #3d4750}
.lbl{position:absolute;left:0;right:0;bottom:-70px;text-align:center;font-size:30px;color:#cfe}
#caps{position:absolute;left:30px;right:30px;top:1380px;height:200px}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:74px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Harrison Okene — 60 horas</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(H)}
{''.join(MEDIA)}
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
