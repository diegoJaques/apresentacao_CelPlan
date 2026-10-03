# Rebobina — Short da homenagem a Rick. 9:16 1080x1920. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/rks/'
NARR = 70.55
END = 70.55

raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1]) for x in json.load(open(P + 'words.json'))]
FIX = {'Ricky': 'Rick &', 'Ranner.': 'Renner.', 'Nobregar': 'Nóbrega', 'Aujo': 'Araújo', 'Eixeira.': 'Teixeira.',
       'canta,': 'canta', 'ela': '"Ela', 'demais': 'demais"', 'Ela': '"Ela', 'demais.': 'demais".'}
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t == 'de' and nx == 'Eixeira.': continue
    if t == 'video' and nx.startswith('-maker'): t = 'videomaker'; skip = True
    W.append((FIX.get(t, t), s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.5, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.6): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')

groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 3 or re.search(r'[.?!,:…]$', w[0]) or (nx[1]-w[2] > .35):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.6, END)
    if e - s < .15: continue
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0])}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H = []
def scene(id_, s, e, inner):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">{inner}</div></section>')
def photo(id_, s, e, img, inner='', dark=.45, z=(1.0, 1.08)):
    scene(id_, s, e, f'<img id="{id_}_img" class="abs ph" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>' + inner)
    A(f'tl.fromTo("#{id_}_img",{{scale:{z[0]}}},{{scale:{z[1]},duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def portrait(id_, s, e, img, inner=''):
    scene(id_, s, e, f'<img class="abs bgv" src="assets/img/{img}_bg.jpg"><img id="{id_}_img" class="abs pv" src="assets/img/{img}.jpg"><div class="abs vig2"></div>' + inner)
    A(f'tl.fromTo("#{id_}_img",{{scale:1}},{{scale:1.06,duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'

HOOK = lambda p: (card('tag', 'REBOBINA · HOMENAGEM', p + 'tg') +
                  card('hk1', 'COMEÇOU CANTANDO<br>EM BAR, AOS <span class="y">9 ANOS</span>', p + 'h1') +
                  card('hk2', '…E VENDEU<br><span class="y">+10 MILHÕES</span><br>DE DISCOS', p + 'h2'))

portrait('s0', 0, 6.4, 'rick_violao', HOOK('a'))
hide('#ah2'); up('#ah2', 3.4)
photo('s1', 6.4, 11.5, 'r5', card('big', 'A DUPLA<br>ACABOU…', 'd1') + card('big low', 'E VOLTOU<br><span class="y" id="d3n">1</span>×', 'd2'), dark=.3)
hide('#d1', '#d2'); up('#d1', 6.6); up('#d2', 9.1)
A('tl.set("#d3n",{textContent:"2"},9.75);'); A('tl.set("#d3n",{textContent:"3"},10.15);')
portrait('s2', 11.5, 14.75, 'rick_retrato', card('nm', 'RICK<small>RICK &amp; RENNER<br>1966 – 2026</small>', 'nm'))
hide('#nm'); up('#nm', 11.7)
photo('s3', 14.75, 22.7, 'r3', card('big', '"ELA É<br>DEMAIS"', 'h1') + card('pill', 'O ESTOURO NACIONAL · 1998', 'h2'), dark=.5)
hide('#h1', '#h2'); pop('#h1', 14.9); fade('#h2', 15.8)
TL = '<div class="abs tline">' + ''.join(f'<div id="m{i}" class="mk {c}"><b>{y}</b>{t}</div>' for i, (y, t, c) in enumerate(
    [('2010', 'SEPARAÇÃO', 'r'), ('2012', 'VOLTA', 'g'), ('2015', 'SEPARAÇÃO', 'r'), ('2018', 'VOLTA', 'g')])) + '</div>'
photo('s4', 22.7, 37.25, 'r5', card('pill top', 'POR TRÁS DO PALCO', 'q1') + TL, dark=.6)
hide('#q1', '#m0', '#m1', '#m2', '#m3'); up('#q1', 22.8)
for i, t in enumerate([28.0, 33.0, 34.5, 36.2]): pop(f'#m{i}', t)
photo('s5', 37.25, 41.95, 'r6', card('pill', 'SERRA CATARINENSE · 21.09.2026', 'se1'), dark=.4)
hide('#se1'); fade('#se1', 37.9)
NM = [('RICK', 'cantor', 41.95), ('BRUNO AVELAR', 'empresário e escritor', 44.2), ('PAULO SOARES', 'videomaker', 47.7),
      ('ANTÔNIO ROBERTO NÓBREGA ARAÚJO', 'piloto', 49.3), ('LEOPOLDO DE BARROS TEIXEIRA', 'copiloto', 52.1)]
scene('s6', 41.95, 59.15, '<div class="abs black"></div><div class="abs J mem">EM MEMÓRIA</div><img id="c5" class="abs cinco" src="assets/img/cinco_up.jpg">' +
      '<div class="abs names">' + ''.join(f'<div id="n{i}"><b>{n}</b>{r}</div>' for i, (n, r, _) in enumerate(NM)) + '</div>')
hide('#c5', *[f'#n{i}' for i in range(5)]); fade('#c5', 42.0, .8)
for i, (_, _, t) in enumerate(NM): up(f'#n{i}', t, .4, 15)
photo('s7', 59.15, 66.55, 'r7', card('big', 'A MÚSICA<br>FICA', 'mf'), dark=.3)
hide('#mf'); fade('#mf', 61.1, .6)
portrait('s8', 66.55, END, 'rick_violao', HOOK('b'))
hide('#bh1', '#bh2', '#btg'); fade('#bh1', 66.6, .3); fade('#btg', 66.6, .3)

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>',
         f'<audio id="a_m" src="assets/audio/piano.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.14"></audio>']

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ph{left:-640px;top:0;width:3413px;height:1920px;object-fit:cover}
.bgv{left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.pv{left:50%;margin-left:-375px;top:400px;width:750px;height:1000px;object-fit:cover;object-position:50% 20%;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.8)}
.vig{inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,.1),rgba(0,0,0,.9) 100%),linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 60%,rgba(0,0,0,.8))}
.vig2{inset:0;background:linear-gradient(rgba(0,0,0,.7) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 60%,rgba(0,0,0,.75) 85%)}
.y{color:#FFC83D}
.tag{left:0;right:0;top:90px;text-align:center;font-family:"J";font-size:30px;color:#FFC83D;letter-spacing:5px}
.hk1{left:40px;right:40px;top:150px;text-align:center;font-size:84px;line-height:1.05;text-shadow:0 8px 30px #000}
.hk2{left:40px;right:40px;top:1200px;text-align:center;font-size:84px;line-height:1.05;text-shadow:0 8px 30px #000;-webkit-text-stroke:3px #000;paint-order:stroke fill}
.big{left:40px;right:40px;top:300px;text-align:center;font-size:120px;line-height:1.02;text-shadow:0 8px 30px #000}
.big.low{top:1000px}
.nm{left:0;right:0;top:1150px;text-align:center;font-size:170px;line-height:1;text-shadow:0 8px 30px #000}.nm small{display:block;font-family:"J";font-size:40px;color:#FFC83D;margin-top:20px;letter-spacing:3px;line-height:1.4}
.pill{left:50%;transform:translateX(-50%);top:640px;white-space:nowrap;font-family:"J";font-size:38px;color:#eee;background:rgba(0,0,0,.65);padding:12px 24px;border-radius:10px}
.pill.top{top:220px}
.tline{left:120px;right:120px;top:420px}
.mk{font-family:"J";font-size:40px;margin-bottom:46px;padding-left:30px;border-left:10px solid #888}.mk b{display:block;font-family:"M";font-size:110px;line-height:1}
.mk.r{border-color:#FF6B5E}.mk.r b{color:#FF6B5E}.mk.g{border-color:#3ddc84}.mk.g b{color:#3ddc84}
.black{inset:0;background:#050505}
.mem{left:0;right:0;top:140px;text-align:center;font-size:40px;letter-spacing:10px;color:#FFC83D}
.cinco{left:40px;top:230px;width:1000px;height:613px;object-fit:cover;border-radius:12px;filter:grayscale(.35)}
.names{left:70px;right:70px;top:900px;font-family:"J";font-size:30px;line-height:1.3;color:#bbb;text-align:center}
.names div{margin-bottom:20px}.names b{display:block;font-family:"M";font-size:40px;color:#fff}
#caps{position:absolute;left:40px;right:40px;top:1530px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:68px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Rick — Short</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
