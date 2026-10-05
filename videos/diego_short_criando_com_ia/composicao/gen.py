# Diego Jaques — Short "20 mil views e eu não gravei nada" (9:16, ≤60s). Gera index.html.
# Uso: python3 gen.py <pasta_projeto>   (o projeto precisa de words.json, assets/ e gsap.min.js)
import json, html, re, sys
P = sys.argv[1].rstrip('/') + '/'
NARR = 37.52
END = 37.60

SUB = {'short': 'Short', 'clode,': 'Claude,', 'À': 'As', 'Labs.': 'ElevenLabs.', 'Frames': 'HyperFrames'}
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t == '11' and nx == 'Labs.': continue
    if t == 'Hyper' and nx == 'Frames': continue
    if t == 'Jamie' and nx == 'me': t = 'Gemini'; skip = True
    t = SUB.get(t, t)
    W.append((t, s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.4, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def pop(sel, t, d=.35): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.5}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2.2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.2}},{{autoAlpha:1,scale:1,duration:.22,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')
def typing(sel, t, txt, d):
    A(f'(()=>{{const s={json.dumps(txt)};const o={{n:0}};tl.to(o,{{n:s.length,duration:{d},ease:"none",onUpdate:()=>{{document.querySelector("{sel}").textContent=s.slice(0,Math.round(o.n))}}}},{t:.2f});}})();')
def strike(sel, t): A(f'tl.fromTo("{sel}",{{scaleX:0}},{{scaleX:1,duration:.25,ease:"power2.out",immediateRender:false}},{t:.2f});')
BR = 'String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g,".")'

# legendas palavra por palavra
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 3 or re.search(r'[.?!,:]$', w[0]) or (nx[1]-w[2] > .35):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.6, END)
    if e - s < .15: continue
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",.?"))}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, V = [], []
def scene(id_, s, e, inner, bg='bgA'):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2">'
             f'<div id="{id_}_in" class="abs inner {bg}">{inner}</div></section>')
def video(id_, s, e, clip, ms, cls):
    V.append(f'<video id="{id_}" class="clip {cls}" src="assets/clips/{clip}.webm" data-start="{s:.2f}" data-duration="{e-s:.2f}" '
             f'data-media-start="{ms:.2f}" data-track-index="3" muted playsinline></video>')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}"{" data-layout-allow-overlap" if cls == "cnt" else ""}>{txt}</div>'
def step(n, nome, ferr, p): return card('step', f'<span class="n">{n}</span>{nome}<span class="f">{ferr}</span>', p)

PHONE_BG = '<img class="abs blur" src="assets/img/tamframe.png"><div class="abs dim"></div>'
def phone_scene(id_, s, e, top_html):
    # o vídeo (track 3) fica dentro da moldura; a moldura e os textos vêm por cima (track 4)
    scene(id_ + 'b', s, e, PHONE_BG)
    video(id_ + 'v', s, e, 'tam', 0.0, 'phv')
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="4">'
             f'<div class="abs inner"><div class="abs phone"></div>{top_html}</div></section>')

# 0 — gancho: o Short do TAM tocando no celular, contador subindo (1º quadro = capa)
phone_scene('s0', 0, 5.5, card('tag', 'DIEGO JAQUES · BASTIDORES', 'a0') +
            card('cnt', '<span id="an" data-layout-allow-overlap>20.763</span><span class="lb" data-layout-allow-overlap>VISUALIZAÇÕES</span>', 'a1') +
            card('stamp', 'NÃO GRAVEI<br>NADA', 'a2'))
hide('#a2'); count('#an', 0.15, 0, 20763, 2.6, BR); slam('#a2', 4.35)
# 1 — 2º gancho: sem câmera, sem editor → 100% IA
scene('s1', 5.5, 11.0, card('nope', '<span class="x">🎥 SEM CÂMERA<i id="k1" class="ln"></i></span>', 'b1') +
      card('nope n2', '<span class="x">✂️ SEM EDITOR<i id="k2" class="ln"></i></span>', 'b2') + card('ia', '100% IA', 'b3'))
hide('#b1', '#b2', '#b3'); up('#b1', 5.55); strike('#k1', 6.4); up('#b2', 6.85); strike('#k2', 7.7); slam('#b3', 9.55)
# 2 — roteiro (Claude)
scene('s2', 11.0, 16.6, step('1', 'ROTEIRO', 'Claude', 'c0') +
      card('chat', '<div class="who">Claude</div><div id="ct" class="msg"></div>', 'c1') + card('chip', '⏱ GANCHO NOS 3 PRIMEIROS SEGUNDOS', 'c2'), 'bgB')
