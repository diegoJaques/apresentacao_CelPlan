#!/usr/bin/env python3
"""Gera o PDF de impressao do roteiro de vistoria a partir do Markdown.

Uso:  python3 vistoria/gerar_pdf.py vistoria/VISTORIA_CPFL_RFID.md vistoria/VISTORIA_CPFL_RFID.pdf
Requer: pip install markdown playwright  (usa o Chromium do ambiente)
"""
import re, sys, pathlib, markdown, asyncio
from playwright.async_api import async_playwright

src = pathlib.Path(sys.argv[1]).resolve()
out = pathlib.Path(sys.argv[2]).resolve()
md = src.read_text(encoding='utf-8')

# caixas de marcar desenhadas (nao depender de glifo unicode)
md = re.sub(r'^(\s*)- \[ \] ', r'\1- <span class="cb"></span> ', md, flags=re.M)
md = re.sub(r'\( \)', '<span class="cb sm"></span>', md)

# lacunas de preenchimento: '____' vira linha real (evita virar negrito no markdown)
def _fill(m):
    w = max(2.2, min(len(m.group(0)) * 0.62, 26))
    return f'<span class="fill" style="width:{w:.1f}em"></span>'
md = re.sub(r'_{2,}', _fill, md)

html_body = markdown.markdown(md, extensions=['tables', 'sane_lists', 'attr_list', 'nl2br'])

# a ficha de campo e formulario manuscrito: marcar para receber espacamento maior
html_body = re.sub(r'<h1>(ANEXO A[^<]*)</h1>', r'<h1 id="ficha">\1</h1>', html_body)

CSS = """
@page { size: A4; margin: 14mm 13mm 14mm 13mm; }
* { box-sizing: border-box; }
body { font-family: "Liberation Sans","DejaVu Sans",Arial,sans-serif;
       font-size: 9.3pt; line-height: 1.38; color: #14181d; margin: 0; }
h1 { font-size: 14pt; color: #0b3a5b; margin: 0 0 8pt; padding: 6pt 0 4pt;
     border-bottom: 2.2pt solid #0b3a5b; letter-spacing: .2px;
     break-before: page; break-after: avoid; }
h1:first-of-type { break-before: auto; }
h2 { font-size: 11.2pt; color: #0b3a5b; margin: 13pt 0 5pt;
     padding-left: 6pt; border-left: 3.5pt solid #1d9ad6; break-after: avoid; }
h3 { font-size: 9.8pt; color: #1f3b4d; margin: 9pt 0 3pt; break-after: avoid; }
p { margin: 0 0 4.5pt; }
strong { color: #0b3a5b; }
ol, ul { margin: 0 0 6pt; padding-left: 17pt; }
li { margin-bottom: 2.4pt; break-inside: avoid; }
li:has(> .cb:first-child) { list-style: none; margin-left: -15pt; }
.cb { display: inline-block; width: 9.5pt; height: 9.5pt; border: .9pt solid #5a6672;
      border-radius: 1.5pt; vertical-align: -1pt; margin-right: 3pt; background: #fff; }
.cb.sm { width: 8pt; height: 8pt; margin: 0 2pt; vertical-align: -.5pt; }
table { width: 100%; border-collapse: collapse; margin: 5pt 0 9pt;
        font-size: 8.5pt; break-inside: auto; }
th { background: #0b3a5b; color: #fff; font-weight: 600; text-align: left;
     padding: 3.5pt 4.5pt; border: .6pt solid #0b3a5b; }
td { padding: 3.5pt 4.5pt; border: .6pt solid #9aa5b1; vertical-align: top; }
tbody tr:nth-child(even) td { background: #f2f5f8; }
tr { break-inside: avoid; }
blockquote { margin: 6pt 0; padding: 5pt 8pt; background: #fff6e0;
             border-left: 3pt solid #e0a409; break-inside: avoid; }
blockquote p { margin: 0; }
hr { border: 0; border-top: .7pt solid #c9d2da; margin: 10pt 0; }
code { font-family: "Liberation Mono","DejaVu Sans Mono",monospace; font-size: 8.4pt;
       background: #eef2f6; padding: .5pt 2.5pt; border-radius: 2pt; }
a { color: #14181d; text-decoration: none; }
.fill { display: inline-block; border-bottom: .7pt solid #8b96a1; height: 9pt;
        vertical-align: -1pt; margin: 0 1.5pt; }
td .fill, th .fill { max-width: 100%; }
#ficha ~ p { line-height: 2.35; margin-bottom: 7pt; }
#ficha ~ table td { height: 26pt; }
"""

doc = f"<!doctype html><html lang='pt-BR'><meta charset='utf-8'><title>Vistoria CPFL RFID</title><style>{CSS}</style><body>{html_body}</body></html>"
import tempfile
tmp = pathlib.Path(tempfile.mkdtemp()) / 'render.html'
tmp.write_text(doc, encoding='utf-8')

FOOT = ("<div style=\"font-family:Liberation Sans,Arial,sans-serif;font-size:7pt;color:#5a6672;"
        "width:100%;padding:0 13mm;display:flex;justify-content:space-between;\">"
        "<span>CelPlan &middot; Vistoria Tecnica CPFL Transmissao &ndash; Solucao RFID</span>"
        "<span>pag. <span class=\"pageNumber\"></span> de <span class=\"totalPages\"></span></span></div>")

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
                                    args=['--no-sandbox'])
        pg = await b.new_page()
        await pg.goto(tmp.as_uri(), wait_until='load')
        await pg.pdf(path=str(out), format='A4', print_background=True,
                     display_header_footer=True, header_template="<div></div>",
                     footer_template=FOOT,
                     margin={'top':'14mm','bottom':'16mm','left':'13mm','right':'13mm'})
        await b.close()

asyncio.run(main())
print("ok", out)
