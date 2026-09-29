# Gera os dois Shorts verticais (1080x1920) recortados do vídeo longo HyperFrames — bastidores
import json, html, re
S = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/'
d = json.load(open(S + 'longo/timing.json')); T = d['T']; WORDS = d['words']
BASE = open(S + 'longo/style.css').read()

VCSS = '''
#root{background:#05070D}
#bg{background:radial-gradient(ellipse at 50% 25%,#10214a 0%,#05070D 70%)}
#bgglow{right:-300px;top:600px;width:1300px;height:1300px}
.avatar{left:40px;top:700px;width:1000px;height:1308px}
#caps{position:absolute;left:40px;right:40px;top:1380px;height:260px;bottom:auto}
.capg{top:0;bottom:auto}
.capg span{font-size:72px;margin:0 10px;line-height:1.15}
.ttl{position:absolute;left:50px;right:50px;text-align:center;font-weight:900;text-transform:uppercase;line-height:1.02;text-shadow:0 8px 30px rgba(0,0,0,.9)}
.vcapa{position:absolute;width:290px;height:516px;border-radius:20px;overflow:hidden;border:6px solid #fff;box-shadow:0 30px 70px rgba(0,0,0,.7)}
.vcapa img{display:block;width:100%;height:100%;object-fit:cover}
.vchk{position:absolute;left:70px;width:940px;font-weight:900;font-size:50px;padding:24px 30px;border-radius:18px;background:rgba(14,20,36,.95);border:4px solid rgba(24,232,255,.45)}
#hud{right:40px;top:40px;font-size:24px}
'''

def build(name, dur, words, t0, body, js, media, hud, capy=1380):
    """words: lista (palavra, inicio_global, fim_global); t0 = tempo global que vira 0 no Short."""
    ws = [(w, round(s - t0, 2), round(e - t0, 2)) for w, s, e in words]
    groups, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w); nx = ws[i+1] if i+1 < len(ws) else None
        if (not nx) or len(cur) >= 4 or re.search(r'[.?!,:]$', w[0]) or (nx[1] - w[2] > .45):
            groups.append(cur); cur = []
    ch, cj = [], []
    for gi, gr in enumerate(groups):
        s = max(0, gr[0][1]); e = groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2] + .6
        e = min(e, gr[-1][2] + .7, dur)
        s = min(s, dur - .3)
        if e - s < .2: e = s + .2
        e = min(e, dur)
        sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",."))}</span>' for j, x in enumerate(gr))
        ch.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
        for j, x in enumerate(gr):
            cj.append(f'tl.set("#w{gi}_{j}",{{color:"#B6FF3B"}},{max(0,x[1]):.2f});')
            if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')
    page = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>{name}</title>
