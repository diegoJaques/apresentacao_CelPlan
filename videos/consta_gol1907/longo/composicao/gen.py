# Consta nos Autos — Gol 1907, vídeo longo 16:9 (1920x1080). Gera index.html.
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/gl/'
NARR = 298.70
END = 298.70

# ---------- palavras (com correções da transcrição) ----------
raw = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(P + 'words.json'))]
FIX = {'Legas': 'Legacy', 'Lega': 'Legacy', 'spares,': 'pares,', 'boing': 'Boeing', '-dença,': 'densa,',
       'anticolizão': 'anticolisão', 'viaérea,': 'via aérea,', 'Caem': 'Cai', 'Jatinho.': 'jatinho.',
       'umaida': 'uma pista escondida', 'colocar': 'colocaram', 'explicou': 'explicou o'}
W, skip = [], False
for i, (t, s, e) in enumerate(raw):
    if skip: skip = False; continue
    nx = raw[i+1][0] if i+1 < len(raw) else ''
    if t in ('Legas', 'Lega') and nx == 'se': skip = True
    if t == 'G' and nx == '.O.': t = 'Gol'; skip = True
    if nx.startswith('.') and nx[1:2].isdigit(): t = t + nx; skip = True
    if nx.startswith('-feira'): t = t + nx; skip = True
    if t == 'mais' and abs(s - 63.6) < .2: t = 'mas'
    if t == 'em' and abs(s - 189.6) < .2: t = 'um'
    if t == 'há' and abs(s - 271.5) < .2: t = 'a'
    if t == 'um' and abs(s - 263.6) < .2: continue
    if t == 'o' and abs(s - 124.0) < .2: t = 'o aparelho que'
    if t == 'Mas' and abs(s - 102.7) < .2: t = 'Mas a'
    W.append((FIX.get(t, t), s, min(e, NARR)))

J = []
def A(s): J.append(s)
def up(sel, t, d=.5, y=30): A(f'tl.fromTo("{sel}",{{autoAlpha:0,y:{y}}},{{autoAlpha:1,y:0,duration:{d},ease:"power3.out",immediateRender:false}},{t:.2f});')
def fade(sel, t, d=.6): A(f'tl.fromTo("{sel}",{{autoAlpha:0}},{{autoAlpha:1,duration:{d},ease:"power1.out",immediateRender:false}},{t:.2f});')
def out(sel, t, d=.3): A(f'tl.to("{sel}",{{autoAlpha:0,duration:{d}}},{t:.2f});')
def pop(sel, t, d=.4): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:{d},ease:"back.out(2)",immediateRender:false}},{t:.2f});')
def slam(sel, t): A(f'tl.fromTo("{sel}",{{autoAlpha:0,scale:1.8}},{{autoAlpha:1,scale:1,duration:.25,ease:"power4.out",immediateRender:false}},{t:.2f});')
def hide(*sels):
    for s in sels: A(f'tl.set("{s}",{{autoAlpha:0}},0);')
def count(sel, t, frm, to, d, fmt='Math.round(v)'):
    A(f'(()=>{{const o={{v:{frm}}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{const v=o.v;document.querySelector("{sel}").textContent={fmt}}}}},{t:.2f});}})();')

# ---------- legendas (rodapé) ----------
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 6 or re.search(r'[.?!]$', w[0]) or (len(cur) >= 3 and w[0].endswith(',')) or (nx[1]-w[2] > .45):
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

H, MEDIA = [], []
def scene(id_, s, e, inner, track=2):
    H.append(f'<section id="{id_}" class="clip scene" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="{track}"><div id="{id_}_in" class="abs inner">{inner}</div></section>')
