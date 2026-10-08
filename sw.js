const CACHE_NAME='raqam-shell-v3.7';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./css/app.css','./css/kit.css','./js/core/dates.js','./js/core/id.js','./js/core/prayer.js','./js/core/holidays.js','./js/i18n.js','./js/ui.js','./js/kit.js','./js/jobs.js','./js/worker.js','./js/views/id.js','./js/views/dates.js','./js/views/prayer.js','./js/views/more.js','./js/app.js','./images/raqam.svg','./images/raqam-maskable.svg','./images/raqam-mono.svg'];
const RUNTIME_HOSTS=['cdn.sheetjs.com','fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))));
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  const isApp=url.origin===self.location.origin;
  const isRuntime=RUNTIME_HOSTS.includes(url.hostname);
  if(!isApp&&!isRuntime)return;
  event.respondWith(
    caches.match(req,{ignoreSearch:isApp}).then(cached=>{
      const network=fetch(req).then(res=>{
        if(res&&(res.status===200||res.type==='opaque')){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});}
        return res;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});
