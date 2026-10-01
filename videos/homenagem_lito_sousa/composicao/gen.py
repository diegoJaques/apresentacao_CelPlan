# Homenagem "O Aviador" — Lito Sousa (1967–2026). 1920x1080. Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/lito/'
NARR = 259.4
END = 264.0
FIX = {'Souza': 'Sousa', 'José': 'Joselito', 'Lito_jose': '', 'Little': 'Lito', 'concertando': 'consertando',
       'brevet': 'brevê', 'Angar': 'hangar', 'Duença': 'Doença', 'Crouzfeld': 'Creutzfeldt', 'Jacob,': 'Jakob,',
       'Anderson': 'Enderson', 'becolou': 'decolou', 'guarulhos': 'Guarulhos', 'natal': 'Natal',
       'assassinas,': 'Assassinas,', 'aviões': 'Aviões', 'músicas.': 'Músicas.', 'Salto.': 'salto.',
       'força': 'Força', 'aérea': 'Aérea', 'brasileira,': 'Brasileira,', 'fatores': 'Fatores', 'humanos': 'Humanos'}
raw = json.load(open(P + 'words.json'))
W = []
for i, w in enumerate(raw):
    t = w['text'].strip(); a, b = w['timestamp'][0], w['timestamp'][1] or w['timestamp'][0] + .3
    if t == 'Lito' and i > 0 and raw[i-1]['text'].strip() == 'José':
        continue  # "José Lito" -> "Joselito"
    if t in ('aérea', 'força') and not (34 < a < 37): FIX_t = t
    else: FIX_t = FIX.get(t, t)
    W.append((FIX_t, a, min(b, NARR)))
CAP_ON = [(0.2, 257.9)]

J = []
def A(s): J.append(s)
def up(sel, t, d=.6, y=40): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.8): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.5): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d},ease:"power1.in"}},{t:.2f});')
def pop(sel, t, d=.45): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:2.2}},{{autoAlpha:1,scale:1,duration:.25,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')
def draw(sel, t, d, ease='power1.inOut'):
    A(f'tl.fromTo("{sel}",{{strokeDashoffset:3000}},{{strokeDashoffset:0,duration:{d},ease:"{ease}",immediateRender:false}},{t:.2f});')
    A(f'tl.set("{sel}",{{strokeDasharray:3000,strokeDashoffset:3000}},0);')

# ---------- legendas (até 4 palavras) ----------
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 4 or re.search(r'[.?!,:]$', w[0]) or (nx[1]-w[2] > .4):
        groups.append(cur); cur = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.5, gr[-1][2]+.7, END)
    ok = [(max(s, a), min(e, b)) for a, b in CAP_ON if min(e, b) - max(s, a) > .15]
    if not ok: continue
    s, e = ok[0]
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",."))}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#F2C14E"}},{max(s,x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

H, MEDIA = [], []
def scene(id_, s, e, inner, track=2):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="{track}">{inner}</section>')
def ovl(id_, s, e, inner, track=8):
    H.append(f'<div id="{id_}" class="clip ovl" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="{track}">{inner}</div>')
def photo(id_, s, e, img, extra='', kb=(1.0, 1.07), box='max-width:1500px;max-height:820px', pos='center'):
    scene(id_, s, e, f'''<div id="{id_}_in" class="abs inner"><img class="abs bgimg" src="assets/img/{img}_bg.jpg">
<div class="abs fgwrap" style="justify-content:{pos}"><img id="{id_}_f" class="fg" src="assets/img/{img}.jpg" style="{box}"></div>{extra}</div>''')
    A(f'tl.fromTo("#{id_}_f",{{scale:{kb[0]}}},{{scale:{kb[1]},duration:{e-s:.2f},ease:"none"}},{s:.2f});')
    A(f'tl.fromTo("#{id_}_in",{{autoAlpha:0}},{{autoAlpha:1,duration:.6,immediateRender:false}},{s:.2f});')

CARDS = []
def card(id_, t, year, title, d=2.6):
    ovl(id_, t, t+d, f'<div class="abs inner cw" data-layout-allow-overlap><div class="abs cardbg"></div><div class="abs cardin"><div class="J cy">{year}</div><div class="cl"></div><div class="ct" data-layout-allow-overlap>{title}</div></div></div>', track=9)
    fade(f'#{id_} .cardbg', t, .35); up(f'#{id_} .cy', t+.1, .5, 20)
    A(f'tl.fromTo("#{id_} .cl",{{scaleX:0}},{{scaleX:1,duration:.6,ease:"power2.out",immediateRender:false}},{t+.2:.2f});')
    up(f'#{id_} .ct', t+.35, .6, 20); out(f'#{id_} .cw', t+d-.5, .5)
    CARDS.append(t)

