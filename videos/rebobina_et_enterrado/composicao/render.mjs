import { chromium } from 'playwright';
import fs from 'fs';
const [,, mode, outDir, a, b] = process.argv; // mode: preview <times...> | range start end
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--allow-file-access-from-files','--disable-web-security'] });
const page = await browser.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor:1 });
page.on('pageerror', e=>console.error('PAGEERR', e.message));
page.on('console', m=>{ if(m.type()==='error') console.error('CONSOLE', m.text()); });
await page.goto('file://'+process.env.COMP+'/index.html');
await page.evaluate(()=>window.ready);
fs.mkdirSync(outDir,{recursive:true});
const shot = async (t, name) => { await page.evaluate(t=>window.seek(t), t); await page.screenshot({ path:`${outDir}/${name}.jpg`, type:'jpeg', quality:92 }); };
if (mode==='preview') { for (const t of process.argv.slice(4).map(Number)) await shot(t, 't'+t.toFixed(2)); }
else { const FPS=25; const tend=await page.evaluate(()=>window.TEND); const s=+a||0, e=Math.min(+b||1e9, Math.round(tend*FPS));
  const t0=Date.now(); for (let f=s; f<e; f++){ await shot(f/FPS, String(f).padStart(5,'0')); if(f%200===0) console.log('frame',f,((Date.now()-t0)/1000).toFixed(0)+'s'); } }
await browser.close();
