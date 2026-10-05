# Consta nos Autos — "8 detalhes que derrubaram aviões" (longo 16:9). Gera index.html do projeto HyperFrames.
# Uso: python3 gen.py <pasta_projeto> <pasta_asr>   (o projeto precisa ter assets/img, assets/vid, assets/audio)
import json, html, re, sys, os, subprocess, difflib, unicodedata

PROJ, ASR = sys.argv[1], sys.argv[2]
AQUI = os.path.dirname(os.path.abspath(__file__))
NAR = os.path.join(AQUI, '..', 'narracao')
FF = os.path.expanduser('~/bin/ffmpeg'); FP = os.path.expanduser('~/bin/ffprobe')
GAP = 3.4          # cartão de capítulo entre blocos (sem narração)
def dur(f): return float(subprocess.check_output([FP, '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

# ---------- narração: blocos + respiros → narracao.wav ----------
D = [dur(f'{NAR}/b{k}.wav') for k in range(1, 9)]
O = [0.0]
for k in range(1, 8): O.append(O[-1] + D[k-1] + GAP)
NARR_FIM = O[7] + D[7]; END = NARR_FIM + 5.0
args, filt = [], []
for k in range(8):
    args += ['-i', f'{NAR}/b{k+1}.wav']; filt.append(f'[{k}]adelay={int(O[k]*1000)}|{int(O[k]*1000)}[a{k}]')
subprocess.run([FF, '-y', '-loglevel', 'error', *args, '-filter_complex', ';'.join(filt) + ';' + ''.join(f'[a{k}]' for k in range(8)) + f'amix=inputs=8:normalize=0,apad=whole_dur={END}[o]',
                '-map', '[o]', '-ac', '2', '-ar', '44100', f'{PROJ}/assets/audio/narracao.wav'], check=True)

# ---------- palavras: texto do roteiro alinhado ao Whisper ----------
def norm(s): return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())
W = []        # (palavra, ini, fim, bloco)
BW = []       # palavras por bloco (para âncoras)
for k in range(8):
    tx = re.sub(r'\[[^\]]*\]', ' ', open(f'{NAR}/bloco{k+1}.txt').read()).split()
    wh = [(x['text'].strip(), x['timestamp'][0], x['timestamp'][1] or x['timestamp'][0] + .3) for x in json.load(open(f'{ASR}/cb{k+1}.words.json'))]
    sm = difflib.SequenceMatcher(None, [norm(t) for t in tx], [norm(w[0]) for w in wh], autojunk=False)
    T = [None] * len(tx)
    for a, b, n in sm.get_matching_blocks():
        for j in range(n): T[a+j] = (wh[b+j][1], wh[b+j][2])
    kn = [i for i, t in enumerate(T) if t]
    for i in range(len(tx)):
        if T[i]: continue
        lo = max([j for j in kn if j < i], default=None); hi = min([j for j in kn if j > i], default=None)
        t0 = T[lo][1] if lo is not None else 0; t1 = T[hi][0] if hi is not None else D[k]
        a = lo if lo is not None else -1; b = hi if hi is not None else len(tx)
        s = t0 + (t1 - t0) * (i - a) / (b - a); T[i] = (s, s + (t1 - t0) / (b - a))
    ws = [(tx[i], O[k] + T[i][0], O[k] + min(T[i][1], D[k]), k) for i in range(len(tx))]
    W += ws; BW.append(ws)

def at(k, frase, depois=-1.0):
    alvo = [norm(x) for x in frase.split()]; ws = BW[k]; nw = [norm(w[0]) for w in ws]
    for i in range(len(ws)):
        if ws[i][1] > depois and nw[i:i+len(alvo)] == alvo: return ws[i][1]
    raise SystemExit(f'âncora não achada no bloco {k+1}: {frase}')

# ---------- dados dos capítulos ----------
CAP = [
 ('TAM 402', 'A manete que voltava sozinha', 'Congonhas, São Paulo · 31/10/1996', 'tam_i2'),
 ('Varig 254', 'Um zero fora do lugar', 'Marabá → Belém · 03/09/1989', 'varig_i1'),
 ('Aeroperú 603', 'Um pedaço de fita adesiva', 'Lima, Peru · 02/10/1996', 'aero_i1'),
 ('Linate · SAS 686', 'O alarme desligado de propósito', 'Milão, Itália · 08/10/2001', 'linate_i1'),
 ('Chapecoense · LaMia 2933', 'O combustível que não deu', 'Medellín, Colômbia · 28/11/2016', 'chape_i8'),
 ('Voepass 2283', 'O gelo que ficou na asa', 'Vinhedo, São Paulo · 09/08/2024', 'gol_07'),
 ('LANSA 508', 'A menina que caiu do céu', 'Amazônia peruana · 24/12/1971', 'juliane_i1'),
 ('Gol 1907', 'O transponder mudo', 'Mato Grosso · 29/09/2006', 'gol_01'),
]
# visual: (âncora, ativo). "i:nome" = imagem; "v:arquivo:inicio" = clipe; vale até a próxima âncora
VIS = [
 [('Uma manete', 'v:tam402_veo1_manete:0'), ('Um zero', 'i:varig_i1'), ('Um pedaço', 'i:aero_i1'), ('Um alarme', 'v:linate_veo1_luzes:0'),
  ('Em cada um', 'i:gol_16'), ('Este vídeo é', 'i:tam_i6'), ('E a gente começa', 'i:tam_i2'), ('Manhã de quinta-feira', 'i:tam_i3'),
  ('No instante em', 'v:tam402_veo1_manete:2'), ('Os pilotos acham', 'i:tam_i2'), ('Mas o problema', 'v:tam402_veo2_reversor:0'),
  ('A manete recuava', 'v:tam402_veo1_manete:4'), ('Na terceira', 'i:tam_i4'), ('O motor foi', 'v:tam402_veo2_reversor:4'),
  ('O Fokker gira', 'i:tam_i5'), ('Noventa e nove', 'i:tam_i6'), ('A investigação mostrou', 'i:tam_i4'), ('E se no caso', 'i:varig_i1')],
 [('Um zero fora', 'v:varig254_veo1_cabine_sol:0'), ('Fim de tarde', 'i:varig_i3'), ('No plano de voo', 'i:varig_i1'), ('O comandante leu', 'i:varig_i2'),
  ('E havia um sinal', 'v:varig254_veo1_cabine_sol:2'), ('Ninguém estranhou', 'i:varig_i1'), ('O tempo passa', 'v:varig254_veo2_voo_amazonia:0'),
  ('Três horas depois', 'v:varig254_veo2_voo_amazonia:5'), ('No escuro', 'i:varig_i4'), ('Doze pessoas', 'i:varig_i5'), ('Depois, o mesmo', 'i:varig_i3'),
  ('O caso virou', 'i:varig_i1'), ('No Varig', 'i:aero_i1')],
 [('Um pedaço de fita', 'i:aero_i1'), ('Madrugada em Lima', 'i:aero_i3'), ('Horas antes', 'i:aero_i2'), ('Esses furos', 'i:aero_i1'),
  ('Logo depois da', 'i:aero_i4'), ('É noite', 'i:aero_i5'), ('Os pilotos pedem', 'i:aero_i4'), ('O painel dizia', 'i:aero_i5'),
  ('A ponta da asa', 'i:aero_i6'), ('Setenta pessoas', 'i:aero_i5'), ('A fita era', 'i:aero_i2'), ('Uma fita que', 'v:linate_veo1_luzes:0')],
 [('O alarme que podia', 'v:linate_veo1_luzes:0'), ('Manhã de neblina', 'i:linate_i1'), ('Um MD oitenta', 'i:linate_i4'), ('Ao mesmo tempo', 'i:linate_i3'),
  ('O controlador não', 'i:linate_i2'), ('E o aeroporto', 'v:linate_veo1_luzes:4'), ('O MD acelera', 'v:linate_veo2_corrida:0'), ('A batida arranca', 'i:linate_i4'),
  ('Cento e dezoito pessoas', 'i:linate_i5'), ('Depois disso', 'i:linate_i2'), ('Em Linate faltou', 'i:chape_i2')],
 [('O avião da Chapecoense', 'i:chape_i8'), ('E o piloto', 'i:chape_i1'), ('O time de', 'i:chape_i3'), ('O voo fretado', 'i:chape_i4'),
  ('Havia aeroportos', 'i:chape_i5'), ('Perto de Medellín', 'i:chape_i2'), ('Outro avião', 'i:chape_i5'), ('Os motores param', 'i:chape_i6'),
  ('Setenta e uma', 'i:chape_i7'), ('A investigação colombiana', 'i:chape_i1'), ('E o adversário', 'i:chape_i7'), ('Na Chapecoense', 'v:voepass2283_veo2_gelo:0')],
 [('Um avião com', 'v:voepass2283_veo1_parafuso:0'), ('Um ATR', 'i:gol_07'), ('Lá em cima', 'v:voepass2283_veo2_gelo:0'),
  ('O avião tem', 'v:voepass2283_veo2_gelo:4'), ('Mas o sistema', 'i:gol_06'), ('Asa com gelo', 'v:voepass2283_veo2_gelo:2'),
  ('Até que a asa', 'v:voepass2283_veo1_parafuso:0'), ('Em vez de', 'v:voepass2283_veo1_parafuso:4'), ('Foi cerca de', 'i:gol_14'),
  ('O relatório final', 'i:gol_12'), ('Em todos esses', 'i:juliane_i2')],
 [('Ela caiu de', 'v:juliane_veo1_queda_anjo:0'), ('Mas o pior', 'i:juliane_i1'), ('Véspera de Natal', 'i:juliane_i2'), ('Ela acorda', 'i:juliane_i3'),
  ('Então ela lembra', 'v:juliane_veo2_riacho_anjo:0'), ('Por onze dias', 'i:juliane_i4'), ('Até que encontra', 'i:juliane_i5'),
  ('Anos depois', 'i:gol_09'), ('A história dela', 'i:gol_16')],
 [('Um jatinho bateu', 'i:gol_01'), ('E quem estava', 'i:gol_02'), ('Céu limpo', 'i:gol_08'), ('Um jatinho executivo', 'i:gol_07'),
  ('O céu tem', 'i:gol_05'), ('Mas o transponder', 'i:gol_06'), ('A ponta da asa', 'i:gol_07'), ('O Legacy, com', 'i:gol_10'),
  ('O acidente expôs', 'i:gol_13'), ('Cento e cinquenta', 'i:gol_14'), ('Oito acidentes', 'i:gol_16'), ('E é por isso', 'i:tam_i6'),
  ('Tudo começou', 'v:tam402_veo1_manete:0')],
]
# números/frases grandes: (âncora, texto, duração)
TXT = [
 [('vinte e cinco segundos', '25 SEGUNDOS', 3.2), ('Uma, duas, três', '3 VEZES', 2.8), ('Noventa e nove pessoas', '99 VIDAS', 3.5)],
 [('zero, dois, sete', '0270 = 027,0°', 4.5), ('O comandante leu', 'LIDO: 270° · OESTE', 3.5), ('Três horas depois', '3 HORAS', 3),
  ('Doze pessoas', '12 MORTOS · 42 SOBREVIVENTES', 4), ('Quinze cometeram', '15 DE 21 PILOTOS ERRARAM', 3.8)],
 [('alguém cobriu com', '3 SENSORES TAPADOS', 3.5), ('dois alarmes que', 'VELOCIDADE ALTA + ESTOL', 3.8),
  ('O painel dizia', 'PAINEL: 3.000 m · REAL: RENTE AO MAR', 4.2), ('Setenta pessoas', '70 VIDAS', 3.2)],
 [('entra no R', 'R5 → R6', 3.2), ('estou na S', 'S4', 2.6), ('E o aeroporto', 'RADAR DE SOLO: OFF · SENSORES: OFF', 4.5),
  ('duzentos e setenta', '270 km/h', 2.8), ('Cento e dezoito pessoas', '118 VIDAS', 3.5)],
 [('menos de vinte', '< 20 km DA PISTA', 3.2), ('Sem reserva', 'SEM RESERVA DE COMBUSTÍVEL', 3.2),
  ('não declara emergência', 'EMERGÊNCIA NÃO DECLARADA', 3.2), ('Setenta e uma pessoas', '71 VIDAS · 6 SOBREVIVENTES', 3.8), ('Ela virou campeã', 'CAMPEÃ', 3.0)],
 [('ligado e desligado', 'DEGELO: ON · OFF · ON', 3.6), ('parafuso chato', 'PARAFUSO CHATO', 3), ('cerca de um minuto', '≈ 1 MINUTO · 62 VIDAS', 3.8),
  ('dezenove fatores', '19 FATORES', 3.4)],
 [('Das noventa e duas', '92 A BORDO → 1 SOBREVIVENTE', 4), ('siga a correnteza', 'SIGA A ÁGUA', 2.8), ('Por onze dias', '11 DIAS', 3)],
 [('onze mil metros de', '11.000 m', 2.8), ('Mas o transponder', 'TRANSPONDER: OFF', 3.4), ('Cento e cinquenta e quatro vidas', '154 VIDAS', 3.5)],
]
RECAP = ['Uma manete', 'um zero', 'uma fita', 'um alarme', 'um tanque', 'uma borracha', 'um raio', 'um transponder']

J, H, VID = [], [], []
def A(s): J.append(s)

# ---------- cenas ----------
n_c = 0
for k in range(8):
    ancs, prev = [], -1.0
    for a, v in VIS[k]:
        prev = at(k, a, prev); ancs.append((prev, v))
    ancs[0] = (O[k] if k else 0.0, ancs[0][1])
    fim_bloco = (O[k+1] if k < 7 else END)
    for i, (t, v) in enumerate(ancs):
        e = ancs[i+1][0] if i+1 < len(ancs) else fim_bloco
        sid = f's{n_c}'; n_c += 1
        if v.startswith('i:'):
            img = v[2:]; d = (n_c % 4)
            ox, oy = ['30% 40%', '70% 40%', '50% 30%', '40% 65%'][d].split()
            H.append(f'<section id="{sid}" class="clip cena" data-start="{t:.2f}" data-duration="{e-t:.2f}" data-track-index="{2 + n_c % 2}"><div id="{sid}i" class="kb" style="background-image:url(assets/img/{img}.jpg);transform-origin:{ox} {oy}"></div><div class="vin"></div></section>')
            A(f'tl.fromTo("#{sid}i",{{scale:1.02}},{{scale:1.12,duration:{e-t:.2f},ease:"none",immediateRender:false}},{t:.2f});')
        else:
            _, arq, ms = v.split(':'); ms = float(ms)
            cap = 10.0 - ms
            if e - t > cap:      # clipe acaba antes: fica a imagem-base do capítulo por baixo
                H.append(f'<section id="{sid}b" class="clip cena" data-start="{t:.2f}" data-duration="{e-t:.2f}" data-track-index="{2 + n_c % 2}"><div class="kb" style="background-image:url(assets/img/{CAP[k][3]}.jpg)"></div><div class="vin"></div></section>')
            VID.append(f'<video id="{sid}v" class="clip vfull" src="assets/vid/{arq}.mp4" data-start="{t:.2f}" data-duration="{min(e-t, cap):.2f}" data-media-start="{ms:.2f}" data-track-index="{6 + n_c % 2}" data-volume="0" muted playsinline></video>')

# ---------- cartões de capítulo ----------
for k in range(8):
    nome, det, lugar, _ = CAP[k]
    if k == 0:
        t = at(0, 'Manhã de quinta-feira') - .2; d = 4.2; full = False
    else:
        t = O[k] - GAP; d = GAP + 0.6; full = True
    cid = f'cap{k}'
    H.append(f'''<div id="{cid}" class="clip capc{' full' if full else ''}" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="14"><div class="capin">
<span class="cn">CAPÍTULO {k+1} DE 8</span><h2>{html.escape(nome)}</h2><p>{html.escape(det)}</p><span class="cl">{html.escape(lugar)}</span></div></div>''')
    A(f'tl.fromTo("#{cid} .capin",{{autoAlpha:0,y:30}},{{autoAlpha:1,y:0,duration:.6,ease:"power3.out",immediateRender:false}},{t+.15:.2f});')
    A(f'tl.to("#{cid} .capin",{{autoAlpha:0,duration:.4}},{t+d-.45:.2f});')
    # selo fixo do capítulo (canto superior esquerdo)
    ts = t + (d if full else 0.5); te = (O[k+1] - GAP) if k < 7 else NARR_FIM
    H.append(f'<div id="tag{k}" class="clip tag" data-start="{ts:.2f}" data-duration="{te-ts:.2f}" data-track-index="15">{k+1}/8 · {html.escape(nome)}</div>')

# ---------- números grandes ----------
n_t = 0
for k in range(8):
    prev = -1.0
    for a, txt, d in TXT[k]:
        prev = at(k, a, prev); t = prev + .1; tid = f't{n_t}'; n_t += 1
        H.append(f'<div id="{tid}" class="clip big" data-start="{t:.2f}" data-duration="{d:.2f}" data-track-index="16"><span>{html.escape(txt)}</span></div>')
        A(f'tl.fromTo("#{tid} span",{{autoAlpha:0,scale:.8}},{{autoAlpha:1,scale:1,duration:.35,ease:"back.out(2)",immediateRender:false}},{t:.2f});')
        A(f'tl.to("#{tid} span",{{autoAlpha:0,duration:.3}},{t+d-.35:.2f});')

# ---------- abertura: título + "em memória" ----------
t1 = at(0, 'Em cada um'); t2 = at(0, 'Este vídeo é'); t3 = at(0, 'E a gente começa')
H.append(f'<div id="titulo" class="clip ttl" data-start="{t1:.2f}" data-duration="{t2-t1:.2f}" data-track-index="17"><div><span class="cn">CONSTA NOS AUTOS</span><h1>8 detalhes que<br/>derrubaram aviões</h1></div></div>')
A(f'tl.fromTo("#titulo h1",{{autoAlpha:0,y:30}},{{autoAlpha:1,y:0,duration:.7,ease:"power3.out",immediateRender:false}},{t1+.1:.2f});')
H.append(f'<div id="memo" class="clip memo" data-start="{t2:.2f}" data-duration="{t3-t2:.2f}" data-track-index="17"><p>Em memória de todas as pessoas que estavam nesses voos.</p></div>')
A(f'tl.fromTo("#memo p",{{autoAlpha:0}},{{autoAlpha:1,duration:.8,immediateRender:false}},{t2+.1:.2f});')

# ---------- recapitulação (bloco 8) ----------
tr = at(7, 'Oito acidentes'); te = at(7, 'Cada um deles')
itens = ''.join(f'<li id="r{i}">{html.escape(x.capitalize())}</li>' for i, x in enumerate(RECAP))
H.append(f'<div id="recap" class="clip recap" data-start="{tr:.2f}" data-duration="{te-tr+.3:.2f}" data-track-index="17"><ul>{itens}</ul></div>')
ws8 = BW[7]; nw8 = [norm(w[0]) for w in ws8]; base = next(i for i, w in enumerate(ws8) if w[1] >= tr - .05)
for i, x in enumerate(RECAP):
    alvo = norm(x.split()[-1]); j = next(j for j in range(base, len(ws8)) if nw8[j] == alvo); base = j + 1
    A(f'tl.fromTo("#r{i}",{{autoAlpha:0,x:-20}},{{autoAlpha:1,x:0,duration:.3,immediateRender:false}},{ws8[j][1]:.2f});')

# ---------- inscrever-se (só visual, depois do pico do capítulo 4) ----------
ti = at(3, 'Depois disso') - 2.6
H.append(f'<div id="sub" class="clip subw" data-start="{ti:.2f}" data-duration="2.4" data-track-index="18"><div class="sub"><svg width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg><span id="subt">INSCREVER-SE</span></div></div>')
A(f'tl.fromTo("#sub .sub",{{autoAlpha:0,scale:.6}},{{autoAlpha:1,scale:1,duration:.35,ease:"back.out(2)",immediateRender:false}},{ti:.2f});')
A(f'tl.to("#sub .sub",{{scale:.9,duration:.1,yoyo:true,repeat:1}},{ti+1.0:.2f});tl.set("#sub .sub",{{background:"#3a3a3a"}},{ti+1.2:.2f});tl.set("#subt",{{textContent:"INSCRITO"}},{ti+1.2:.2f});')
A(f'tl.to("#sub .sub",{{autoAlpha:0,duration:.3}},{ti+2.05:.2f});')

# ---------- fim ----------
H.append(f'<div id="fim" class="clip fim" data-start="{NARR_FIM+.3:.2f}" data-duration="{END-NARR_FIM-.3:.2f}" data-track-index="19"><p>Em memória de todos que estavam a bordo.</p></div>')
A(f'tl.fromTo("#fim p",{{autoAlpha:0}},{{autoAlpha:1,duration:1,immediateRender:false}},{NARR_FIM+.5:.2f});')

# ---------- legendas (até 7 palavras) ----------
groups, g = [], []
for i, w in enumerate(W):
    g.append(w); nx = W[i+1] if i+1 < len(W) else None
    if not nx or len(g) >= 7 or re.search(r'[.?!:…]$', w[0]) or nx[1] - w[2] > .45 or nx[3] != w[3]: groups.append(g); g = []
cap, cj = [], []
for gi, gr in enumerate(groups):
    s = gr[0][1]; e = min(groups[gi+1][0][1] if gi+1 < len(groups) else gr[-1][2] + .5, gr[-1][2] + .7)
    sp = ''.join(f'<span id="w{gi}_{j}">{html.escape(x[0])}</span>' for j, x in enumerate(gr))
    cap.append(f'<div id="cap_{gi}" class="clip capg" data-start="{s:.2f}" data-duration="{e-s:.2f}" data-track-index="20">{sp}</div>')
    for j, x in enumerate(gr):
        cj.append(f'tl.set("#w{gi}_{j}",{{color:"#FFC83D"}},{max(s, x[1]):.2f});')
        if j+1 < len(gr): cj.append(f'tl.set("#w{gi}_{j}",{{color:"#ffffff"}},{gr[j+1][1]:.2f});')

CSS = '''
@font-face{font-family:"M";font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:"M7";font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2)}
@font-face{font-family:"J";font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0;background:#000}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#000;font-family:"M";color:#fff}
.cena{position:absolute;inset:0;overflow:hidden}
.kb{position:absolute;inset:0;background-size:cover;background-position:center}
.vin{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%),linear-gradient(transparent 70%,rgba(0,0,0,.55))}
.vfull{position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;z-index:3}
.capc{position:absolute;inset:0;z-index:20}
.capc.full{background:radial-gradient(1200px 700px at 30% 40%,#1b2235,#05070c)}
.capin{position:absolute;left:120px;bottom:200px}
.capc:not(.full) .capin{background:rgba(0,0,0,.6);padding:26px 40px;border-left:10px solid #FFC83D;border-radius:10px;bottom:240px}
.cn{font-family:"J";font-size:30px;letter-spacing:6px;color:#FFC83D}
.capin h2{font-size:104px;line-height:1.02;margin:14px 0 8px}
.capin p{font-family:"M7";font-size:46px;margin:0 0 18px;color:#e9edf5}
.cl{font-family:"J";font-size:28px;color:#aab3c5}
.tag{position:absolute;left:44px;top:36px;z-index:21;font-family:"J";font-size:24px;background:rgba(0,0,0,.55);padding:8px 16px;border-radius:8px;color:#ffd977}
.big{position:absolute;left:0;right:0;top:330px;text-align:center;z-index:22}
.big span{display:inline-block;font-size:92px;line-height:1.1;background:rgba(0,0,0,.62);padding:16px 44px;border-radius:16px;border:3px solid rgba(255,200,61,.8);color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.6)}
.ttl{position:absolute;inset:0;z-index:23;display:flex;align-items:center;padding-left:140px;background:linear-gradient(90deg,rgba(0,0,0,.75),rgba(0,0,0,0) 70%)}
.ttl h1{font-size:120px;line-height:1.02;margin:16px 0 0}
.memo{position:absolute;inset:0;z-index:23;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55)}
.memo p,.fim p{font-family:"M7";font-size:54px;text-align:center;max-width:1300px}
.fim{position:absolute;inset:0;z-index:24;background:#000;display:flex;align-items:center;justify-content:center}
.recap{position:absolute;inset:0;z-index:22;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center}
.recap ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:620px 620px;gap:22px 60px}
.recap li{font-size:64px;border-left:10px solid #FFC83D;padding-left:24px}
.subw{position:absolute;right:80px;top:120px;z-index:25}
.sub{display:flex;align-items:center;gap:14px;font-size:40px;background:#FF0033;padding:16px 34px;border-radius:60px}
.capg{position:absolute;left:0;right:0;top:952px;text-align:center;z-index:26}
.capg span{display:inline-block;margin:0 8px;font-size:46px;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 4px 14px rgba(0,0,0,.9)}
'''
page = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/>
<title>8 detalhes que derrubaram aviões</title><script src="gsap.min.js"></script><style>{CSS}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="{END:.2f}">
<audio id="narr" src="assets/audio/narracao.wav" data-start="0" data-duration="{END:.2f}" data-track-index="10" data-volume="1"></audio>
<audio id="bg" src="assets/audio/piano_longo.mp3" data-start="0" data-duration="{END:.2f}" data-track-index="11" data-volume="0.06"></audio>
{chr(10).join(VID)}
{chr(10).join(H)}
{''.join(cap)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
{chr(10).join(cj)}
window.__timelines["main"] = tl;
</script></body></html>'''
open(f'{PROJ}/index.html', 'w').write(page)
# capítulos (timestamps) para a descrição do YouTube
def mmss(x): return f'{int(x//60)}:{int(x%60):02d}'
cap_ts = ['0:00 Abertura'] + [f'{mmss(at(0, "Manhã de quinta-feira") if k == 0 else O[k]-GAP)} {CAP[k][0]}: {CAP[k][1]}' for k in range(8)]
open(os.path.join(AQUI, '..', 'capitulos.txt'), 'w').write('\n'.join(cap_ts) + '\n')
# legenda .srt
def ts(x): return f'{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(x*1000%1000):03d}'
open(os.path.join(AQUI, '..', 'legenda.srt'), 'w').write('\n'.join(f'{i+1}\n{ts(g[0][1])} --> {ts(g[-1][2]+.2)}\n{" ".join(w[0] for w in g)}\n' for i, g in enumerate(groups)))
print('ok', round(END, 1), 's', n_c, 'cenas', n_t, 'números'); print('\n'.join(cap_ts))