# ================= ABERTURA =================
photo('s_open', 0, 10.0, 'retrato', '''<div class="abs shadeL"></div>
<div id="ttl" class="abs ttl"><div class="J tk">EM MEMÓRIA</div><div class="tb">O AVIADOR</div><div class="ts">Lito Sousa · 1967–2026</div></div>''',
      kb=(1.04, 1.12), box='max-width:1400px;max-height:900px', pos='flex-end')
hide('#ttl .tk', '#ttl .tb', '#ttl .ts')
fade('#ttl .tk', .4, .8); up('#ttl .tb', 1.5, 1.0); up('#ttl .ts', 4.8, .8)

photo('s_medo', 10.0, 17.0, 'selfie', '', kb=(1.0, 1.08), box='height:760px')

scene('s_ceu', 17.0, 21.4, '''<div class="abs sky"></div>
<svg class="abs" style="inset:0" viewBox="0 0 1920 1080"><path id="trail" d="M-50 900 C 500 760, 1100 520, 1700 160" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="6" stroke-linecap="round"/></svg>
<div id="pl" class="abs plane">✈</div>''')
draw('#trail', 17.1, 4.0, 'none')
A('tl.fromTo("#pl",{x:-60,y:880,rotation:-30},{x:1680,y:140,rotation:-35,duration:4.0,ease:"none",immediateRender:false},17.10);')

# ================= CAP 1 — 1967 =================
scene('s_natal', 21.4, 29.3, '''<div class="abs grid"></div>
<div id="dot" class="abs dot"></div><div id="ring" class="abs ring"></div>
<div id="nt" class="abs place"><div class="pn">NATAL · RN</div><div class="J pc">5°47′S · 35°12′O</div></div>
<div id="nd" class="abs J bigdate">25 · 01 · 1967</div>''')
card('c1', 21.4, '1967', 'O MENINO DO HANGAR')
hide('#nt', '#nd'); fade('#nt', 23.6, .8); up('#nd', 26.2, .8)
A('tl.fromTo("#ring",{scale:.3,opacity:.9},{scale:2.6,opacity:0,duration:1.6,repeat:3,ease:"power1.out",immediateRender:false},23.60);')

photo('s_jovem', 29.3, 42.9, 'jovem', '''<div class="abs chips"><div id="j1" class="chip gold">14 ANOS</div><div id="j2" class="chip">CURSO TÉCNICO · FORÇA AÉREA BRASILEIRA</div></div>''',
      kb=(1.0, 1.1), box='max-width:1300px;max-height:860px')
hide('#j1', '#j2'); pop('#j1', 29.6); up('#j2', 34.3)

# ================= CAP 2 — 1986 =================
scene('s_linha', 42.9, 51.0, '''<div class="abs grid"></div>
<div class="abs tline"><div class="tlbar"></div><div id="tlfill" class="tlfill"></div>
<div id="n1" class="node" style="left:0%"><div class="nd"></div><div class="nl">VARIG</div><div class="J ny">aos 19 anos</div></div>
<div id="n2" data-layout-allow-overlap class="node" style="left:50%"><div class="nd"></div><div class="nl">TRANSBRASIL</div></div>
<div id="n3" data-layout-allow-overlap class="node" style="left:100%"><div class="nd"></div><div class="nl">UNITED AIRLINES</div></div></div>
<div id="lq" class="abs J lq">“o sonho de qualquer mecânico no Brasil”</div>''')
card('c2', 42.9, '1986', 'VARIG, TRANSBRASIL E O MUNDO')
A('tl.set("#n2,#n3",{opacity:.25},0);'); hide('#n1', '#lq')
pop('#n1', 47.6); fade('#lq', 45.0, .8)
A('tl.fromTo("#tlfill",{scaleX:0},{scaleX:.5,duration:2.5,ease:"power1.inOut",immediateRender:false},48.20);')
A('tl.to("#n2",{opacity:1,duration:.4},50.60);')

photo('s_transb', 51.0, 54.1, 'transbrasil', '<div class="abs chips"><div id="tb1" class="chip">TRANSBRASIL</div></div>', kb=(1.0, 1.06), box='height:900px')
hide('#tb1'); up('#tb1', 51.4)

photo('s_united', 54.1, 68.4, 'united', '''<div class="abs chips"><div id="u1" class="chip">UNITED AIRLINES</div><div id="u2" class="chip gold"><span id="u2n">0</span> ANOS</div></div>
<div class="abs roles"><div id="r1" class="role">MECÂNICO</div><div id="r2" class="role">SUPERVISOR</div><div id="r3" class="role">SEGURANÇA DE VOO</div></div>''',
      kb=(1.0, 1.08), box='max-width:1500px;max-height:860px')
hide('#u1', '#u2', '#r1', '#r2', '#r3'); up('#u1', 54.5); pop('#u2', 58.2); count('#u2n', 58.3, 0, 25, 1.4, '"~"+Math.round(v)')
up('#r1', 60.6, .4, 20); up('#r2', 61.9, .4, 20); up('#r3', 62.8, .4, 20)