KB = [(1.0, 1.12, -40, 0), (1.12, 1.0, 40, 0), (1.0, 1.1, 0, -30), (1.08, 1.0, -30, 20)]
kbn = [0]
def photo(id_, s, e, img, inner='', dark=.45, kb=None):
    k = KB[kbn[0] % 4] if kb is None else kb; kbn[0] += 1
    scene(id_, s, e, f'<img id="{id_}_img" class="abs ph" src="assets/img/{img}.jpg"><div class="abs vig" style="opacity:{dark}"></div>' + inner)
    A(f'tl.fromTo("#{id_}_img",{{scale:{k[0]},x:0,y:0}},{{scale:{k[1]},x:{k[2]},y:{k[3]},duration:{e-s:.2f},ease:"none",immediateRender:false}},{s:.2f});')
def card(cls, txt, id_): return f'<div id="{id_}" class="abs {cls}">{txt}</div>'
def pouso(id_, s, e, ms, inner=''):
    MEDIA.append(f'<video id="{id_}f" class="clip vid" src="assets/clips/pouso169.webm" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-media-start="{ms:.2f}" data-track-index="1" muted playsinline></video>')
    if inner: H.append(f'<div id="{id_}o" class="clip ovl" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="8"><div class="abs inner">{inner}</div></div>')

PL = '<path d="M10 40 L150 34 Q190 36 195 40 Q190 44 150 46 L10 40 Z M90 38 L60 8 L80 8 L120 37 Z M90 42 L60 72 L80 72 L120 43 Z M18 39 L8 22 L18 22 L32 38 Z" fill="{c}"/>'
def plane(id_, cls, c='#fff', flip=False, style=''):
    tr = ' transform="translate(200,0) scale(-1,1)"' if flip else ''
    return f'<svg id="{id_}" class="abs {cls}" style="{style}" viewBox="0 0 200 80"><g{tr}>{PL.format(c=c)}</g></svg>'

HOOK = lambda p: f'''<div class="abs hk1" id="{p}h1">DOIS AVIÕES SE CHOCARAM<br>A <span class="y">11 MIL METROS</span></div>
<div class="abs hk2" id="{p}h2">UM CAIU.</div><div class="abs hk3" id="{p}h3">O OUTRO POUSOU.</div>
<div class="abs J tag">CONSTA NOS AUTOS · VOO 1907 · 29.09.2006</div>'''

# ===== ABERTURA =====
photo('s0', 0, 5.6, '07', HOOK('a'), dark=.35, kb=(1.0, 1.15, 0, 0))
hide('#ah2', '#ah3'); slam('#ah2', 3.5); slam('#ah3', 4.5)
pouso('p1', 5.6, 9.4, 1.2, card('big2', 'NINGUÉM A BORDO SABIA<br><span class="y">NO QUE TINHA BATIDO</span>', 'nb'))
hide('#nb'); up('#nb', 6.2)
scene('s2', 9.4, 16.0, '''<div class="abs sky2"></div>
<div class="abs alt"><div class="altl"></div><div class="J altt">37.000 PÉS</div></div>''' + plane('b1', 'pa', '#fff') + plane('l1', 'pb', '#FFC83D', True) +
      card('lab', 'MESMA ALTITUDE · MESMA ROTA · SENTIDO CONTRÁRIO', 'ma') + '<div id="bell" class="abs bell">🔔<div class="slash"></div></div>' + card('lab r big3', 'NENHUM ALARME TOCOU', 'na'))
hide('#ma', '#bell', '#na')
A('tl.fromTo("#b1",{x:0},{x:700,duration:6.4,ease:"none",immediateRender:false},9.50);')
A('tl.fromTo("#l1",{x:0},{x:-700,duration:6.4,ease:"none",immediateRender:false},9.50);')
fade('#ma', 10.0, .4); pop('#bell', 14.1); slam('#na', 14.9)
photo('s3', 16.0, 21.8, '16', card('big2', '20 ANOS DEPOIS', 'v20') + card('sub', 'uma das histórias mais difíceis de explicar da aviação brasileira', 'v20b'))
hide('#v20', '#v20b'); up('#v20', 16.1); fade('#v20b', 17.6)

