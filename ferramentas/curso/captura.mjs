// Captura de aulas: abre o navegador, executa os passos de um roteiro JSON e tira um print por passo.
// Uso: node ferramentas/curso/captura.mjs <roteiro.json> <pasta_saida>
//      node ferramentas/curso/captura.mjs <roteiro.json> <pasta_saida> 3-7   (só os passos 3 a 7; o resto do passos.json é mantido)
//      node ferramentas/curso/captura.mjs --explorar <url> <pasta_saida>   (print + lista de links/botões da página)
//
// Rede: o navegador sai pelo proxy deste ambiente (HTTPS_PROXY) e confia SOMENTE no certificado
// da CA desse proxy (/root/.ccr/agent-proxy-ca.crt). Qualquer outro certificado inválido continua bloqueado.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { X509Certificate, createHash } from 'crypto';
import { networkInterfaces } from 'os';

const ca = new X509Certificate(readFileSync('/root/.ccr/agent-proxy-ca.crt'));
const spki = createHash('sha256').update(ca.publicKey.export({ type: 'spki', format: 'der' })).digest('base64');

// Páginas locais (Studio em localhost, arquivos file://) não passam pelo proxy.
// O IP da própria máquina também fica fora do proxy: o Studio acessado por ele (via ponte de porta)
// carrega o que é externo (fontes, vídeos) pelo proxy e o resto direto.
const IPS = Object.values(networkInterfaces()).flat().filter(i => i.family === 'IPv4' && !i.internal).map(i => i.address).join(',');
const local = u => /^(file:|https?:\/\/(localhost|127\.0\.0\.1)[:/])/.test(u || '');
async function abrir(soLocal) {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    ...(soLocal ? {} : { proxy: { server: process.env.HTTPS_PROXY, bypass: IPS } }),
    // WebGL por software (o preview do Studio precisa); o certificado só vale para o proxy
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', ...(soLocal ? [] : ['--ignore-certificate-errors-spki-list=' + spki])],
  });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' });
  return [b, p];
}

// alvo: primeiro elemento VISÍVEL (sites costumam ter cópias escondidas, ex.: menu mobile).
// Se a busca por papel não achar nada visível, tenta pelo texto.
async function visivel(loc) {
  const n = await loc.count();
  for (let i = 0; i < n; i++) if (await loc.nth(i).isVisible()) return loc.nth(i);
  return null;
}
async function alvo(p, a) {
  if (a.seletor) return visivel(p.locator(a.seletor));
  if (a.papel) { const l = await visivel(p.getByRole(a.papel, { name: a.texto, exact: !!a.exato })); if (l) return l; }
  return visivel(p.getByText(a.texto, { exact: !!a.exato }));
}

async function caixa(loc) {
  if (!loc) return null;
  try { await loc.evaluate(e => e.scrollIntoView({ block: 'center' })); await loc.page().waitForTimeout(800); const r = await loc.boundingBox(); return r && { x: r.x, y: r.y, w: r.width, h: r.height }; }
  catch { return null; }
}

const [, , a1, a2, a3] = process.argv;
const [ini, fim] = (a1 !== '--explorar' && a1 !== '--sondar' && a3) ? a3.split('-').map(Number) : [1, 1e9];
if (a1 === '--sondar') {
  // diagnóstico: node captura.mjs --sondar <url> <texto> → lista onde o texto aparece e se está visível
  const [b, p] = await abrir(local(a2));
  const logs = []; p.on('console', m => logs.push(m.type() + ': ' + m.text().slice(0, 200))); p.on('pageerror', e => logs.push('ERRO: ' + e.message.slice(0, 200)));
  p.on('requestfailed', r => logs.push('FALHOU: ' + r.url().slice(0, 120) + ' ' + (r.failure() || {}).errorText));
  await p.goto(a2, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(4000);
  if (a3 === '@console') { await p.waitForTimeout(10000); console.log(logs.join('\n')); await b.close(); process.exit(0); }
  if (a3 === '@iframes') { await p.waitForTimeout(8000); console.log(p.frames().map(f => f.url()).join('\n')); await b.close(); process.exit(0); }
  console.log(JSON.stringify(await p.$$eval('*', (els, t) => els.filter(e => (e.innerText || '').trim().startsWith(t) && (e.innerText || '').length < 200).slice(0, 15).map(e => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return { tag: e.tagName, role: e.getAttribute('role'), aria: e.getAttribute('aria-hidden'), box: [r.x, r.y, r.width, r.height].map(Math.round), vis: cs.visibility, op: cs.opacity, html: e.outerHTML.slice(0, 160) };
  }), a3), null, 1));
  await b.close();
} else if (a1 === '--explorar') {
  mkdirSync(a3, { recursive: true });
  const [b, p] = await abrir(local(a2));
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
  let antes = []; try { antes = JSON.parse(readFileSync(`${a2}/passos.json`, 'utf8')); } catch {}
  const [b, p] = await abrir(rot.passos.every(s => s.acao !== 'abrir' || local(s.url))); const out = antes;
  for (const [i, s] of rot.passos.entries()) {
    if (i + 1 < ini || i + 1 > fim) continue;
    let box = null, loc = null;
    if (s.acao === 'abrir') { await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
    if (s.acao === 'rolar') { await p.mouse.wheel(0, s.pixels || 600); }
    // clicarxy: clica numa posição da tela (ex.: régua da timeline) ANTES do print; caixa = ponto clicado
    if (s.acao === 'clicarxy') { await p.mouse.click(s.x, s.y); box = { x: s.x - 18, y: s.y - 18, w: 36, h: 36 }; }
    await p.waitForTimeout(s.espera ?? 2500);
    if (s.acao === 'destacar' || s.acao === 'clicar' || s.acao === 'digitar') {
      loc = await alvo(p, s); box = await caixa(loc); await p.waitForTimeout(600);
      if (!loc) console.log('alvo não encontrado', i + 1, s.texto || s.seletor);
    }
    // print ANTES do clique/digitação (mostra onde clicar); depois executa a ação
    const nome = `${String(i + 1).padStart(2, '0')}.png`;
    await p.screenshot({ path: `${a2}/${nome}` });
    out[i] = { ...s, img: nome, url_atual: p.url(), caixa: box };
    if (s.acao === 'clicar' && loc) { await loc.click({ timeout: 8000 }).catch(e => console.log('clique falhou', i + 1, e.message)); }
    if (s.acao === 'digitar' && loc) { await loc.fill(s.valor || ''); }
    console.log(i + 1, s.acao, box ? 'ok' : '-', p.url());
  }
  writeFileSync(`${a2}/passos.json`, JSON.stringify(out, null, 1));
  await b.close();
}
