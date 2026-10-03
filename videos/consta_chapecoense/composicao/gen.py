# Consta nos Autos — Chapecoense / LaMia 2933 (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/ch/'
NARR = 57.52
END = 57.60

raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t in ('...', '…'): continue
    if t.startswith('Medellin'): t = t.replace('Medellin', 'Medellín')
    if t == 'a' and nx.startswith('Chapecoense') and s > 45: t = 'à'
    W.append((t, s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.4, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.5): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.35): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.5}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2.2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.2}},{{autoAlpha:1,scale:1,duration:.22,ease:"power4.out",immediateRender:false}},{t:.2f});')
def blink(sel, t, n=7): A(f'tl.fromTo("{sel}",{{opacity:1}},{{opacity:.25,duration:.2,yoyo:true,repeat:{n},ease:"steps(1)",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

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
POS = {'i1': -520, 'i2': -1060, 'i3': -1060, 'i4': -500, 'i5': -1400, 'i6': -1350, 'i7': -1166}
def scene(id_, s, e, img, inner='', dark=.45, z=(1.0, 1.08), left=None):
    l = POS[img] if left is None else left
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">'
             f'<img id="{id_}_img" class="abs ph" style="left:{l}px" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>{inner}</div></section>')
    A(f'tl.fromTo("#{id_}_img",{{scale:{z[0]}}},{{scale:{z[1]},transformOrigin:"50% 50%",duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'

HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · VOO 2933', p + 'tg') + '<div class="abs ring"></div>' +
                  card('hk1', 'SEM <span class="y">COMBUSTÍVEL</span>', p + 'h1') + card('hk2', 'A MENOS DE 20 KM<br>DA PISTA', p + 'h2'))

# 0 — gancho (1º quadro = capa: o avião sobre as montanhas)
scene('s0', 0, 5.3, 'i1', HOOK('a'), dark=.3, z=(1.0, 1.06))
A('tl.fromTo("#ah2",{scale:1},{scale:1.12,duration:.25,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},3.0);')
# 1 — 2º gancho: o piloto era dono
scene('s1', 5.3, 10.6, 'i2', card('pill', 'O PILOTO QUE NÃO PAROU', 'p1') + card('big low', 'ERA DONO<br><span class="r">DA EMPRESA</span>', 'p2'), dark=.35)
hide('#p1', '#p2'); fade('#p1', 5.6); slam('#p2', 9.0)
# 2 — a final
scene('s2', 10.6, 14.7, 'i3', card('pill', 'MEDELLÍN · 28.11.2016', 'f1') + card('big', 'A MAIOR FINAL<br><span class="y">DA HISTÓRIA</span>', 'f2'), dark=.4)
hide('#f1', '#f2'); up('#f2', 11.6); fade('#f1', 13.2)
# 3 — sem margem (barra de combustível esvaziando)
scene('s3', 14.7, 20.1, 'i4', card('pill', 'BOLÍVIA → COLÔMBIA', 'm1') +
      '<div id="fuel" class="abs fuel"><div class="J lab">COMBUSTÍVEL</div><div class="tank"><div id="fill" class="fill"></div></div></div>' +
      card('big low', '<span class="r">SEM MARGEM</span>', 'm2'), dark=.4)
hide('#m1', '#fuel', '#m2'); fade('#m1', 15.0); fade('#fuel', 15.6, .3)
A('tl.fromTo("#fill",{width:"100%"},{width:"4%",duration:3.2,ease:"power1.in",immediateRender:false},15.8);')
slam('#m2', 18.8)
# 4 — aeroportos no caminho
scene('s4', 20.1, 24.4, 'i1', card('big', 'AEROPORTOS<br><span class="y">NO CAMINHO</span>', 'r1') + card('stamp', 'NÃO PAROU', 'r2'), dark=.45, z=(1.12, 1.2), left=-1700)
hide('#r1', '#r2'); up('#r1', 20.4); slam('#r2', 23.2)
# 5 — combustível acaba, sem emergência
scene('s5', 24.4, 30.3, 'i2', card('al a1', '⚠ COMBUSTÍVEL NO FIM', 'e1') + card('pill', 'PEDE PRIORIDADE', 'e2') +
      card('big low', 'NÃO DECLARA<br><span class="r">EMERGÊNCIA</span>', 'e3'), dark=.4, z=(1.15, 1.28))
