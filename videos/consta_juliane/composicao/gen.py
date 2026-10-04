# Consta nos Autos — Juliane Koepcke (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/ju/'
NARR = 58.20
END = 58.50

FIX = {'17,': '17 anos,', 'tentestade.': 'tempestade.', 'sobreviveu,': 'sobreviveu.', 'dizia.': 'dizia:',
       'as': 'às', 'disse,': 'disse:', 'metros,': 'metros', 'avião,': 'avião…'}
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W = []
for i, (t, s, e) in enumerate(raw):
    if t in ('...', '…'): continue
    if t == '-a.': W[-1] = (W[-1][0] + '-a.', W[-1][1], e); continue
    if t == 'encontram' and s < 47: t = 'encontra'
    if t == 'encontram.': W.append(('a', s - .05, s)); 
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

POS.update({'i6': -1167, 'i1': -1140, 'i2': -1250, 'i3': -950, 'i4': -1167, 'i5': -1330})
HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · CASOS REAIS', p + 'tg') +
                  card('hk1', 'ELA CAIU DE<br><span class="y">3 MIL METROS</span>', p + 'h1') +
                  card('hk2', 'E SOBREVIVEU', p + 'h2'))

# 0 — gancho (1º quadro = capa: a fileira de poltronas caindo)
scene('s0', 0, 4.8, 'i6', HOOK('a'), dark=.3, z=(1.0, 1.08))
A('tl.fromTo("#ah2",{scale:1},{scale:1.12,duration:.25,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},4.0);')
# 1 — 2º gancho
scene('s1', 4.8, 7.4, 'i1', card('big', 'MAS O PIOR<br><span class="r">AINDA NEM TINHA<br>COMEÇADO</span>', 'g1'), dark=.6, z=(1.35, 1.5))
hide('#g1'); up('#g1', 4.95)
# 2 — véspera de Natal, Juliane, 17 anos
scene('s2', 7.4, 14.6, 'i2', card('pill', 'PERU · 24.12.1971', 'd1') + card('big', 'JULIANE<br><span class="y">17 ANOS</span>', 'd2') + card('pill2 pv', 'COM A MÃE → NATAL COM O PAI', 'd3'), dark=.4, z=(1.0, 1.08))
hide('#d1', '#d2', '#d3'); fade('#d1', 7.6); slam('#d2', 9.4); fade('#d3', 11.5)
# 3 — o raio
scene('s3', 14.6, 19.0, 'i2', '<div id="fl" class="abs flash"></div>' + card('big', 'UM RAIO', 'r1') + card('big lower', 'O AVIÃO SE<br><span class="r">DESFAZ NO AR</span>', 'r2'), dark=.5, z=(1.4, 1.55))
hide('#r1', '#r2')
A('tl.fromTo("#fl",{opacity:1},{opacity:0,duration:.45,ease:"power2.out",immediateRender:false},16.1);')
A('tl.fromTo("#s3_in",{x:0},{x:22,duration:.05,yoyo:true,repeat:7,ease:"none",immediateRender:false},16.1);')
slam('#r1', 16.15); up('#r2', 17.6)
# 4 — acorda sozinha
scene('s4', 19.0, 26.4, 'i3', card('big', 'ACORDA<br><span class="y">SOZINHA</span>', 'a1') + card('chk c1', '✕ CLAVÍCULA QUEBRADA', 'a2') + card('chk c2', '✕ UMA SANDÁLIA SÓ', 'a3'), dark=.45, z=(1.0, 1.1))
hide('#a1', '#a2', '#a3'); up('#a1', 19.3); pop('#a2', 24.1); pop('#a3', 25.5)
# 5 — 92 a bordo, 1 sobrevivente
scene('s5', 26.4, 31.6, 'i3', card('pill', 'A MÃE NÃO ESTAVA ALI', 'b1') + card('huge', '<span id="nn">92</span><span class="sm" id="nl">A BORDO</span>', 'b2'), dark=.75, z=(1.15, 1.22))
hide('#b1', '#b2'); fade('#b1', 26.5); slam('#b2', 28.3)
A('tl.set("#nn",{textContent:"1",color:"#3DDC84"},30.5);tl.set("#nl",{textContent:"SAIU VIVA"},30.5);')
A('tl.fromTo("#b2",{scale:1.25},{scale:1,duration:.25,ease:"power4.out",immediateRender:false},30.5);')
# 6 — o conselho do pai
scene('s6', 31.6, 39.2, 'i4', card('qlab', 'O CONSELHO DO PAI', 'q0') + card('quote', '“Se um dia se perder na mata,<br><span id="q2">ache a água</span><br><span id="q3">e siga a correnteza.”</span>', 'q1') + card('big lower', 'A ÁGUA LEVA<br><span class="y">ÀS PESSOAS</span>', 'q4'), dark=.8, z=(1.1, 1.18))
hide('#q0', '#q1', '#q2', '#q3', '#q4'); fade('#q0', 31.8); up('#q1', 33.6); fade('#q2', 35.4, .3); fade('#q3', 36.3, .3); up('#q4', 37.6)
# 7 — 11 dias dentro do riacho
scene('s7', 39.2, 45.6, 'i4', card('alt', '<div class="lab">NA SELVA</div><div class="num" id="dd">DIA 1</div>', 'k1') + card('chk c1', 'SANDÁLIA PARA TATEAR', 'k2') + card('chk c2 cr', 'FERIDAS INFECCIONAM', 'k3'), dark=.45, z=(1.0, 1.12))
hide('#k2', '#k3'); count('#dd', 39.5, 1, 11, 1.4, '"DIA "+Math.round(v)'); pop('#k2', 42.2); pop('#k3', 44.3)
# 8 — o barco, a cabana, os madeireiros
scene('s8', 45.6, 50.2, 'i5', card('big', 'UM BARCO.<br><span class="y">UMA CABANA.</span>', 'm1') + card('pill2 pv2', 'NO DIA SEGUINTE: MADEIREIROS A ENCONTRAM', 'm2'), dark=.35, z=(1.0, 1.08))
hide('#m1', '#m2'); up('#m1', 46.1); fade('#m2', 48.0)
# 9 — voltou para a floresta
scene('s9', 50.2, 54.7, 'i5', card('big', 'ANOS DEPOIS…', 'v1') + card('big lower', 'VOLTOU PARA<br><span class="g">A FLORESTA</span>', 'v2'), dark=.5, z=(1.0, 1.1), left=-150)
hide('#v1', '#v2'); up('#v1', 50.3); up('#v2', 51.7)
# 10 — siga a água → loop
scene('s10', 54.7, END, 'i6', card('quote2', '“SIGA A ÁGUA.”', 'z1'), dark=.35, z=(1.08, 1.0))
hide('#z1'); slam('#z1', 57.3)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/piano.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.22"></audio>',
         '<audio id="a_i" src="assets/audio/impacto.wav" data-start="16.10" data-duration="1.40" data-track-index="12" data-volume="0.45"></audio>']
