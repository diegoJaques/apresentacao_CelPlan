# Monta uma aula do curso como projeto HyperFrames (16:9).
# Uso: python3 ferramentas/curso/montar.py <pasta_aula> <pasta_projeto>
# A pasta da aula precisa ter: roteiro.json, telas/ (saída do captura.mjs, com passos.json),
# narracao/aula*.mp3 (narração tratada), narracao/texto_tts.txt (texto enviado ao ElevenLabs)
# e narracao/words.json (Whisper, timestamps por palavra).
# Cada passo com "fala" vira uma cena: print dentro de uma janela de navegador, zoom no alvo,
# cursor animado, anel de destaque, clique (passo com "clique": true), selo do passo,
# cartão de comando ("codigo") e legenda palavra por palavra.
import json, html, re, sys, os, glob, shutil, difflib, unicodedata, subprocess

AULA, PROJ = sys.argv[1], sys.argv[2]
AQUI = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f'{AULA}/roteiro.json'))
CAP = {p['img']: p for p in json.load(open(f'{AULA}/telas/passos.json'))}
for i, p in enumerate(R['passos']):
    p['img'] = f'{i+1:02d}.png'; cp = CAP.get(p['img'], {})
    p['caixa'] = p.get('caixa_fixa') or cp.get('caixa'); p['url_atual'] = cp.get('url_atual', '')
    # passo gravado pela mesa virtual: a cena usa o trecho real da gravação de tela (t_ini → t_fim)
    if cp.get('gravacao') and cp.get('t_fim') is not None and not p.get('sem_gravacao') and not p.get('video'):
        p['video'], p['video_inicio'], p['video_ate'] = f"telas/{cp['gravacao']}", cp['t_ini'], cp['t_fim']
NARR = sorted(glob.glob(f'{AULA}/narracao/aula*.mp3'))[0]
DUR = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', NARR]))

# ---------- alinhamento: texto do roteiro × palavras do Whisper ----------
def norm(s): return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())
WH = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(f'{AULA}/narracao/words.json'))]
TX = open(f'{AULA}/narracao/texto_tts.txt').read().split()
sm = difflib.SequenceMatcher(None, [norm(t) for t in TX], [norm(w[0]) for w in WH], autojunk=False)
T = [None] * len(TX)
for a, b, n in sm.get_matching_blocks():
    for k in range(n): T[a+k] = (WH[b+k][1], WH[b+k][2])
known = [i for i, t in enumerate(T) if t]
for i in range(len(TX)):          # interpola palavras sem par
    if T[i]: continue
    lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
    t0 = T[lo][1] if lo is not None else 0; t1 = T[hi][0] if hi is not None else DUR
    a = lo if lo is not None else -1; b = hi if hi is not None else len(TX)
    s = t0 + (t1 - t0) * (i - a) / (b - a); T[i] = (s, s + (t1 - t0) / (b - a))
W = [(TX[i], T[i][0], T[i][1]) for i in range(len(TX))]

# início de cada fala = primeira palavra dela dentro do texto falado
cenas, pos = [], 0
NT = [norm(t) for t in TX]
for p in R['passos']:
    if not p.get('fala'): continue
    alvo = [norm(x) for x in p['fala'].split()[:3]]
    k = next(i for i in range(pos, len(NT)) if NT[i:i+3] == alvo)
    cenas.append(dict(p, t=0.0 if not cenas else W[k][1] - .12)); pos = k + 1
FIM_N = DUR; END = FIM_N + 4.2
for i, c in enumerate(cenas): c['e'] = cenas[i+1]['t'] if i+1 < len(cenas) else END
N = len(cenas)

# trocas de exibição na legenda (ex.: "ene pê xis" → "npx")
for de, para in R.get('legenda_troca', []):
    d = de.split(); i = 0; out = []
    while i < len(W):
        if [w[0] for w in W[i:i+len(d)]] == d:
            out.append((para, W[i][1], W[i+len(d)-1][2])); i += len(d)
        else: out.append(W[i]); i += 1
    W = out