# ===== CAP 1 — DOIS AVIÕES NOVOS =====
photo('s4', 21.8, 26.4, '09', card('chap', '<small>CAPÍTULO 1</small>DOIS AVIÕES NOVOS', 'c1'), dark=.6)
hide('#c1'); up('#c1', 22.0)
photo('s5', 26.4, 39.4, '01', card('lt', 'MANAUS · AM', 'm1') + card('lt2', 'VOO 1907 · MANAUS → BRASÍLIA → RIO', 'm2') + card('chip', 'MENOS DE 3 SEMANAS DE USO', 'm3'))
hide('#m1', '#m2', '#m3'); up('#m1', 26.6); up('#m2', 30.5); pop('#m3', 36.3)
photo('s6', 39.4, 45.7, '04', '<div id="pc" class="abs pc"><span id="pn">0</span><small>PESSOAS A BORDO</small></div>' + card('lt2', '148 PASSAGEIROS + 6 TRIPULANTES', 'pt'))
hide('#pc', '#pt'); up('#pt', 40.3); pop('#pc', 43.4); count('#pn', 43.5, 0, 154, 1.2)
photo('s7', 45.7, 60.5, '02', card('lt', 'SÃO JOSÉ DOS CAMPOS · SP', 'j1') + card('lt2', 'EMBRAER LEGACY 600 · ZERO-QUILÔMETRO', 'j2') + card('chip', 'SÃO JOSÉ → MANAUS → EUA', 'j3'))
hide('#j1', '#j2', '#j3'); up('#j1', 47.0); up('#j2', 50.4); pop('#j3', 55.6)
photo('s8', 60.5, 71.1, '03', card('lt', '2 PILOTOS AMERICANOS · NOVOS NO MODELO', 'k1') + card('lt2', '5 PASSAGEIROS · 1 DELES, JORNALISTA', 'k2'))
hide('#k1', '#k2'); up('#k1', 61.4); up('#k2', 66.1)
MAP = '''<div class="abs mapbg"></div>
<svg class="abs map" viewBox="0 0 1920 1080">
<path d="M560 200 Q900 120 1240 260 Q1500 380 1460 640 Q1380 900 1080 980 Q820 1020 700 860 Q520 700 470 480 Q450 300 560 200 Z" fill="#14243a" stroke="#2b4a70" stroke-width="4"/>
<circle cx="700" cy="300" r="14" fill="#fff"/><circle cx="1160" cy="640" r="14" fill="#fff"/><circle cx="1330" cy="800" r="14" fill="#fff"/>
<path id="rb" d="M700 300 L1160 640" stroke="#fff" stroke-width="8" stroke-dasharray="1000" stroke-dashoffset="1000" fill="none"/>
<path id="rl" d="M1330 800 L1160 640 L700 300" stroke="#FFC83D" stroke-width="8" stroke-dasharray="1200" stroke-dashoffset="1200" fill="none"/>
<g id="xx"><circle cx="905" cy="452" r="34" fill="none" stroke="#FF4B3E" stroke-width="8"/><path d="M880 427 L930 477 M930 427 L880 477" stroke="#FF4B3E" stroke-width="8"/></g></svg>
<div class="abs J city" style="left:520px;top:240px">MANAUS</div><div class="abs J city" style="left:1190px;top:600px">BRASÍLIA</div>
<div class="abs J city" style="left:1360px;top:780px">SÃO JOSÉ DOS CAMPOS</div>'''
scene('s9', 71.1, 77.4, MAP + card('big2 top', 'O MESMO PONTO DO CÉU', 'mp'))
hide('#xx', '#mp')
A('tl.to("#rl",{strokeDashoffset:0,duration:2.2,ease:"power1.inOut"},71.30);')
A('tl.to("#rb",{strokeDashoffset:0,duration:1.8,ease:"power1.inOut"},72.80);')
pop('#xx', 75.3); up('#mp', 75.5)

