# The Archive Room — Ep. 01 The Ghost Army (16:9, ~13 min). Gera index.html + legendas .srt.
import json, re, html
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/ga/'
EP = '/home/user/apresentacao_CelPlan/videos/canal_eua/ep01_ghost_army/'
NARR = 778.11
END = NARR + 20.0           # 20s de cartão final (tela final do YouTube)
XF = 1.2                    # crossfade entre fotos

W = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
NW = [norm(w[0]) for w in W]
cursor = 0
def at(phrase):
    """Tempo de início da frase (procura a partir da última encontrada)."""
    global cursor
    ws = [norm(x) for x in phrase.split()]
    for i in range(cursor, len(NW) - len(ws)):
        if NW[i:i + len(ws)] == ws:
            cursor = i + 1; return W[i][1]
    raise SystemExit('frase não encontrada: ' + phrase)

# (frase que abre a cena, imagem, título de capítulo opcional)
PLAN = [
    ('In the autumn of', 'ai1_bicicletas', None),
    ('four young soldiers had', 'nara_100310454', None),
    ('The tank was made', 'nara_100310462', None),
    ('Today, we call them', 'nara_100310468', 'TITLE'),
    ('To understand the Ghost', 'nara_404790269', ('Chapter One', 'An Army of Artists')),
    ('Wars are won and', 'ai8_oficial_alemao', None),
    ('So recruiters went looking', 'ai2_escola_arte', None),
    ('Among them was a', 'ai6_desenho_celeiro', None),
    ('Many of them had', 'nara_292565', None),
    ('The Ghost Army fought', 'nara_100310470', ('Chapter Two', 'Rubber, Sound and Radio')),
    ('From the air, through', 'nara_292565', None),
    ('But the artists knew', 'nara_100310466', None),
    ('The second weapon was', 'ai3_gravacao', None),
    ('At night, they drove', 'ai4_alto_falantes', None),
    ('The third weapon was', 'ai5_radio', None),
    ('And there was a fourth', 'nara_404790442', None),
    ('Sight. Sound. Radio.', 'nara_100310468', None),
    ('In the spring of', 'nara_12003936', ('Chapter Three', 'Landing in France')),
    ('Their first missions were', 'nara_219775780', None),
    ('And their stages were', 'nara_100310454', None),
    ('In late August of', 'nara_204896831', ('Chapter Four', 'Brest, 1944')),
    ('For about a week, the', 'nara_204896795', None),
    ('The answer, it turned', 'nara_204894682', None),
    ('One of the most dangerous', 'nara_276536941', ('Chapter Five', 'Seventy Miles of Nothing')),
    ('There was no time', 'nara_100310470', None),
    ('For about a week, near', 'ai4_alto_falantes', None),
    ('But they did not attack', 'nara_12495809', None),
    ('Even in the middle', 'ai6_desenho_celeiro', ('Chapter Six', 'Sketchbooks in a War Zone')),
    ('They painted the ruined', 'nara_315833802', None),
    ('Hundreds of these sketches', 'nara_404790421', None),
    ('By March of', 'nara_280956221', ('Chapter Seven', 'The Biggest Bluff')),
    ('Crossing a river that', 'ai8_oficial_alemao', None),
    ('So the Ghost Army was given', 'nara_292565', None),
    ('For this performance, the', 'ai4_alto_falantes', None),
    ('When the real crossing', 'nara_148727442', None),
    ('Two months later, the', 'nara_336563823', None),
    ('When the men of', 'nara_350492285', ('Chapter Eight', 'Fifty Years of Silence')),
    ('Their work was classified.', 'ai7_veterano', None),
    ('It was not until', 'nara_176888892', None),
    ('a law was signed', 'nara_404790421', None),
    ('How many lives did', 'nara_505634288', ('Chapter Nine', 'What the Ghosts Left Behind')),
    ('So the next time', 'nara_100310468', None),
    ('And remember those two', 'ai1_bicicletas', None),
]
CAPTIONS = {  # legenda de fonte na foto (canto inferior)
    'nara_': 'U.S. National Archives',
}
times = [at(p) for p, _, _ in PLAN]
times[0] = 0.0

