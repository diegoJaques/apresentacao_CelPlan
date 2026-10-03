// Tira "foto" do elemento #c de um HTML de capa. Uso: node capa.mjs /caminho/capa.html saida.jpg 1920 1080
import { chromium } from 'playwright';
const [,, src, out, w, h] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('file://' + src); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await (await p.$('#c')).screenshot({ path: out, type: out.endsWith('.png') ? 'png' : 'jpeg', quality: out.endsWith('.png') ? undefined : 93 });
await b.close();
