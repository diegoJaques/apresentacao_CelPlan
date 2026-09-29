# Gera index.html (composição HyperFrames) a partir de timing.json
import json, html, re
P = '/tmp/claude-0/-home-user-apresentacao-CelPlan/6f5535a1-b72a-5aa0-be2c-9dda47ff067c/scratchpad/hf/longo/'
d = json.load(open(P + 'timing.json'))
T = d['T']; W = d['words']
END = T['end']
OFF = {'b2': 15.24, 'b4': 30.51, 'b5': 28.98, 'b6': 27.69, 'b7': 25.35}
def g(k, vt): return round(vt + OFF[k], 2)   # voz-local -> global
def a(k, lt): return round(T[k] + lt, 2)      # avatar-local -> global

# ---------- captions (static clips) ----------
groups = []; cur = []
for i, w in enumerate(W):
    cur.append(w); nx = W[i+1] if i+1 < len(W) else None
    if (not nx) or len(cur) >= 5 or re.search(r'[.?!,:]$', w[0]) or (nx[1]-w[2] > .45) or any(nx[1] >= T[k] > w[1] for k in T):
        groups.append(cur); cur = []
cap_html = []; cap_js = []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2]+.6
    e = min(e, gr[-1][2] + .7, END)
    if e - s < .2: e = s + .2
    spans = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0].rstrip(",."))}</span>' for j, x in enumerate(gr))
    cap_html.append(f'<div id="cg{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{spans}</div>')
    for j, x in enumerate(gr):
        cap_js.append(f'tl.set("#w{gi}_{j}",{{color:"#B6FF3B"}},{x[1]:.2f});')
        if j+1 < len(gr): cap_js.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

def clip(id_, k0, k1, inner, cls='scene'):
    s = T[k0] if isinstance(k0, str) else k0; e = T[k1] if isinstance(k1, str) else k1
    return f'<section id="{id_}" class="clip {cls}" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="2">{inner}</section>'

