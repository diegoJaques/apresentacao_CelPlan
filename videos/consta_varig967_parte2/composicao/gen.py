# Consta nos Autos — Varig 967 parte 2 (Short 1080x1920). Gera index.html.
import json, html, re, math
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/varig/'
END = 33.45
FIX = {'pôs': 'pousa', 'Várid,': 'Varig,', 'Mab.': 'Mabe.'}
W = [(FIX.get(w['text'].strip(), w['text'].strip()), w['timestamp'][0], w['timestamp'][1]) for w in json.load(open(P + 'words.json'))]

# cenas
H0, PA, TK, RD, NO, FN = 0, 5.9, 14.85, 21.2, 24.05, 27.6
CAP_ON = [(PA + .12, FN)]            # legendas só fora do gancho e do fecho (lá o texto da capa já está na tela)

J = []
def A(s): J.append(s)
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.4)"}},{t:.2f});')
def up(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{opacity:0,y:60}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{opacity:0,scale:2.6}},{{opacity:1,scale:1,duration:.2,ease:"power4.out"}},{t:.2f});')
def out(sel, t, d=.25): A(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def show(sel, t): A(f'tl.set("{sel}",{{opacity:1}},{t:.2f});')
def hide(sel, t=0): A(f'tl.set("{sel}",{{opacity:0}},{t:.2f});')

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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC233"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

def clip(id_, s, e, inner, extra=''):
    return f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2" {extra}>{inner}</section>'

PLANE = '''<div class="plane"><i class="fus"></i><i class="win"></i><i class="fin"></i><i class="eng e1"></i><i class="eng e2"></i><i class="stripe"></i></div>'''

H = []
# ---------- camada do radar (gancho + fecho = capa) ----------
H.append(f'''<div id="radarL">
<div id="radar" class="abs"></div><div id="sweep" class="abs"></div>
<div id="blip" class="abs"></div><div id="ring" class="abs"></div>
<div id="blab" class="abs J">VARIG 967<br><span class="red">SINAL PERDIDO</span></div>
<div id="rdate" class="abs J">TÓQUIO · 30 JAN 1979</div>
</div>
<div id="tTop" class="abs t" style="top:150px;font-size:80px">ELE ESCAPOU DE UM<br><span class="yl">AVIÃO EM CHAMAS</span></div>
<div id="tBot" class="abs t" style="top:1280px;font-size:88px">6 ANOS DEPOIS<br><span class="red">SUMIU COM OUTRO</span></div>''')

# ---------- PARIS 1973 ----------
H.append(clip('sc_pa', PA, TK, f'''
<div class="sky fire"></div>
<div id="field" class="abs" data-layout-allow-overflow></div>
<div id="pa_h" class="abs chipL">PARIS · 11 JUL 1973</div>
<div id="pa_f" class="abs strip">VARIG 820 · BOEING 707</div>
<div id="pa_pl" class="abs" data-layout-allow-overflow style="left:300px;top:520px">{PLANE}</div>
{''.join(f'<div id="sm{i}" class="abs smoke" style="left:{560+i*38}px;top:{560-i*6}px"></div>' for i in range(7))}
<div id="pa_dim" class="abs" style="inset:0;background:rgba(0,0,0,.55)"></div>
<div id="pa_m" class="abs t" style="top:420px;font-size:120px"><span class="red">123</span><div style="font-size:54px;margin-top:16px">MORTOS</div></div>
<div id="pa_s" class="abs t" style="top:720px;font-size:120px"><span class="lm">11</span><div style="font-size:54px;margin-top:16px">SOBREVIVEM</div></div>
<div id="pa_c" class="abs card" style="left:170px;top:1010px;width:740px">✓ &nbsp;incluindo o COMANDANTE</div>
'''))
up('#pa_h', PA+.05); up('#pa_f', PA+.25)
A(f'tl.fromTo("#pa_pl",{{x:-420,y:-40,rotation:4}},{{x:0,y:0,rotation:6,duration:{9.58-PA:.2f},ease:"none"}},{PA:.2f});')
for i in range(7):
    A(f'tl.fromTo("#sm{i}",{{opacity:0,scale:.3,x:0,y:0}},{{opacity:.85,scale:{2.2+i*.25:.2f},x:{-120-i*40},y:{-140-i*25},duration:1.6,ease:"power1.out"}},{7.74+i*.18:.2f});')
    A(f'tl.to("#sm{i}",{{x:"-=160",y:"-=120",opacity:.5,duration:{14.8-9.4-i*.18:.2f},ease:"none"}},{9.4+i*.18:.2f});')
A(f'tl.to("#pa_pl",{{x:120,y:420,rotation:-2,scale:.85,duration:1.5,ease:"power2.inOut"}},9.6);')
A('tl.fromTo("#field",{opacity:0,y:200},{opacity:1,y:0,duration:.8,ease:"power2.out"},9.7);')
for s in ['#pa_dim', '#pa_m', '#pa_s', '#pa_c']: hide(s)
A('tl.fromTo("#pa_dim",{opacity:0},{opacity:1,duration:.3},11.6);')
out('#pa_h', 11.6); out('#pa_f', 11.6)
slam('#pa_m', 11.68); slam('#pa_s', 13.28); up('#pa_c', 13.7)

# ---------- TÓQUIO 1979 ----------
TILES = ''.join(f'<i style="background:hsl({(i*47)%360},70%,{45+(i*13)%25}%)"></i>' for i in range(153))
H.append(clip('sc_tk', TK, RD, f'''
<div class="sky night"></div>
<div id="tk_sun" class="abs"></div>
<div id="tk_h" class="abs chipL">TÓQUIO · 30 JAN 1979</div>
<div id="tk_f" class="abs strip" style="top:300px">VARIG 967 · BOEING 707 CARGUEIRO</div>
<div id="tk_pl" class="abs" data-layout-allow-overflow style="left:360px;top:430px">{PLANE}</div>
<div id="tk_g" class="abs tiles">{TILES}</div>
<div id="tk_n" class="abs t" style="top:1080px;font-size:130px"><span id="tk_c">0</span><div style="font-size:46px;margin-top:16px">QUADROS DE MANABU MABE</div></div>
'''))
up('#tk_h', TK+.05); pop('#tk_sun', TK+.05, .6)
A(f'tl.fromTo("#tk_pl",{{x:-500,y:160,rotation:-12}},{{x:700,y:-260,rotation:-12,duration:3.2,ease:"power1.in"}},16.4);')
up('#tk_f', 16.42)
hide('#tk_g'); hide('#tk_n')
show('#tk_g', 18.3); show('#tk_n', 18.3)
A('tl.fromTo("#tk_g i",{opacity:0,scale:0},{opacity:1,scale:1,duration:.18,stagger:.0085,ease:"back.out(2)"},18.32);')
A('(()=>{const o={v:0};tl.to(o,{v:153,duration:1.4,ease:"power1.out",onUpdate:()=>{document.querySelector("#tk_c").textContent=Math.round(o.v)}},18.32);})();')

# ---------- RÁDIO ----------
H.append(clip('sc_rd', RD, NO, f'''
<div class="sky night"></div>
<div id="rd_clk" class="abs t J" style="top:220px;font-size:110px;color:#50FF8C">T+00:30</div>
<div id="rd_lab" class="abs t J" style="top:370px;font-size:34px;color:#8fb3a0">TORRE DE TÓQUIO → VARIG 967</div>
<div id="rd_w" class="abs wave2">{''.join(f'<i id="rb{i}"></i>' for i in range(40))}</div>
<div id="rd_flat" class="abs"></div>
<div id="rd_s" class="abs t" style="top:960px;font-size:130px;letter-spacing:6px">SILÊNCIO</div>
'''))
up('#rd_clk', RD+.05); up('#rd_lab', RD+.2)
A(f'for(let i=0;i<40;i++){{tl.fromTo("#rb"+i,{{scaleY:.15}},{{scaleY:()=>.25+.75*Math.abs(Math.sin(i*1.3)),duration:.22,yoyo:true,repeat:5,ease:"sine.inOut"}},{RD+.1:.2f}+i*.01);}}')
A('tl.to("#rd_w i",{scaleY:.03,duration:.15},22.82);')
hide('#rd_flat'); show('#rd_flat', 22.82); hide('#rd_s'); slam('#rd_s', 22.9)

# ---------- NENHUM ----------
H.append(clip('sc_no', NO, FN, '''
<div class="sky ocean"></div><div id="waves" class="abs"></div>
<div id="n1" class="abs stamp2" style="top:430px;transform:rotate(-4deg)">NENHUM DESTROÇO</div>
<div id="n2" class="abs stamp2" style="top:660px;transform:rotate(3deg)">NENHUM CORPO</div>
<div id="n3" class="abs stamp2" style="top:890px;transform:rotate(-2deg)">NENHUM SINAL</div>
'''))
A(f'tl.fromTo("#waves",{{backgroundPositionX:"0px"}},{{backgroundPositionX:"-600px",duration:{FN-NO:.2f},ease:"none"}},{NO:.2f});')
for s, t in [('#n1', 24.12), ('#n2', 25.5), ('#n3', 26.68)]: hide(s); slam(s, t)

# ---------- FECHO (volta ao quadro da capa) ----------
H.append(clip('sc_fn', FN, 31.3, '''
<div id="fn_card" class="abs pcard">
 <div class="J" style="font-size:28px;color:#8fb3a0;margin-bottom:10px">COMANDANTE</div>
 <div style="font-size:52px;line-height:1.05">GILBERTO ARAÚJO<br>DA SILVA</div>
 <div id="fn_a" class="prow lmr">1973 · VARIG 820 &nbsp;<b>✓ SOBREVIVEU</b></div>
 <div id="fn_b" class="prow redr">1979 · VARIG 967 &nbsp;<b>✗ DESAPARECEU</b></div>
</div>'''))
up('#fn_card', FN+.1); hide('#fn_a'); hide('#fn_b'); up('#fn_a', 28.2); slam('#fn_b', 29.58)

# visibilidade da camada do radar / textos da capa
A(f'tl.set(["#radarL","#tTop","#tBot"],{{autoAlpha:0}},{PA:.2f});')
A(f'tl.set("#radarL",{{autoAlpha:.3}},{FN:.2f});')
A('tl.to("#fn_card",{autoAlpha:0,duration:.25},31.2);')
A(f'tl.set(["#blab","#rdate"],{{autoAlpha:0}},{FN:.2f});tl.set(["#blab","#rdate"],{{autoAlpha:1}},31.25);')
A('tl.to("#radarL",{autoAlpha:1,duration:.3},31.25);')
A('tl.fromTo(["#tTop","#tBot"],{autoAlpha:0},{autoAlpha:1,duration:.3,immediateRender:false},31.3);')
# radar: varredura, blip some em "sumiu" e volta no fim (loop)
A(f'tl.fromTo("#sweep",{{rotation:0}},{{rotation:{360*9},duration:{END:.2f},ease:"none"}},0);')
A('tl.fromTo("#ring",{scale:1,opacity:1},{scale:1.6,opacity:0,duration:.9,repeat:4,ease:"power1.out"},0);')
A('tl.to(["#blip","#ring"],{opacity:0,duration:.08},4.66);tl.to("#blip",{opacity:1,duration:.06},4.8);tl.to("#blip",{opacity:0,duration:.06},4.95);')
A('tl.set(["#blip","#ring"],{opacity:1},31.3);tl.fromTo("#ring",{scale:1,opacity:1},{scale:1.6,opacity:0,duration:.9,repeat:1,ease:"power1.out",immediateRender:false},31.3);')
A('tl.fromTo("#blab .red",{opacity:1},{opacity:.25,duration:.15,yoyo:true,repeat:5},4.7);')

SFX = [('ping', .02, .35, .35), ('ping', 1.9, .35, .25), ('whump', 4.64, .5, .6), ('whump', 11.68, .5, .5), ('whump', 13.28, .5, .4),
       ('static', 22.82, .9, .35), ('whump', 24.12, .5, .6), ('whump', 25.5, .5, .6), ('whump', 26.68, .5, .6), ('whump', 29.58, .5, .5), ('ping', 31.3, .35, .3)]
media = [f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>']
for i, (f, t, d, v) in enumerate(SFX):
    media.append(f'<audio id="fx{i}" src="assets/audio/{f}.wav" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="{11+i%3}" data-volume="{v}"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#020806}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#06281f 0%,#020806 70%);font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0}
.red{color:#FF6161}.yl{color:#FFC233}.lm{color:#50FF8C}
.t{left:40px;right:40px;text-align:center;text-transform:uppercase;line-height:1;white-space:nowrap;text-shadow:0 10px 30px #000}
#radarL{position:absolute;inset:0}
#radar{left:170px;top:420px;width:740px;height:740px;border-radius:50%;border:4px solid rgba(80,255,140,.6);
 background:repeating-radial-gradient(circle,rgba(80,255,140,0) 0 121px,rgba(80,255,140,.35) 121px 124px),
 linear-gradient(rgba(80,255,140,.25),rgba(80,255,140,.25)) center/3px 100% no-repeat,
 linear-gradient(90deg,rgba(80,255,140,.25),rgba(80,255,140,.25)) center/100% 3px no-repeat,
 radial-gradient(circle,#062a1a,#010a06);box-shadow:0 0 80px rgba(80,255,140,.25) inset,0 0 60px rgba(0,0,0,.8)}
#sweep{left:170px;top:420px;width:740px;height:740px;border-radius:50%;background:conic-gradient(from 20deg,rgba(80,255,140,.55),rgba(80,255,140,0) 70deg,rgba(80,255,140,0))}
#blip{left:640px;top:600px;width:36px;height:36px;border-radius:50%;background:#FF3B3B;box-shadow:0 0 30px 10px rgba(255,59,59,.7)}
#ring{left:614px;top:574px;width:88px;height:88px;border-radius:50%;border:4px dashed #FF3B3B}
#blab{left:700px;top:570px;font-size:32px;color:#50FF8C;line-height:1.25}
#rdate{left:0;right:0;text-align:center;top:1190px;font-size:30px;color:#50FF8C;opacity:.8}
.sky{position:absolute;inset:0}
.fire{background:linear-gradient(#2a0a04 0%,#5a1a08 45%,#12060a 100%)}
.night{background:radial-gradient(ellipse at 50% 30%,#0d1830,#03060d 75%)}
.ocean{background:linear-gradient(#020812 0%,#041a33 55%,#020a14 100%)}
#waves{left:0;right:0;top:1000px;height:400px;background-image:repeating-linear-gradient(170deg,rgba(120,180,255,.10) 0 4px,transparent 4px 46px);opacity:.8}
#field{left:-200px;right:-200px;top:880px;height:560px;transform:perspective(600px) rotateX(58deg);transform-origin:top;background:repeating-linear-gradient(90deg,#1f4a18 0 34px,#2f6a22 34px 44px,#3a2a12 44px 70px)}
.chipL{left:50%;transform:translateX(-50%);top:170px;font-family:"J";font-weight:700;font-size:40px;background:#FFC233;color:#111;padding:12px 26px;border-radius:10px;white-space:nowrap}
.strip{left:50%;transform:translateX(-50%);top:270px;font-family:"J";font-weight:700;font-size:34px;border:3px solid rgba(255,255,255,.6);padding:10px 22px;border-radius:10px;white-space:nowrap;background:rgba(0,0,0,.4)}
.plane{position:relative;width:420px;height:150px}
.plane i{position:absolute;display:block}
.plane .fus{left:0;top:60px;width:420px;height:46px;border-radius:30px 60px 60px 30px;background:linear-gradient(#f2f2f2,#b9bec6)}
.plane .stripe{left:20px;top:78px;width:380px;height:8px;background:#1e3f8f}
.plane .fin{left:6px;top:0;width:80px;height:70px;background:#dfe3e8;clip-path:polygon(0 0,45% 0,100% 100%,0 100%)}
.plane .win{left:150px;top:88px;width:160px;height:40px;background:#aab0b8;clip-path:polygon(0 0,70% 0,100% 100%,40% 100%)}
.plane .eng{width:56px;height:18px;border-radius:9px;background:#8b919a}
.plane .e1{left:200px;top:118px}.plane .e2{left:250px;top:126px}
.smoke{width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(90,90,90,.9),rgba(60,60,60,0) 70%);filter:blur(6px)}
.card{font-weight:900;font-size:44px;text-align:center;padding:22px 20px;border-radius:18px;background:rgba(10,30,20,.9);border:4px solid #50FF8C;color:#50FF8C}
#tk_sun{left:390px;top:560px;width:300px;height:300px;border-radius:50%;background:#C8102E;opacity:.35;filter:blur(2px)}
.tiles{left:100px;top:560px;width:880px;display:grid;grid-template-columns:repeat(17,1fr);gap:8px}
.tiles i{display:block;height:46px;border-radius:4px}
.wave2{left:90px;right:90px;top:560px;height:260px;display:flex;align-items:center;gap:8px}
.wave2 i{display:block;flex:1;height:100%;border-radius:6px;background:#50FF8C}
#rd_flat{left:90px;right:90px;top:688px;height:6px;background:#FF3B3B;box-shadow:0 0 20px #FF3B3B}
.stamp2{left:50%;margin-left:-440px;width:880px;text-align:center;font-weight:900;font-size:74px;white-space:nowrap;color:#FF3B3B;border:9px solid #FF3B3B;border-radius:16px;padding:12px 0;background:rgba(0,0,0,.45)}
.pcard{left:120px;top:300px;width:840px;padding:40px 44px;border-radius:24px;background:rgba(8,20,16,.92);border:3px solid rgba(80,255,140,.4);text-align:center}
.prow{margin-top:26px;font-size:40px;padding:16px 10px;border-radius:14px;font-family:"J";font-weight:700}
.prow b{font-family:"M";font-weight:900}
.lmr{background:rgba(80,255,140,.15);color:#50FF8C}.redr{background:rgba(255,59,59,.18);color:#FF3B3B}
#caps{position:absolute;left:40px;right:40px;top:1370px;height:200px}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:76px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Varig 967 — parte 2</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{END:.2f}">
{''.join(H)}
{''.join(media)}
<div id="caps">{''.join(cap)}</div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
{chr(10).join(cj)}
window.__timelines["main"] = tl;
</script></body></html>'''
open(P + 'index.html', 'w').write(page)
print('ok', len(groups), 'grupos', len(cap), 'legendas')
