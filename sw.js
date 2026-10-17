/* FlowVault service worker — offline support. Build 20 */
const V='fv-20',CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','lib-pdf.min.js','lib-pdf.worker.min.js','lib-pdf-lib.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
  await Promise.all(CORE.map(async u=>{try{const r=await fetch(new Request(u,{cache:'reload'}));if(r.ok)await c.put(u==='./'?'index.html':u,r)}catch{}}));
  self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('fv-')&&k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('message',e=>{
  if(e.data==='warm-ff')e.waitUntil((async()=>{const c=await caches.open(V);
    for(const u of ['lib-ff.js','814.ffmpeg.js','lib-ff-core.js','lib-ff-wasm-0.bin','lib-ff-wasm-1.bin','lib-ff-wasm-2.bin']){
      if(await c.match(u))continue;try{const r=await fetch(u);if(r.ok)await c.put(u,r)}catch{}}})())});
self.addEventListener('fetch',e=>{
  const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);if(u.origin!==location.origin)return;
  const name=u.pathname.split('/').pop()||'index.html',nav=q.mode==='navigate'||name==='index.html'||name==='';
  const key=nav?'index.html':name;
  if(nav){ // network first so updates arrive; cache when offline
    e.respondWith((async()=>{const c=await caches.open(V);
      try{const r=await fetch(q,{cache:'no-store'});if(r.ok&&q.mode==='navigate')c.put('index.html',r.clone());return r}
      catch{const m=await c.match('index.html');return m||new Response('Offline',{status:503})}})());return}
  if(u.searchParams.has('chk')){return} // update check: let it fail offline
  e.respondWith((async()=>{const c=await caches.open(V),m=await c.match(key);if(m)return m;
    const r=await fetch(q);if(r.ok&&/^(lib-|814\.|icon-|manifest)/.test(name))c.put(key,r.clone());return r})())});
