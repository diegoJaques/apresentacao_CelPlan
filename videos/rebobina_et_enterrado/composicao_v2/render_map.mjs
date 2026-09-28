import { chromium } from 'playwright';
import fs from 'fs';
const [,, comp, map, outDir, a, b] = process.argv;
const frames=JSON.parse(fs.readFileSync(map));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport:{width:1080,height:1920} });
page.on('pageerror', e=>console.error('PAGEERR', e.message));
await page.goto('file://'+comp+'/index.html'); await page.evaluate(()=>window.ready);
fs.mkdirSync(outDir,{recursive:true});
const s=+a, e=Math.min(+b, frames.length);
for (let i=s;i<e;i++){ const [t,tz,rw]=frames[i]; await page.evaluate(([t,tz,rw])=>{window.TEASER=tz;window.REWF=rw;return window.seek(t)},[t,tz,rw]); await page.screenshot({path:`${outDir}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92}); }
await browser.close();
