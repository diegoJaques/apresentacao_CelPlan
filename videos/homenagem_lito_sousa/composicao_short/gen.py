# Short 9:16 "O Aviador" — Lito Sousa (1967–2026), recortado da narração do vídeo longo. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/lito_short/'
NARR = 68.91
END = 71.5
FIX = {'Souza': 'Sousa', 'brevet': 'brevê', 'Angar': 'hangar', 'Duença': 'Doença', 'Crouzfeld': 'Creutzfeldt',
       'Jacob,': 'Jakob,', 'Anderson': 'Enderson', 'becolou': 'decolou', 'para': 'pra'}
W = [(FIX.get(x['text'].strip(), x['text'].strip()), x['timestamp'][0], min(x['timestamp'][1], NARR))
     for x in json.load(open(P + 'words.json'))]
CAP_ON = [(0.0, 67.2)]

J = []
def A(s): J.append(s)
def up(sel, t, d=.6, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.8): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def pop(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')
def draw(sel, t, d, ease='power1.inOut'):
    A(f'tl.set("{sel}",{{strokeDasharray:3000,strokeDashoffset:3000}},0);')
    A(f'tl.fromTo("{sel}",{{strokeDashoffset:3000}},{{strokeDashoffset:0,duration:{d},ease:"{ease}",immediateRender:false}},{t:.2f});')

# ---------- legendas (até 3 palavras) ----------
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
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#F2C14E"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, MEDIA = [], []
def scene(id_, s, e, inner):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2"><div id="{id_}_in" class="abs inner">{inner}</div></section>')
def photo(id_, s, e, img, extra='', kb=(1.0, 1.07), box='width:1000px', top=300, fadein=True):
    scene(id_, s, e, f'''<img class="abs bgimg" src="assets/img/{img}_bg.jpg">
<div class="abs fgwrap" style="top:{top}px"><img id="{id_}_f" class="fg" src="assets/img/{img}.jpg" style="{box}"></div>{extra}''')
    A(f'tl.fromTo("#{id_}_f",{{scale:{kb[0]}}},{{scale:{kb[1]},duration:{e-s:.2f},ease:"none"}},{s:.2f});')
    if fadein: A(f'tl.fromTo("#{id_}_in",{{autoAlpha:0}},{{autoAlpha:1,duration:.4,immediateRender:false}},{s:.2f});')

# 1 — capa/gancho (visível no frame 0)
photo('s1', 0, 9.9, 'retrato', '''<div class="abs shadeT"></div>
<div class="abs hk"><div class="J tk">EM MEMÓRIA</div><div class="tb">O AVIADOR</div><div class="ts">Lito Sousa · 1967–2026</div></div>''',
      kb=(1.0, 1.08), box='width:1080px;height:900px;object-fit:cover', top=620, fadein=False)

# 2 — o canal
photo('s2', 9.9, 16.8, 'estudio2', '''<div class="abs chips"><div id="c1" class="chip red">▶ AVIÕES E MÚSICAS</div><div id="c2" class="chip gold"><span id="c2n">0</span> INSCRITOS</div></div>''',
      box='width:980px', top=420)
hide('#c1', '#c2'); up('#c1', 10.2); pop('#c2', 11.4); count('#c2n', 11.5, 0, 3.7, 1.6, '(Math.round(v*10)/10).toLocaleString("pt-BR")+" MI"')

# 3 — carreira
photo('s3', 16.8, 22.6, 'united', '''<div class="abs chips"><div id="r0" class="chip">VARIG · TRANSBRASIL · UNITED</div><div id="r1" class="role">MECÂNICO</div><div id="r2" class="role">SUPERVISOR</div><div id="r3" class="role">SEGURANÇA DE VOO</div></div>''',
      box='width:1040px', top=560)
hide('#r0', '#r1', '#r2', '#r3'); up('#r0', 16.9, .4, 20); up('#r1', 16.95, .4, 20); up('#r2', 18.2, .4, 20); up('#r3', 19.1, .4, 20)
photo('s3b', 22.6, 24.7, 'jovem', '<div class="abs chips"><div id="j1" class="chip gold">ANOS 80 · NO HANGAR</div></div>', box='width:1040px', top=520)
hide('#j1'); up('#j1', 22.7, .4, 20)

# 4 — brevê
photo('s4', 24.7, 29.6, 'jato', '''<div id="lic" class="abs lic" data-layout-allow-overlap><div class="J lk">LICENÇA · PILOTO PRIVADO</div><div class="lv">LITO SOUSA</div><div class="J lk2">2021 · AOS 54 ANOS</div></div>''',
      box='width:1060px', top=400)
hide('#lic'); A('tl.fromTo("#lic",{autoAlpha:0,y:200,rotation:6},{autoAlpha:1,y:0,rotation:-3,duration:.7,ease:"back.out(1.4)",immediateRender:false},27.40);')
scene('s5', 29.6, 32.6, '''<div class="abs dark"></div>
<div id="sp1" class="abs spl" style="top:170px"><img src="assets/img/jovem.jpg"><div class="J spt">O MENINO DO HANGAR</div></div>
<div id="sp2" class="abs spl" style="top:760px"><img src="assets/img/selfie.jpg"><div class="J spt gold">O AVIADOR</div></div>''')
up('#sp1', 29.65, .45); up('#sp2', 30.9, .5)

# 6 — o último roteiro
SCRIPT = 'ROTEIRO — próximo vídeo\n\nHoje eu quero explicar por que voar continua sendo o jeito mais seguro de viajar. Quando o avião balança, o que'
scene('s6', 32.6, 40.1, '''<div class="abs dark2"></div><div id="yr" class="abs J yr">AGOSTO · 2026</div>
<div id="ed" class="abs editor"><div class="J edh"><i></i><i></i><i></i> roteiro.txt</div><div class="J edb"><span id="tx"></span><span id="cur" class="cur">▌</span></div></div>''')
A(f'(()=>{{const T={json.dumps(SCRIPT)};const o={{n:0}};tl.to(o,{{n:120,duration:1.8,ease:"none",onUpdate:()=>{{document.querySelector("#tx").textContent=T.slice(0,Math.round(o.n))}}}},35.90);}})();')
A('tl.fromTo("#cur",{opacity:1},{opacity:0,duration:.25,repeat:7,yoyo:true,ease:"steps(1)",immediateRender:false},37.80);')
A('tl.to("#ed",{x:6,duration:.06,repeat:7,yoyo:true,ease:"none"},37.90);')
A('tl.to("#ed",{opacity:.35,filter:"blur(2px)",duration:1.2,ease:"power1.in"},38.70);')
scene('s7', 40.1, 46.3, '''<div class="abs black"></div>
<div id="dg" class="abs dg">DOENÇA DE<br>CREUTZFELDT-JAKOB</div>
<div class="abs dgs"><div id="d1">RARA</div><div id="d2">DEGENERATIVA</div><div id="d3" class="gold">SEM CURA</div></div>''')
hide('#dg', '#d1', '#d2', '#d3'); fade('#dg', 41.8, .8); fade('#d1', 43.7, .35); fade('#d2', 44.4, .35); fade('#d3', 45.5, .35)

# 8 — Texas
LITO = 'M120 430 L120 830 L290 830 M400 430 L400 830 M500 430 L720 430 M610 430 L610 830 M820 530 C820 400 960 400 960 530 L960 730 C960 860 820 860 820 730 Z'
scene('s8', 46.3, 57.8, f'''<div class="abs night"></div><div class="abs stars"></div>
<div id="t1" class="abs place2"><div class="pn">TEXAS · EUA</div><div class="J pc">24 de agosto · perto de Dallas</div></div>
<svg class="abs" style="left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920"><path id="lp" d="{LITO}" fill="none" stroke="#F2C14E" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 14px rgba(242,193,78,.8))"/></svg>
<div id="t2" class="abs J txinfo">CESSNA 150M<br>MAIS DE 3 HORAS DE VOO</div>''')
hide('#t1', '#t2'); up('#t1', 46.5); fade('#t2', 50.3, .6); draw('#lp', 53.3, 4.0)

# 9 — família
photo('s9', 57.8, 62.2, 'hospital', '<div id="fam" class="abs fam"><div>Deixa a esposa <span class="gold">Mila</span></div><div>e o filho <span class="gold">Malone</span>, 7 anos</div></div>',
      box='width:960px', top=420)
hide('#fam'); fade('#fam', 58.9, .7)

# 10 — despedida
scene('s10', 62.2, END, '''<div class="abs sky2"></div>
<svg class="abs" style="left:0;top:0;width:1080px;height:1920px" viewBox="0 0 1080 1920"><path id="trail" d="M-60 1500 C 300 1440, 700 1360, 1140 1180" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round"/></svg>
<div id="pl" class="abs plane">✈</div>
<div id="ob" class="abs ob">OBRIGADO,<br>LITO.</div><div id="bv" class="abs bv">BOM VOO.</div>
<div id="nm" class="abs J nm">JOSELITO GERALDO DE SOUSA<br>1967–2026</div>
<div id="cr" class="abs J cr">Imagens: redes sociais de Lito Sousa,<br>usadas em homenagem.</div>''')
draw('#trail', 62.3, 6.0, 'none')
A('tl.fromTo("#pl",{x:-80,y:1460,rotation:-14},{x:1100,y:1140,rotation:-16,duration:6.0,ease:"none",immediateRender:false},62.30);')
hide('#ob', '#bv', '#nm', '#cr'); up('#ob', 67.2, .7); up('#bv', 68.05, .7); fade('#nm', 68.9, .8); fade('#cr', 69.4, .8)

MEDIA.append(f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_p" src="assets/audio/piano.mp3" data-start="0" data-media-start="190.9" data-duration="{END:.2f}" data-track-index="11" data-volume="0.22"></audio>')
MEDIA.append('<audio id="fxt" src="assets/audio/typing.wav" data-start="35.85" data-duration="1.90" data-track-index="12" data-volume="0.35"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:500;src:url(assets/fonts/jetbrains-mono-latin-500-normal.woff2)}
body{margin:0;background:#0b0d12}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0b0d12;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.gold{color:#F2C14E}
.bgimg{left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.fgwrap{left:0;right:0;display:flex;justify-content:center}
.fg{display:block;box-shadow:0 30px 80px rgba(0,0,0,.6);border-radius:8px}
.shadeT{left:0;right:0;top:0;height:760px;background:linear-gradient(#07090d 55%,rgba(7,9,13,0))}
.hk{left:0;right:0;top:170px;text-align:center}
.tk{font-size:34px;letter-spacing:10px;color:#F2C14E;font-weight:700}
.tb{font-size:150px;line-height:1;margin-top:18px}
.ts{font-size:50px;font-weight:700;margin-top:26px;color:#e8e2d4}
.chips{left:60px;right:60px;top:150px;display:flex;flex-direction:column;align-items:center;gap:16px}
.chip{font-family:"J";font-weight:700;font-size:40px;background:rgba(10,12,18,.9);border-left:8px solid #F2C14E;padding:14px 26px;white-space:nowrap}
.chip.gold{background:#F2C14E;color:#14110a;border-left-color:#fff}
.chip.red{border-left-color:#ff4d40}
.role{font-size:58px;background:rgba(10,12,18,.88);padding:8px 26px;white-space:nowrap}
.lic{left:110px;top:1000px;width:860px;background:linear-gradient(135deg,#f7f2e6,#e2d6b8);color:#1d1a14;border-radius:24px;padding:36px 44px;box-sizing:border-box;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.lk{font-size:30px;color:#7a6324}.lv{font-size:80px;line-height:1.1;margin:20px 0}.lk2{font-size:30px;color:#4a3b28}
.dark{inset:0;background:radial-gradient(ellipse at 50% 40%,#1a2030,#07090d 75%)}
.dark2{inset:0;background:radial-gradient(ellipse at 50% 40%,#202634,#06070a 80%)}
.black{inset:0;background:#000}
.night{inset:0;background:radial-gradient(ellipse at 50% 100%,#1b2740,#04060b 70%)}
.stars{inset:0;background-image:radial-gradient(3px 3px at 10% 20%,#fff8,transparent),radial-gradient(3px 3px at 30% 12%,#fff6,transparent),radial-gradient(3px 3px at 70% 18%,#fff7,transparent),radial-gradient(3px 3px at 85% 40%,#fff5,transparent),radial-gradient(3px 3px at 55% 8%,#fff6,transparent),radial-gradient(3px 3px at 20% 55%,#fff4,transparent)}
.spl{left:90px;width:900px;text-align:center}
.spl img{display:block;width:900px;height:500px;object-fit:cover;border-radius:12px;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.spt{font-size:44px;margin-top:20px;font-weight:700}
.yr{left:0;right:0;top:260px;text-align:center;font-size:46px;color:#F2C14E}
.editor{left:70px;top:380px;width:940px;height:820px;background:#14171e;border-radius:22px;box-shadow:0 40px 90px rgba(0,0,0,.7);overflow:hidden}
.edh{height:64px;background:#1f2430;display:flex;align-items:center;gap:12px;padding:0 26px;font-size:26px;color:#9aa3b5;font-weight:500}
.edh i{display:inline-block;width:16px;height:16px;border-radius:50%;background:#4a5263}
.edb{padding:44px 50px;font-size:42px;line-height:1.5;color:#e9ecf2;white-space:pre-wrap;font-weight:500}
.cur{color:#F2C14E}
.dg{left:0;right:0;top:520px;text-align:center;font-size:84px;line-height:1.15}
.dgs{left:0;right:0;top:820px;display:flex;flex-direction:column;align-items:center;gap:18px;font-family:"J";font-weight:700;font-size:56px;color:#cfd5e2}
.place2{left:0;right:0;top:200px;text-align:center}
.pn{font-size:84px}.pc{font-size:32px;color:#b9c2d4;margin-top:10px;font-weight:500}
.txinfo{left:0;right:0;top:1000px;text-align:center;font-size:40px;color:#cfd5e2;line-height:1.5}
.fam{left:0;right:0;top:170px;text-align:center;font-size:62px;line-height:1.3;text-shadow:0 6px 24px #000}
.sky2{inset:0;background:linear-gradient(#0b1424,#27406b 60%,#c98a5a)}
.plane{left:0;top:0;font-size:80px;color:#fff;text-shadow:0 0 18px rgba(255,255,255,.6)}
.ob{left:0;right:0;top:470px;text-align:center;font-size:130px;line-height:1.05}
.bv{left:0;right:0;top:780px;text-align:center;font-size:130px;color:#F2C14E}
.nm{left:0;right:0;top:980px;text-align:center;font-size:36px;color:#e8e2d4;line-height:1.5}
.cr{left:0;right:0;top:1700px;text-align:center;font-size:26px;color:#d6dbe6;line-height:1.5}
#caps{position:absolute;left:40px;right:40px;top:1560px;height:220px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 10px;font-weight:900;font-size:76px;line-height:1.1;color:#fff;text-transform:uppercase;-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 6px 20px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>O Aviador — Short</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