scene('s_fh', 68.4, 88.3, '''<div class="abs dark"></div>
<div id="f1" class="abs fl" style="top:170px">A maioria dos acidentes <b>não</b> começa numa <span class="strike">peça quebrada</span></div>
<div id="f2" class="abs fl" style="top:380px">Começa numa <span class="gold">decisão humana</span></div>
<div class="abs fchips"><div id="k1" class="kchip">CANSAÇO</div><div id="k2" class="kchip">PRESSA</div><div id="k3" class="kchip">“DEIXA PRA DEPOIS”</div></div>
<div id="fbig" class="abs fbig"><div class="J tk">ESPECIALISTA EM</div><div class="tb2">FATORES HUMANOS</div></div>''')
hide('#f1', '#f2', '#k1', '#k2', '#k3', '#fbig')
up('#f1', 72.6); A('tl.fromTo("#f1 .strike",{"--s":0},{"--s":1,duration:.6,ease:"power2.out",immediateRender:false},75.00);')
up('#f2', 76.2); pop('#k1', 78.0); pop('#k2', 79.0); pop('#k3', 80.0)
out('#f1,#f2,#k1,#k2,#k3', 81.5, .5); up('#fbig', 82.2, .9)

# ================= CAP 3 — 2010 =================
photo('s_est1', 88.3, 100.5, 'estudio1', '''<div class="abs chips"><div id="b1" class="chip">BLOG</div><div id="b2" class="chip red">▶ YOUTUBE</div></div>
<div id="aem" class="abs lower"><div class="lw1">AVIÕES E MÚSICAS</div><div class="J lw2">o canal · desde 2010</div></div>''', kb=(1.0, 1.08))
card('c3', 88.3, '2010', 'AVIÕES E MÚSICAS')
hide('#b1', '#b2', '#aem'); up('#b1', 94.8); up('#b2', 96.0); up('#aem', 98.8, .8)

photo('s_est2', 100.5, 106.0, 'estudio2', '', kb=(1.02, 1.1), box='height:900px')

scene('s_rel', 106.0, 117.9, '''<div class="abs paper"></div>
<div id="doc" class="abs doc"><div class="J dt">RELATÓRIO FINAL DE ACIDENTE</div><div class="J dp">página <span id="pg">1</span> de 200</div>
<div class="ln"></div><div class="ln s"></div><div class="ln"></div><div class="ln"></div><div class="ln s"></div><div class="ln"></div><div class="ln s"></div></div>
<div id="cvr" class="abs cvr"><div class="J cvl">CAIXA-PRETA · CVR</div><div class="wave">''' + ''.join(f'<i style="height:{12+int(60*abs(__import__("math").sin(k*0.7)*__import__("math").cos(k*0.23)))}px"></i>' for k in range(36)) + '''</div></div>
<div id="bub" class="abs bubble">Deixa eu te explicar do jeito mais simples…</div>
<div id="bub2" class="abs J bubtag">conversa de almoço de domingo</div>''')
hide('#cvr', '#bub', '#bub2'); up('#doc', 106.1)
count('#pg', 106.6, 1, 200, 1.9)
up('#cvr', 109.2)
A('tl.to("#doc,#cvr",{scale:.55,x:-420,opacity:.35,duration:.8,ease:"power2.inOut"},112.70);')
pop('#bub', 113.3); fade('#bub2', 115.1, .6)

scene('s_casos', 117.9, 121.9, '''<div class="abs dark"></div>
<div class="abs casos"><div id="cs1" class="caso"><div class="J cyy">1996</div><div>MAMONAS ASSASSINAS</div></div>
<div id="cs2" class="caso"><div class="J cyy">2016</div><div>CHAPECOENSE</div></div>
<div id="cs3" class="caso"><div class="J cyy">2021</div><div>MARÍLIA MENDONÇA</div></div></div>''')
hide('#cs1', '#cs2', '#cs3'); up('#cs1', 117.9, .4); up('#cs2', 119.3, .4); up('#cs3', 120.5, .4)

scene('s_phones', 121.9, 128.4, '''<div class="abs dark2"></div>
<div id="ph1" class="abs phone" style="left:470px"><img src="assets/img/short1.jpg"></div>
<div id="ph2" class="abs phone" style="left:1010px"><img src="assets/img/short2.jpg"></div>''')
A('tl.fromTo("#ph1",{autoAlpha:0,y:200,rotation:-6},{autoAlpha:1,y:0,rotation:-3,duration:.8,ease:"power3.out",immediateRender:false},122.00);')
A('tl.fromTo("#ph2",{autoAlpha:0,y:200,rotation:6},{autoAlpha:1,y:0,rotation:3,duration:.8,ease:"power3.out",immediateRender:false},122.40);')