# ---------- geometria ----------
FX, FY, FW, CH = 160, 26, 1600, 42       # janela do navegador: x, y, largura, barra
S0 = FW / 1920; FH = 1080 * S0            # print escalado (1600×900)
J, H, VIDS = [], [], []
def A(s): J.append(s)

def zoom_de(c):
    b = c.get('caixa')
    if not b: return 1.0, 0.0, 0.0, None
    bx, by, bw, bh = (v * S0 for v in (b['x'], b['y'], b['w'], b['h']))
    Z = max(1.0, min(1.9, .5 * FW / max(bw, 1), .45 * FH / max(bh, 1)))
    cx, cy = bx + bw / 2, by + bh / 2
    tx = min(0, max(FW - FW * Z, FW / 2 - cx * Z)); ty = min(0, max(FH - FH * Z, FH / 2 - cy * Z))
    return Z, tx, ty, (bx * Z + tx, by * Z + ty, bw * Z, bh * Z)

cur = (FW * .55, FH * .6)
A(f'tl.set("#cursor",{{x:{cur[0]:.0f},y:{cur[1]:.0f},autoAlpha:0}},0);tl.to("#cursor",{{autoAlpha:1,duration:.3}},4.0);')
for i, c in enumerate(cenas):
    t, e = c['t'], c['e']; sid = f'c{i}'
    Z, tx, ty, ring = zoom_de(c) if not c.get('video') else (1.0, 0.0, 0.0, None)
    if c.get('video'):   # cena com vídeo: <video> filho direto do root, sobre a área do navegador
        nome = os.path.basename(c['video'])
        dur, vel = e - t, 1.0
        if c.get('video_ate') is not None:          # trecho com fim: acelera se não couber; se sobrar tempo, fica o print final
            L = max(0.1, c['video_ate'] - c.get('video_inicio', 0))
            vel = min(16.0, max(1.0, L / (e - t))); dur = min(e - t, L / vel)
        taxa = f' data-playback-rate="{vel:.2f}"' if vel > 1.05 else ''
        VIDS.append(f'<video id="{sid}v" class="clip vid" src="assets/media/{nome}" data-start="{t:.2f}" data-duration="{dur:.2f}" data-media-start="{c.get("video_inicio", 0):.2f}"{taxa} data-track-index="{6 + i % 2}" data-volume="0" muted playsinline></video>')
        if vel >= 1.5:
            VIDS.append(f'<div id="{sid}vel" class="clip vel" data-start="{t:.2f}" data-duration="{dur:.2f}" data-track-index="12">⏩ {vel:.0f}× mais rápido</div>')
        A(f'tl.to("#cursor",{{autoAlpha:0,duration:.2}},{t:.2f});')
    u = c.get('url_exibir') or c['url_atual']
    if u.startswith('file:'): u = 'Terminal'
    u = re.sub(r'^http://\d+\.\d+\.\d+\.\d+:3003', 'localhost:3002', u)   # Studio visto pela ponte de porta
    u = re.sub(r'\?v=1&t=[^&]*&tab=design&rc=0$', '', u)
    url = html.escape(u.replace('https://', '').replace('http://', '').rstrip('/'))
    cod = ''
    if c.get('codigo'):
        linhas = ''.join(f'<div>{"<i>$</i> " if l.startswith("npx") else ""}{html.escape(l)}</div>' for l in c['codigo'].split('\n'))
        cod = f'<div id="{sid}k" class="code">{linhas}</div>'
    H.append(f'''<section id="{sid}" class="clip cena" data-start="{t:.2f}" data-duration="{e-t:.2f}" data-track-index="{2 + i % 2}"><div id="{sid}i" class="inner">
<div class="win"><div class="bar"><b></b><b></b><b></b><span class="url">🔒 {url}</span><span class="chip">AULA {R["aula"]} · {i+1}/{N}</span></div>
<div class="vp"><div id="{sid}z" class="zw"><img src="assets/telas/{c["img"]}"/></div>
{f'<div id="{sid}r" class="ring" style="left:{ring[0]-10:.0f}px;top:{ring[1]-10:.0f}px;width:{ring[2]+20:.0f}px;height:{ring[3]+20:.0f}px"></div>' if ring else ''}
{f'<div id="{sid}l" class="lbl">{html.escape(c["rotulo"])}</div>' if c.get("rotulo") else ''}{cod}</div></div></div></section>''')
    A(f'tl.fromTo("#{sid}i",{{autoAlpha:0}},{{autoAlpha:1,duration:.35,ease:"power1.out",immediateRender:false}},{t:.2f});')
    if Z > 1.001:
        A(f'tl.fromTo("#{sid}z",{{scale:1,x:0,y:0}},{{scale:{Z:.3f},x:{tx:.1f},y:{ty:.1f},duration:1.1,ease:"power3.inOut",immediateRender:false}},{t+.35:.2f});')
    else:
        A(f'tl.fromTo("#{sid}z",{{scale:1}},{{scale:1.05,duration:{e-t:.2f},ease:"none",immediateRender:false}},{t:.2f});')
    if ring:
        A(f'tl.fromTo("#{sid}r",{{autoAlpha:0,scale:1.25}},{{autoAlpha:1,scale:1,duration:.4,ease:"back.out(2)",immediateRender:false}},{t+1.45:.2f});')
        A(f'tl.to("#{sid}r",{{scale:1.035,duration:.6,yoyo:true,repeat:{max(1,2*int((e-t-2.2)/1.2)+1)},ease:"sine.inOut"}},{t+1.9:.2f});')
        nxt = (ring[0] + min(ring[2] * .9, ring[2] - 6), ring[1] + ring[3] * .9)
        A(f'tl.to("#cursor",{{x:{nxt[0]:.0f},y:{nxt[1]:.0f},duration:.9,ease:"power2.inOut"}},{t+.6:.2f});'); cur = nxt
        if c.get('clique'):
            A(f'tl.to("#cursor",{{scale:.82,duration:.09,yoyo:true,repeat:1}},{t+1.6:.2f});')
            A(f'tl.set("#ripple",{{x:{nxt[0]:.0f},y:{nxt[1]:.0f}}},{t+1.6:.2f});')
            A(f'tl.fromTo("#ripple",{{autoAlpha:.9,scale:.2}},{{autoAlpha:0,scale:2.4,duration:.7,ease:"power2.out",immediateRender:false}},{t+1.62:.2f});')
    if c.get('rotulo'): A(f'tl.fromTo("#{sid}l",{{autoAlpha:0,x:-30}},{{autoAlpha:1,x:0,duration:.45,ease:"power3.out",immediateRender:false}},{t+.5:.2f});')
    if cod: A(f'tl.fromTo("#{sid}k",{{autoAlpha:0,y:30}},{{autoAlpha:1,y:0,duration:.45,ease:"power3.out",immediateRender:false}},{t+1.9:.2f});')