H, J = [], []
A = J.append
for i, ((p, img, chap), t) in enumerate(zip(PLAN, times)):
    s = max(0, t - (XF if i else 0)); e = (times[i + 1] if i + 1 < len(PLAN) else END) + .05
    d = e - s; sid = f's{i}'
    z0, z1 = (1.0, 1.07) if i % 2 == 0 else (1.07, 1.0)
    ox = ['50% 50%', '40% 50%', '60% 50%', '50% 40%'][i % 4]
    src = 'Archive photo: U.S. National Archives' if img.startswith('nara_') else 'Illustrative image'
    H.append(f'<section id="{sid}" class="clip scene" data-start="{s:.2f}" data-duration="{d:.2f}" data-track-index="{2 + i % 2}">'
             f'<div id="{sid}_in" class="abs inner"><img id="{sid}_img" class="abs ph" src="assets/img/{img}.jpg">'
             f'<div class="abs vig"></div><div class="abs src">{src}</div></div></section>')
    A(f'tl.fromTo("#{sid}_img",{{scale:{z0}}},{{scale:{z1},transformOrigin:"{ox}",duration:{d:.2f},ease:"none",immediateRender:false}},{s:.2f});')
    if i: A(f'tl.fromTo("#{sid}_in",{{autoAlpha:0}},{{autoAlpha:1,duration:{XF},ease:"sine.inOut",immediateRender:false}},{s:.2f});')
    if chap == 'TITLE':
        H.append(f'<div id="tt" class="clip abs ovl" data-start="{t:.2f}" data-duration="7" data-track-index="8"><div id="tt_in" class="abs inner"><div class="abs ttbg"></div>'
                 f'<div class="abs ttk">THE ARCHIVE ROOM PRESENTS</div><div class="abs ttl">The Ghost Army</div><div class="abs tts">America\'s secret army of artists · 1944–1945</div></div></div>')
        A(f'tl.fromTo("#tt_in",{{autoAlpha:0}},{{autoAlpha:1,duration:1.2,immediateRender:false}},{t:.2f});tl.to("#tt_in",{{autoAlpha:0,duration:1.2}},{t + 5.6:.2f});')
    elif chap:
        cid = f'c{i}'; ts = t + .6
        H.append(f'<div id="{cid}" class="clip abs ovl" data-start="{ts:.2f}" data-duration="6.5" data-track-index="8"><div id="{cid}_in" class="abs inner">'
                 f'<div class="abs chap"><div class="chk">{chap[0].upper()}</div><div class="cht">{html.escape(chap[1])}</div></div></div></div>')
        A(f'tl.fromTo("#{cid}_in",{{autoAlpha:0,x:-30}},{{autoAlpha:1,x:0,duration:1,ease:"power2.out",immediateRender:false}},{ts:.2f});tl.to("#{cid}_in",{{autoAlpha:0,duration:1}},{ts + 5.3:.2f});')

# abertura: selo do canal nos primeiros segundos
H.append('<div id="op" class="clip abs ovl" data-start="0.30" data-duration="5.5" data-track-index="9"><div id="op_in" class="abs inner"><div class="abs opk">THE ARCHIVE ROOM</div></div></div>')
A('tl.fromTo("#op_in",{autoAlpha:0},{autoAlpha:1,duration:1.2,immediateRender:false},0.3);tl.to("#op_in",{autoAlpha:0,duration:1.2},4.6);')
# cartão final (fundo escuro, espaço para elementos da tela final do YouTube)
H.append(f'<section id="end" class="clip scene" data-start="{NARR + .3:.2f}" data-duration="{END - NARR - .3:.2f}" data-track-index="10"><div id="end_in" class="abs inner endbg">'
         '<img class="abs endlogo" src="assets/img/logo.png"><div class="abs endt">Thank you for spending this time with us.</div>'
         '<div class="abs ends">More stories from the archive →</div></div></section>')
A(f'tl.fromTo("#end_in",{{autoAlpha:0}},{{autoAlpha:1,duration:1.5,immediateRender:false}},{NARR + .3:.2f});')