photo('s_regra', 128.4, 143.4, 'estudio2', '''<div class="abs shadeAll"></div>
<div id="rg1" class="abs rgk J">A REGRA DELE</div>
<div id="rg2" class="abs rgt">EXPLICAR <span class="gold">SEM</span> SENSACIONALISMO</div>
<div id="rg3" class="abs rgt" style="top:330px">A VERDADE.<br><span class="gold">NÃO PALPITE.</span></div>''', kb=(1.08, 1.0), box='height:900px')
hide('#rg1', '#rg2', '#rg3'); fade('#rg1', 128.9, .5); up('#rg2', 130.1, .7)
out('#rg1,#rg2', 138.4, .5); up('#rg3', 141.2, .8)

# ================= CAP 4 — SEM MEDO DE VOAR =================
env = ''.join(f'<div class="env" id="e{k}" style="left:{110+ (k%8)*220}px;top:{200+(k//8)*190}px">✉</div>' for k in range(24))
scene('s_cartas', 143.4, 151.6, f'''<div class="abs dark"></div>{env}<div id="mm" class="abs mm">MILHARES DE MENSAGENS</div>''')
card('c4', 143.4, '✈', 'SEM MEDO DE VOAR')
A('tl.set(".env",{autoAlpha:0},0);')
for k in range(24):
    pop(f'#e{k}', 147.2 + k*0.11, .35)
hide('#mm'); up('#mm', 149.0)

scene('s_cartao', 151.6, 160.0, '''<div class="abs paper"></div>
<div id="bp" class="abs bp"><div class="bph J">CARTÃO DE EMBARQUE</div>
<div class="bpr"><div><div class="J bpk">DE</div><div class="bpv">SUA CIDADE</div></div><div class="bpa">✈</div><div><div class="J bpk">PARA</div><div class="bpv">CASA DA MÃE</div></div></div>
<div class="bpr2 J"><span>VOO: O PRIMEIRO</span><span>ASSENTO: JANELA</span></div></div>
<div id="stp" class="abs stamp2" data-layout-allow-overlap>SEM MEDO</div>''')
hide('#stp'); up('#bp', 151.7); slam('#stp', 157.6)

photo('s_boeing', 160.0, 173.6, 'boeing', '''<div class="abs side"><div id="o1" class="obra"><div class="J ok">CURSO</div><div class="ov">Sem Medo de Voar</div></div>
<div id="o2" class="obra"><div class="J ok">LIVRO</div><div class="ov">Onde Morrem os Aviões</div></div>
<div id="o3" class="obra"><div class="J ok">ESCOLA · com a Mila</div><div class="ov">Lito Aviation Academy</div></div></div>''',
      kb=(1.0, 1.07), box='height:880px', pos='flex-start')
hide('#o1', '#o2', '#o3'); up('#o1', 161.8); up('#o2', 164.0); up('#o3', 168.0)

photo('s_maq', 173.6, 183.2, 'maquete', '''<div id="subs" class="abs subs"><div class="sn"><span id="sn">0</span></div><div class="J sl">INSCRITOS NO YOUTUBE</div></div>''', kb=(1.0, 1.08))
hide('#subs'); up('#subs', 179.0, .5)
count('#sn', 179.2, 0, 3700000, 2.4, 'Math.round(v).toLocaleString("pt-BR")')

# ================= CAP 5 — 2021 =================
photo('s_jato', 183.2, 194.6, 'jato', '''<div class="abs chips"><div id="h1" class="chip">40 ANOS NO HANGAR</div></div>
<div id="lic" class="abs lic" data-layout-allow-overlap><div class="J lk">LICENÇA · PILOTO PRIVADO</div><div class="lv">LITO SOUSA</div><div class="J lk2">EMITIDA EM 2021 · AOS 54 ANOS</div></div>''', kb=(1.0, 1.08))
card('c5', 183.2, '2021', 'O BREVÊ')
hide('#h1', '#lic'); up('#h1', 185.4); A('tl.fromTo("#lic",{autoAlpha:0,x:300,rotation:8},{autoAlpha:1,x:0,rotation:-4,duration:.8,ease:"back.out(1.4)",immediateRender:false},192.40);')

scene('s_split', 194.6, 197.4, '''<div class="abs dark"></div>
<div id="sp1" class="abs spl" style="left:150px"><img src="assets/img/jovem.jpg" style="width:760px;height:620px;object-fit:cover"><div class="J spt">O MENINO DO HANGAR</div></div>
<div id="sp2" class="abs spl" style="left:1010px"><img src="assets/img/selfie.jpg" style="width:760px;height:620px;object-fit:cover"><div class="J spt gold">O AVIADOR</div></div>''')
up('#sp1', 194.6, .5); up('#sp2', 195.6, .6)