H = []; J = []
def pop(sel, t, d=.45): J.append(f'tl.fromTo("{sel}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:{d},ease:"back.out(2.2)"}},{t:.2f});')
def up(sel, t, d=.5): J.append(f'tl.fromTo("{sel}",{{opacity:0,y:40}},{{opacity:1,y:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def left(sel, t, d=.5): J.append(f'tl.fromTo("{sel}",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:{d},ease:"power3.out"}},{t:.2f});')
def fade(sel, t, d=.4): J.append(f'tl.fromTo("{sel}",{{opacity:0}},{{opacity:1,duration:{d}}},{t:.2f});')
def out(sel, t, d=.3): J.append(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def slam(sel, t): J.append(f'tl.fromTo("{sel}",{{opacity:0,scale:2.4}},{{opacity:1,scale:1,duration:.22,ease:"power4.out"}},{t:.2f});')
def wipe(sel, t, d=.8): J.append(f'tl.fromTo("{sel}",{{clipPath:"inset(0 100% 0 0)"}},{{clipPath:"inset(0 0% 0 0)",duration:{d},ease:"none"}},{t:.2f});')
def count(sel, t, to, d=1.0, suf=''):
    J.append(f'(()=>{{const o={{v:0}};tl.to(o,{{v:{to},duration:{d},ease:"power2.out",onUpdate:()=>{{document.querySelector("{sel}").textContent=Math.round(o.v).toLocaleString("pt-BR")+"{suf}"}}}},{t:.2f});}})();')

# ---------- avatar videos + audio ----------
AV = [('intro', 'intro', 12.12), ('av1', 'av1', 16.93), ('av4', 'av4', 34.92), ('av8', 'av8', 25.82), ('outro', 'outro', 16.02)]
media = []
for key, f, dur in AV:
    media.append(f'<video id="v_{key}" class="clip avatar" src="assets/clips/av_{f}.webm" data-start="{T[key]:.2f}" data-duration="{dur:.2f}" data-track-index="5" muted playsinline></video>')
    media.append(f'<audio id="a_{key}" src="assets/audio/{f}.mp3" data-start="{T[key]:.2f}" data-duration="{dur:.2f}" data-track-index="11" data-volume="1"></audio>')
VOZ = {'b2': (0.0, 40.34), 'b4': (42.0, 69.97), 'b5': (71.5, 111.61), 'b6': (112.9, 157.76), 'b7': (160.1, 198.77)}
for k, (s, e) in VOZ.items():
    media.append(f'<audio id="a_{k}" src="assets/audio/voz.mp3" data-start="{T[k]:.2f}" data-media-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="12" data-volume="1"></audio>')
# Shorts reais (em "celulares")
def phone(id_, src, t0, dur, mstart, x, y, w=300, label=''):
    h = int(w*16/9)
    H.append(f'<div id="{id_}_f" class="clip phone" data-start="{t0:.2f}" data-duration="{dur:.2f}" data-track-index="6" style="left:{x-12}px;top:{y-12}px;width:{w+24}px;height:{h+24}px"></div>')
    media.append(f'<video id="{id_}" class="clip shortv" src="assets/clips/{src}" data-start="{t0:.2f}" data-duration="{dur:.2f}" data-media-start="{mstart:.2f}" data-track-index="7" muted playsinline style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"></video>')
    if label: H.append(f'<div id="{id_}_l" class="clip plabel" data-start="{t0:.2f}" data-duration="{dur:.2f}" data-track-index="8" style="left:{x-12}px;top:{y+h+24}px;width:{w+24}px">{label}</div>')

# ================= SCENES =================
# INTRO (avatar + tags)
H.append(clip('sc_intro', 'intro', 'sting', '''
<div class="panelL">
 <div id="i1" class="tag tg-mg">⏱ TEMPO ABSURDO</div>
 <div id="i2" class="tag tg-cy">✂ CORTANDO VÍDEOS</div>
 <div id="i3" class="tag tg-lm mono">FRAME <span id="i3n">0000</span></div>
 <div id="i4" class="stamp">COM OS DIAS CONTADOS</div>
</div>'''))
pop('#i1', 2.26); pop('#i2', 4.18); pop('#i3', 7.7); count('#i3n', 7.7, 212, 1.2); slam('#i4', 11.0)
# STING
H.append(clip('sc_sting', 'sting', 'b2', '''
<div class="center col">
 <div id="st1" class="mono kicker">OS BASTIDORES</div>
 <div id="st2" class="huge"><span class="cy">HYPER</span>FRAMES</div>
 <div id="st3" class="sub">como eu faço vídeos com IA, do roteiro à capa</div>
</div>'''))
fade('#st1', 12.3); slam('#st2', 12.55); up('#st3', 13.3)
# B2 — o que é
H.append(clip('sc_b2', 'b2', 'av1', f'''
<div id="b2q" class="center col"><div class="big">O QUE É</div><div class="huge"><span class="cy">HYPER</span>FRAMES?</div></div>
<div id="b2c" class="row chips" style="top:640px"><div class="chip">🧩 CÓDIGO ABERTO</div><div class="chip">criado pela HeyGen</div></div>
<div id="b2x" class="abs" style="left:0;right:0;top:120px">
  <div id="b2l" class="card" style="left:90px;top:120px;width:820px;height:560px">
    <div class="ctitle">EDITOR TRADICIONAL</div>
    <div class="track" style="top:120px"><div class="blk" style="left:0;width:180px;background:#3b82f6"></div><div class="blk" style="left:190px;width:120px;background:#2563eb"></div><div class="blk" style="left:320px;width:220px;background:#1d4ed8"></div></div>
    <div class="track" style="top:230px"><div class="blk" style="left:60px;width:140px;background:#FF2E88"></div><div class="blk" style="left:260px;width:160px;background:#FF2E88"></div></div>
    <div class="track" style="top:340px"><div class="blk" style="left:0;width:560px;background:#16a34a"></div></div>
    <div id="b2cross" class="cross"></div>
  </div>
  <div id="b2r" class="card code" style="left:1010px;top:120px;width:820px;height:560px">
    <div class="ctitle">video.html</div>
    <div id="cl1" class="cline"><span class="k">&lt;h1&gt;</span>Texto<span class="k">&lt;/h1&gt;</span></div>
    <div id="cl2" class="cline"><span class="k">&lt;img</span> src=<span class="s">"imagem.jpg"</span><span class="k">&gt;</span></div>
    <div id="cl3" class="cline"><span class="k">color:</span> <span class="s">#18E8FF</span>;</div>
    <div id="cl4" class="cline"><span class="k">tl.to</span>(<span class="s">"#texto"</span>, {{ y: 0 }})</div>
  </div>
</div>
<div id="b2b" class="abs" style="left:0;right:0;top:140px">
  <div class="card browser" style="left:120px;top:60px;width:760px;height:520px"><div class="bbar"><i></i><i></i><i></i><span>video.html</span></div>
    <div class="bpage"><div class="bh">HYPERFRAMES</div><div class="bline"></div><div class="bline s"></div></div><div id="flash" class="flash"></div></div>
  <div id="film" class="film" style="left:960px;top:160px"></div>
  <div id="fps" class="big mono" style="position:absolute;left:960px;top:470px;width:860px;text-align:center"><span id="fpsn">0</span> FOTOS / SEGUNDO</div>
  <div id="mp4" class="mp4" style="left:1260px;top:600px">▶ video.mp4</div>
</div>
<div id="b2d" class="center col"><div id="b2d1" class="kicker mono">O DETALHE QUE MUDA O JOGO</div><div id="b2d2" class="big">IA <span class="mg">♥</span> CÓDIGO DE SITE</div><div id="b2d3" class="huge"><span class="lm">A IA EDITA VÍDEO</span></div><div id="b2d4" class="huge">ESCREVENDO</div></div>
'''))
slam('#b2q', g('b2', .28)); out('#b2q', g('b2', 10.9))
pop('#b2c', g('b2', 4.12)); out('#b2c', g('b2', 10.9))
fade('#b2x', g('b2', 11.1)); left('#b2l', g('b2', 11.2)); up('#b2r', g('b2', 14.9)); fade('#b2cross', g('b2', 12.66), .2)
for i, t in enumerate([17.9, 18.56, 19.28, 19.76]): wipe(f'#cl{i+1}', g('b2', t), .45)
out('#b2x', g('b2', 21.9))
fade('#b2b', g('b2', 22.1))
for n in range(8):
    J.append(f'tl.fromTo("#flash",{{opacity:.85}},{{opacity:0,duration:.25,immediateRender:false}},{g("b2",24.2)+n*.3:.2f});')
J.append(f'tl.fromTo("#film",{{backgroundPositionX:"0px"}},{{backgroundPositionX:"-1200px",duration:6,ease:"none"}},{g("b2",24.2):.2f});')
J.append(f'tl.set("#fps",{{opacity:0}},{T["b2"]:.2f});'); fade('#fps', g('b2', 26.8), .2); count('#fpsn', g('b2', 26.8), 30, .8); pop('#mp4', g('b2', 28.4))
out('#b2b', g('b2', 30.1))
fade('#b2d', g('b2', 30.2)); up('#b2d1', g('b2', 30.26)); pop('#b2d2', g('b2', 32.3)); slam('#b2d3', g('b2', 37.78)); slam('#b2d4', g('b2', 39.4))
# AV1 — bastidores
H.append(clip('sc_av1', 'av1', 'b4', '''
<div class="panelL">
 <div id="p1a" class="big">EU VOU TE <span class="lm">MOSTRAR</span></div>
 <div id="p1b" class="kicker mono" style="margin-top:28px">DO ROTEIRO À CAPA</div>
 <div id="p1l" class="steps">
  <div id="s1" class="step"><b>1</b> ROTEIRO</div><div id="s2" class="step"><b>2</b> VOZ E AVATAR</div>
  <div id="s3" class="step"><b>3</b> MONTAGEM</div><div id="s4" class="step hot"><b>4</b> RETENÇÃO <span class="mono">(o segredo)</span></div>
 </div>
</div>'''))
up('#p1a', a('av1', 2.0)); fade('#p1b', a('av1', 9.06))
for i, t in enumerate([13.16, 13.58, 13.9, 15.04]): left(f'#s{i+1}', a('av1', t), .4)
# B4 — roteiro
H.append(clip('sc_b4', 'b4', 'b5', '''
<div id="h4" class="hdr"><span class="n">1</span>ROTEIRO</div>
<div class="card chat" style="left:90px;top:200px;width:880px;height:720px">
 <div class="ctitle">Claude · Anthropic</div>
 <div id="m1" class="msg me">Escreve um roteiro de 45 segundos sobre a mulher que sobreviveu a 3 desastres em navios.</div>
 <div id="m2" class="msg ai">Claro! Gancho: "Essa mulher sobreviveu ao Titanic… e esse nem foi o mais estranho."</div>
 <div id="m3" class="msg me">Confere as datas e os nomes dos navios.</div>
</div>
<div class="checks" style="left:1040px;top:220px">
 <div id="k1" class="chk">⚡ Gancho nos 2 primeiros segundos</div>
 <div id="k2" class="chk">↻ Virada no meio</div>
 <div id="k3" class="chk">? Pergunta no final</div>
 <div id="k4" class="chk red">✓ CHECAGEM DE FATOS</div>
 <div class="row" style="position:relative;gap:14px;margin-top:10px"><div id="k5" class="chip sm">datas</div><div id="k6" class="chip sm">nomes</div><div id="k7" class="chip sm">números</div></div>
 <div id="k8" class="note">📌 Guarda essa parte…</div>
</div>'''))
left('#h4', g('b4', 42.26)); up('#m1', g('b4', 44.36)); up('#m2', g('b4', 48.88)); up('#m3', g('b4', 60.82))
for i, t in enumerate([51.0, 53.9, 55.68, 60.82]): left(f'#k{i+1}', g('b4', t))
for i, t in enumerate([62.9, 63.42, 64.14]): pop(f'#k{i+5}', g('b4', t))
pop('#k8', g('b4', 67.2))
# B5 — voz e avatar
H.append(clip('sc_b5', 'b5', 'b6', f'''
<div id="h5" class="hdr"><span class="n">2</span>VOZ E AVATAR</div>
<div id="wave" class="wave" style="left:90px;top:230px;width:900px;height:220px">{''.join(f'<i id="wb{i}"></i>' for i in range(40))}</div>
<div id="v1" class="chip" style="position:absolute;left:90px;top:480px">🎙 MINHA VOZ CLONADA</div>
<div class="checks" style="left:1060px;top:220px;width:780px">
 <div id="t1" class="chk"><span class="mono">1983</span> → mil novecentos e oitenta e três</div>
 <div id="t2" class="chk">Reticências… = suspense</div>
 <div id="t3" class="chk">MAIÚSCULA = ÊNFASE</div>
 <div class="row" style="position:relative;gap:14px;margin-top:14px"><div id="t4" class="chip sm mg">[sussurra]</div><div id="t5" class="chip sm mg">[animado]</div><div id="t6" class="chip sm mg">[pausa longa]</div></div>
</div>
<div id="flow5" class="row" style="top:690px;gap:30px"><div class="chip">🔊 áudio</div><div class="arrow">→</div><div class="chip">🧑 avatar falando</div><div class="arrow">→</div><div class="chip">👄 boca sincronizada</div></div>
<div id="rule" class="card" style="left:360px;top:800px;width:1200px;height:120px;display:flex;align-items:center;justify-content:space-around">
 <div class="big lm" style="font-size:48px">✓ MESMO ÁUDIO</div><div id="rx" class="big red" style="font-size:48px">✗ OUTRO ÁUDIO = BOCA NÃO BATE</div></div>
'''))
left('#h5', g('b5', 71.76)); fade('#wave', g('b5', 72.2))
J.append(f'for(let i=0;i<40;i++){{tl.fromTo("#wb"+i,{{scaleY:.15}},{{scaleY:()=>.3+.7*Math.abs(Math.sin(i*.9)),duration:.35,yoyo:true,repeat:{int((111.6-72.2)/0.7)},ease:"sine.inOut"}},{g("b5",72.2):.2f}+i*.02);}}')
pop('#v1', g('b5', 74.74))
for i, t in enumerate([82.96, 84.86, 87.24]): left(f'#t{i+1}', g('b5', t))
for i, t in enumerate([92.36, 93.42, 94.3]): pop(f'#t{i+4}', g('b5', t))
up('#flow5', g('b5', 97.26)); up('#rule', g('b5', 102.0)); slam('#rx', g('b5', 108.56))
# B6 — montagem
H.append(clip('sc_b6', 'b6', 'b7', f'''
<div id="h6" class="hdr"><span class="n">3</span>MONTAGEM <span class="badge">HYPERFRAMES</span></div>
<div id="tr" class="card code" style="left:90px;top:210px;width:1740px;height:300px">
 <div class="ctitle">transcrição · o tempo de cada palavra</div>
 <div class="row" style="position:relative;gap:12px;flex-wrap:wrap;justify-content:flex-start;padding:10px 0">
 {''.join(f'<div id="tw{i}" class="wchip"><b>{html.escape(w)}</b><span>{t}</span></div>' for i,(w,t) in enumerate([("Etapa","113.14s"),("3","113.68s"),("A","114.20s"),("montagem","114.42s"),("É","115.34s"),("aqui","115.64s"),("que","115.84s"),("o","115.92s"),("HyperFrames","116.16s"),("entra","116.94s")]))}
 </div></div>
<div id="cd" class="card code" style="left:90px;top:540px;width:1740px;height:380px">
 <div class="ctitle">cena.html · o carimbo que bate</div>
 <div id="cd1" class="cline">&lt;div <span class="k">class</span>=<span class="s">"stamp clip"</span> <span class="k">data-start</span>=<span class="s">"18.6"</span>&gt;SOBREVIVEU ✓&lt;/div&gt;</div>
 <div id="cd2" class="cline"><span class="k">tl.fromTo</span>(<span class="s">".stamp"</span>, {{ scale: <span class="s">2.6</span> }}, {{ scale: <span class="s">1</span>, duration: <span class="s">0.16</span> }}, <span class="s">18.6</span>)</div>
 <div id="cd3" class="cline"><span class="k">tl.to</span>(contador, {{ valor: <span class="s">3</span> }}, <span class="s">42.4</span>)  <span class="c">// SOBREVIVEU 1/3 → 3/3</span></div>
</div>
<div id="grid" class="grid" style="left:90px;top:200px;width:1740px;height:560px">{''.join('<i></i>' for _ in range(120))}</div>
<div id="gcount" class="huge mono" style="position:absolute;left:0;right:0;top:780px;text-align:center"><span id="gn">0</span> FOTOS</div>
<div id="ff" class="row" style="top:330px;gap:26px"><div id="f1" class="chip">🖼 fotos</div><div class="arrow">+</div><div id="f2" class="chip">🎙 voz</div><div class="arrow">+</div><div id="f3" class="chip">🎵 trilha</div><div class="arrow">+</div><div id="f4" class="chip">💥 efeitos</div></div>
<div id="ff2" class="row" style="top:470px"><div class="arrow">↓</div></div>
<div id="ff3" class="row" style="top:580px"><div class="mp4 big2">▶ FFmpeg → video.mp4</div></div>
<div id="noed" class="center col"><div class="huge">SEM EDITOR</div><div class="huge red">DE VÍDEO</div></div>
'''))
left('#h6', g('b6', 113.14)); J.append(f'tl.set("#ff",{{opacity:0}},{T["b6"]:.2f});'); fade('#ff', g('b6', 150.5), .2)
fade('#tr', g('b6', 117.58))
for i in range(10): pop(f'#tw{i}', g('b6', 118.0) + i*.35, .3)
fade('#cd', g('b6', 128.62))
for i, t in enumerate([128.9, 131.64, 133.02]): wipe(f'#cd{i+1}', g('b6', t), .7)
out('#tr', g('b6', 131.5)); out('#cd', g('b6', 131.5))
phone('ph1', 'violet.webm', g('b6', 131.64), 7.1, 5.5, 360, 200, 270, 'o carimbo que bate')
phone('ph2', 'bombas.webm', g('b6', 131.64), 7.1, 16.5, 825, 200, 270, 'o contador que sobe')
phone('ph3', 'violet.webm', g('b6', 131.64), 7.1, 23.0, 1290, 200, 270, 'o navio que afunda')
fade('#grid', g('b6', 138.84))
J.append(f'tl.fromTo("#grid i",{{opacity:0}},{{opacity:1,duration:.05,stagger:.045}},{g("b6",138.9):.2f});')
fade('#gcount', g('b6', 142.5)); count('#gn', g('b6', 142.54), 1500, 2.4)
out('#grid', g('b6', 146.4)); out('#gcount', g('b6', 146.4))
for i, t in enumerate([150.62, 151.3, 152.06, 152.62]): pop(f'#f{i+1}', g('b6', t))
fade('#ff2', g('b6', 153.8)); pop('#ff3', g('b6', 154.0))
out('#ff', g('b6', 155.1)); out('#ff2', g('b6', 155.1)); out('#ff3', g('b6', 155.1))
slam('#noed', g('b6', 155.26))
# B7 — retenção
H.append(clip('sc_b7', 'b7', 'av4', '''
<div id="h7" class="hdr"><span class="n">4</span>RETENÇÃO <span class="mono" style="font-size:30px;color:#9fb0c8">a parte que ninguém te conta</span></div>
<div id="r1" class="tipbox" style="left:90px;top:220px"><div class="tipn">1</div><div class="big">COMEÇA NO <span class="lm">CLÍMAX</span></div></div>
<div id="r2" class="tipbox" style="left:90px;top:220px"><div class="tipn">2</div><div class="big">PAUSAS CURTAS + <span class="lm">8%</span> MAIS RÁPIDO</div></div>
<div id="pz" class="abs" style="left:90px;top:420px;width:1740px;height:300px">
 <div class="wv"><i style="width:220px"></i><em style="width:160px"></em><i style="width:300px"></i><em style="width:180px"></em><i style="width:260px"></i><em style="width:140px"></em><i style="width:200px"></i></div>
 <div id="pz2" class="wv" style="top:170px"><i style="width:220px"></i><em style="width:30px"></em><i style="width:300px"></i><em style="width:30px"></em><i style="width:260px"></i><em style="width:30px"></em><i style="width:200px"></i></div>
</div>
<div id="r3" class="tipbox" style="left:90px;top:220px"><div class="tipn">3</div><div class="big">FINAL <span class="lm">SECO</span> = VÍDEO EM LOOP ↺</div></div>
<div id="lp" class="loop">↺</div>
<div id="r4" class="tipbox" style="left:90px;top:190px"><div class="tipn">★</div><div class="big">A CAPA: ROSTO <span class="mg">vs</span> OBJETO</div></div>
<div id="cv1" class="capa" style="left:560px;top:300px;width:330px;height:587px"><img src="assets/img/capa_rosto.jpg"><div class="plabel2">com o meu rosto</div></div>
<div id="cv2" class="capa" style="left:960px;top:300px;width:330px;height:587px"><img src="assets/img/capa_ufo.jpg"><div class="plabel2 lm">com o disco voador</div></div>
<div id="cvw" class="stamp" style="position:absolute;left:1340px;top:540px;font-size:44px">O OBJETO VENCE</div>
'''))
left('#h7', g('b7', 160.38)); left('#r1', g('b7', 165.66)); out('#r1', g('b7', 172.3))
phone('ph4', 'rebobina_v1.webm', g('b7', 166.0), 6.3, 0.0, 700, 330, 290, 'ANTES: chiado + "Em 1983…"')
phone('ph5', 'rebobina_v2.webm', g('b7', 166.0), 6.3, 0.0, 1150, 330, 290, 'DEPOIS: o E.T. já na tela')
left('#r2', g('b7', 172.56)); fade('#pz', g('b7', 173.4)); fade('#pz2', g('b7', 174.8), .6)
out('#r2', g('b7', 182.0)); out('#pz', g('b7', 182.0))
left('#r3', g('b7', 182.3)); pop('#lp', g('b7', 186.66))
J.append(f'tl.fromTo("#lp",{{rotation:0}},{{rotation:720,duration:3.5,ease:"none",immediateRender:false}},{g("b7",186.7):.2f});')
out('#r3', g('b7', 190.5)); out('#lp', g('b7', 190.5))
left('#r4', g('b7', 190.72)); up('#cv1', g('b7', 193.46)); up('#cv2', g('b7', 194.9)); slam('#cvw', g('b7', 196.02))
# AV4 — o erro
H.append(clip('sc_av4', 'av4', 'av8', '''
<div class="panelL">
 <div id="e0" class="kicker mono">A LIÇÃO DO OLYMPIC</div>
 <div class="row" style="position:relative;gap:30px;justify-content:flex-start;margin-top:24px">
  <div id="e1" class="capa sm"><img src="assets/img/capa_violet_errada.jpg"><div id="e1x" class="xmark">✗</div></div>
  <div id="e5" class="capa sm"><img src="assets/img/capa_violet_certa.jpg"><div class="okmark">✓</div></div>
 </div>
 <div id="e2" class="comment"><b>@inscrito</b> o Olympic nunca afundou</div>
 <div id="e3" class="big" style="margin-top:20px">COLISÃO <span class="red">≠</span> NAUFRÁGIO</div>
 <div id="e4" class="row" style="position:relative;gap:14px;justify-content:flex-start;margin-top:16px"><div class="chip sm lmc">✓ Corrigi</div><div class="chip sm lmc">✓ Agradeci</div><div class="chip sm lmc">✓ Fixei</div></div>
</div>
<div id="e6" class="quote">"A IA acelera tudo. Quem responde pelo vídeo sou eu."</div>'''))
fade('#e0', a('av4', 1.0)); up('#e1', a('av4', 3.84)); pop('#e1x', a('av4', 12.1)); up('#e2', a('av4', 14.46)); slam('#e3', a('av4', 19.54))
out('#e2', a('av4', 25.9)); up('#e5', a('av4', 26.46)); pop('#e4', a('av4', 27.4)); out('#e3', a('av4', 30.5)); out('#e4', a('av4', 30.5)); up('#e6', a('av4', 30.74))
# AV8 — resultado
H.append(clip('sc_av8', 'av8', 'outro', '''
<div class="panelL">
 <div id="n0" class="big">SEM MÁGICA</div>
 <div class="row" style="position:relative;gap:30px;justify-content:flex-start;margin-top:26px">
  <div id="n1" class="stat"><div class="huge lm mono"><span id="n1v">0</span></div><div class="slbl">visualizações · Titanic</div></div>
  <div id="n2" class="stat"><div class="huge red mono">7</div><div class="slbl">visualizações · Op. Prato</div></div>
 </div>
 <div class="steps" style="margin-top:26px">
  <div id="l1" class="step">📰 Fato famoso + detalhe estranho</div>
  <div id="l2" class="step">⏱ Abaixo de 1 minuto</div>
  <div id="l3" class="step">⚡ Gancho no 1º segundo</div>
 </div>
 <div id="l4" class="row" style="position:relative;gap:20px;justify-content:flex-start;margin-top:20px"><div class="chip sm redc">✗ trabalho braçal</div><div class="chip sm lmc">✓ parte criativa</div></div>
</div>'''))
up('#n0', a('av8', 2.86)); pop('#n1', a('av8', 5.16)); count('#n1v', a('av8', 5.16), 1753, 1.0); pop('#n2', a('av8', 8.74))
for i, t in enumerate([11.22, 14.74, 17.26]): left(f'#l{i+1}', a('av8', t))
pop('#l4', a('av8', 19.3))
# OUTRO
H.append(clip('sc_outro', 'outro', END, '''
<div class="panelL">
 <div id="o1" class="row" style="position:relative;gap:20px;justify-content:flex-start"><div class="chip sm redc">✂ quem corta</div><div class="arrow">→</div><div class="chip lmc">✦ quem direciona a IA</div></div>
 <div id="o2" class="card qcard">A edição manual sobrevive por quanto tempo?</div>
 <div id="o3" class="chip" style="margin-top:26px;background:#18E8FF;color:#05070D">💬 COMENTE</div>
 <div id="o4" class="chip" style="margin-top:20px;background:#FF2E88">+ SEGUIR</div>
</div>'''))
up('#o1', a('outro', 3.54)); pop('#o2', a('outro', 8.82)); pop('#o3', a('outro', 12.6)); pop('#o4', a('outro', 13.6))

CSS = open(P + 'style.css').read()
page = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1920, height=1080"/>
<title>HyperFrames — os bastidores</title>
<script src="gsap.min.js"></script>
<style>{CSS}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}">
<div id="bg"><div id="bggrid"></div><div id="bgglow"></div></div>
{''.join(H)}
{''.join(media)}
<div id="caps">{''.join(cap_html)}</div>
<div id="hud"><span class="rec">●</span> HYPERFRAMES · BASTIDORES</div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
tl.set("#flash",{{opacity:0}},0);
tl.set("#lp",{{rotation:0,opacity:0}},0);
tl.fromTo("#bggrid",{{backgroundPositionY:"0px"}},{{backgroundPositionY:"{int(END*40)}px",duration:{END:.2f},ease:"none"}},0);
{chr(10).join(J)}
{chr(10).join(cap_js)}
window.__timelines["main"] = tl;
</script>
</body>
</html>'''
open(P + 'index.html', 'w').write(page)
print('ok', len(H), len(J), len(groups))
