base='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;font-weight:900;src:url(assets/fonts/montserrat-latin-900-normal.woff2)}
@font-face{font-family:J;font-weight:700;src:url(assets/fonts/jetbrains-mono-latin-700-normal.woff2)}
body{margin:0}#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:#07090d;font-family:M;font-weight:900;color:#fff}
.a{position:absolute}.g{color:#F2C14E}.J{font-family:J;font-weight:700}
.tag{font-family:J;font-weight:700;font-size:36px;letter-spacing:6px;background:#F2C14E;color:#14110a;padding:12px 26px;display:inline-block}
%s</style></head><body><div id="c">%s</div></body></html>'''
V={}
# A — rosto grande + frase
V['A']=('''.ph{left:-268px;top:400px;height:1150px;filter:contrast(1.05) saturate(1.05)}
.sh{inset:0;background:linear-gradient(#07090df0 0%,#07090d80 26%,#07090d00 42%,#07090d00 58%,#07090dcc 78%,#07090d 100%)}''',
'''<img class="a ph" src="assets/img/retrato.jpg"><div class="a sh"></div>
<div class="a" style="left:0;right:0;top:150px;text-align:center"><span class="tag">1967 – 2026</span></div>
<div class="a" style="left:40px;right:40px;top:250px;text-align:center;font-size:118px;line-height:1">LITO SOUSA</div>
<div class="a" style="left:40px;right:40px;top:1360px;text-align:center;font-size:92px;line-height:1.05">O HOMEM QUE TE<br>ENSINOU A <span class="g">VOAR<br>SEM MEDO</span> ✈️</div>''')
# B — do hangar ao céu (jovem x adulto)
V['B']=('''.p1{left:0;top:0;width:1080px;height:960px;object-fit:cover;object-position:55% 40%;filter:sepia(.35) contrast(1.05)}
.p2{left:0;top:960px;width:1080px;height:960px;object-fit:cover;object-position:50% 35%}
.bar{left:0;right:0;top:900px;height:120px;background:#F2C14E;display:flex;align-items:center;justify-content:center;color:#14110a;font-size:78px}
.l{font-family:J;font-weight:700;font-size:40px;background:#07090dd0;padding:10px 22px}''',
'''<img class="a p1" src="assets/img/jovem.jpg"><img class="a p2" src="assets/img/boeing.jpg">
<div class="a" style="left:0;right:0;top:0;height:560px;background:linear-gradient(#07090d 40%,#07090d00)"></div>
<div class="a" style="left:0;right:0;top:140px;text-align:center;font-size:96px;line-height:1.02">DO HANGAR<br><span class="g">AO CÉU</span></div>
<div class="a l" style="left:60px;top:780px">1986 · MECÂNICO</div>
<div class="a bar">LITO SOUSA · 1967–2026</div>
<div class="a l" style="right:60px;top:1060px">O AVIADOR</div>''')
# C — LITO no céu
V['C']=('''.sk{inset:0;background:radial-gradient(ellipse at 50% 110%,#c98a5a 0%,#27406b 45%,#060a14 80%)}
.ph{left:240px;top:1080px;width:600px;height:600px;border-radius:50%;object-fit:cover;object-position:60% 30%;border:10px solid #F2C14E;box-shadow:0 0 80px #F2C14E88}''',
'''<div class="a sk"></div>
<svg class="a" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920"><path d="M120 330 L120 730 L290 730 M400 330 L400 730 M500 330 L720 330 M610 330 L610 730 M820 430 C820 300 960 300 960 430 L960 630 C960 760 820 760 820 630 Z" fill="none" stroke="#F2C14E" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 22px #F2C14E)"/></svg>
<div class="a" style="left:0;right:0;top:170px;text-align:center"><span class="tag">ESCREVERAM O NOME DELE NO CÉU</span></div>
<div class="a" style="left:0;right:0;top:820px;text-align:center;font-size:84px;line-height:1.05">OBRIGADO,<br><span class="g">BOM VOO.</span></div>
<img class="a ph" src="assets/img/retrato.jpg">''')
for k,(css,body) in V.items(): open(f'capa916_{k}.html','w').write(base%(css,body))