# ================= CAP 6 — 2026 =================
SCRIPT = 'ROTEIRO — próximo vídeo do canal\n\nHoje eu quero explicar pra vocês por que voar continua sendo o jeito mais seguro de viajar. Quando o avião balança, o que está acontecendo de verdade é'
scene('s_type', 197.4, 205.0, f'''<div class="abs dark2"></div>
<div id="ed" class="abs editor"><div class="J edh"><i></i><i></i><i></i> roteiro.txt</div><div class="J edb"><span id="tx"></span><span id="cur" class="cur">▌</span></div></div>''')
card('c6', 197.4, '2026', 'O ÚLTIMO ROTEIRO')
A(f'(()=>{{const T={json.dumps(SCRIPT)};const o={{n:0}};tl.to(o,{{n:150,duration:3.0,ease:"none",onUpdate:()=>{{document.querySelector("#tx").textContent=T.slice(0,Math.round(o.n))}}}},199.60);}})();')
A('tl.fromTo("#cur",{opacity:1},{opacity:0,duration:.25,repeat:9,yoyo:true,ease:"steps(1)",immediateRender:false},202.60);')
A('tl.to("#ed",{x:6,duration:.06,repeat:7,yoyo:true,ease:"none"},202.70);')
A('tl.to("#ed",{opacity:.35,filter:"blur(2px)",duration:1.4,ease:"power1.in"},203.40);')

scene('s_diag', 205.0, 211.2, '''<div class="abs black"></div>
<div id="dg" class="abs dg">DOENÇA DE CREUTZFELDT-JAKOB</div>
<div class="abs dgs"><span id="d1">RARA</span><span id="d2">DEGENERATIVA</span><span id="d3" class="gold">SEM CURA</span></div>''')
hide('#dg', '#d1', '#d2', '#d3'); fade('#dg', 206.6, 1.0); fade('#d1', 208.5, .4); fade('#d2', 209.2, .4); fade('#d3', 210.3, .4)

LITO = 'M560 300 L560 700 L760 700 M880 300 L880 700 M1000 300 L1240 300 M1120 300 L1120 700 M1360 400 C1360 270 1560 270 1560 400 L1560 600 C1560 730 1360 730 1360 600 Z'
scene('s_texas', 211.2, 225.6, f'''<div class="abs night"></div><div class="abs stars"></div>
<div id="tx1" class="abs place2"><div class="pn">TEXAS · EUA</div><div class="J pc">perto de Dallas · 24 de agosto</div></div>
<svg class="abs" style="inset:0" viewBox="0 0 1920 1080"><path id="lp" d="{LITO}" fill="none" stroke="#F2C14E" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 14px rgba(242,193,78,.8))"/></svg>
<div id="tx2" class="abs J txinfo">CESSNA 150M · MAIS DE 3 HORAS DE VOO · PILOTO ENDERSON RAFAEL</div>
<div id="tx3" class="abs txbig">MAIOR QUE A CIDADE DE SÃO PAULO</div>''')
hide('#tx1', '#tx2', '#tx3'); up('#tx1', 214.2); draw('#lp', 216.2, 7.0); fade('#tx2', 218.0, .6); up('#tx3', 223.2, .6)

scene('s_rota', 225.6, 240.9, '''<div class="abs night"></div>
<div id="ro1" class="abs rok J">SETEMBRO · LIBERAÇÃO EXCEPCIONAL</div>
<div id="ro2" class="abs rot">REMÉDIO EXPERIMENTAL</div>
<svg class="abs" style="inset:0" viewBox="0 0 1920 1080">
<path id="arc" d="M360 360 C 800 120, 1200 420, 1380 700" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="3000"/>
<path id="heli" d="M1380 700 L1620 760" fill="none" stroke="#F2C14E" stroke-width="5" stroke-dasharray="3000"/></svg>
<div class="abs city" style="left:300px;top:300px" id="cy1"><i></i>NOVA YORK</div>
<div class="abs city" style="left:1320px;top:640px" id="cy2"><i></i>GUARULHOS</div>
<div class="abs city" style="left:1560px;top:780px" id="cy3"><i class="g"></i>HOSPITAL</div>
<div id="lm" class="abs J lm">LIBERADO EM MINUTOS</div>
<div id="ro3" class="abs rofinal">UMA OPERAÇÃO DE AVIAÇÃO<br><span class="gold">PRA SALVAR UM HOMEM DA AVIAÇÃO</span></div>''')
hide('#ro1', '#ro2', '#cy1', '#cy2', '#cy3', '#lm', '#ro3')
fade('#ro1', 225.8, .5); up('#ro2', 226.5); fade('#cy1', 231.4, .4); draw('#arc', 231.6, 1.9); fade('#cy2', 233.3, .4)
pop('#lm', 233.8); draw('#heli', 235.5, 1.0); fade('#cy3', 236.2, .4)
out('#ro1,#ro2', 237.0, .4); up('#ro3', 237.4, .7)

photo('s_hosp', 240.9, 245.2, 'hospital', '''<div id="fam" class="abs fam"><div>Deixa a esposa <span class="gold">Mila</span></div><div>e o filho <span class="gold">Malone</span>, de 7 anos</div></div>''',
      kb=(1.0, 1.05), box='height:880px')
hide('#fam'); fade('#fam', 242.0, .8)