hide('#c0', '#c1', '#c2'); up('#c0', 11.05); up('#c1', 11.4)
typing('#ct', 11.6, 'Lutaram contra o próprio avião… e perderam em 25 segundos.', 2.6); pop('#c2', 15.1)
# 3 — voz clonada (ElevenLabs)
bars = ''.join(f'<i id="wb{i}" class="bar" style="left:{60 + i*34}px"></i>' for i in range(28))
scene('s3', 16.6, 20.4, step('2', 'VOZ', 'ElevenLabs', 'd0') + card('wave', bars, 'd1') + card('big', 'MINHA VOZ<br><span class="y">CLONADA</span>', 'd2'), 'bgC')
hide('#d0', '#d1', '#d2'); up('#d0', 16.65); fade('#d1', 16.8); up('#d2', 18.7)
for i in range(28):
    h = .25 + ((i * 37) % 11) / 11 * .75
    A(f'tl.fromTo("#wb{i}",{{scaleY:.12}},{{scaleY:{h:.2f},duration:{.18 + (i % 5) * .04:.2f},yoyo:true,repeat:{int(3.6/(.18 + (i % 5) * .04))},ease:"sine.inOut",immediateRender:false}},16.8);')
# 4 — cenas (Gemini)
scene('s4', 20.4, 24.6, step('3', 'CENAS', 'Gemini', 'e0') +
      card('prompt', '<div class="who">prompt</div><div id="et" class="msg sm"></div>', 'e1') +
      '<div class="abs fr f1"></div><div class="abs fr f2"></div>', 'bgB')
video('s4v1', 22.9, 24.6, 'manete169', 0.5, 'v169 p1'); video('s4v2', 23.5, 24.6, 'anjo169', 0.5, 'v169 p2')
hide('#e0', '#e1'); up('#e0', 20.45); up('#e1', 20.6)
typing('#et', 20.8, '0–2s: mão do piloto empurra a manete; câmera lenta, luz âmbar do painel…', 1.8)
# 5 — montagem (HyperFrames Studio) + seta para o vídeo relacionado
scene('s5', 24.6, 30.7, step('4', 'MONTAGEM', 'HyperFrames', 'g0') +
      '<div class="abs scr"><img id="g1" class="abs" src="assets/img/studio.png"></div>' +
      card('cafe', '☕', 'g2') + card('rel', 'PASSO A PASSO COMPLETO<br><span class="y">▼ VÍDEO RELACIONADO ▼</span>', 'g3'), 'bgC')
hide('#g0', '#g2', '#g3'); up('#g0', 24.65)
A('tl.fromTo("#g1",{scale:1,x:0,y:0},{scale:1.9,x:-380,y:120,duration:5.6,ease:"power1.inOut",immediateRender:false},25.0);')
pop('#g2', 29.8); up('#g3', 27.3)
A('tl.fromTo("#g3",{y:0},{y:14,duration:.3,yoyo:true,repeat:7,ease:"sine.inOut",immediateRender:false},27.8);')
# 6 — conferir e publicar
scene('s6', 30.7, 33.6, card('chk', '<span id="h1">✅ FATOS CONFERIDOS</span><span id="h2">✅ PUBLICAR</span>', 'h0'), 'bgB')
hide('#h1', '#h2'); pop('#h1', 31.7); pop('#h2', 32.6)
# 7 — final em loop: o mesmo celular da abertura
phone_scene('s7', 33.6, END, card('tag', 'DIEGO JAQUES · BASTIDORES', 'm0') +
            card('cnt', '<span id="mn" data-layout-allow-overlap>20.000</span><span class="lb" data-layout-allow-overlap>PESSOAS ASSISTIRAM</span>', 'm1') +
            card('stamp', 'NINGUÉM<br>GRAVOU', 'm2'))