# abertura (título) e encerramento (próxima aula + inscrever-se, só visual)
H.append(f'''<div id="abre" class="clip" data-start="0" data-duration="4.2" data-track-index="8"><div class="abre">
<span class="k">{html.escape(R["curso"])}</span><h1>Aula {R["aula"]}<br/><em>{html.escape(R["titulo_curto"])}</em></h1></div></div>''')
A('tl.fromTo(".abre",{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.5,ease:"power3.out",immediateRender:false},.1);')
A('tl.to(".abre",{autoAlpha:0,duration:.4},3.7);')
H.append(f'''<div id="fim" class="clip" data-start="{FIM_N:.2f}" data-duration="{END-FIM_N:.2f}" data-track-index="8"><div class="fimbg"></div><div class="fimc">
<span class="k">{html.escape(R["curso"])}</span><h2>{html.escape(R["proxima"])}</h2>
<div id="sub" class="sub"><svg width="54" height="54" viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg><span id="subt">INSCREVER-SE</span></div></div></div>''')
A(f'tl.to("#cursor",{{autoAlpha:0,duration:.3}},{FIM_N:.2f});')
A(f'tl.fromTo(".fimbg",{{autoAlpha:0}},{{autoAlpha:1,duration:.5,immediateRender:false}},{FIM_N:.2f});')
A(f'tl.fromTo(".fimc",{{autoAlpha:0,y:40}},{{autoAlpha:1,y:0,duration:.5,ease:"power3.out",immediateRender:false}},{FIM_N+.2:.2f});')
A(f'tl.fromTo("#sub",{{scale:.6}},{{scale:1,duration:.45,ease:"back.out(2)",immediateRender:false}},{FIM_N+.6:.2f});')
A(f'tl.to("#sub",{{scale:.9,duration:.1,yoyo:true,repeat:1}},{FIM_N+2.0:.2f});')
A(f'tl.set("#sub",{{background:"#3a3a3a"}},{FIM_N+2.2:.2f});tl.set("#subt",{{textContent:"INSCRITO"}},{FIM_N+2.2:.2f});')