photo('s_fim', 245.2, 252.9, 'retrato', '<div class="abs shadeAll"></div>', kb=(1.0, 1.08), box='max-width:1500px;max-height:900px')

scene('s_end', 252.9, END, '''<div class="abs sky2"></div>
<svg class="abs" style="inset:0" viewBox="0 0 1920 1080"><path id="trail2" d="M-60 940 C 600 900, 1200 850, 1980 740" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round"/></svg>
<div id="pl2" class="abs plane" style="font-size:60px">✈</div>
<div id="ob" class="abs ob">OBRIGADO, LITO.</div>
<div id="bv" class="abs bv">BOM VOO.</div>
<div id="nm" class="abs J nm">JOSELITO GERALDO DE SOUSA · 1967–2026</div>
<div id="cr" class="abs J cr">Imagens: redes sociais de Lito Sousa e do canal Aviões e Músicas, usadas em homenagem.</div>''')
draw('#trail2', 253.0, 6.0, 'none')
A('tl.fromTo("#pl2",{x:-80,y:900,rotation:-8},{x:1900,y:700,rotation:-8,duration:6.0,ease:"none",immediateRender:false},253.00);')
hide('#ob', '#bv', '#nm', '#cr'); up('#ob', 257.9, .8); up('#bv', 258.7, .8); fade('#nm', 259.8, 1.0); fade('#cr', 260.6, 1.0)

