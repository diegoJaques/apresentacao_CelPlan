# Consta nos Autos — TAM 402 (Short 9:16, ≤60s). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/tm/'
NARR = 56.58
END = 56.60

raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t == '-feira,': continue
    if t == 'quinta' and nx == '-feira,': t = 'quinta-feira,'
    if t == 'Sendatan': t = '100'
    if t == 'congonhas': t = 'Congonhas'
    if t == 'rio.': t = 'Rio.'
    if t.startswith('Jabacuara'): t = 'Jabaquara.'
    if t == 'acreditar.': t = 'acreditar:'
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
POS = {'i2': -1680, 'i3': -1337, 'i4': -825, 'i5': -825, 'i6': -1000}
def scene(id_, s, e, img, inner='', dark=.45, z=(1.0, 1.08), left=None):
    l = POS[img] if left is None else left
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">'
             f'<img id="{id_}_img" class="abs ph" style="left:{l}px" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>{inner}</div></section>')
    A(f'tl.fromTo("#{id_}_img",{{scale:{z[0]}}},{{scale:{z[1]},transformOrigin:"50% 50%",duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'
def lever(p, x=760):
    return (f'<div id="{p}" class="abs lev" style="left:{x}px"><div class="J ltop">MÁX</div><div class="trk"></div>'
            f'<div id="{p}k" class="knob"></div><div class="J lbot">LENTA</div><div class="J lname">MOTOR<br>DIREITO</div></div>')
def knob(p, t, down, d=.22):
    A(f'tl.to("#{p}k",{{y:{520 if down else 0},duration:{d},ease:"{"power4.in" if down else "power2.out"}"}},{t:.2f});')

HOOK = lambda p: (card('tag', 'CONSTA NOS AUTOS · VOO 402', p + 'tg') + '<div class="abs ring"></div>' +
                  card('hk1', 'LUTARAM CONTRA<br><span class="y">O PRÓPRIO AVIÃO</span>', p + 'h1') + card('hk2', 'E PERDERAM EM<br>25 SEGUNDOS', p + 'h2'))

# 0 — gancho (1º quadro = capa: a mão empurrando a manete)
scene('s0', 0, 5.0, 'i2', HOOK('a'), dark=.3, z=(1.0, 1.06))
A('tl.fromTo("#ah2",{scale:1},{scale:1.12,duration:.25,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},3.9);')
# 1 — 2º gancho
scene('s1', 5.0, 9.7, 'i4', card('big', 'O AVIÃO TENTAVA<br><span class="y">SALVAR TODOS</span>', 'g1') + card('al a2', '🔇 NENHUM ALARME', 'g2'), dark=.55, z=(1.15, 1.25))
hide('#g1', '#g2'); up('#g1', 5.1); pop('#g2', 7.8)
# 2 — decolagem
scene('s2', 9.7, 14.6, 'i3', card('pill', 'CONGONHAS · 31.10.1996', 'd1') + card('big low', 'VOO 402<br><span class="y" style="font-size:84px;white-space:nowrap">SÃO PAULO → RIO</span>', 'd2'), dark=.35)
hide('#d1', '#d2'); fade('#d1', 10.0); up('#d2', 11.9)
# 3 — a manete volta sozinha
scene('s3', 14.6, 19.9, 'i2', card('pill', 'RODAS FORA DO CHÃO', 'm1') + lever('L3') + card('bigl', 'VOLTA<br><span class="r">SOZINHA</span>', 'm2'), dark=.55, z=(1.1, 1.18))
hide('#m1', '#m2'); fade('#m1', 15.3); knob('L3', 17.9, True); slam('#m2', 18.2)
# 4 — acham que é pane e empurram
scene('s4', 19.9, 26.4, 'i3', lever('L4') + card('bigl', 'PANE NO<br><span class="y">AUTOMÁTICO?</span>', 'n1') + card('bigl low2', 'EMPURRAM<br>DE VOLTA', 'n2'), dark=.6, z=(1.2, 1.3))
A('tl.set("#L4k",{y:520},19.9);'); hide('#n1', '#n2'); up('#n1', 20.6); knob('L4', 23.6, False, .5); up('#n2', 23.6)
# 5 — o reversor aberto
scene('s5', 26.4, 33.4, 'i4', card('pill', 'A PEÇA QUE FREIA NO POUSO', 'r1') + card('big low', 'REVERSOR<br><span class="r">ABERTO<br>EM PLENO VOO</span>', 'r2') + card('al a1', '🔕 SEM AVISO NO PAINEL', 'r3'), dark=.35)
hide('#r1', '#r2', '#r3'); fade('#r1', 28.2); slam('#r2', 30.2); pop('#r3', 31.9)
# 6 — a briga: 3 vezes
scene('s6', 33.4, 39.4, 'i2', lever('L6', 420) + card('stamp', '3 VEZES', 'b1'), dark=.7, z=(1.2, 1.3), left=-1400)
hide('#b1'); knob('L6', 33.9, True); knob('L6', 36.3, False, .35); knob('L6', 37.3, True); knob('L6', 37.9, False, .3); knob('L6', 38.5, True); slam('#b1', 38.3)
# 7 — a trava rompe
scene('s7', 39.4, 44.1, 'i4', card('pill', 'UMA TRAVA QUE ELES NEM SABIAM', 't1') + card('big low', 'TRAVA DE<br>SEGURANÇA', 't2') + card('stamp', 'ROMPEU', 't3'), dark=.5, z=(1.25, 1.35))
hide('#t1', '#t2', '#t3'); fade('#t1', 40.3); up('#t2', 40.6); slam('#t3', 43.3)
# 8 — potência máxima, freando; tomba
scene('s8', 44.1, 50.0, 'i5', card('big', 'POTÊNCIA MÁXIMA<br><span class="r">FREANDO</span>', 'p1') + card('pill pbot', 'JABAQUARA · SÃO PAULO', 'p2'), dark=.45, z=(1.15, 1.22))
hide('#p1', '#p2'); up('#p1', 44.4); fade('#p2', 48.4)
A('tl.fromTo("#s8_img",{rotation:0},{rotation:-7,duration:1.4,ease:"power2.in",immediateRender:false},47.0);')
# 9 — 99 vidas
scene('s9', 50.0, 54.5, 'i6', card('huge', '99<span class="sm">VIDAS</span>', 'v1') + card('pill2', '95 A BORDO · 4 NO CHÃO', 'v2'), dark=.45, z=(1.0, 1.06))
hide('#v1', '#v2'); slam('#v1', 50.2); fade('#v2', 52.3)
# 10 — loop
scene('s10', 54.5, END, 'i2', HOOK('b'), dark=.3, z=(1.0, 1.06))
hide('#bh1', '#bh2', '#btg'); fade('#btg', 54.6, .2); up('#bh1', 54.7); slam('#bh2', 55.6)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_d" src="assets/audio/drone.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.18"></audio>']

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
.pill{left:50%;transform:translateX(-50%);top:220px;white-space:nowrap;font-family:"J";font-size:40px;color:#eee;background:rgba(0,0,0,.85);padding:12px 24px;border-radius:10px}
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
.rot{left:0;top:420px;width:1080px;height:1294px;transform:rotate(7deg);transform-origin:650px 600px}
.fadecapa{inset:0;background:linear-gradient(#0a1626 0%,#0a1626 24%,rgba(10,22,38,0) 34%,rgba(10,22,38,0) 70%,#0a1626 86%)}
.pista{left:640px;top:610px;font-family:"J";font-size:40px;color:#111;background:#FFC83D;padding:10px 18px;border-radius:10px;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.6)}
.ring{left:440px!important;top:470px!important;width:560px!important;height:680px!important}
.hk1{font-size:88px!important}
.lev{top:560px;width:220px;height:700px}
.trk{position:absolute;left:96px;top:60px;width:28px;height:580px;border-radius:14px;background:rgba(255,255,255,.18);border:3px solid rgba(255,255,255,.6)}
.knob{position:absolute;left:30px;top:40px;width:160px;height:100px;border-radius:18px;background:#FFC83D;border:5px solid #111;box-shadow:0 10px 30px rgba(0,0,0,.8)}
.ltop{position:absolute;left:0;right:0;top:0;text-align:center;font-size:36px;color:#fff;text-shadow:0 3px 10px #000}
.lbot{position:absolute;left:0;right:0;top:665px;text-align:center;font-size:36px;color:#FF4B3E;text-shadow:0 3px 10px #000}
.lname{position:absolute;left:-200px;top:300px;width:180px;text-align:right;font-size:30px;line-height:1.3;color:#ddd;text-shadow:0 3px 10px #000}
.bigl{left:40px;width:640px;top:300px;text-align:left;font-size:96px;line-height:1.02;text-shadow:0 8px 30px #000}
.bigl.low2{top:1120px}
.pbot{top:1300px}
#caps{position:absolute;left:40px;right:40px;top:1530px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>TAM 402</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