hide('#m2'); count('#mn', 33.6, 0, 20000, .8, BR); slam('#m2', 36.6)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.wav" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_m" src="assets/audio/piano.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.12"></audio>']

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
@font-face{font-family:"J5";font-weight:500;src:url(assets/fonts/jetbrains-mono-latin-500-normal.woff2)}
body{margin:0;background:#0b0d12}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b0d12;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.y{color:#FFC83D}
.bgA{background:#0b0d12}
.bgB{background:radial-gradient(circle at 50% 35%,#1d2433,#0b0d12 70%)}
.bgC{background:radial-gradient(circle at 50% 40%,#2a1d3a,#0b0d12 72%)}
.blur{left:-60px;top:-60px;width:1200px;height:2040px;object-fit:cover;filter:blur(36px) brightness(.55)}
.dim{inset:0;background:linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.1) 30%,rgba(0,0,0,.1) 70%,rgba(0,0,0,.8))}
.phv{position:absolute;left:256px;top:446px;width:568px;height:1010px;object-fit:cover;border-radius:44px}
.phone{left:240px;top:430px;width:568px;height:1010px;border:16px solid #15171c;border-radius:60px;box-shadow:0 0 0 3px #3a3f4a,0 30px 80px rgba(0,0,0,.8)}
.tag{left:50%;transform:translateX(-50%);top:70px;white-space:nowrap;font-family:"J";font-size:30px;color:#FFC83D;letter-spacing:4px;background:rgba(0,0,0,.7);padding:8px 18px;border-radius:8px}
.cnt{left:0;right:0;top:150px;text-align:center;font-size:150px;line-height:1;text-shadow:0 8px 30px #000}
.cnt .lb{display:block;font-size:44px;letter-spacing:8px;color:#FFC83D;margin-top:10px}
.stamp{left:50%;margin-left:-360px;top:760px;width:720px;text-align:center;font-size:96px;line-height:1.02;color:#FF3B30;border:10px solid #FF3B30;padding:16px 0;transform:rotate(-7deg);background:rgba(0,0,0,.78)}
.nope{left:0;right:0;top:420px;text-align:center;font-size:96px}
.nope.n2{top:640px}
.x{position:relative;display:inline-block;color:#c9ccd3}
.ln{position:absolute;left:-12px;right:-12px;top:50%;height:16px;margin-top:-8px;background:#FF3B30;border-radius:8px;transform-origin:0 50%;transform:scaleX(0)}
.ia{left:0;right:0;top:930px;text-align:center;font-size:230px;color:#FFC83D;text-shadow:0 10px 50px rgba(255,200,61,.45)}
.step{left:60px;right:60px;top:170px;text-align:center;font-size:78px;letter-spacing:2px}
.step .n{display:inline-block;width:104px;height:104px;line-height:104px;border-radius:52px;background:#FFC83D;color:#111;margin-right:26px;font-size:64px;vertical-align:middle}
.step .f{display:block;font-family:"J";font-size:42px;color:#9fb3ff;letter-spacing:4px;margin-top:14px}
.chat{left:80px;right:80px;top:520px;min-height:420px;background:#f5f1ea;border-radius:28px;padding:34px 40px;color:#1d1b18;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.prompt{left:80px;right:80px;top:470px;min-height:240px;background:#f5f1ea;border-radius:28px;padding:28px 36px;color:#1d1b18}
.who{font-family:"J";font-size:30px;color:#c15f3c;letter-spacing:3px;margin-bottom:18px;text-transform:uppercase}
.msg{font-family:"M";font-size:66px;line-height:1.12;min-height:300px}
.msg.sm{font-family:"J5";font-weight:500;font-size:38px;line-height:1.35;min-height:150px}
.chip{left:50%;transform:translateX(-50%);top:1090px;white-space:nowrap;font-family:"J";font-size:38px;background:#FF3B30;padding:16px 26px;border-radius:12px}
.wave{left:60px;right:60px;top:520px;height:440px}
.bar{position:absolute;bottom:0;top:0;margin:auto 0;width:20px;height:440px;border-radius:10px;background:linear-gradient(#9fb3ff,#FFC83D);transform:scaleY(.12)}
.big{left:40px;right:40px;top:1060px;text-align:center;font-size:110px;line-height:1.02;text-shadow:0 8px 30px #000}
.v169{position:absolute;left:60px;width:960px;height:540px;object-fit:cover;border-radius:24px}
.p1{top:760px}.p2{top:1320px}
.fr{left:54px;width:960px;height:540px;border:6px solid rgba(255,255,255,.18);border-radius:28px}
.f1{top:754px}.f2{top:1314px}
.scr{left:40px;top:470px;width:1000px;height:563px;overflow:hidden;border-radius:20px;border:6px solid #3a3f4a;box-shadow:0 30px 80px rgba(0,0,0,.7)}
.scr img{left:0;top:0;width:1000px;height:563px;transform-origin:30% 70%}
.cafe{left:830px;top:1360px;font-size:140px}
.rel{left:50%;transform:translateX(-50%);top:1170px;white-space:nowrap;text-align:center;font-size:46px;line-height:1.3;background:rgba(0,0,0,.85);border:4px solid #FFC83D;padding:18px 34px;border-radius:18px}
.chk{left:0;right:0;top:600px;text-align:center}
.chk span{display:block;font-size:92px;margin:40px 0}
#s0,#s7{z-index:3}.phv,.v169{z-index:2}
#an,#mn{display:block}
#caps{position:absolute;left:40px;right:40px;top:1560px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>20 mil views sem gravar</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(MEDIA)}{''.join(V)}
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