# ---------- áudio ----------
MEDIA.append(f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_p" src="assets/audio/piano.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.22"></audio>')
for k, t in enumerate(CARDS):
    MEDIA.append(f'<audio id="fx{k}" src="assets/audio/whoosh.wav" data-start="{t:.2f}" data-duration="0.80" data-track-index="{12+k%2}" data-volume="0.25"></audio>')
MEDIA.append('<audio id="fxt" src="assets/audio/typing.wav" data-start="199.55" data-duration="3.00" data-track-index="14" data-volume="0.35"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:500;src:url(assets/fonts/jetbrains-mono-latin-500-normal.woff2)}
body{margin:0;background:#0b0d12}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#0b0d12;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J"}.scene{position:absolute;inset:0;overflow:hidden}
.ovl{position:absolute;inset:0;z-index:5}
.inner{inset:0}.gold{color:#F2C14E}.red{color:#ff6b5e}
.bgimg{inset:0;width:1920px;height:1080px;object-fit:cover}
.fgwrap{inset:0;display:flex;align-items:center;padding:0 120px}
.fg{display:block;box-shadow:0 30px 80px rgba(0,0,0,.6);border-radius:6px}
.shadeL{left:0;top:0;bottom:0;width:1100px;background:linear-gradient(90deg,rgba(8,10,14,.95),rgba(8,10,14,.75) 55%,rgba(8,10,14,0))}
.shadeAll{inset:0;background:rgba(8,10,14,.62)}
.ttl{left:120px;top:300px;width:820px}
.tk{font-size:28px;letter-spacing:8px;color:#F2C14E;font-weight:700}
.tb{font-size:150px;line-height:1;margin-top:18px}
.ts{font-size:46px;font-weight:700;margin-top:24px;color:#e8e2d4}
.sky{inset:0;background:linear-gradient(#1d3b63,#6f8fb5 70%,#e8b98a)}
.sky2{inset:0;background:linear-gradient(#0b1424,#27406b 60%,#c98a5a)}
.plane{left:0;top:0;font-size:80px;color:#fff;text-shadow:0 0 18px rgba(255,255,255,.6)}
.grid{inset:0;background:#0b0f17;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:80px 80px}
.dark{inset:0;background:radial-gradient(ellipse at 50% 40%,#1a2030,#07090d 75%)}
.dark2{inset:0;background:radial-gradient(ellipse at 50% 50%,#202634,#06070a 80%)}
.black{inset:0;background:#000}
.night{inset:0;background:radial-gradient(ellipse at 50% 100%,#1b2740,#04060b 70%)}
.stars{inset:0;background-image:radial-gradient(2px 2px at 10% 20%,#fff8,transparent),radial-gradient(2px 2px at 30% 12%,#fff6,transparent),radial-gradient(2px 2px at 70% 18%,#fff7,transparent),radial-gradient(2px 2px at 85% 30%,#fff5,transparent),radial-gradient(2px 2px at 55% 8%,#fff6,transparent),radial-gradient(2px 2px at 20% 40%,#fff4,transparent)}
.dot{left:1230px;top:470px;width:28px;height:28px;border-radius:50%;background:#F2C14E;box-shadow:0 0 30px #F2C14E}
.ring{left:1214px;top:454px;width:60px;height:60px;border-radius:50%;border:3px solid #F2C14E}
.place{left:1300px;top:420px}.place2{left:120px;top:110px}
.pn{font-size:64px}.pc{font-size:26px;color:#b9c2d4;margin-top:8px;font-weight:500}
.bigdate{left:200px;top:560px;font-size:110px;color:#F2C14E;font-weight:700}
.chips{left:80px;top:70px;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.chip{font-family:"J";font-weight:700;font-size:30px;background:rgba(10,12,18,.85);border-left:6px solid #F2C14E;padding:12px 22px;white-space:nowrap}
.chip.gold{background:#F2C14E;color:#14110a;border-left-color:#fff}
.chip.red{border-left-color:#ff4d40}
.roles{right:80px;top:70px;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
.role{font-size:40px;background:rgba(10,12,18,.85);padding:10px 22px;white-space:nowrap}
.tline{left:260px;right:260px;top:520px;height:8px}
.tlbar{position:absolute;inset:0;background:rgba(255,255,255,.18);border-radius:4px}
.tlfill{position:absolute;inset:0;background:#F2C14E;border-radius:4px;transform-origin:0 50%}
.node{position:absolute;top:-16px;width:0}
.nd{position:absolute;left:-20px;width:40px;height:40px;border-radius:50%;background:#F2C14E;box-shadow:0 0 24px #F2C14E}
.nl{position:absolute;left:-300px;width:600px;text-align:center;top:70px;font-size:50px;white-space:nowrap}
.ny{position:absolute;left:-300px;width:600px;text-align:center;top:140px;font-size:26px;color:#cfd5e2;font-weight:500}
.lq{left:0;right:0;top:260px;text-align:center;font-size:40px;color:#e8e2d4;font-weight:500}
.fl{left:140px;right:140px;font-size:64px;line-height:1.15;font-weight:700}
.fl b{color:#ff6b5e;font-weight:900}
.strike{position:relative;--s:0}
.strike::after{content:"";position:absolute;left:-4px;right:-4px;top:52%;height:7px;background:#ff6b5e;transform:scaleX(var(--s));transform-origin:0 50%}
.fchips{left:140px;top:560px;display:flex;gap:26px}
.kchip{font-family:"J";font-weight:700;font-size:40px;border:3px solid #F2C14E;color:#F2C14E;padding:14px 26px;border-radius:12px;white-space:nowrap}
.fbig{left:0;right:0;top:300px;text-align:center}
.tb2{font-size:130px;margin-top:16px;color:#F2C14E}
.lower{left:80px;top:690px;background:rgba(10,12,18,.88);padding:22px 34px;border-left:8px solid #ff4d40}
.lw1{font-size:64px}.lw2{font-size:26px;color:#cfd5e2;margin-top:6px;font-weight:500}
.paper{inset:0;background:radial-gradient(ellipse at 50% 30%,#f3ead8,#cdbb98 85%)}
.doc{left:560px;top:110px;width:800px;height:690px;background:#fffdf7;color:#2a2116;padding:46px 54px;box-sizing:border-box;box-shadow:0 30px 80px rgba(60,40,10,.4);transform:rotate(-1.5deg)}
.dt{font-size:34px}.dp{font-size:24px;color:#7a6a52;margin-top:10px;font-weight:500}
.ln{height:16px;background:#e6dcc6;border-radius:8px;margin-top:34px;width:94%}.ln.s{width:60%}
.cvr{left:1420px;top:200px;width:380px;background:#14171e;padding:24px;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.4)}
.cvl{font-size:24px;color:#ff8a3d}.wave{display:flex;align-items:center;gap:4px;height:90px;margin-top:14px}.wave i{display:block;width:6px;background:#ff8a3d;border-radius:3px}
.bubble{left:820px;top:280px;width:860px;background:#fff;color:#1d1a14;font-size:54px;font-weight:700;line-height:1.2;padding:40px 46px;border-radius:40px 40px 40px 6px;box-shadow:0 30px 70px rgba(60,40,10,.35)}
.bubtag{left:860px;top:600px;font-size:30px;color:#4a3b28;font-weight:700}
.casos{left:0;right:0;top:160px;display:flex;flex-direction:column;align-items:center;gap:30px}
.caso{display:flex;gap:40px;align-items:baseline;font-size:76px;white-space:nowrap}.cyy{font-size:40px;color:#F2C14E}
.phone{top:90px;width:430px;height:766px;border-radius:46px;background:#000;padding:14px;box-shadow:0 40px 90px rgba(0,0,0,.7)}
.phone img{width:430px;height:766px;object-fit:cover;border-radius:34px;display:block}
.rgk{left:0;right:0;top:170px;text-align:center;font-size:30px;color:#F2C14E;font-weight:700}
.rgt{left:0;right:0;top:240px;text-align:center;font-size:96px;line-height:1.1}
.env{position:absolute;font-size:110px;color:#F2C14E;width:150px;text-align:center;font-family:sans-serif}
.mm{left:0;right:0;top:820px;text-align:center;font-size:30px;color:#cfd5e2;font-weight:700}
.bp{left:360px;top:180px;width:1200px;background:#fffdf7;color:#1d1a14;border-radius:26px;padding:44px 60px;box-sizing:border-box;box-shadow:0 30px 80px rgba(60,40,10,.4)}
.bph{font-size:32px;color:#8a6d2b}
.bpr{display:flex;justify-content:space-between;align-items:center;margin-top:30px}
.bpk{font-size:24px;color:#8a7a62}.bpv{font-size:60px}.bpa{font-size:80px;color:#c1972f}
.bpr2{display:flex;justify-content:space-between;margin-top:40px;font-size:30px;color:#4a3b28;border-top:3px dashed #d8ccb2;padding-top:26px}
.stamp2{left:1180px;top:500px;font-size:84px;color:#2e8b57;border:10px solid #2e8b57;border-radius:20px;padding:6px 30px;transform:rotate(-10deg);background:rgba(255,253,247,.7);white-space:nowrap}
.side{right:90px;top:120px;width:640px;display:flex;flex-direction:column;gap:26px}
.obra{background:rgba(10,12,18,.88);border-left:8px solid #F2C14E;padding:22px 30px}
.ok{font-size:24px;color:#F2C14E;font-weight:700}.ov{font-size:44px;margin-top:6px}
.subs{left:0;right:0;top:250px;text-align:center}
.sn{display:inline-block;font-size:150px;background:rgba(10,12,18,.8);padding:6px 50px;border-radius:24px;font-family:"J";font-weight:700;color:#F2C14E}
.sl{font-size:34px;margin-top:16px;text-shadow:0 4px 16px #000}
.lic{right:120px;top:420px;width:660px;background:linear-gradient(135deg,#f7f2e6,#e2d6b8);color:#1d1a14;border-radius:22px;padding:34px 40px;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.lk{font-size:24px;color:#7a6324}.lv{font-size:62px;line-height:1.1;margin:22px 0}.lk2{font-size:24px;color:#4a3b28}
.spl{top:160px;text-align:center}
.spl img{display:block;border-radius:10px;box-shadow:0 30px 70px rgba(0,0,0,.6)}
.spt{font-size:36px;margin-top:22px;font-weight:700}
.editor{left:310px;top:120px;width:1300px;height:640px;background:#14171e;border-radius:18px;box-shadow:0 40px 90px rgba(0,0,0,.7);overflow:hidden}
.edh{height:56px;background:#1f2430;display:flex;align-items:center;gap:12px;padding:0 24px;font-size:22px;color:#9aa3b5;font-weight:500}
.edh i{display:inline-block;width:14px;height:14px;border-radius:50%;background:#4a5263}
.edb{padding:40px 50px;font-size:36px;line-height:1.5;color:#e9ecf2;white-space:pre-wrap;font-weight:500}
.cur{color:#F2C14E}
.dg{left:0;right:0;top:330px;text-align:center;font-size:82px}
.dgs{left:0;right:0;top:500px;display:flex;justify-content:center;gap:60px;font-family:"J";font-weight:700;font-size:44px;color:#cfd5e2}
.txinfo{left:0;right:0;top:770px;text-align:center;font-size:28px;color:#cfd5e2;font-weight:700}
.txbig{left:0;right:0;top:830px;text-align:center;font-size:52px;color:#F2C14E}
.rok{left:120px;top:100px;font-size:28px;color:#F2C14E}
.rot{left:120px;top:150px;font-size:80px}
.city{display:flex;align-items:center;gap:16px;font-family:"J";font-weight:700;font-size:30px;white-space:nowrap}
.city i{display:block;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 0 18px #fff}
.city i.g{background:#F2C14E;box-shadow:0 0 18px #F2C14E}
.lm{left:880px;top:560px;font-size:34px;background:#F2C14E;color:#14110a;padding:10px 22px;border-radius:10px;white-space:nowrap}
.rofinal{left:120px;top:110px;font-size:62px;line-height:1.15}
.fam{left:0;right:0;top:120px;text-align:center;font-size:58px;line-height:1.3;text-shadow:0 6px 24px #000}
.ob{left:0;right:0;top:330px;text-align:center;font-size:120px}
.bv{left:0;right:0;top:480px;text-align:center;font-size:120px;color:#F2C14E}
.nm{left:0;right:0;top:680px;text-align:center;font-size:32px;color:#e8e2d4;font-weight:700}
.cr{left:0;right:0;top:980px;text-align:center;font-size:20px;color:#b9c2d4;font-weight:500}
.cardbg{inset:0;background:rgba(5,7,11,.92)}
.cardin{left:0;right:0;top:360px;text-align:center}
.cy{font-size:120px;color:#F2C14E;font-weight:700;line-height:1}
.cl{width:240px;height:6px;background:#F2C14E;margin:34px auto}
.ct{font-size:72px}
#caps{position:absolute;left:100px;right:100px;top:930px;height:110px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 9px;font-weight:900;font-size:54px;line-height:1.1;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 5px 18px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>O Aviador — Lito Sousa</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
