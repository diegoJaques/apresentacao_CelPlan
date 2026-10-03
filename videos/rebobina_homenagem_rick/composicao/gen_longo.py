# Rebobina — homenagem a Rick (Rick & Renner). 16:9 1920x1080. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/rk/'
NARR = 118.0
END = 118.0

raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
FIX = {'Ricky': 'Rick &', 'Ranner.': 'Renner.', 'Hener.': 'Renner.', 'moleca,': 'Muleca…', 'filha,': 'Filha,',
       'Nobregar': 'Nóbrega', 'Aujo': 'Araújo', 'Eixeira.': 'Teixeira.', 'canta,': 'canta', 'ela': '"Ela', 'demais': 'demais"',
       'Ela': '"Ela', 'demais.': 'demais".'}
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t == 'a' and abs(s - 21.0) < .15: continue
    if t == 'de' and abs(s - 100.7) < .15: continue
    if t == 'video' and nx.startswith('-maker'): t = 'videomaker'; skip = True
    W.append((FIX.get(t, t), s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.5, y=30): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.6): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.3): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')

# legendas
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 6 or re.search(r'[.?!…]$', w[0]) or (len(cur) >= 3 and w[0].endswith(',')) or (nx[1]-w[2] > .45):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.7, END)
    if e - s < .15: continue
    sp = ' '.join(f'<span id="w{gi}_{j}">{html.escape(x[0])}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H = []
def scene(id_, s, e, inner):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">{inner}</div></section>')
KB = [(1.0, 1.1, -30, 0), (1.1, 1.0, 30, 0), (1.0, 1.08, 0, -20), (1.06, 1.0, -20, 10)]
kbn = [0]
def photo(id_, s, e, img, inner='', dark=.45):
    k = KB[kbn[0] % 4]; kbn[0] += 1
    scene(id_, s, e, f'<img id="{id_}_img" class="abs ph" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>' + inner)
    A(f'tl.fromTo("#{id_}_img",{{scale:{k[0]},x:0,y:0}},{{scale:{k[1]},x:{k[2]},y:{k[3]},duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def portrait(id_, s, e, img, inner='', side='right'):
    pos = 'right:150px' if side == 'right' else 'left:150px'
    scene(id_, s, e, f'<img class="abs bgf" src="assets/img/{img}_bg.jpg"><img id="{id_}_p" class="abs por" style="{pos}" src="assets/img/{img}.jpg">' + inner)
    A(f'tl.fromTo("#{id_}_p",{{scale:1}},{{scale:1.05,duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'

HOOK = lambda p: (card('hk1', 'COMEÇOU CANTANDO<br>EM BAR, AOS <span class="y">9 ANOS</span>', p + 'h1') +
                  card('hk2', '…E VENDEU <span class="y">+10 MILHÕES</span><br>DE DISCOS', p + 'h2') +
                  card('tag', 'REBOBINA · HOMENAGEM', p + 'tg'))

# 0 — gancho (1º quadro = capa)
portrait('s0', 0, 6.4, 'rick_violao', HOOK('a'))
hide('#ah2'); up('#ah2', 3.4)
# 1 — a dupla acabou e voltou 3 vezes
photo('s1', 6.4, 11.5, 'r5', card('big2', 'A DUPLA ACABOU…', 'd1') + card('big2 low', 'E VOLTOU <span class="y" id="d3n">1</span>×', 'd2'), dark=.3)
hide('#d1', '#d2'); up('#d1', 6.6); up('#d2', 9.1)
A('tl.set("#d3n",{textContent:"2"},9.75);'); A('tl.set("#d3n",{textContent:"3"},10.15);')
# 2 — título
portrait('s2', 11.5, 14.9, 'rick_retrato', card('nm', 'RICK<small>RICK &amp; RENNER · 1966 – 2026</small>', 'nm'), side='left')
hide('#nm'); up('#nm', 11.7)
# 3 — origem
scene('s3', 14.9, 22.0, '''<div class="abs mapbg"></div>
<svg class="abs map" viewBox="0 0 1920 1080">
<circle cx="1180" cy="330" r="16" fill="#FFC83D"/><circle cx="1050" cy="640" r="16" fill="#fff"/>
<path id="rt" d="M1180 330 Q1180 500 1050 640" stroke="#FFC83D" stroke-width="8" stroke-dasharray="400" stroke-dashoffset="400" fill="none"/></svg>
<div class="abs J city" style="left:1220px;top:300px">PORTO NACIONAL · TO</div><div class="abs J city" style="left:1090px;top:615px">BRASÍLIA · DF</div>''' +
      card('nm2', 'GERALDO ANTÔNIO<br>DE CARVALHO', 'g1') + card('lt2b', 'NASCEU EM 05.12.1966', 'g2'))
hide('#g1', '#g2'); up('#g1', 15.0); fade('#g2', 16.4)
A('tl.to("#rt",{strokeDashoffset:0,duration:1.6,ease:"power1.inOut"},19.10);')
# 4 — o bar
photo('s4', 22.0, 34.9, 'r1', card('lt', 'AOS 9 ANOS, JÁ CANTAVA EM BAR', 'b1') + card('chip', 'O PARCEIRO: RENNER', 'b2'))
hide('#b1', '#b2'); up('#b1', 25.4); pop('#b2', 33.2)
# 5 — estrada
photo('s5', 34.9, 41.6, 'r2', card('lt', 'BARES · FESTAS · ESTRADA', 'e1'))
hide('#e1'); up('#e1', 35.1)
# 6 — primeiro disco
photo('s6', 41.6, 46.8, 'r4', card('lt', '1º DISCO · 1992', 'f1'), dark=.35)
hide('#f1'); up('#f1', 42.4)
# 7 — Ela é demais
photo('s7', 46.8, 54.6, 'r3', card('big2', '"ELA É DEMAIS"', 'h1') + card('lt2b c', 'O ESTOURO NACIONAL · 1998', 'h2') + card('sub', 'no rádio · na festa · no carro · na casa da vó', 'h3'), dark=.5)
hide('#h1', '#h2', '#h3'); pop('#h1', 46.8); fade('#h2', 47.6); fade('#h3', 51.1)
# 8 — sucessos
photo('s8', 54.6, 61.7, 'r8', '<div class="abs hits"><div id="t1">FILHA</div><div id="t2">NOS BAIRROS ONDE MOREI</div><div id="t3">MULECA</div></div>' + card('lt2b', 'ANOS 90 E 2000', 'h4'), dark=.5)
hide('#t1', '#t2', '#t3', '#h4'); up('#t1', 55.3); up('#t2', 55.9); up('#t3', 57.3); fade('#h4', 59.6)
# 9 — separações e reencontros
TL = '<div class="abs tline"><div class="tl0"></div>' + ''.join(f'<div id="m{i}" class="mk {c}" style="left:{x}px"><b>{y}</b>{t}</div>' for i, (x, y, t, c) in enumerate(
    [(40, '2010', 'SEPARAÇÃO', 'r'), (420, '2012', 'VOLTA', 'g'), (800, '2015', 'SEPARAÇÃO', 'r'), (1180, '2018', 'VOLTA', 'g')])) + '</div>'
photo('s9', 61.7, 80.0, 'r5', card('lt', 'POR TRÁS DO PALCO: UMA PARCERIA TURBULENTA', 'q1') + TL + card('big2 low3', 'COMO UMA FAMÍLIA', 'q2'), dark=.55)
hide('#q1', '#m0', '#m1', '#m2', '#m3', '#q2'); up('#q1', 61.8)
for i, t in enumerate([66.9, 71.9, 73.4, 75.1]): pop(f'#m{i}', t)
up('#q2', 76.4)
# 10 — legado
portrait('s10', 80.0, 84.8, 'rick_palco', card('leg', 'QUASE <span class="y">40 ANOS</span><br>DE MÚSICA<br><small>+10 MILHÕES DE DISCOS</small>', 'l1'), side='right')
hide('#l1'); up('#l1', 80.1)
# 11 — a serra
photo('s11', 84.8, 89.4, 'r6', card('lt2b', 'SERRA CATARINENSE · 21.09.2026', 'se1'), dark=.4)
hide('#se1'); fade('#se1', 85.4)
# 12 — em memória (as 5 vítimas)
NM = [('RICK', 'cantor', 89.4), ('BRUNO AVELAR', 'empresário e escritor', 91.6), ('PAULO SOARES', 'videomaker', 95.1),
      ('ANTÔNIO ROBERTO NÓBREGA ARAÚJO', 'piloto', 96.7), ('LEOPOLDO DE BARROS TEIXEIRA', 'copiloto', 99.5)]
scene('s12', 89.4, 106.6, '<div class="abs black"></div><div class="abs J mem">EM MEMÓRIA</div><img id="c5" class="abs cinco" src="assets/img/cinco_up.jpg">' +
      '<div class="abs names">' + ''.join(f'<div id="n{i}"><b>{n}</b> · {r}</div>' for i, (n, r, _) in enumerate(NM)) + '</div>' +
      card('big2 low4', 'CINCO VIDAS. CINCO FAMÍLIAS.', 'cv'))
hide('#c5', '#cv', *[f'#n{i}' for i in range(5)]); fade('#c5', 89.5, .8)
for i, (_, _, t) in enumerate(NM): up(f'#n{i}', t, .4, 15)
fade('#cv', 101.8, .6)
# 13 — a música fica
photo('s13', 106.6, 114.0, 'r7', card('big2', 'A MÚSICA FICA', 'mf'), dark=.3)
hide('#mf'); fade('#mf', 108.6, .6)
# 14 — loop
portrait('s14', 114.0, END, 'rick_violao', HOOK('b'))
hide('#bh1', '#bh2', '#btg'); fade('#bh1', 114.1, .3); fade('#btg', 114.1, .3)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_m" src="assets/audio/piano.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.14"></audio>']

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ph{left:-96px;top:-54px;width:2112px;height:1188px;object-fit:cover}
.vig{inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,.1),rgba(0,0,0,.9) 100%),linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 65%,rgba(0,0,0,.7))}
.bgf{inset:0;width:1920px;height:1080px;object-fit:cover}
.por{top:60px;height:960px;width:auto;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.8);transform-origin:50% 50%}
.y{color:#FFC83D}
.hk1{left:90px;top:200px;width:980px;font-size:84px;line-height:1.05;text-shadow:0 8px 30px #000}
.hk2{left:90px;top:520px;width:980px;font-size:72px;line-height:1.05;text-shadow:0 8px 30px #000}
.tag{left:90px;top:110px;font-family:"J";font-size:30px;color:#FFC83D;letter-spacing:5px}
.big2{left:80px;right:80px;top:330px;text-align:center;font-size:96px;line-height:1.08;text-shadow:0 8px 30px #000}
.big2.low{top:560px}.big2.low3{top:720px;font-size:64px}.big2.low4{top:820px;font-size:56px}
.nm{left:1050px;top:360px;font-size:150px;line-height:1;text-shadow:0 8px 30px #000}.nm small{display:block;font-family:"J";font-size:34px;color:#FFC83D;margin-top:20px;letter-spacing:3px}
.nm2{left:160px;top:300px;font-size:76px;line-height:1.05}
.lt{left:90px;top:110px;font-family:"J";font-size:44px;background:rgba(0,0,0,.65);padding:12px 22px;border-left:8px solid #FFC83D}
.lt2b{left:160px;top:520px;font-family:"J";font-size:36px;color:#eee;background:rgba(0,0,0,.6);padding:8px 18px;border-radius:8px}
.lt2b.c{left:50%;transform:translateX(-50%);top:470px;white-space:nowrap}
.chip{left:50%;transform:translateX(-50%);top:640px;white-space:nowrap;font-family:"J";font-size:46px;background:#FFC83D;color:#111;padding:14px 28px;border-radius:10px}
.sub{left:50%;transform:translateX(-50%);top:640px;white-space:nowrap;font-family:"J";font-size:38px;color:#eee;background:rgba(0,0,0,.6);padding:10px 22px;border-radius:8px}
.mapbg{inset:0;background:radial-gradient(ellipse at 60% 50%,#13233a,#05080d 80%)}.map{inset:0}.city{font-size:30px;color:#cfe0f5}
.hits{left:0;right:0;top:250px;text-align:center;font-size:84px;line-height:1.3;text-shadow:0 8px 30px #000}
.tline{left:120px;right:120px;top:420px;height:220px}.tl0{position:absolute;left:0;right:0;top:40px;border-top:6px solid rgba(255,255,255,.4)}
.mk{position:absolute;top:0;width:420px;font-family:"J";font-size:34px}.mk b{display:block;font-family:"M";font-size:70px}
.mk.r b{color:#FF6B5E}.mk.g b{color:#3ddc84}
.leg{left:120px;top:300px;font-size:92px;line-height:1.05;text-shadow:0 8px 30px #000}.leg small{display:block;font-family:"J";font-size:40px;color:#ddd;margin-top:24px}
.black{inset:0;background:#050505}
.mem{left:0;right:0;top:60px;text-align:center;font-size:36px;letter-spacing:10px;color:#FFC83D}
.cinco{left:120px;top:150px;width:860px;height:527px;object-fit:cover;border-radius:12px;filter:grayscale(.35)}
.names{left:1040px;right:80px;top:160px;font-family:"J";font-size:26px;line-height:1.35;color:#bbb}
.names div{margin-bottom:16px}.names b{display:block;font-family:"M";font-size:34px;color:#fff}
#caps{position:absolute;left:120px;right:120px;top:930px;height:110px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 7px;font-weight:900;font-size:46px;line-height:1.15;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 4px 14px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>Rick — homenagem</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}">
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
