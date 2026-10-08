const Kit=(()=>{
  const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
  Object.defineProperty(HTMLSelectElement.prototype,'value',{configurable:true,get(){return desc.get.call(this);},set(v){desc.set.call(this,v);this._kitSync&&this._kitSync();}});
  const sidx=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'selectedIndex');
  Object.defineProperty(HTMLSelectElement.prototype,'selectedIndex',{configurable:true,get(){return sidx.get.call(this);},set(v){sidx.set.call(this,v);this._kitSync&&this._kitSync();}});

  function enhance(sel){
    if(sel._kit||!sel.classList.contains('field'))return;
    sel._kit=true;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='kselect '+[...sel.classList].filter(c=>c!=='field').join(' ');
    btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');
    if(sel.id){btn.id=sel.id+'-k';const lb=document.querySelector('label[for="'+sel.id+'"]');if(lb){lb.htmlFor=btn.id;}}
    const al=sel.getAttribute('aria-label');if(al)btn.setAttribute('aria-label',al);
    if(sel.getAttribute('style'))btn.setAttribute('style',sel.getAttribute('style'));
    btn.innerHTML='<span class="kv"></span>'+ic('chevd','kchev');
    sel.classList.add('kselect-native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');
    sel.after(btn);
    const sync=()=>{const o=sel.options[sel.selectedIndex];btn.querySelector('.kv').textContent=o?o.textContent:'';};
    sel._kitSync=sync;sync();
    btn.onclick=()=>open(sel,btn);
    btn.onkeydown=e=>{
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(e.altKey){open(sel,btn);return;}const i=clamp(sel.selectedIndex+(e.key==='ArrowDown'?1:-1),0,sel.options.length-1);if(i!==sel.selectedIndex){sel.selectedIndex=i;fire(sel);}}
    };
  }
  function reveal(box,it){const t0=it.offsetTop,b0=t0+it.offsetHeight;if(t0<box.scrollTop+4)box.scrollTop=t0-4;else if(b0>box.scrollTop+box.clientHeight-4)box.scrollTop=b0-box.clientHeight+4;}
  function fire(sel){sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));}
  function open(sel,btn){
    const cur=sel.selectedIndex;
    const html=[...sel.options].map((o,i)=>'<button type="button" role="option" class="mi kopt'+(i===cur?' on':'')+'" aria-selected="'+(i===cur)+'" data-i="'+i+'"><span class="grow">'+esc(o.textContent)+'</span>'+ic('check','kcheck')+'</button>').join('');
    const m=Menu.open(btn,html,el=>{
      el.classList.add('kmenu');el.setAttribute('role','listbox');
      el.style.minWidth=Math.max(btn.offsetWidth,160)+'px';
      const items=[...el.querySelectorAll('.kopt')];
      let k=Math.max(0,cur);
      const mark=()=>items.forEach((x,j)=>x.classList.toggle('kb',j===k));
      const pick=i=>{Menu.close();if(i!==sel.selectedIndex){sel.selectedIndex=i;fire(sel);}btn.focus({preventScroll:true});};
      items.forEach((b,i)=>{b.onclick=()=>pick(i);b.onmousemove=()=>{if(k!==i){k=i;mark();}};});
      el.addEventListener('keydown',e=>{
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();k=clamp(k+(e.key==='ArrowDown'?1:-1),0,items.length-1);mark();items[k].focus({preventScroll:true});reveal(el,items[k]);}
        else if(e.key==='Home'||e.key==='End'){e.preventDefault();k=e.key==='Home'?0:items.length-1;mark();items[k].focus();}
        else if(e.key==='Tab'){Menu.close();}
        else if(e.key.length===1){const c=e.key.toLowerCase(),j=items.findIndex((x,j2)=>j2>k&&x.textContent.trim().toLowerCase().startsWith(c));const n=j>=0?j:items.findIndex(x=>x.textContent.trim().toLowerCase().startsWith(c));if(n>=0){k=n;mark();items[k].focus();}}
      });
      const a0=items[k];if(a0){el.scrollTop=Math.max(0,a0.offsetTop-(el.clientHeight-a0.offsetHeight)/2);mark();requestAnimationFrame(()=>a0.focus({preventScroll:true}));}
    });
    return m;
  }
  function scan(root){(root||document).querySelectorAll('select.field').forEach(enhance);(root||document).querySelectorAll('.seg,.tabs').forEach(watch);}

  function glide(c,instant){
    if(!c)return;
    let g=c.querySelector(':scope>.glide');
    if(!g){g=document.createElement('span');g.className='glide';g.setAttribute('aria-hidden','true');c.prepend(g);}
    const a=c.querySelector(':scope>.active');
    if(!a||!a.offsetWidth){g.style.opacity='0';return;}
    const quiet=instant||!g._on||RM();
    if(quiet)g.style.transition='none';
    g.style.width=a.offsetWidth+'px';g.style.height=a.offsetHeight+'px';
    g.style.transform='translate3d('+a.offsetLeft+'px,'+a.offsetTop+'px,0)';
    g.style.opacity='1';
    if(quiet){void g.offsetWidth;g.style.transition='';}
    g._on=true;
  }
  function watch(c){
    if(c._glide)return;c._glide=true;
    if(c.isConnected)glide(c,true);
    requestAnimationFrame(()=>glide(c,true));
    if('ResizeObserver'in window){const ro=new ResizeObserver(()=>glide(c,true));ro.observe(c);[...c.children].forEach(x=>ro.observe(x));}
    addEventListener('resize',()=>{if(c.isConnected)glide(c,true);});
  }

  let cbox=null,resolver=null;
  function confirm(o){
    o=o||{};
    cbox=cbox||$('#ov-confirm');
    const d=cbox.querySelector('.dialog');
    d.classList.toggle('danger',!!o.danger);
    d.innerHTML='<div class="confirm-body"><span class="confirm-ic">'+ic(o.icon||(o.danger?'trash':'info'))+'</span><h3 class="confirm-title" id="cf-title">'+esc(o.title||'')+'</h3>'+(o.body?'<p class="confirm-text">'+esc(o.body)+'</p>':'')+'</div><div class="confirm-acts"><button type="button" class="btn btn-line" data-cf="0">'+esc(o.cancel||t('cancel'))+'</button><button type="button" class="btn '+(o.danger?'btn-danger-solid':'btn-primary')+'" data-cf="1" autofocus>'+esc(o.ok||t('ok'))+'</button></div>';
    if(resolver)resolver(false);
    return new Promise(res=>{
      resolver=res;let done=false;
      const end=v=>{if(done)return;done=true;resolver=null;res(v);};
      d.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{end(b.dataset.cf==='1');Overlay.close('ov-confirm');});
      cbox.addEventListener('closed',()=>end(false),{once:true});
      Overlay.open('ov-confirm');
    });
  }


  function theme(fn,x,y){
    const r=document.documentElement;
    r.classList.add('theming');
    const finish=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>r.classList.remove('theming')));
    if(!document.startViewTransition||RM()){r.classList.add('theme-fade');fn();setTimeout(()=>r.classList.remove('theme-fade'),520);r.classList.remove('theming');return;}
    const cx=x??innerWidth-40,cy=y??32,rad=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy));
    const vt=document.startViewTransition(fn);
    vt.ready.then(()=>r.animate({clipPath:['circle(0px at '+cx+'px '+cy+'px)','circle('+rad+'px at '+cx+'px '+cy+'px)']},{duration:620,easing:'cubic-bezier(.16,1,.3,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
    vt.finished.finally(finish);
  }

  function init(){
    scan();
    new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches&&n.matches('select.field'))enhance(n);else if(n.matches&&n.matches('.seg,.tabs')){watch(n);scan(n);}else if(n.querySelector)scan(n);}}).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.iconbtn,.qchip,.tab,.seg button');if(b)b.classList.add('pressed');},{passive:true});
    const up=()=>$$('.pressed').forEach(b=>b.classList.remove('pressed'));
    document.addEventListener('pointerup',up,{passive:true});document.addEventListener('pointercancel',up,{passive:true});
  }
  const sig=el=>[...el.children].slice(0,3).map(c=>c.tagName+'.'+c.className).join('|');
  function paint(el,html){
    if(!el)return false;
    if(el._html===html)return false;
    const had=el._html!=null,prev=had?sig(el):'';
    const sy=scrollY;
    el.innerHTML=html;el._html=html;
    const same=had&&sig(el)===prev;
    el.classList.toggle('calm',same);
    if(had&&!same&&!RM()){el.classList.remove('kfade');void el.offsetWidth;el.classList.add('kfade');}
    if(Math.abs(scrollY-sy)>1)scrollTo(scrollX,sy);
    return true;
  }
  function vt(fn){if(document.startViewTransition&&!RM()){document.documentElement.classList.add('vt-soft');const v=document.startViewTransition(fn);v.finished.finally(()=>document.documentElement.classList.remove('vt-soft'));}else fn();}
  return{init,scan,enhance,confirm,theme,glide,paint,vt};
})();