<script src="gsap.min.js"></script>
<style>{BASE}{VCSS}#caps{{top:{capy}px}}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{dur:.2f}">
<div id="bg"><div id="bggrid"></div><div id="bgglow"></div></div>
{media}
{body}
<div id="caps">{''.join(ch)}</div>
<div id="hud"><span class="rec">●</span> {hud}</div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
tl.fromTo("#bggrid",{{backgroundPositionY:"0px"}},{{backgroundPositionY:"{int(dur*40)}px",duration:{dur:.2f},ease:"none"}},0);
{chr(10).join(js)}
{chr(10).join(cj)}
window.__timelines["main"] = tl;
</script>
</body>
</html>'''
    open(S + name + '/index.html', 'w').write(page)
    print(name, 'ok', len(groups), 'grupos')

def anim():
    J = []
    A = lambda s: J.append(s)
    f = {
        'pop':  lambda sel, t, d=.45: A(f'tl.fromTo("{sel}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.2)"}},{t:.2f});'),
        'up':   lambda sel, t, d=.5: A(f'tl.fromTo("{sel}",{{opacity:0,y:50}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});'),
        'left': lambda sel, t, d=.5: A(f'tl.fromTo("{sel}",{{opacity:0,x:-90}},{{opacity:1,x:0,duration:{d},ease:"power3.out"}},{t:.2f});'),
        'out':  lambda sel, t, d=.3: A(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});'),
        'slam': lambda sel, t: A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.4}},{{opacity:1,scale:1,duration:.22,ease:"power4.out"}},{t:.2f});'),
        'hide': lambda sel: A(f'tl.set("{sel}",{{opacity:0}},0);'),
    }
    return J, f

# ================= SHORT 1 — O ERRO QUE UM INSCRITO PEGOU =================
CUT = 3.70                         # corta "Agora, lembra da checagem de fatos?"
g0 = T['av4'] + CUT
DUR1 = round(34.92 - CUT, 2)
w1 = [w for w in WORDS if g0 - .05 <= w[1] < T['av4'] + 34.92]
L = lambda lt: round(lt - CUT, 2)  # tempo local do avatar -> tempo do Short
J, a = anim()
body1 = '''
<div id="t_hook" class="ttl" style="top:90px;font-size:78px">UM INSCRITO<br><span class="red">ME CORRIGIU</span></div>
<div id="t_col" class="ttl" style="top:130px;font-size:66px">COLISÃO <span class="red">≠</span> NAUFRÁGIO</div>
<div id="cA" class="vcapa" style="left:200px;top:250px;transform:rotate(-4deg)"><img src="assets/img/capa_violet_errada.jpg"><div id="cAx" class="xmark">✗</div></div>
<div id="cB" class="vcapa" style="left:590px;top:250px;transform:rotate(4deg)"><img src="assets/img/capa_violet_certa.jpg"><div class="okmark">✓</div></div>
<div id="cmt" class="comment" style="position:absolute;left:90px;top:640px;margin:0;font-size:46px;box-shadow:0 20px 50px rgba(0,0,0,.6)"><b>@inscrito</b> o Olympic nunca afundou</div>
<div id="chips" class="row" style="top:140px;gap:16px"><div class="chip lmc">✓ Corrigi</div><div class="chip lmc">✓ Agradeci</div><div class="chip lmc">✓ Fixei</div></div>
<div id="quote" class="ttl" style="top:170px;font-size:84px;color:#FFC233">A IA ACELERA TUDO.<br><span style="color:#fff">QUEM RESPONDE<br>PELO VÍDEO?</span><br><span class="lm">SOU EU.</span></div>
'''
media1 = (f'<video id="v_av" class="clip avatar" src="assets/clips/av_av4.webm" data-start="0" data-media-start="{CUT:.2f}" data-duration="{DUR1:.2f}" data-track-index="5" muted playsinline></video>'
          f'<audio id="a_av" src="assets/audio/av4.mp3" data-start="0" data-media-start="{CUT:.2f}" data-duration="{DUR1:.2f}" data-track-index="11" data-volume="1"></audio>')
for s in ['#t_col', '#cB', '#cmt', '#chips', '#quote', '#cAx']: a['hide'](s)
J.append('tl.fromTo("#t_hook",{scale:1},{scale:1.06,duration:.5,yoyo:true,repeat:3,ease:"sine.inOut"},0);')
a['slam']('#cAx', L(12.1))
a['up']('#cmt', L(14.46))
a['out']('#t_hook', L(19.4), .15); a['slam']('#t_col', L(19.54))
a['out']('#cmt', L(25.9)); a['pop']('#cB', L(26.46))
a['out']('#t_col', L(27.2), .2); a['pop']('#chips', L(27.4))
for s in ['#cA', '#cB', '#chips']: a['out'](s, L(30.5))
a['up']('#quote', L(30.74))
J.append(f'tl.fromTo("#quote .lm",{{scale:1}},{{scale:1.15,duration:.25,yoyo:true,repeat:1}},{L(34.42):.2f});')
build('sh_erro', DUR1, w1, g0, body1, J, media1, 'BASTIDORES')

# ================= SHORT 2 — ESSA VOZ É IA =================
VS = 3.10                          # corta "Etapa 2. A voz e o avatar."
VE = 40.22
g0 = T['b5'] + VS
DUR2 = round(VE - VS, 2)
w2 = [w for w in WORDS if g0 - .05 <= w[1] < T['b5'] + VE]
V = lambda rt: round(rt - VS, 2)   # tempo relativo ao bloco -> tempo do Short
J, a = anim()
body2 = f'''
<div id="h1" class="ttl" style="top:240px;font-size:96px">ESSA VOZ<br><span class="mg">É IA</span></div>
<div id="h1s" class="ttl" style="top:460px;font-size:40px;color:#c9d4e6;font-weight:700">clonada da minha voz real</div>
<div id="wave" class="wave" style="left:90px;top:600px;width:900px;height:300px">{''.join(f'<i id="wb{i}"></i>' for i in range(32))}</div>
<div id="el" class="row" style="top:950px"><div class="chip">🎙 ElevenLabs · Eleven v4</div></div>
<div id="h2" class="ttl" style="top:250px;font-size:80px">O SEGREDO<br>ESTÁ NO <span class="lm">TEXTO</span></div>
<div id="k1" class="vchk" style="top:470px"><span class="mono cy">1983</span> → mil novecentos<br>e oitenta e três</div>
<div id="k2" class="vchk" style="top:670px">Reticências… = <span class="cy">suspense</span></div>
<div id="k3" class="vchk" style="top:810px">MAIÚSCULA = <span class="cy">ÊNFASE</span></div>
<div id="k4" class="row" style="top:980px;gap:16px"><div id="p1" class="chip mg">[sussurra]</div><div id="p2" class="chip mg">[animado]</div><div id="p3" class="chip mg">[pausa longa]</div></div>
<div id="h3" class="ttl" style="top:240px;font-size:76px">MESMO ÁUDIO<br>→ <span class="cy">AVATAR</span></div>
<div id="ph" class="phone" style="left:330px;top:460px;width:420px;height:560px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#10214a,#05070D)"><img src="assets/img/avatar.png" style="position:absolute;left:-10px;top:10px;width:440px"><div class="chip sm lmc" style="position:absolute;left:50%;bottom:20px;transform:translateX(-50%)">👄 boca sincronizada</div></div>
<div id="h4" class="ttl" style="top:240px;font-size:80px;color:#FFC233">REGRA DE OURO</div>
<div id="r1" class="vchk" style="top:460px;border-color:#B6FF3B;color:#B6FF3B;font-size:60px;text-align:center">✓ MESMO ÁUDIO</div>
<div id="r2" class="vchk" style="top:650px;border-color:#FF4757;color:#FF4757;font-size:56px;text-align:center">✗ OUTRO ÁUDIO<br>= BOCA NÃO BATE</div>
<div id="r3" class="ttl" style="top:930px;font-size:54px">E TODO MUNDO <span class="red">PERCEBE</span></div>
<div id="trk" class="card" style="left:70px;top:1560px;width:940px;height:170px;padding:18px 24px"><div class="mono" style="font-size:24px;color:#8ea3c4">🎙 voz_clonada.mp3</div><div class="wave" style="left:24px;right:24px;top:62px;height:90px">{''.join(f'<i id="tb{i}"></i>' for i in range(48))}</div><div id="ph2" style="position:absolute;top:10px;bottom:10px;width:5px;background:#FF4757;left:24px"></div></div>
'''
media2 = f'<audio id="a_voz" src="assets/audio/voz.mp3" data-start="0" data-media-start="{71.5+VS:.2f}" data-duration="{DUR2:.2f}" data-track-index="12" data-volume="1"></audio>'
for s in ['#el', '#h2', '#k1', '#k2', '#k3', '#k4', '#h3', '#ph', '#h4', '#r1', '#r2', '#r3']: a['hide'](s)
J.append(f'for(let i=0;i<32;i++){{tl.fromTo("#wb"+i,{{scaleY:.2}},{{scaleY:()=>.3+.7*Math.abs(Math.sin(i*.9)),duration:.35,yoyo:true,repeat:{int(DUR2/0.7)},ease:"sine.inOut"}},i*.02);}}')
J.append('tl.fromTo("#h1 .mg",{scale:1},{scale:1.12,duration:.4,yoyo:true,repeat:3,ease:"sine.inOut"},0);')
a['pop']('#el', V(7.0))
for s in ['#h1', '#h1s', '#wave', '#el']: a['out'](s, V(7.9), .2)
a['up']('#h2', V(8.04))
a['left']('#k1', V(11.46)); a['left']('#k2', V(13.36)); a['left']('#k3', V(15.74))
J.append(f'tl.set("#k4",{{opacity:1}},{V(18.12):.2f});')
for s in ['#p1', '#p2', '#p3']: a['hide'](s)
a['pop']('#p1', V(20.86)); a['pop']('#p2', V(21.92)); a['pop']('#p3', V(22.8))
for s in ['#h2', '#k1', '#k2', '#k3', '#k4']: a['out'](s, V(25.6), .2)
a['up']('#h3', V(25.76)); a['pop']('#ph', V(27.86))
for s in ['#h3', '#ph']: a['out'](s, V(30.35), .2)
a['up']('#h4', V(30.5)); a['left']('#r1', V(32.64)); a['slam']('#r2', V(37.06)); a['pop']('#r3', V(39.5))
J.append(f'for(let i=0;i<48;i++){{tl.fromTo("#tb"+i,{{scaleY:.25}},{{scaleY:()=>.3+.7*Math.abs(Math.sin(i*1.7)),duration:.3,yoyo:true,repeat:{int(DUR2/0.6)},ease:"sine.inOut"}},i*.015);}}')
J.append(f'tl.fromTo("#ph2",{{x:0}},{{x:880,duration:{DUR2:.2f},ease:"none"}},0);')
build('sh_voz', DUR2, w2, g0, body2, J, media2, 'VOZ CLONADA', capy=1300)
