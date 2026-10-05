# Gera uma tela de terminal (HTML 1920×1080) com um comando e a saída REAL dele, para o captura.mjs fotografar.
# Uso: python3 ferramentas/curso/terminal.py <saida.html> <pasta> "<comando>" [arquivo_com_saida.txt] [--mais "<cmd2>" arq2.txt ...]
# Cada linha da saída vira <div data-l="N">, para destacar com seletor: [data-l="3"]. Comandos: .cmd (data-c="N").
import sys, html

args = sys.argv[1:]
saida, pasta = args[0], args[1]
blocos, i = [], 2
while i < len(args):
    if args[i] == '--mais': i += 1; continue
    cmd = args[i]; arq = args[i+1] if i+1 < len(args) and args[i+1] != '--mais' else None
    blocos.append((cmd, open(arq).read().rstrip('\n').split('\n') if arq else [])); i += 2 if arq else 1

corpo, n = [], 0
for c, (cmd, linhas) in enumerate(blocos):
    corpo.append(f'<div class="cmd" data-c="{c+1}"><span class="pr">{html.escape(pasta)} $</span> {html.escape(cmd)}</div>')
    for l in linhas:
        n += 1
        corpo.append(f'<div class="o" data-l="{n}">{html.escape(l) or "&nbsp;"}</div>')
open(saida, 'w').write(f'''<!doctype html><html><head><meta charset="utf-8"><title>Terminal</title><style>
body{{margin:0;width:1920px;height:1080px;background:#1e1e2e;font-family:"DejaVu Sans Mono",monospace;color:#cdd6f4;overflow:hidden}}
.top{{height:56px;background:#181825;display:flex;align-items:center;gap:12px;padding:0 24px;font-size:22px;color:#7f849c}}
.top b{{width:16px;height:16px;border-radius:50%;background:#f38ba8}}.top b:nth-child(2){{background:#f9e2af}}.top b:nth-child(3){{background:#a6e3a1}}
.top span{{margin-left:auto;margin-right:auto}}
.t{{padding:30px 40px;font-size:30px;line-height:1.45;white-space:pre-wrap}}
.cmd{{color:#fff;font-weight:bold;margin:14px 0 6px}}.pr{{color:#a6e3a1}}.o{{color:#bac2de}}
</style></head><body><div class="top"><b></b><b></b><b></b><span>Terminal — {html.escape(pasta)}</span></div>
<div class="t">{"".join(corpo)}<div class="cmd"><span class="pr">{html.escape(pasta)} $</span> <span style="background:#cdd6f4">&nbsp;</span></div></div></body></html>''')
print('ok', saida, n, 'linhas')
