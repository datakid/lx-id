const ViewPrayer=(()=>{
  const D=LXDate,P=LXPrayer;
  let city=null,timer=null,showMonth=false;
  function opts(){
    const m=Store.get('pMethod','auto');
    return{method:m==='auto'?(P.COUNTRY_METHOD[city&&city.cc]||'mwl'):m,asr:Store.get('pAsr','shafi'),highLat:Store.get('pHigh','middle')};
  }
  const label=c=>I18N.lang==='ar'&&c.ar?c.ar:c.en;
  const country=c=>I18N.lang==='ar'&&c.countryAr?c.countryAr:(c.country||'');
  function view(el){
    city=Store.get('pCity',null)||LXCities.EG[0];
    const M=Object.keys(P.METHODS);
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <div><label class="label" for="p-q">${esc(t('city'))}</label>
          <div class="row"><div class="grow" style="position:relative"><input class="field" id="p-q" type="search" autocomplete="off" placeholder="${esc(t('city_ph'))}" value="${esc(label(city))}" role="combobox" aria-expanded="false" aria-controls="p-res"></div><button type="button" class="btn btn-line" id="p-here" title="${esc(t('near_me'))}">${ic('pin')}<span>${esc(t('near_me'))}</span></button></div>
          <div id="p-res" class="menu hide" role="listbox" style="position:static;animation:none;box-shadow:var(--sh-1);max-width:none;margin-top:.45rem"></div></div>
        <div class="grid-2">
          <div><label class="label" for="p-m">${esc(t('method'))}</label><select class="field" id="p-m"><option value="auto">${esc(t('m_auto'))}</option>${M.map(k=>`<option value="${k}">${esc(t('m_'+k))}</option>`).join('')}</select></div>
          <div><label class="label" for="p-asr">${esc(t('asr'))}</label><select class="field" id="p-asr"><option value="shafi">${esc(t('asr_shafi'))}</option><option value="hanafi">${esc(t('asr_hanafi'))}</option></select></div>
          <div><label class="label" for="p-hl">${esc(t('highlat'))}</label><select class="field" id="p-hl"><option value="middle">${esc(t('hl_middle'))}</option><option value="seventh">${esc(t('hl_seventh'))}</option><option value="angle">${esc(t('hl_angle'))}</option></select></div>
          <div><label class="label" for="p-clk">${esc(t('clock'))}</label><select class="field" id="p-clk"><option value="24">24h</option><option value="12">12h</option></select></div>
        </div>
        <p class="tiny faint" style="margin:0">${esc(t('prayer_note'))}</p>
      </section>
      <section class="stack" id="p-out" aria-live="polite"></section></div>`;
    $('#p-m').value=Store.get('pMethod','auto');$('#p-asr').value=Store.get('pAsr','shafi');$('#p-hl').value=Store.get('pHigh','middle');$('#p-clk').value=Store.get('clock','24');
    $('#p-m').onchange=e=>{Store.set('pMethod',e.target.value);render();};
    $('#p-asr').onchange=e=>{Store.set('pAsr',e.target.value);render();};
    $('#p-hl').onchange=e=>{Store.set('pHigh',e.target.value);render();};
    $('#p-clk').onchange=e=>{Store.set('clock',e.target.value);render();};
    const q=$('#p-q'),res=$('#p-res');
    let matches=[],kb=-1;
    const draw=()=>{
      matches=LXCities.search(q.value);kb=-1;
      if(!matches.length){res.classList.add('hide');q.setAttribute('aria-expanded','false');return;}
      res.innerHTML=matches.map((c,i)=>`<button type="button" class="mi" role="option" data-i="${i}">${ic('pin')}<span class="grow">${esc(label(c))}${c.province?`<span class="faint tiny"> · ${esc(c.province)}</span>`:''}</span><span class="tiny faint">${esc(country(c))}</span></button>`).join('');
      res.classList.remove('hide');q.setAttribute('aria-expanded','true');
      res.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>pick(matches[+b.dataset.i]));
    };
    q.addEventListener('focus',()=>{q.select();LXCities.load().then(draw);draw();});
    q.addEventListener('input',debounce(()=>LXCities.load().then(draw),90));
    q.addEventListener('keydown',e=>{
      const items=[...res.querySelectorAll('[data-i]')];
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();kb=clamp(kb+(e.key==='ArrowDown'?1:-1),0,items.length-1);items.forEach((x,i)=>x.classList.toggle('kb',i===kb));items[kb]&&items[kb].scrollIntoView({block:'nearest'});}
      else if(e.key==='Enter'){e.preventDefault();if(matches.length)pick(matches[kb<0?0:kb]);}
      else if(e.key==='Escape'){res.classList.add('hide');}
    });
    document.addEventListener('mousedown',function h(e){if(!document.contains(q)){document.removeEventListener('mousedown',h);return;}if(!res.contains(e.target)&&e.target!==q)res.classList.add('hide');});
    $('#p-here').onclick=here;
    render();
  }
  function pick(c){city=c;Store.set('pCity',c);$('#p-q').value=label(c);$('#p-res').classList.add('hide');render();}
  function here(){
    if(!navigator.geolocation){toast(t('loc_denied'),'bad');return;}
    toast(t('locating'),'info');
    navigator.geolocation.getCurrentPosition(async pos=>{
      await LXCities.load();
      const {latitude:lat,longitude:lng}=pos.coords,n=LXCities.nearest(lat,lng);
      const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||(n.city&&n.city.tz)||'UTC';
      const c=Object.assign({},n.city||{en:t('my_location'),cc:''},{lat,lng,tz:n.km<200&&n.city?n.city.tz:tz,en:(n.city?n.city.en:t('my_location')),approx:n.km});
      pick(c);toast(t('nearest',label(c),Math.round(n.km)));
    },()=>toast(t('loc_denied'),'bad'),{timeout:12000,maximumAge:600000});
  }
  function render(){
    clearInterval(timer);
    const out=$('#p-out');if(!out||!city)return;
    const o=opts(),tz=city.tz||'Africa/Cairo';
    let today;
    try{today=P.forCity(city,o,0);}catch(e){out.innerHTML=`<div class="card pad">${emptyState('alert',esc(t('prayer_fail')),true)}</div>`;return;}
    const now=new Date(),nx=P.next(city,o,now);
    const qb=P.qibla(city.lat,city.lng),km=P.distKm(city.lat,city.lng,P.KAABA.lat,P.KAABA.lng);
    const icons={fajr:'moon',sunrise:'sun',dhuhr:'sun',asr:'sun',maghrib:'moon',isha:'moon'};
    const rows=P.ORDER.map(k=>{const at=today[k],isNext=!nx.tomorrow&&nx.key===k,past=at&&at<=now&&!isNext;return`<div class="pr${isNext?' next':''}${past?' past':''}">${ic(icons[k])}<b>${esc(t('pr_'+k))}</b><span>${esc(Fmt.time(at,tz))}</span></div>`;}).join('');
    const local=new Intl.DateTimeFormat(Fmt.loc(),{timeZone:tz,hour:'2-digit',minute:'2-digit',weekday:'short',hour12:Store.get('clock','24')==='12'}).format(now);
    out.innerHTML=`
      <div class="card pad stack">
        <div class="hero prayer-next"><div><div class="k">${esc(t('next_prayer'))}${nx.tomorrow?' · '+esc(t('tomorrow')):''}</div><div class="v">${esc(t('pr_'+nx.key))}</div><div class="s">${esc(Fmt.time(nx.at,tz))} · ${esc(label(city))}</div></div><div style="text-align:end"><div class="disp" id="p-cd" style="font-size:1.6rem;font-weight:620;color:var(--amber-text);font-variant-numeric:tabular-nums"></div><div class="tiny faint">${esc(t('local_time'))} ${esc(local)}</div></div></div>
        <div class="prayer-list">${rows}</div>
        ${today.adjusted?`<div class="callout warn">${ic('warn')}<span>${esc(t('hl_applied'))}</span></div>`:''}
        <div class="between"><span class="tiny faint">${esc(Fmt.date(today.rd,'full'))} · ${esc(Fmt.hijri(today.rd))}</span><span class="chip">${esc(t('m_'+o.method))}</span></div>
      </div>
      <div class="split even">
        <div class="card pad"><div class="row" style="gap:1.1rem"><div class="qibla" aria-label="${esc(t('qibla'))}"><span class="n">N</span><span class="needle" style="transform:rotate(${qb+180}deg)"></span><span class="hub"></span></div><div class="stack-sm"><div class="eyebrow" style="margin:0">${esc(t('qibla'))}</div><div class="disp" style="font-size:1.5rem;font-weight:620">${Fmt.n(qb,1)}°</div><div class="tiny faint">${esc(t('from_north'))} · ${Fmt.n(km)} km</div></div></div></div>
        <div class="card pad list">${li(t('pr_sunset'),esc(Fmt.time(today.sunset,tz)))}${li(t('pr_midnight'),esc(Fmt.time(today.midnight,tz)))}${li(t('pr_lastthird'),esc(Fmt.time(today.lastThird,tz)))}${li(t('coords'),`<span class="mono">${city.lat.toFixed(3)}, ${city.lng.toFixed(3)}</span>`,esc(tz))}</div>
      </div>
      <div class="card pad stack-sm"><div class="between"><h3 class="card-title">${ic('cal')}${esc(t('month_table'))}</h3><div class="row-wrap"><button type="button" class="btn btn-ghost btn-sm" id="p-mt">${esc(showMonth?t('hide'):t('show'))}</button><button type="button" class="btn btn-line btn-sm" id="p-csv">${ic('down')}CSV</button></div></div><div id="p-month"></div></div>`;
    const cd=$('#p-cd'),tick=()=>{const ms=nx.at-new Date();if(ms<=0){render();return;}const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;cd.textContent=(h?h+':':'')+D.pad(m)+':'+D.pad(sec);};
    tick();timer=setInterval(()=>{if(!document.contains(cd)){clearInterval(timer);return;}tick();},1000);
    const g=D.toG(today.rd);
    const month=()=>P.month(city,o,g.y,g.m);
    const mt=$('#p-month');
    const drawMonth=()=>{if(!showMonth){mt.innerHTML='';return;}const rs=month();mt.innerHTML=`<div class="tablebox" style="max-height:24rem"><table class="t"><thead><tr><th>${esc(t('date'))}</th>${P.ORDER.map(k=>`<th>${esc(t('pr_'+k))}</th>`).join('')}</tr></thead><tbody>${rs.map(r=>`<tr${r.rd===today.rd?' style="background:var(--amber-soft)"':''}><td><b>${D.toG(r.rd).d}</b> <span class="faint small">${esc(Fmt.wd(D.dow(r.rd),true))} · ${D.toH(r.rd).d}</span></td>${P.ORDER.map(k=>`<td class="mono">${esc(Fmt.time(r[k],tz))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;};
    drawMonth();
    $('#p-mt').onclick=()=>{showMonth=!showMonth;$('#p-mt').textContent=showMonth?t('hide'):t('show');drawMonth();};
    $('#p-csv').onclick=()=>{const rs=month();download(toCSV([[t('date')].concat(P.ORDER.map(k=>t('pr_'+k)))].concat(rs.map(r=>[D.iso(r.rd)].concat(P.ORDER.map(k=>Fmt.time(r[k],tz)))))),'prayer-'+city.en.replace(/\W+/g,'-').toLowerCase()+'-'+g.y+'-'+D.pad(g.m)+'.csv','text/csv');toast(t('t_downloaded',rs.length));};
  }
  function stop(){clearInterval(timer);}
  return{view,stop};
})();