# ===== CAP 2 — O ERRO =====
photo('s10', 77.4, 90.7, '15', card('chap', '<small>CAPÍTULO 2</small>O ERRO', 'c2') +
      '<div id="fp" class="abs doc"><div class="J dh">PLANO DE VOO · LEGACY</div><div class="J dl">SÃO JOSÉ → BRASÍLIA: <b>37.000 PÉS</b></div><div id="fp2" class="J dl">BRASÍLIA → MANAUS: <b class="g">36.000 PÉS</b></div></div>', dark=.6)
hide('#fp', '#fp2'); up('#c2', 77.5); out('#c2', 83.6, .3); up('#fp', 84.0); up('#fp2', 87.7)
LANES = '''<div class="abs sky2"></div>
<div class="abs lane" style="top:330px"><div class="ll"></div><div class="J lt3">37.000 · QUEM VEM DE MANAUS (ÍMPAR)</div></div>
<div class="abs lane" style="top:640px"><div class="ll g"></div><div class="J lt3 g">36.000 · QUEM VAI PARA MANAUS (PAR)</div></div>'''
scene('s11', 90.7, 102.7, LANES + plane('b2', 'pl1', '#fff', True, 'top:360px') + plane('l2', 'pl2', '#FFC83D', False, 'top:670px') + card('big2 low', 'NUNCA NO MESMO NÍVEL', 'nn'))
hide('#nn')
A('tl.fromTo("#b2",{x:0},{x:-1300,duration:11,ease:"none",immediateRender:false},91.00);')
A('tl.fromTo("#l2",{x:0},{x:1300,duration:11,ease:"none",immediateRender:false},91.00);')
up('#nn', 98.8)
scene('s12', 102.7, 116.9, LANES + '<div id="au" class="abs doc red"><div class="J dh">AUTORIZAÇÃO RECEBIDA</div><div class="J dl">37.000 PÉS ATÉ MANAUS</div><div id="sd" class="stamp">SEM A DESCIDA</div></div>' +
      plane('l3', 'pl2', '#FFC83D', False, 'top:360px;left:-260px') + card('lab r big3 low2', 'NA ALTITUDE DE QUEM VEM DE FRENTE', 'af'))
hide('#sd', '#l3', '#af'); up('#au', 102.8); slam('#sd', 107.9); out('#au', 108.8, .3)
A('tl.fromTo("#l3",{autoAlpha:1,x:0},{x:1400,duration:7.5,ease:"none",immediateRender:false},109.00);')
slam('#af', 113.8)
photo('s13', 116.9, 133.5, '06', card('lt', 'A SEGUNDA FALHA', 't1') + '<div id="tx" class="abs J txp">TRANSPONDER: <span id="txv" class="g">ON</span></div>' +
      card('chip red', 'SISTEMA ANTICOLISÃO: CEGO', 't3'), dark=.35)
