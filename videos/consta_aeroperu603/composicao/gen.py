# Consta nos Autos — Aeroperú 603 (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/ap/'
NARR = 55.75
END = 55.75

raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t == 'Aero' and nx == 'Peru': t = 'Aeroperú'; skip = True
    if t == 'a' and nx == 'gente': continue
    if t == 'gente': t = 'rente'
    if t == 'Tocam': t = 'Toca'
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
POS = {'i1': -782, 'i2': -910, 'i3': -1210, 'i4': -1166, 'i5': -1166, 'i6': -1420, 'radar': -1166}
def scene(id_, s, e, img, inner='', dark=.45, z=(1.0, 1.08)):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">'
             f'<img id="{id_}_img" class="abs ph" style="left:{POS[img]}px" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>{inner}</div></section>')
    A(f'tl.fromTo("#{id_}_img",{{scale:{z[0]}}},{{scale:{z[1]},transformOrigin:"50% 50%",duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'

HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · VOO 603', p + 'tg') + '<div class="abs ring"></div>' +
                  card('hk1', 'UMA <span class="y">FITA ADESIVA</span>', p + 'h1') + card('hk2', 'DERRUBOU UM BOEING', p + 'h2'))

# 0 — gancho (1º quadro = capa: a fita)
scene('s0', 0, 4.2, 'i1', HOOK('a'), dark=.3, z=(1.0, 1.06))
hide('#ah2'); slam('#ah2', 1.6)
# 1 — dois alarmes
scene('s1', 4.2, 8.5, 'i4', card('al a1', '⚠ VELOCIDADE ALTA', 'x1') + card('al a2', '⚠ PERDA DE SUSTENTAÇÃO', 'x2') + card('big', 'JUNTOS?', 'x3'), dark=.35)
hide('#x1', '#x2', '#x3'); pop('#x1', 5.8); blink('#x1', 6.2); pop('#x2', 6.6); blink('#x2', 7.0); slam('#x3', 7.3)
# 2 — decolagem
scene('s2', 8.5, 13.5, 'i3', card('pill', 'LIMA · 02.10.1996', 'd1') + card('big low', 'VOO 603<br><span class="y">→ SANTIAGO</span>', 'd2'))
hide('#d1', '#d2'); fade('#d1', 8.6); up('#d2', 9.9)
# 3 — lavagem e fita
scene('s3', 13.5, 21.1, 'i2', card('pill', 'HORAS ANTES: A LAVAGEM', 'l1') + card('big low', '3 SENSORES<br><span class="y">TAPADOS</span>', 'l2') + card('stamp', 'NINGUÉM TIROU', 'l3'), dark=.4)
hide('#l1', '#l2', '#l3'); fade('#l1', 13.6); pop('#l2', 18.0); slam('#l3', 19.7)
# 4 — o que os sensores fazem
scene('s4', 21.1, 25.0, 'i1', '<div class="abs ring"></div>' + card('big', 'ALTITUDE<br><span class="y">+ VELOCIDADE</span>', 's4t'), dark=.4, z=(1.08, 1.2))
hide('#s4t'); up('#s4t', 22.9)
# 5 — instrumentos enlouquecem + alarmes
scene('s5', 25.0, 32.7, 'i4', card('big', 'INSTRUMENTOS<br><span class="r">ENLOUQUECEM</span>', 'm1') + card('al a1', '⚠ VELOCIDADE ALTA', 'm2') + card('al a2', '⚠ PERDA DE SUSTENTAÇÃO', 'm3'), dark=.4)
hide('#m1', '#m2', '#m3'); up('#m1', 26.6); out('#m1', 28.0, .2); pop('#m2', 28.5); blink('#m2', 28.9, 13); pop('#m3', 31.2); blink('#m3', 31.6, 3)
# 6 — noite sobre o mar
scene('s6', 32.7, 36.4, 'i5', card('big', 'NOITE.<br>NENHUMA LUZ.', 'n1'), dark=.2)
hide('#n1'); fade('#n1', 33.0)
# 7 — a torre lê os mesmos sensores
scene('s7', 36.4, 40.8, 'radar', card('pill', 'CONTROLE EM LIMA', 't1') + card('big low', 'OS MESMOS<br><span class="r">DADOS ERRADOS</span>', 't2'), dark=.4)
hide('#t1', '#t2'); fade('#t1', 36.5); up('#t2', 38.5)
# 8 — painel x realidade
scene('s8', 40.8, 45.5, 'i5', '<div class="abs alt"><div class="J lab">PAINEL</div><div id="av" class="num">0 m</div></div>'
      '<div class="abs alt2"><div class="J lab">REAL</div><div id="rv" class="num r" style="white-space:normal">RENTE<br>AO MAR</div></div>', dark=.6)
hide('#rv'); count('#av', 41.0, 0, 2950, 1.4, 'Math.round(v).toLocaleString("pt-BR")+" m"'); slam('#rv', 43.4)
# 9 — a asa toca a água
scene('s9', 45.5, 50.7, 'i6', card('big low', '70 PESSOAS<br><span class="r">NENHUM SOBREVIVENTE</span>', 'f1'), dark=.35)
hide('#f1'); fade('#f1', 48.0, .5)
# 10 — loop
scene('s10', 50.7, END, 'i1', HOOK('b'), dark=.3, z=(1.0, 1.06))
hide('#bh1', '#bh2', '#btg'); fade('#btg', 50.8, .2); up('#bh1', 52.2); slam('#bh2', 53.4)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>',
         '<audio id="a_a1" src="assets/audio/alerta.wav" data-start="5.80" data-duration="1.60" data-track-index="12" data-volume="0.2"></audio>',
         '<audio id="a_a2" src="assets/audio/alerta.wav" data-start="28.50" data-duration="1.60" data-track-index="12" data-volume="0.2"></audio>']

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
.hk2{left:30px;right:30px;top:1240px;text-align:center;font-size:100px;line-height:1.02;color:#FF4B3E;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 8px 30px #000}
.ring{left:190px;top:640px;width:700px;height:520px;border:14px solid #FF2D20;border-radius:50%;box-shadow:0 0 40px rgba(255,45,32,.85)}
.big{left:40px;right:40px;top:300px;text-align:center;font-size:110px;line-height:1.02;text-shadow:0 8px 30px #000}
.big.low{top:1080px}
.pill{left:50%;transform:translateX(-50%);top:220px;white-space:nowrap;font-family:"J";font-size:40px;color:#eee;background:rgba(0,0,0,.65);padding:12px 24px;border-radius:10px}
.al{left:50%;transform:translateX(-50%);white-space:nowrap;font-family:"J";font-size:48px;background:#FF2D20;color:#fff;padding:16px 28px;border-radius:12px}
.al.a1{top:620px}.al.a2{top:760px;background:#FFB020;color:#111}
.stamp{left:50%;margin-left:-330px;top:640px;width:660px;text-align:center;font-size:76px;color:#FF2D20;border:8px solid #FF2D20;padding:10px;transform:rotate(-8deg);background:rgba(0,0,0,.6)}
.alt{left:80px;right:80px;top:420px;text-align:center}.alt2{left:80px;right:80px;top:820px;text-align:center}
.lab{font-size:44px;color:#aaa;letter-spacing:6px}.num{font-size:130px;line-height:1.1;white-space:nowrap}
#caps{position:absolute;left:40px;right:40px;top:1530px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Aeroperú 603</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
