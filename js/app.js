const App=(()=>{
  const SECTIONS={
    id:{icon:'id',label:'nav_id',title:'id_title',lede:'id_lede',subs:[['','sub_single','id',el=>ViewID.single(el)],['batch','sub_batch','rows',el=>ViewID.batch(el)],['upload','sub_upload','cloud',el=>ViewID.upload(el)],['build','sub_build','build',el=>ViewID.builder(el)]]},
    dates:{icon:'cal',label:'nav_dates',title:'dates_title',lede:'dates_lede',subs:[['','sub_between','range',el=>ViewDates.between(el)],['add','sub_add','calplus',el=>ViewDates.addsub(el)],['age','sub_age','cake',el=>ViewDates.age(el)],['day','sub_day','today',el=>ViewDates.anatomy(el)],['convert','sub_convert','moon',el=>ViewDates.convert(el)],['holidays','sub_holidays','party',el=>ViewDates.holidays(el)],['prayer','sub_prayer','mosque',el=>ViewPrayer.view(el)],['leap','sub_leap','repeat',el=>ViewDates.leap(el)]]},
    formulas:{icon:'fx',label:'nav_formulas',title:'fx_title',lede:'fx_lede',subs:[['','',null,el=>ViewFormulas.view(el)]]},
    ref:{icon:'book',label:'nav_ref',title:'ref_title',lede:'ref_lede',subs:[['','ref_structure','id',el=>ViewRef.structure(el)],['gov','ref_gov','pin',el=>ViewRef.govs(el)],['law','ref_law','gavel',el=>ViewRef.law(el)],['dates','ref_dates','info',el=>ViewRef.dates(el)]]}
  };
  let cur={sec:'id',sub:'',param:''},prevSec=null;
  const api={param:''};
  function parse(h){
    const parts=String(h||'').replace(/^#\/?/,'').split('/').filter(Boolean);
    let sec=parts[0]||'id';if(!SECTIONS[sec])sec='id';
    let sub=parts[1]||'',param='';
    if(sec==='id'&&sub&&!['batch','upload','build'].includes(sub)){param=decodeURIComponent(sub);sub='';}
    if(!SECTIONS[sec].subs.some(s=>s[0]===sub))sub='';
    return{sec,sub,param};
  }
  function href(sec,sub){return'#/'+sec+(sub?'/'+sub:'');}
  let shownSec=null,shownLang=null;
  function centerTab(nav,a,smooth){if(!nav||!a)return;const x=a.offsetLeft-(nav.clientWidth-a.offsetWidth)/2;nav.scrollTo({left:document.dir==='rtl'?x-(nav.scrollWidth-nav.clientWidth):x,behavior:smooth?'smooth':'auto'});}
  function render(mode){
    ViewPrayer.stop();Menu.close();DateField.closePop();
    const S=SECTIONS[cur.sec];
    const sub=S.subs.find(s=>s[0]===cur.sub)||S.subs[0];
    api.param=cur.param;
    const app=$('#app');
    const same=shownSec===cur.sec&&shownLang===I18N.lang&&$('#view');
    if(same){
      const tabs=app.querySelector('.tabs');
      if(tabs){
        $$('.tab',tabs).forEach(a=>{const on=a.getAttribute('href')===href(cur.sec,sub[0]);a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
        Kit.glide(tabs);centerTab(app.querySelector('.subnav'),tabs.querySelector('.active'),true);
      }
      const old=$('#view');
      const v=document.createElement('div');v.id='view';
      if(mode!=='soft')v.className='view-in';
      old.replaceWith(v);
      sub[3](v);
    }else{
      app.innerHTML=`<div class="page${mode==='soft'?'':' page-in'}"><div class="page-head"><div><h1 class="page-title">${esc(t(S.title))}</h1><p class="page-lede">${esc(t(S.lede))}</p></div></div>
      ${S.subs.length>1?`<nav class="subnav scrollx noprint" aria-label="${esc(t(S.label))}"><div class="tabs wide">${S.subs.map(s=>`<a class="tab${s===sub?' active':''}" href="${href(cur.sec,s[0])}"${s===sub?' aria-current="page"':''}>${ic(s[2])}<span>${esc(t(s[1]))}</span></a>`).join('')}</div></nav>`:''}
      <div id="view"></div></div>`;
      const sn=app.querySelector('.subnav');
      centerTab(sn,app.querySelector('.tab.active'),false);
      if(sn&&'ResizeObserver'in window){let w=0;new ResizeObserver(()=>{if(sn.clientWidth!==w){w=sn.clientWidth;centerTab(sn,sn.querySelector('.tab.active'),false);}}).observe(sn);}
      sub[3]($('#view'));
      shownSec=cur.sec;shownLang=I18N.lang;
    }
    navState();
    document.title=(sub[1]?t(sub[1])+' · ':'')+t(S.title)+' — '+t('brand');
  }
  function soft(){
    const y=scrollY,ae=document.activeElement,aid=ae&&ae.id;
    const h=$('#view');if(h)h.style.minHeight=h.offsetHeight+'px';
    render('soft');
    const v=$('#view');
    requestAnimationFrame(()=>{if(v)v.style.minHeight='';});
    scrollTo(scrollX,y);
    if(aid&&!Overlay.isOpen()){const n=document.getElementById(aid);n&&n.focus({preventScroll:true});}
  }
  function navState(){
    $$('[data-sec]').forEach(a=>{const on=a.dataset.sec===cur.sec;a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
    moveInd();
  }
  let indReady=false;
  function moveInd(){
    const b=$('#bottomnav');if(b){const items=[...b.children].filter(x=>x.matches('a,button'));const i=items.findIndex(x=>x.classList.contains('active'));b.style.setProperty('--n',items.length);b.style.setProperty('--i',Math.max(0,i));b.classList.toggle('has-active',i>=0);}
    const a=$('.mainnav a.active'),ind=$('#nav-ind');if(!a||!ind||!a.offsetWidth)return;
    if(!indReady)ind.style.transition='none';
    ind.style.width=a.offsetWidth+'px';ind.style.transform='translate3d('+a.offsetLeft+'px,0,0)';ind.style.opacity='1';
    if(!indReady){void ind.offsetWidth;ind.style.transition='';indReady=true;}
  }
  function onHash(){
    const n=parse(location.hash);
    if(n.sec===cur.sec&&n.sub===cur.sub&&cur.sec==='id'&&!n.sub&&$('#id-input')){
      if(n.param&&n.param!==$('#id-input').value){$('#id-input').value=n.param;ViewID.inspect(n.param);}
      cur=n;return;
    }
    const changed=n.sec!==cur.sec||n.sub!==cur.sub;
    if(!changed&&$('#view')){cur=n;return;}
    cur=n;Store.set('route',href(n.sec,n.sub));
    render();
    if(changed){const top=n.sec===prevSec?Math.min(scrollY,Math.max(0,($('.subnav')||$('#app')).getBoundingClientRect().top+scrollY-80)):0;scrollTo({top,behavior:'instant'});}
    prevSec=n.sec;
  }
  function go(h){if(location.hash===h){const n=parse(h);if(n.sec==='id'&&!n.sub&&n.param&&$('#id-input')){onHash();return;}cur=n;render();}else location.hash=h;}
  function setParam(id){
    if(cur.sec!=='id'||cur.sub)return;
    const h=id?'#/id/'+id:'#/id';
    if(location.hash!==h){try{history.replaceState(null,'',h);}catch(e){}cur.param=id;}
  }
  function chrome(){
    const bm=$('#brandmark');if(bm&&!bm.firstChild)bm.innerHTML=markSvg();
    document.documentElement.lang=I18N.lang;document.documentElement.dir=I18N.lang==='ar'?'rtl':'ltr';
    $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
    $$('.mainnav [data-sec],.bottomnav [data-sec]').forEach(a=>{const S=SECTIONS[a.dataset.sec];a.innerHTML=ic(S.icon)+'<span>'+esc(t(S.label))+'</span>';a.title=t(S.label);});
    $('#btn-cmdk-m').innerHTML=ic('search')+'<span>'+esc(t('nav_search'))+'</span>';
    const L=$('#btn-lang');L.textContent=I18N.lang==='ar'?'EN':'ع';L.title=L.ariaLabel=t('lang_switch');
    $('#btn-cmdk').innerHTML=ic('search');$('#btn-cmdk').title=$('#btn-cmdk').ariaLabel=t('cmdk')+' (⌘K)';
    $('#btn-settings').innerHTML=ic('gear');$('#btn-settings').title=$('#btn-settings').ariaLabel=t('settings');
    $$('[data-close]').forEach(b=>{b.innerHTML=ic('x');b.ariaLabel=t('close');});
    $('#ov-cmdk').setAttribute('aria-label',t('cmdk'));
    Settings.apply();
  }
  function refresh(){const y=scrollY;chrome();shownLang=null;render('soft');scrollTo(scrollX,y);indReady=false;requestAnimationFrame(moveInd);$$('.seg,.tabs').forEach(s=>Kit.glide(s,true));}
  function toggleLang(){Kit.vt(()=>{I18N.set(I18N.lang==='ar'?'en':'ar');Store.set('lang',I18N.lang);refresh();});toast(t('t_lang'));}
  function toggleTheme(e){
    const dark=!document.documentElement.classList.contains('dark');Store.set('theme',dark?'dark':'light');
    const b=$('#btn-theme').getBoundingClientRect();
    Kit.theme(()=>Settings.applyTheme(),e&&e.clientX?e.clientX:b.left+b.width/2,e&&e.clientY?e.clientY:b.top+b.height/2);
  }
  function openSettings(focus){Settings.render(focus);Overlay.open('ov-settings');}
  function openHolidays(onDone){ViewDates.holidayDialog(onDone);Overlay.open('ov-holidays');}
  function touchIcon(){
    try{
      const c=document.createElement('canvas');c.width=c.height=180;const x=c.getContext('2d'),k=180/64;
      const g=x.createRadialGradient(54,0,0,54,0,216);g.addColorStop(0,'#3A2C21');g.addColorStop(.55,'#1C1510');g.addColorStop(1,'#0D0A07');x.fillStyle=g;x.fillRect(0,0,180,180);
      x.scale(k,k);x.translate(MARK.shift[0],MARK.shift[1]);const a=x.createLinearGradient(20,10,26,48);a.addColorStop(0,'#F8D2AA');a.addColorStop(.55,'#E39563');a.addColorStop(1,'#C2652F');
      x.strokeStyle=a;x.lineWidth=9.5;x.lineCap='round';x.stroke(new Path2D(MARK.stroke));
      MARK.dots.forEach(([cx,cy,c])=>{x.fillStyle=c;x.beginPath();x.arc(cx,cy,MARK.r,0,Math.PI*2);x.fill();});
      $('#touch-icon').href=c.toDataURL('image/png');
    }catch(e){}
  }
  function init(){
    I18N.set(Store.get('lang',(navigator.language||'').startsWith('ar')?'ar':'en'));
    chrome();Overlay.init();Cmdk.init();Kit.init();
    $('#btn-lang').onclick=toggleLang;$('#btn-theme').onclick=toggleTheme;$('#btn-settings').onclick=()=>openSettings();
    $('#btn-cmdk').onclick=Cmdk.open;$('#btn-cmdk-m').onclick=Cmdk.open;
    $$('[data-close]').forEach(b=>b.onclick=()=>Overlay.close(b.dataset.close));
    $('#ov-holidays').addEventListener('closed',()=>{if(cur.sec==='dates')soft();});
    $('#btn-theme').innerHTML=themeIcon();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>Settings.applyTheme());
    addEventListener('hashchange',onHash);
    addEventListener('resize',debounce(()=>{indReady=false;moveInd();},60));
    let ticking=false,sc=null;
    addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const s=scrollY>4;if(s!==sc){sc=s;$('#topbar').classList.toggle('scrolled',s);}});},{passive:true});
    document.addEventListener('keydown',e=>{
      const tag=(document.activeElement&&document.activeElement.tagName)||'',typing=/INPUT|TEXTAREA|SELECT/.test(tag);
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();Overlay.isOpen()?Overlay.close('ov-cmdk'):Cmdk.open();return;}
      if(typing||Overlay.isOpen()||e.metaKey||e.ctrlKey||e.altKey)return;
      if(e.key==='/'){e.preventDefault();go('#/id');setTimeout(()=>{const i=$('#id-input');i&&i.focus();},30);}
      else if(e.key==='?'){e.preventDefault();Cmdk.open();}
      else if(/^[1-4]$/.test(e.key)){go(href(['id','dates','formulas','ref'][+e.key-1],''));}
    });
    document.addEventListener('paste',e=>{
      const tag=(document.activeElement&&document.activeElement.tagName)||'';
      if(/INPUT|TEXTAREA/.test(tag)||Overlay.isOpen())return;
      const s=(e.clipboardData||window.clipboardData).getData('text');const toks=LXID.tokens(s);
      if(toks.length>1){go('#/id/batch');setTimeout(()=>ViewID.loadBatch(toks.join('\n'),true),40);}
      else if(toks.length===1)go('#/id/'+toks[0]);
    });
    if(!location.hash){const r=Store.get('route','#/id');try{history.replaceState(null,'',r);}catch(e){}}
    cur={sec:null};onHash();
    requestAnimationFrame(moveInd);
    if(document.fonts)document.fonts.ready.then(()=>{indReady=false;moveInd();$$('.seg,.tabs').forEach(s=>Kit.glide(s,true));document.documentElement.classList.add('ready');});
    else document.documentElement.classList.add('ready');
    const warm=()=>{XL.load().catch(()=>{});LXCities.load();};
    'requestIdleCallback'in window?requestIdleCallback(warm,{timeout:5000}):setTimeout(warm,3000);
    touchIcon();
    if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  return Object.assign(api,{init,go,setParam,refresh,soft,toggleLang,toggleTheme,openSettings,openHolidays});
})();
document.addEventListener('DOMContentLoaded',App.init);