for k, t in enumerate([9.4, 24.1, 25.5, 30.5, 42.2, 44.3]):
    MEDIA.append(f'<audio id="a_c{k}" src="assets/audio/clique.wav" data-start="{t:.2f}" data-duration="0.12" data-track-index="{13+k}" data-volume="0.3"></audio>')

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
.ring{left:270px;top:760px;width:540px;height:440px}
.hk1{font-size:92px!important}.hk2{top:345px!important;font-size:84px!important}
.pv{top:1150px;font-size:40px}.pv2{top:1180px;font-size:34px}
.chk{left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"J";font-size:46px;background:rgba(0,0,0,.82);color:#fff;padding:14px 26px;border-radius:12px;border-left:10px solid #FFC83D}
.chk.c1{top:1080px}.chk.c2{top:1200px}.chk.cr{border-left-color:#FF2D20}
.qlab{left:0;right:0;top:330px;text-align:center;font-family:"J";font-size:40px;color:#FFC83D;letter-spacing:4px}
.quote{left:70px;right:70px;top:430px;text-align:center;font-family:"M";font-size:74px;line-height:1.15;color:#fff;text-shadow:0 8px 30px #000}
#q2,#q3{color:#7FDBFF}
.quote2{left:0;right:0;top:170px;white-space:nowrap;text-align:center;font-size:104px;line-height:1.02;color:#7FDBFF;-webkit-text-stroke:5px #000;paint-order:stroke fill;text-shadow:0 10px 40px #000}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Juliane</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