hide('#t1', '#tx', '#t3'); up('#t1', 117.3); up('#tx', 119.3)
A('tl.set("#txv",{textContent:"OFF",color:"#FF4B3E"},121.90);')
A('tl.fromTo("#txv",{opacity:1},{opacity:.2,duration:.25,yoyo:true,repeat:7,ease:"steps(1)",immediateRender:false},121.95);')
pop('#t3', 130.3)
photo('s14', 133.5, 139.8, '12', card('lt', 'RELATÓRIO OFICIAL: HIPÓTESE DE DESLIGAMENTO SEM QUERER', 'h1') + card('lt2', 'OS PILOTOS SEMPRE NEGARAM', 'h2'))
hide('#h1', '#h2'); up('#h1', 134.6); up('#h2', 137.9)
photo('s15', 139.8, 151.0, '05', card('lt', 'ALTITUDE DO JATINHO: ?', 'r1') + card('lt2', 'RÁDIO: SEM RESPOSTA', 'r2') + card('big2 low', 'MINUTOS DE SILÊNCIO', 'r3'), dark=.4)
hide('#r1', '#r2', '#r3'); up('#r1', 141.0); up('#r2', 143.9); fade('#r3', 149.3)
scene('s16', 151.0, 158.5, LANES + plane('b4', 'pl1', '#fff', True, 'top:360px') + plane('l4', 'pl2', '#FFC83D', False, 'top:360px;left:-260px') + card('big2 low', 'VINDO DE FRENTE', 'vf'))
hide('#vf')
A('tl.fromTo("#b4",{x:0},{x:-900,duration:7.5,ease:"none",immediateRender:false},151.00);')
A('tl.fromTo("#l4",{x:0},{x:900,duration:7.5,ease:"none",immediateRender:false},151.00);')
slam('#vf', 157.2)
photo('s17', 158.5, 168.2, '07', '<div id="sp" class="abs spd"><span id="spn">0</span><small>KM/H DE APROXIMAÇÃO</small></div>', dark=.3, kb=(1.1, 1.35, 0, 0))
hide('#sp'); pop('#sp', 160.2); count('#spn', 160.3, 0, 1500, 1.6, '"+"+Math.round(v).toLocaleString("pt-BR")')
scene('s18', 168.2, 178.1, '''<div class="abs sky2"></div>
<svg class="abs" style="left:0;top:200px;width:1920px;height:800px" viewBox="0 0 1920 800">
<path d="M0 360 L1250 420 L1330 480 L0 480 Z" fill="#e8ecf2"/><path id="wB" d="M1250 420 L1920 452 L1920 480 L1330 480 Z" fill="#e8ecf2"/>
<g id="wl"><path d="M900 60 L950 60 L1010 360 L930 360 Z" fill="#FFC83D"/></g>
<path id="cut" d="M1250 390 L1330 510" stroke="#FF4B3E" stroke-width="12"/></svg>
<div id="ck" class="abs J clock">16:56</div><div id="fk" class="abs big2 top">COMO UMA FACA</div><div id="fl" class="abs flash"></div>''')
hide('#cut', '#fk', '#fl', '#ck'); pop('#ck', 168.3)
A('tl.fromTo("#wl",{x:-1100,y:-60},{x:320,y:60,duration:1.6,ease:"power2.in",immediateRender:false},171.10);')
A('tl.set("#cut",{autoAlpha:1},172.70);'); A('tl.fromTo("#fl",{autoAlpha:.9},{autoAlpha:0,duration:.6,immediateRender:false},172.70);')
A('tl.to("#wB",{x:160,y:420,rotation:24,transformOrigin:"0% 0%",duration:2.2,ease:"power2.in"},172.75);')
slam('#fk', 176.8)
photo('s19', 178.1, 187.8, '09', card('big2', 'NINGUÉM SOBREVIVE', 'ns') + card('n154', '154 VIDAS', 'n1'), dark=.7)
hide('#ns', '#n1'); fade('#ns', 183.9, .6); fade('#n1', 185.7, .8)