hide('#e1', '#e2', '#e3'); pop('#e1', 26.2); blink('#e1', 26.6, 5); fade('#e2', 27.4); slam('#e3', 28.9)
# 6 — outro avião pousa primeiro
scene('s6', 30.3, 35.6, 'i5', card('big', 'OUTRO AVIÃO<br><span class="y">POUSA PRIMEIRO</span>', 'o1') + card('big low', 'VOLTAS<br>NO ESCURO', 'o2'), dark=.35)
hide('#o1', '#o2'); up('#o1', 30.5); out('#o1', 33.5, .2); up('#o2', 33.8)
# 7 — motores param, montanha
scene('s7', 35.6, 39.9, 'i6', '<div id="eng" class="abs alt"><div class="J lab">MOTORES</div><div id="ev" class="num" style="font-size:220px">4</div></div><div id="flash" class="abs flash"></div>', dark=.35)
hide('#flash'); count('#ev', 36.0, 4, 0, 1.4, 'Math.round(v)')
A('tl.fromTo("#flash",{autoAlpha:.9},{autoAlpha:0,duration:.9,ease:"power2.out",immediateRender:false},38.3);')
# 8 — 71 vidas, 6 sobreviventes
scene('s8', 39.9, 46.6, 'i3', card('huge', '71<span class="sm">VIDAS</span>', 'v1') +
      card('pill2', 'JOGADORES · COMISSÃO TÉCNICA<br>JORNALISTAS · TRIPULAÇÃO', 'v2') + card('big low', '<span class="y">6</span> SOBREVIVERAM', 'v3'), dark=.7, z=(1.1, 1.18))
hide('#v1', '#v2', '#v3'); slam('#v1', 40.1); fade('#v2', 41.6); up('#v3', 45.5)
# 9 — campeã sem jogar
scene('s9', 46.6, 52.3, 'i7', card('pill', 'O ADVERSÁRIO PEDIU', 'c1') + card('big low', 'CAMPEÃ<br><span class="y">SEM ENTRAR<br>EM CAMPO</span>', 'c2'), dark=.35)
hide('#c1', '#c2'); fade('#c1', 46.9); up('#c2', 50.0)
# 10 — loop
scene('s10', 52.3, END, 'i1', HOOK('b'), dark=.3, z=(1.0, 1.06))
hide('#bh1', '#bh2', '#btg'); fade('#btg', 52.4, .2); up('#bh1', 53.6); slam('#bh2', 55.4)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>',
         '<audio id="a_a1" src="assets/audio/alerta.wav" data-start="26.20" data-duration="1.60" data-track-index="12" data-volume="0.2"></audio>']

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ph{top:0;width:3413px;height:1920px}
.vig{inset:0;background:linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,0) 28%,rgba(0,0,0,0) 62%,rgba(0,0,0,.85))}
.y{color:#FFC83D}.r{color:#FF4B3E}
.tag{left:0;right:0;top:80px;text-align:center;font-family:"J";font-size:30px;color:#FFC83D;letter-spacing:4px}
.hk1{left:30px;right:30px;top:150px;text-align:center;font-size:104px;line-height:1.02;text-shadow:0 8px 30px #000}
.hk2{left:20px;right:20px;top:1240px;text-align:center;font-size:86px;line-height:1.02;color:#FF4B3E;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 8px 30px #000}
.ring{left:190px;top:640px;width:700px;height:520px;border:14px solid #FF2D20;border-radius:50%;box-shadow:0 0 40px rgba(255,45,32,.85)}
.big{left:40px;right:40px;top:300px;text-align:center;font-size:110px;line-height:1.02;text-shadow:0 8px 30px #000}
.big.low{top:1080px}
.pill{left:50%;transform:translateX(-50%);top:220px;white-space:nowrap;font-family:"J";font-size:40px;color:#eee;background:rgba(0,0,0,.65);padding:12px 24px;border-radius:10px}
.al{left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"J";font-size:48px;background:#FF2D20;color:#fff;padding:16px 28px;border-radius:12px}
.al.a1{top:620px}.al.a2{top:760px;background:#FFB020;color:#111}
.stamp{left:50%;margin-left:-330px;top:640px;width:660px;text-align:center;font-size:76px;color:#FF2D20;border:8px solid #FF2D20;padding:10px;transform:rotate(-8deg);background:rgba(0,0,0,.6)}
.alt{left:80px;right:80px;top:420px;text-align:center}.alt2{left:80px;right:80px;top:820px;text-align:center}
.lab{font-size:44px;color:#fff;text-shadow:0 4px 14px #000;letter-spacing:6px}.num{font-size:130px;line-height:1.1;white-space:nowrap}
.fuel{left:120px;right:120px;top:620px;text-align:center}
.fuel .lab{color:#fff;text-shadow:0 4px 14px #000}
.tank{margin-top:16px;height:70px;border:6px solid #fff;border-radius:14px;padding:6px;background:rgba(0,0,0,.5)}
.fill{height:100%;width:100%;background:linear-gradient(90deg,#FF2D20,#FFC83D);border-radius:6px}
.huge{left:0;right:0;top:330px;text-align:center;font-size:330px;line-height:1;color:#fff;text-shadow:0 10px 40px #000}
.huge .sm{display:block;font-size:90px;color:#FFC83D;letter-spacing:6px}
.pill2{left:60px;right:60px;top:900px;text-align:center;font-family:"J";font-size:38px;line-height:1.5;color:#eee;background:rgba(0,0,0,.6);padding:14px 10px;border-radius:12px}
.flash{inset:0;background:#fff}
#caps{position:absolute;left:40px;right:40px;top:1530px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Chapecoense 2933</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