# legendas: grupos de até 7 palavras, palavra atual em verde
groups, g = [], []
for i, w in enumerate(W):
    g.append(w); nx = W[i+1] if i+1 < len(W) else None
    if not nx or len(g) >= 7 or re.search(r'[.?!:]$', w[0]) or nx[1] - w[2] > .45: groups.append(g); g = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2] + .5, gr[-1][2] + .7)
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0])}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cap{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#2EE6A6"}},{max(s, x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

CSS = f'''
@font-face{{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}}
@font-face{{font-family:"M7";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}}
@font-face{{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}}
body{{margin:0;background:#0b1020}}
#root{{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(1300px 800px at 50% 0%,#18233f,#0b1020);font-family:"M7";color:#fff}}
.cena{{position:absolute;inset:0}}.inner{{position:absolute;inset:0}}
.win{{position:absolute;left:{FX}px;top:{FY}px;width:{FW}px;height:{FH+CH:.0f}px;border-radius:16px;overflow:hidden;background:#1b2130;box-shadow:0 30px 90px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08)}}
.bar{{height:{CH}px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#232a3b}}
.bar b{{width:13px;height:13px;border-radius:50%;background:#ff5f57}}.bar b:nth-child(2){{background:#febc2e}}.bar b:nth-child(3){{background:#28c840}}
.url{{margin-left:18px;flex:1;max-width:760px;background:#151a26;border-radius:8px;padding:5px 16px;font-family:"J";font-size:17px;color:#b8c1d6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.chip{{margin-left:auto;font-family:"J";font-size:17px;color:#0b1020;background:#2EE6A6;padding:5px 14px;border-radius:20px}}
.vp{{position:relative;width:{FW}px;height:{FH:.0f}px;overflow:hidden;background:#fff}}
.zw{{position:absolute;left:0;top:0;width:{FW}px;height:{FH:.0f}px;transform-origin:0 0}}.zw img{{width:100%;height:100%;display:block}}
.ring{{position:absolute;border:4px solid #2EE6A6;border-radius:12px;box-shadow:0 0 30px rgba(46,230,166,.6);z-index:4}}
.vid{{position:absolute;left:{FX}px;top:{FY+CH}px;width:{FW}px;height:{FH:.0f}px;object-fit:cover;z-index:3}}
.vel{{position:absolute;right:{FX+26}px;top:{FY+CH+20}px;z-index:7;font-family:"J";font-size:26px;background:rgba(11,16,32,.85);color:#2EE6A6;padding:8px 16px;border-radius:10px}}
.lbl{{position:absolute;left:26px;bottom:26px;z-index:5;font-family:"M";font-size:34px;background:rgba(11,16,32,.92);border-left:8px solid #2EE6A6;padding:14px 26px;border-radius:10px}}
.code{{position:absolute;right:26px;bottom:26px;z-index:5;background:#0d1117;border:2px solid #2EE6A6;border-radius:14px;padding:20px 28px;font-family:"J";font-size:28px;line-height:1.55;color:#e6edf3;box-shadow:0 20px 60px rgba(0,0,0,.6)}}
.code i{{color:#2EE6A6;font-style:normal}}
#cursor{{position:absolute;left:{FX}px;top:{FY+CH}px;width:44px;height:44px;z-index:30;transform-origin:4px 4px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.6))}}
#ripple{{position:absolute;left:{FX-40}px;top:{FY+CH-40}px;width:80px;height:80px;border-radius:50%;border:5px solid #2EE6A6;z-index:29;opacity:0}}
#abre,#fim{{position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:40}}
.abre{{position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgba(11,16,32,.86);display:flex;flex-direction:column;justify-content:center;padding-left:200px;box-sizing:border-box}}
.k{{font-family:"J";font-size:30px;letter-spacing:6px;color:#2EE6A6}}
.abre h1{{font-family:"M";font-size:120px;line-height:1.02;margin:20px 0 0}}.abre em,.fimc h2 em{{font-style:normal;color:#2EE6A6}}
.fimbg{{position:absolute;left:0;top:0;width:1920px;height:1080px;background:rgba(11,16,32,.9)}}
.fimc{{position:absolute;left:200px;top:300px;width:1520px}}.fimc h2{{font-family:"M";font-size:84px;line-height:1.08;margin:20px 0 50px}}
.sub{{display:inline-flex;align-items:center;gap:18px;font-family:"M";font-size:52px;background:#FF0033;padding:20px 44px;border-radius:70px}}
.capg{{position:absolute;left:0;right:0;top:{FY+CH+FH+6:.0f}px;text-align:center;z-index:25}}
.capg span{{display:inline-block;margin:0 8px;font-family:"M";font-size:40px;color:#fff;-webkit-text-stroke:2px #000;paint-order:stroke fill;text-shadow:0 3px 10px rgba(0,0,0,.9)}}
'''
CURSOR = '<svg id="cursor" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.9L4 20z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>'
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>{html.escape(R["titulo"])}</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}">
<audio id="narr" src="assets/audio/narracao.mp3" data-start="0" data-duration="{DUR:.2f}" data-track-index="10" data-volume="1"></audio>
{chr(10).join(H)}
{chr(10).join(VIDS)}
<div id="ripple"></div>{CURSOR}
{''.join(cap)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
{chr(10).join(cj)}
window.__timelines["main"] = tl;
</script></body></html>'''

os.makedirs(f'{PROJ}/assets/telas', exist_ok=True); os.makedirs(f'{PROJ}/assets/audio', exist_ok=True)
os.makedirs(f'{PROJ}/assets/media', exist_ok=True)
for c in cenas:
    shutil.copy(f'{AULA}/telas/{c["img"]}', f'{PROJ}/assets/telas/')
    if c.get('video') and not os.path.exists(f'{PROJ}/assets/media/{os.path.basename(c["video"])}'): shutil.copy(f'{AULA}/{c["video"]}', f'{PROJ}/assets/media/')
shutil.copy(NARR, f'{PROJ}/assets/audio/narracao.mp3')
open(f'{PROJ}/index.html', 'w').write(page)
# legenda .srt para o YouTube
def ts(x): return f'{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(x*1000%1000):03d}'
open(f"{AULA}/{R.get('nome_arquivo') or 'aula%02d' % R['aula']}.srt", "w").write('\n'.join(f'{k+1}\n{ts(gr[0][1])} --> {ts(gr[-1][2]+.2)}\n{" ".join(w[0] for w in gr)}\n' for k, gr in enumerate(groups)))
print('ok', N, 'cenas', round(END, 2), 's', [(c['img'], round(c['t'], 1)) for c in cenas])