# ===== CAP 3 — O POUSO E AS RESPOSTAS =====
photo('s20', 187.8, 199.5, '08', card('lt', 'NO LEGACY: UM TRANCO', 'g1') + card('lt2', 'PONTA DA ASA DESTRUÍDA · CAUDA ATINGIDA', 'g2') + card('chip', 'NÃO SABIAM NO QUE TINHAM BATIDO', 'g3'))
hide('#g1', '#g2', '#g3'); up('#g1', 188.0); up('#g2', 190.6); pop('#g3', 194.8)
photo('s21', 199.5, 209.2, '10', card('lt', 'UMA PISTA ESCONDIDA NA SELVA', 'q1') + card('chip', 'BASE AÉREA DA SERRA DO CACHIMBO · PA', 'q2'))
hide('#q1', '#q2'); up('#q1', 203.6); pop('#q2', 206.3)
pouso('p2', 209.2, 213.6, 2.5, card('big2', '7 A BORDO<br><span class="g">SEM FERIMENTOS</span>', 'sf'))
hide('#sf'); up('#sf', 210.5)
scene('s22', 213.6, 219.2, '<div class="abs black"></div>' + card('big2', 'SÓ HORAS DEPOIS…', 'hd') + card('sub r2', 'O BOEING DA GOL TINHA DESAPARECIDO', 'hd2'))
hide('#hd', '#hd2'); fade('#hd', 213.7, .5); fade('#hd2', 215.8, .5)
photo('s23', 219.2, 228.3, '11', card('lt', 'BUSCA À NOITE · MATA FECHADA, SEM ESTRADA', 'u1') + card('lt2', 'PERTO DA TERRA INDÍGENA CAPOTO-JARINÃ (MT)', 'u2') + card('chip', 'DESTROÇOS: SÓ NA MANHÃ SEGUINTE', 'u3'), dark=.3)
hide('#u1', '#u2', '#u3'); up('#u1', 219.3); up('#u2', 223.3); pop('#u3', 224.9)
scene('s24', 228.3, 236.2, '<div class="abs black"></div>' + card('big2', 'O PIOR ACIDENTE<br>DA AVIAÇÃO BRASILEIRA', 'pa') + card('sub', 'até aquele momento', 'pa2'))
hide('#pa', '#pa2'); fade('#pa', 229.6, .6); fade('#pa2', 231.2, .5)
photo('s25', 236.2, 241.6, '07', card('big2', 'COMO DOIS AVIÕES BATEM DE FRENTE<br><span class="y">NUM CÉU LIMPO?</span>', 'cp'), dark=.5)
hide('#cp'); up('#cp', 236.3)
photo('s26', 241.6, 248.0, '12', card('chap', '<small>CAPÍTULO 3</small>A CORRENTE', 'c3') + card('lt2', 'RELATÓRIO FINAL · CENIPA · 10.12.2008', 'c3b'), dark=.6)
hide('#c3', '#c3b'); up('#c3', 241.7); fade('#c3b', 243.0)
CH = '<div class="abs black"></div><div class="abs chain">' + ''.join(f'<div id="k{i}" class="link"><b>{i+1}</b>{t}</div>' for i, t in enumerate(
    ['AUTORIZAÇÃO ERRADA,<br>NUNCA CORRIGIDA', 'PILOTOS POUCO PREPARADOS<br>PARA A ROTA E O AVIÃO', 'TRANSPONDER<br>INATIVO', 'RÁDIO QUE NÃO<br>FUNCIONOU'])) + '</div>'
scene('s27', 248.0, 266.6, CH + card('big2 low3', 'JUNTAS: MESMO PONTO, MESMA HORA', 'jt'))
hide('#k0', '#k1', '#k2', '#k3', '#jt')
for i, t in enumerate([248.0, 250.9, 254.3, 256.0]): pop(f'#k{i}', t)
A('tl.to(".link",{borderColor:"#FF4B3E",duration:.4},262.60);'); up('#jt', 262.7)
photo('s28', 266.6, 275.2, '12', card('lt', 'CONTROLADOR DE VOO: CONDENADO', 'z1') + card('lt2', 'PILOTOS DO LEGACY: 3 ANOS E 1 MÊS (MANTIDA PELO STJ)', 'z2') + card('chip', 'ELES VIVEM NOS ESTADOS UNIDOS', 'z3'), dark=.65)
hide('#z1', '#z2', '#z3'); up('#z1', 267.3); up('#z2', 269.6); pop('#z3', 273.2)
photo('s29', 275.2, 283.1, '13', card('lt', 'SOBRECARGA DOS CONTROLADORES', 'y1') + card('big2 low', 'O APAGÃO AÉREO', 'y2'), dark=.55)
hide('#y1', '#y2'); up('#y1', 276.4); slam('#y2', 281.6)
photo('s30', 283.1, 290.1, '14', card('n154 top2', '154', 'm154') + card('sub', 'a investigação explicou o como… nunca o porquê', 'mp2'), dark=.35)
hide('#m154', '#mp2'); fade('#m154', 283.4, .8); fade('#mp2', 286.3, .6)
photo('s31', 290.1, END, '07', HOOK('b'), dark=.35, kb=(1.0, 1.15, 0, 0))
hide('#bh1', '#bh2', '#bh3'); fade('#bh1', 292.9, .3); slam('#bh2', 296.5); slam('#bh3', 297.4)