MEDIA = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="20" data-volume="1"></audio>',
         f'<audio id="a_m" src="assets/audio/piano.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="21" data-volume="0.13"></audio>']

CSS = '''
@font-face{font-family:"P";font-weight:900;src:url(assets/fonts/playfair-display-latin-900-normal.woff2)}
@font-face{font-family:"P";font-weight:700;src:url(assets/fonts/playfair-display-latin-700-normal.woff2)}
@font-face{font-family:"O";font-weight:600;src:url(assets/fonts/oswald-latin-600-normal.woff2)}
@font-face{font-family:"T";src:url(assets/fonts/special-elite-latin-400-normal.woff2)}
body{margin:0;background:#140d08}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#140d08;color:#F3E7CC}
.abs{position:absolute}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}.ovl{inset:0}
.ph{left:-96px;top:-54px;width:2112px;height:1188px}
.vig{inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}
.src{right:28px;bottom:20px;font-family:"T";font-size:20px;color:rgba(243,231,204,.75);text-shadow:0 2px 6px #000}
.chap{left:90px;bottom:110px;padding:22px 34px 26px;background:rgba(20,13,8,.78);border-left:6px solid #C9A96E}
.chk{font-family:"O";font-weight:600;font-size:28px;letter-spacing:8px;color:#C9A96E}
.cht{font-family:"P";font-weight:900;font-size:68px;line-height:1.05;color:#F3E7CC;white-space:nowrap}
.ttbg{inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(10,6,3,.82) 0%,rgba(10,6,3,.55) 60%,rgba(10,6,3,.3) 100%)}
.ttk{left:0;right:0;top:330px;text-align:center;font-family:"O";font-weight:600;font-size:34px;letter-spacing:12px;color:#C9A96E;text-shadow:0 3px 12px #000}
.ttl{left:0;right:0;top:390px;text-align:center;font-family:"P";font-weight:900;font-size:170px;line-height:1;color:#F3E7CC;text-shadow:0 8px 30px #000}
.tts{left:0;right:0;top:600px;text-align:center;font-family:"T";font-size:40px;color:#E6D6B4;text-shadow:0 3px 12px #000}
.opk{left:0;right:0;top:470px;text-align:center;font-family:"O";font-weight:600;font-size:46px;letter-spacing:18px;color:#F3E7CC;text-shadow:0 4px 16px #000}
.endbg{background:radial-gradient(ellipse at 50% 45%,#3a2a1c,#140d08 75%)}
.endlogo{left:760px;top:170px;width:400px;height:400px;border-radius:50%}
.endt{left:0;right:0;top:620px;text-align:center;font-family:"P";font-weight:700;font-size:54px;color:#F3E7CC}
.ends{left:0;right:0;top:720px;text-align:center;font-family:"T";font-size:36px;color:#C9A96E}
'''
page = f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>The Ghost Army</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}" data-fps="24">
{''.join(MEDIA)}
{''.join(H)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
window.__timelines["main"] = tl;
</script></body></html>'''
open(P + 'index.html', 'w').write(page)

# legendas .srt (frases de até ~12 palavras / 6 s)
def ts(x):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'.replace(',1000', ',999')
cues, cur = [], []
for k, w in enumerate(W):
    cur.append(w)
    if re.search(r'[.?!]$', w[0]) or len(cur) >= 12 or (k + 1 < len(W) and W[k + 1][1] - w[2] > .6) or w[2] - cur[0][1] > 6:
        cues.append(cur); cur = []
if cur: cues.append(cur)
with open(EP + 'the_ghost_army.en.srt', 'w') as f:
    for n, c in enumerate(cues, 1):
        f.write(f'{n}\n{ts(c[0][1])} --> {ts(c[-1][2])}\n{" ".join(x[0] for x in c)}\n\n')
print('ok', len(PLAN), 'cenas', len(cues), 'legendas', 'fim', END)
print('\n'.join(f'{t:7.1f} {p[1]} {p[2] if p[2] else ""}' for t, p in zip(times, PLAN)))
