import { chromium } from 'playwright';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1280,height:2000}});
await p.goto('file://'+process.argv[2]+'/thumb.html');await p.evaluate(()=>document.fonts.ready);
await (await p.$('#h')).screenshot({path:process.argv[3]+'/capa_youtube_16x9.jpg',type:'jpeg',quality:92});
await (await p.$('#v')).screenshot({path:process.argv[3]+'/capa_shorts_9x16.jpg',type:'jpeg',quality:92});
await b.close();