# ---------- áudio ----------
MEDIA.append(f'<audio id="a_n" src="assets/audio/narr.mp3" data-start="0" data-duration="{NARR:.2f}" data-track-index="10" data-volume="1"></audio>')
MEDIA.append(f'<audio id="a_m" src="assets/audio/trilha.wav" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.16"></audio>')
MEDIA.append('<audio id="a_i" src="assets/audio/impacto.wav" data-start="172.70" data-duration="2.20" data-track-index="12" data-volume="0.6"></audio>')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#0a0c10}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#0a0c10;font-family:"M";font-weight:900;color:#fff}
.abs{position:absolute}.J{font-family:"J";font-weight:700}.scene{position:absolute;inset:0;overflow:hidden}.inner{inset:0}
.ovl{position:absolute;inset:0;z-index:4}
.vid{position:absolute;left:0;top:0;width:1920px;height:1080px}
.vbg{position:absolute;left:0;top:-420px;width:1920px;height:3413px;object-fit:cover;filter:blur(40px) brightness(.55)}
.vfg{position:absolute;left:656px;top:0;width:608px;height:1080px;object-fit:cover;z-index:3;box-shadow:0 0 60px rgba(0,0,0,.8)}
.ph{left:-96px;top:-54px;width:2112px;height:1188px;object-fit:cover}
.vig{inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,.1),rgba(0,0,0,.9) 100%),linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 65%,rgba(0,0,0,.7))}
.y{color:#FFC83D}.r{color:#FF4B3E}.g{color:#3ddc84}
.hk1{left:60px;right:60px;top:170px;text-align:center;font-size:92px;line-height:1.05;text-shadow:0 8px 30px #000}
.hk2{left:0;right:0;top:520px;text-align:center;font-size:110px;color:#FF4B3E;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 8px 30px #000}
.hk3{left:0;right:0;top:660px;text-align:center;font-size:110px;color:#FFC83D;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 8px 30px #000}
.tag{left:0;right:0;top:80px;text-align:center;font-size:28px;color:#FFC83D;letter-spacing:4px}
.big2{left:80px;right:80px;top:380px;text-align:center;font-size:84px;line-height:1.08;text-shadow:0 8px 30px #000}
.big2.top{top:130px}.big2.low{top:820px;font-size:70px}.big2.low3{top:700px;font-size:64px}
.big3{font-size:64px !important}
.sub{left:50%;transform:translateX(-50%);top:640px;white-space:nowrap;text-align:center;font-family:"J";font-size:38px;color:#eee;background:rgba(0,0,0,.6);padding:10px 22px;border-radius:8px}
.sub.r2{color:#FF8A80}
.chap{left:120px;top:360px;font-size:110px;line-height:1;text-shadow:0 8px 30px #000}.chap small{display:block;font-family:"J";font-size:36px;color:#FFC83D;letter-spacing:6px;margin-bottom:18px}
.lt{left:90px;top:110px;font-family:"J";font-size:44px;background:rgba(0,0,0,.65);padding:12px 22px;border-left:8px solid #FFC83D}
.lt2{left:90px;top:200px;font-family:"J";font-size:36px;background:rgba(0,0,0,.6);padding:10px 20px;color:#e6e6e6}
.chip{left:50%;transform:translateX(-50%);top:640px;white-space:nowrap;font-family:"J";font-size:46px;background:#FFC83D;color:#111;padding:14px 28px;border-radius:10px}
.chip.red{background:#FF4B3E;color:#fff}
.lab{left:0;right:0;top:170px;text-align:center;font-family:"J";font-size:40px;color:#cfe0f5}
.lab.r{top:760px;color:#FF4B3E;font-family:"M"}.low2{top:820px !important}
.sky2{inset:0;background:linear-gradient(#0b1730,#24497a 70%,#4a7aa8)}
.alt{left:0;right:0;top:500px;height:80px}.altl{position:absolute;left:0;right:0;top:38px;border-top:4px dashed rgba(255,255,255,.6)}
.altt{position:absolute;left:40px;top:-40px;font-size:32px;color:#cfe0f5}
.pa{left:120px;top:490px;width:300px;height:120px}.pb{left:1500px;top:500px;width:300px;height:120px}
.bell{left:50%;margin-left:-90px;top:600px;width:180px;height:180px;font-size:150px;text-align:center;line-height:180px}
.slash{position:absolute;left:-10px;top:80px;width:200px;height:14px;background:#FF4B3E;transform:rotate(-40deg);border-radius:8px}
.pc{right:120px;top:300px;text-align:center;background:rgba(10,20,40,.85);padding:20px 50px;border-radius:16px}
.pc span{display:block;font-size:150px;color:#FFC83D;line-height:1.15;white-space:nowrap}.pc small{display:block;font-family:"J";font-size:32px;margin-top:6px}
.mapbg{inset:0;background:radial-gradient(ellipse at 50% 50%,#0f1c2e,#05080d 80%)}.map{inset:0}
.city{font-size:30px;color:#cfe0f5}
.doc{left:460px;right:460px;top:420px;background:#f3f1ea;color:#111;border-radius:14px;padding:36px 46px;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.doc.red{top:330px}.dh{font-size:30px;color:#555;border-bottom:4px solid #111;padding-bottom:12px;margin-bottom:14px}.dl{font-size:38px;margin:10px 0}.doc .g{color:#178a4a}
.stamp{position:absolute;right:30px;bottom:-40px;font-size:56px;color:#C62828;border:6px solid #C62828;padding:6px 18px;transform:rotate(-8deg);background:rgba(255,255,255,.85)}
.lane{left:0;right:0;height:80px;overflow:visible}.ll{position:absolute;left:0;right:0;top:40px;border-top:4px dashed rgba(255,255,255,.55)}.ll.g{border-color:rgba(61,220,132,.7)}
.lt3{position:absolute;left:60px;top:-30px;font-size:30px;color:#cfe0f5}
.pl1{left:1700px;width:260px;height:104px}.pl2{left:-260px;width:260px;height:104px}
.txp{left:0;right:0;top:420px;text-align:center;font-size:96px;text-shadow:0 8px 30px #000}
.spd{left:0;right:0;top:330px;text-align:center}.spd span{display:block;font-size:200px;line-height:1.15;white-space:nowrap;color:#FFC83D;text-shadow:0 8px 30px #000}
.spd small{display:block;font-family:"J";font-size:40px;margin-top:8px;text-shadow:0 4px 18px #000}
.clock{left:80px;top:80px;font-size:64px;color:#FF4B3E;background:#000;padding:8px 22px;border-radius:10px}
.flash{inset:0;background:#fff}
.n154{left:0;right:0;top:560px;text-align:center;font-size:96px;color:#ddd}.n154.top2{top:300px;font-size:220px;color:#fff}
.black{inset:0;background:#000}
.chain{left:80px;right:80px;top:300px;display:flex;gap:28px;justify-content:center}
.link{width:390px;min-height:250px;border:6px solid #FFC83D;border-radius:30px;padding:26px;font-family:"J";font-size:38px;line-height:1.25;text-align:center;background:#0d1117}
.link b{display:block;font-family:"M";font-size:70px;color:#FFC83D;margin-bottom:10px}
#caps{position:absolute;left:120px;right:120px;top:930px;height:110px;z-index:6}
.capg{position:absolute;left:0;right:0;top:0;text-align:center}
.capg span{display:inline-block;margin:0 7px;font-weight:900;font-size:46px;line-height:1.15;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 4px 14px rgba(0,0,0,.95)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>Gol 1907 — longo</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
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
