// Captura de aulas: abre o navegador, executa os passos de um roteiro JSON e tira um print por passo.
// Uso: node ferramentas/curso/captura.mjs <roteiro.json> <pasta_saida>
//      node ferramentas/curso/captura.mjs --explorar <url> <pasta_saida>   (print + lista de links/botões da página)
//
// Rede: o navegador sai pelo proxy deste ambiente (HTTPS_PROXY) e confia SOMENTE no certificado
// da CA desse proxy (/root/.ccr/agent-proxy-ca.crt). Qualquer outro certificado inválido continua bloqueado.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { X509Certificate, createHash } from 'crypto';

const ca = new X509Certificate(readFileSync('/root/.ccr/agent-proxy-ca.crt'));
const spki = createHash('sha256').update(ca.publicKey.export({ type: 'spki', format: 'der' })).digest('base64');

async function abrir() {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy: { server: process.env.HTTPS_PROXY },
    args: ['--ignore-certificate-errors-spki-list=' + spki],
  });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' });
  return [b, p];
}

const alvo = (p, a) => a.seletor ? p.locator(a.seletor).first()
  : a.papel ? p.getByRole(a.papel, { name: a.texto, exact: !!a.exato }).first()
  : p.getByText(a.texto, { exact: !!a.exato }).first();

async function caixa(loc) {
  try { await loc.scrollIntoViewIfNeeded({ timeout: 4000 }); const r = await loc.boundingBox(); return r && { x: r.x, y: r.y, w: r.width, h: r.height }; }
  catch { return null; }
}

const [, , a1, a2, a3] = process.argv;
if (a1 === '--explorar') {
  mkdirSync(a3, { recursive: true });
  const [b, p] = await abrir();
  await p.goto(a2, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3500);
  await p.screenshot({ path: `${a3}/explorar.png` });
  const itens = await p.$$eval('a,button,[role=button],input', els => els.map(e => ({
    tag: e.tagName.toLowerCase(), texto: (e.innerText || e.value || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60),
    href: e.getAttribute('href'), vis: !!(e.offsetWidth || e.offsetHeight) })).filter(x => x.vis && (x.texto || x.href)));
  writeFileSync(`${a3}/explorar.json`, JSON.stringify({ url: p.url(), titulo: await p.title(), itens }, null, 1));
  console.log(p.url(), '|', await p.title(), '|', itens.length, 'itens');
  await b.close();
} else {
  const rot = JSON.parse(readFileSync(a1, 'utf8')); mkdirSync(a2, { recursive: true });
  const [b, p] = await abrir(); const out = [];
  for (const [i, s] of rot.passos.entries()) {
    let box = null;
    if (s.acao === 'abrir') { await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
    if (s.acao === 'rolar') { await p.mouse.wheel(0, s.pixels || 600); }
    if (s.acao === 'destacar' || s.acao === 'clicar' || s.acao === 'digitar') box = await caixa(alvo(p, s));
    // print ANTES do clique/digitação (mostra onde clicar); depois executa a ação
    await p.waitForTimeout(s.espera ?? 2500);
    const nome = `${String(i + 1).padStart(2, '0')}.png`;
    await p.screenshot({ path: `${a2}/${nome}` });
    out.push({ ...s, img: nome, url_atual: p.url(), caixa: box });
    if (s.acao === 'clicar') { await alvo(p, s).click({ timeout: 8000 }).catch(e => console.log('clique falhou', i + 1, e.message)); }
    if (s.acao === 'digitar') { await alvo(p, s).fill(s.valor || ''); }
    console.log(i + 1, s.acao, box ? 'ok' : '-', p.url());
  }
  writeFileSync(`${a2}/passos.json`, JSON.stringify(out, null, 1));
  await b.close();
}
