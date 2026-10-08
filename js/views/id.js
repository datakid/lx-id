const IDCols=(()=>{
  const D=LXDate;
  const L=()=>I18N.lang;
  const C=[
    {k:'id',l:'c_id',v:r=>r.valid?r.id:r.raw,def:1},
    {k:'status',l:'c_status',v:r=>t(r.valid?'st_valid':r.isNull?'st_null':'st_error'),def:1},
    {k:'birth',l:'c_birth',v:r=>r.valid?D.iso(r.birth):'',xl:r=>D.excelSerial(r.birth),z:'yyyy-mm-dd',f:'birth',def:1},
    {k:'weekday',l:'c_weekday',v:r=>r.valid?Fmt.wd(r.weekday):''},
    {k:'age',l:'c_age',v:r=>r.valid?r.age.years:'',f:'age',def:1},
    {k:'ageFull',l:'c_agefull',v:r=>r.valid?Fmt.ymd(r.age):'',f:'ageFull'},
    {k:'days',l:'c_days',v:r=>r.valid?r.age.totalDays:''},
    {k:'gender',l:'c_gender',v:r=>r.valid?t(r.gender==='M'?'male':'female'):'',f:'gender',s:1,def:1},
    {k:'govCode',l:'c_govcode',v:r=>r.valid?r.govCode:''},
    {k:'gov',l:'c_gov',v:r=>r.valid?(LXID.govName(r.govCode,L())||t('unknown')):'',f:'gov',s:1,def:1},
    {k:'region',l:'c_region',v:r=>r.valid?(LXID.govRegion(r.govCode,L())||''):''},
    {k:'serial',l:'c_serial',v:r=>r.valid?r.serial:''},
    {k:'check',l:'c_check',v:r=>r.valid?r.check:''},
    {k:'retireAge',l:'c_retage',v:r=>r.valid?r.ret.age:'',f:'retireAge',def:1},
    {k:'retireDate',l:'c_retdate',v:r=>r.valid?D.iso(r.ret.date):'',xl:r=>D.excelSerial(r.ret.date),z:'yyyy-mm-dd',f:'retireDate',def:1},
    {k:'yearsLeft',l:'c_yearsleft',v:r=>r.valid?(r.retired?0:r.toRetire.years):'',f:'yearsLeft',def:1},
    {k:'daysLeft',l:'c_daysleft',v:r=>r.valid?Math.max(0,r.daysToRetire):''},
    {k:'career',l:'c_career',v:r=>r.valid?Math.round(r.career):''},
    {k:'hijri',l:'c_hijri',v:r=>{if(!r.valid)return'';const h=D.toH(r.birth);return h.y+'-'+D.pad(h.m)+'-'+D.pad(h.d);}},
    {k:'flags',l:'c_flags',v:r=>r.valid?r.flags.map(f=>t('flag_'+f)).join(', '):'',def:1},
    {k:'error',l:'c_error',v:r=>r.valid?'':(r.error?errText(r.error):''),def:1}
  ];
  const MAP=Object.fromEntries(C.map(c=>[c.k,c]));
  function sheetRows(rows,keys,inject,idKey){
    const F=c=>LXID.F(c,{lang:L(),male:t('male'),female:t('female'),unknown:t('unknown')});
    return rows.map((r,i)=>{
      const o={};
      keys.forEach(k=>{const c=MAP[k];o[k]=c.xl&&r.valid?{t:'n',v:c.xl(r),z:c.z}:c.v(r);});
      return o;
    });
  }
  return{C,MAP,sheetRows};
})();

function errText(e){if(!e)return'';const a=(e.a||[]).map(x=>e.k==='err_future'?Fmt.date(x):x);return t(e.k,...a);}

const ViewID=(()=>{
  const D=LXDate;
  let lastValid=false;
  function single(el){
    el.innerHTML=`
      <div class="card pad noprint">
        <label class="label" for="id-input">${esc(t('id_label'))}</label>
        <div class="field-wrap">
          <input id="id-input" class="field idinput" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="${esc(t('id_ph'))}" aria-describedby="id-cap">
          <div class="idinput-acts">
            <button type="button" class="iconbtn sm" id="id-paste" title="${esc(t('paste'))}" aria-label="${esc(t('paste'))}">${ic('paste')}</button>
            <button type="button" class="iconbtn sm" id="id-sample" title="${esc(t('sample'))}" aria-label="${esc(t('sample'))}">${ic('spark')}</button>
            <button type="button" class="iconbtn sm" id="id-mask" title="${esc(t('mask'))}" aria-label="${esc(t('mask'))}" aria-pressed="${Store.get('mask',false)}">${ic(Store.get('mask',false)?'eyeoff':'eye')}</button>
            <button type="button" class="iconbtn sm" id="id-clear" title="${esc(t('clear'))}" aria-label="${esc(t('clear'))}">${ic('xc')}</button>
          </div>
        </div>
        <div class="meter" id="id-meter" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i class="${i===0?'g-d':i<7?'g-d':i<9?'g-l':i<13?'g-s':'g-c'}"></i>`).join('')}</div>
        <div class="meter-cap" id="id-cap"><b id="id-count">0/14</b><span>${esc(t('id_hint'))}</span></div>
      </div>
      <div id="id-result" class="stack" style="margin-top:1rem" aria-live="polite"></div>`;
    const inp=$('#id-input',el);
    const run=()=>inspect(inp.value);
    inp.addEventListener('input',debounce(run,120));
    inp.addEventListener('paste',e=>{
      const txt=(e.clipboardData||window.clipboardData).getData('text');
      const toks=LXID.tokens(txt);
      if(toks.length>1){e.preventDefault();App.go('#/id/batch');setTimeout(()=>ViewID.loadBatch(toks.join('\n'),true),30);toast(t('t_routed_batch',toks.length),'info');}
    });
    $('#id-paste',el).onclick=async()=>{const s=await readClipboard();if(s==null)return;const toks=LXID.tokens(s);if(toks.length>1){App.go('#/id/batch');setTimeout(()=>ViewID.loadBatch(toks.join('\n'),true),30);return;}inp.value=toks[0]||s.trim();run();};
    $('#id-sample',el).onclick=()=>{inp.value=LXID.sample();run();toast(t('t_sample'),'info');};
    $('#id-clear',el).onclick=()=>{inp.value='';run();inp.focus();};
    $('#id-mask',el).onclick=e=>{const v=!Store.get('mask',false);Store.set('mask',v);e.currentTarget.innerHTML=ic(v?'eyeoff':'eye');e.currentTarget.setAttribute('aria-pressed',v);run();toast(t(v?'t_masked':'t_unmasked'),'info');};
    const init=App.param||Store.get('single','');
    if(init){inp.value=init;run();}
    else{paint($('#id-result',el),intro());bindIntro($('#id-result',el));}
  }
  const RKEY='recent';
  function recents(){return Store.remember()?Store.get(RKEY+'_s',[]):(window.__recent||[]);}
  function pushRecent(id){
    let l=recents().filter(x=>x!==id);l.unshift(id);l=l.slice(0,6);
    if(Store.remember())Store.set(RKEY+'_s',l);window.__recent=l;
  }
  function intro(){
    const rc=recents();
    return `${rc.length?`<section class="card pad stack-sm"><div class="between"><h3 class="card-title">${ic('history')}${esc(t('recent'))}</h3><button type="button" class="btn btn-ghost btn-sm" data-rc-clear>${esc(t('clear'))}</button></div><div class="qchips">${rc.map(s=>`<button type="button" class="qchip mono" data-s="${s}">${esc(maskId(s))}</button>`).join('')}</div></section>`:''}
      <div class="card pad"><div class="split even">
      <div class="stack-sm"><h3 class="card-title">${ic('spark')}${esc(t('intro_t'))}</h3><p class="muted small" style="margin:0">${esc(t('intro_d'))}</p>
      <div class="qchips" style="margin-top:.4rem">${LXID.SAMPLES.slice(0,4).map(s=>`<button type="button" class="qchip mono" data-s="${s}">${s}</button>`).join('')}</div></div>
      <div class="anatomy" aria-hidden="true"><span class="a1">2</span><span class="a2">9</span><span class="a2">8</span><span class="a2">0</span><span class="a2">5</span><span class="a2">1</span><span class="a2">2</span><span class="a3">1</span><span class="a3">4</span><span class="a4">0</span><span class="a4">1</span><span class="a4">2</span><span class="a5">3</span><span class="a6">4</span></div>
    </div></div>`;
  }
  function meter(n){
    const m=$('#id-meter');if(!m)return;
    [...m.children].forEach((x,i)=>x.classList.toggle('on',i<n));
    m.classList.toggle('over',n>14);
    const c=$('#id-count');c.textContent=n+'/14';c.className=n===14?'ok':n>14?'over':'';
  }
  function partial(d){
    const P=(k,v,cls)=>`<span class="partial ${cls||''}"><small>${esc(t(k))}</small>${v}</span>`;
    const out=[];const c=d[0];
    if(c)out.push(P('p_century',c==='2'||c==='3'?(c==='2'?'1900s':'2000s'):esc(c),c==='2'||c==='3'?'':'bad'));
    if(d.length>=7&&(c==='2'||c==='3')){const y=1700+100*+c+ +d.slice(1,3),m=+d.slice(3,5),dd=+d.slice(5,7),ok=D.validG(y,m,dd);out.push(P('p_birth',ok?esc(Fmt.date(D.fromG(y,m,dd))):`${D.pad(dd)}/${D.pad(m)}/${y}`,ok?'':'bad'));}
    else if(d.length>1)out.push(P('p_birth','…','wait'));
    if(d.length>=9){const g=d.slice(7,9),n=LXID.govName(g,I18N.lang);out.push(P('p_gov',esc(n||t('unknown'))+` <span class="mono faint">${g}</span>`,n?'':'bad'));}else if(d.length>=7)out.push(P('p_gov','…','wait'));
    if(d.length>=13)out.push(P('p_gender',esc(t(+d[12]%2?'male':'female'))));else if(d.length>=9)out.push(P('p_gender','…','wait'));
    return `<div class="card pad stack-sm"><div class="row tiny faint">${ic('key')}${esc(t('p_wait',14-d.length))}</div><div class="partials">${out.join('')}</div></div>`;
  }
  function inspect(raw){
    Store.set('single',raw);
    const box=$('#id-result');if(!box)return;
    const n=LXID.normalize(raw);
    meter(n.digits.length);
    if(!raw.trim()){paint(box,intro());bindIntro(box);lastValid=false;App.setParam('');return;}
    if(!n.sci&&n.digits.length>0&&n.digits.length<14){paint(box,partial(n.digits));lastValid=false;return;}
    const r=LXID.parse(raw,{trace:true});
    const openTrace=!!box.querySelector('details.disclose[open]');
    paint(box,r.valid?result(r):invalid(r));
    if(openTrace){const d=box.querySelector('details.disclose');if(d)d.open=true;}
    if(r.valid){pushRecent(r.id);App.setParam(Store.get('mask',false)?'':r.id);animateIn(box);}
    lastValid=r.valid;
    bind(box,r);
  }
  function bindIntro(box){box.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{$('#id-input').value=b.dataset.s;inspect(b.dataset.s);});const c=box.querySelector('[data-rc-clear]');if(c)c.onclick=()=>{window.__recent=[];Store.set(RKEY+'_s',[]);inspect('');};}
  function maskId(id){return Store.get('mask',false)&&id.length===14?id.slice(0,7)+'•••••'+id.slice(12):id;}
  function checksHtml(r){
    return '<div class="checks">'+r.checks.map((c,i)=>{const st=c.pass===true?'pass':c.pass===false?'fail':'';return `<div class="check" style="animation-delay:${i*40}ms"><span class="ci ${st}">${ic(c.pass===true?'check':c.pass===false?'x':'minus')}</span>${esc(t('chk_'+c.k))}</div>`;}).join('')+
      (LXID.settings.checksum&&r.checksum?`<div class="check"><span class="ci ${r.checksum.match?'pass':'warn'}">${ic(r.checksum.match?'check':'warn')}</span>${esc(t('chk_luhn'))}<span class="note mono">${r.checksum.expected} / ${r.checksum.actual}</span></div>`:'')+'</div>';
  }
  function traceHtml(r){
    if(!r.trace.length)return'';
    return `<details class="card pad disclose noprint"><summary><span class="card-title">${ic('history')}${esc(t('trace_t'))}</span><span class="chev">${ic('chevd')}</span></summary><div class="trace" style="margin-top:.8rem">${r.trace.map((s,i)=>`<div class="tr"${s.seg?` data-seg="${[].concat(s.seg).join(' ')}"`:''}><i>${String(i+1).padStart(2,'0')}</i><span>${esc(t(s.k,...s.a.map(x=>typeof x==='number'&&x>600000&&x<4000000?Fmt.date(x):x)))}</span></div>`).join('')}</div></details>`;
  }
  function suggestions(r){
    const s=LXID.suggest(r.raw);if(!s.length)return'';
    return `<section class="card pad stack-sm noprint"><h3 class="card-title">${ic('spark')}${esc(t('sug_title'))}</h3><p class="card-sub" style="margin:0">${esc(t('sug_desc'))}</p><div class="stack-sm" style="gap:.35rem">${s.map(x=>`<button type="button" class="sug" data-sug="${x.id}"><span class="mono sug-id">${diffHtml(r.digits,x.id)}</span><span class="tiny faint grow">${esc(Fmt.date(x.birth))} · ${esc(LXID.govName(x.gov,I18N.lang)||'')} · ${esc(t(x.gender==='M'?'male':'female'))}</span><span class="chip" style="padding:.1rem .5rem">${esc(t('sug_'+x.kind))}</span></button>`).join('')}</div></section>`;
  }
  function diffHtml(a,b){let o='';for(let i=0;i<b.length;i++)o+=a[i]===b[i]?b[i]:'<mark>'+b[i]+'</mark>';return o;}
  function invalid(r){
    return `<div class="card pad">${emptyState('alert','<b style="color:var(--ink);font-size:1rem">'+esc(errText(r.error))+'</b><span class="small">'+esc(t('normalized'))+' <span class="mono">'+esc(r.digits||r.raw)+'</span></span>',true)}</div>${suggestions(r)}
      <div class="card pad stack-sm"><h3 class="card-title">${ic('shield')}${esc(t('checks_t',r.passed,r.total))}</h3>${checksHtml(r)}</div>${traceHtml(r)}`;
  }
  function result(r){
    const lang=I18N.lang,gov=LXID.govName(r.govCode,lang),reg=LXID.govRegion(r.govCode,lang);
    const S=(v,k,seg,g)=>`<span class="sg" data-seg="${seg}">${v}<small>${esc(t(k))}</small></span>`;
    const ret=r.ret,nb=r.nextBirthday,tdy=D.today();
    const h=D.toH(r.birth);
    const tl=clamp((tdy-r.birth)/Math.max(1,ret.date-r.birth),0,1)*100;
    const side=document.dir==='rtl'?'right':'left';
    const flags=r.flags.filter(f=>f!=='sci');
    return `
    <article class="idcard">
      <span class="mark-ghost" aria-hidden="true">${markSvg(true)}</span>
      <div class="between">
        <div class="row" style="gap:.85rem"><span class="idchip"></span><div><div class="eyebrow" style="margin:0">${esc(t('country'))}</div><div class="idnum">${esc(maskId(r.id))}</div></div></div>
        <div class="row">${genderBadge(r.gender)}<button type="button" class="iconbtn sm noprint" data-copy="${r.id}" title="${esc(t('copy'))}" aria-label="${esc(t('copy'))}">${ic('copy')}</button></div>
      </div>
      <div class="segs">
        <div class="seg-group g-date">${S(r.century,'s_cent','century')}${S(r.id.slice(1,3),'s_year','year')}${S(r.id.slice(3,5),'s_month','month')}${S(r.id.slice(5,7),'s_day','day')}</div>
        <div class="seg-group g-loc">${S(r.govCode,'s_gov','gov')}${`<span class="sg" data-seg="serial" title="${esc(t('serial_hint'))}">${Store.get('mask',false)?'•••':r.serial.slice(0,3)}<sup>${r.serial[3]}</sup><small>${esc(t('s_serial'))}</small></span>`}</div>
        <div class="seg-group g-meta">${S(Store.get('mask',false)?'•':r.check,'s_check','check')}</div>
      </div>
    </article>
    <div class="split">
      <section class="card pad stack">
        <h3 class="card-title">${ic('id')}${esc(t('identity'))}</h3>
        <div class="tiles">
          <div class="tile"><span class="ti">${ic('cake')}</span><div><div class="tk">${esc(t('birth'))}</div><div class="tv">${esc(Fmt.date(r.birth))}</div><div class="ts">${esc(Fmt.wd(r.weekday))} · <span class="mono">${D.iso(r.birth)}</span></div></div></div>
          <div class="tile"><span class="ti mint">${ic('hour')}</span><div><div class="tk">${esc(t('age'))}</div><div class="tv">${esc(Fmt.ymd(r.age))}</div><div class="ts"><span data-count="${r.age.totalDays}">${Fmt.n(r.age.totalDays)}</span> ${esc(t('days_lived'))}</div></div></div>
          <div class="tile"><span class="ti rose">${ic('pin')}</span><div><div class="tk">${esc(t('gov_birth'))}</div><div class="tv"${gov?'':' style="font-style:italic"'}>${esc(gov||t('unknown'))}</div><div class="ts">${esc(reg||'')} <span class="mono">${r.govCode}</span></div></div></div>
          <div class="tile"><span class="ti sun">${ic('party')}</span><div><div class="tk">${esc(t('next_bday'))}</div><div class="tv">${nb.days===0?esc(t('bday_today')):esc(t('in_days',nb.days))}</div><div class="ts">${esc(t('turns',nb.turns))} · ${esc(Fmt.wd(D.dow(nb.rd)))}</div></div></div>
          <div class="tile full"><span class="ti azure">${ic('moon')}</span><div><div class="tk">${esc(t('alt_cal'))}</div><div class="tv">${esc(Fmt.hijri(r.birth))}</div><div class="ts">${esc(Fmt.coptic(r.birth))} · ${esc(t('zodiac_n')[D.zodiac(r.birth)])}</div></div></div>
        </div>
        ${flags.length?`<div class="row-wrap">${flags.map(f=>`<span class="chip ${['fake','gov','checksum'].includes(f)?'scarlet':'sun'}">${esc(t('flag_'+f))}</span>`).join('')}</div>`:''}
      </section>
      <section class="card pad stack">
        <div class="between"><h3 class="card-title">${ic('gavel')}${esc(t('retirement'))}</h3><span class="chip amber">${esc(t('law'))}</span></div>
        <div class="row" style="gap:1.2rem;align-items:center">
          <div class="ring-wrap">${ring(r.career,112,10)}<div class="rl"><div><div class="disp" style="font-size:1.45rem;font-weight:620" data-count="${Math.round(r.career)}" data-fmt="pct">${Fmt.pct(r.career)}</div><div class="tiny faint">${esc(t('of_way'))}</div></div></div></div>
          <div class="stack-sm grow">
            <div class="disp" style="font-size:1.25rem;font-weight:600">${esc(t('ret_at',ret.age))}</div>
            <div class="small">${esc(t('ret_on'))} <b style="color:var(--amber-text)">${esc(Fmt.date(ret.date))}</b></div>
            <div class="tiny faint">${esc(Fmt.wd(D.dow(ret.date)))} · ${esc(r.retired?t('eligible'):Fmt.rel(r.daysToRetire))}</div>
          </div>
        </div>
        <div class="timeline" role="img" aria-label="${esc(t('timeline'))}"><div class="fill" style="width:${tl.toFixed(2)}%"></div><div class="mark" style="${side}:${tl.toFixed(2)}%"></div><span class="tl" style="${side}:0">${D.toG(r.birth).y}</span><span class="tl" style="${side==='left'?'right':'left'}:0">${D.toG(ret.date).y}</span></div>
        ${r.retired?`<div class="callout">${ic('checkc')}<span>${esc(t('ret_past',Fmt.date(ret.date)))}</span></div>`:`<div><div class="eyebrow">${esc(t('ret_in'))}</div><div class="cd"><div><b>${Fmt.n(r.toRetire.years)}</b><span>${esc(t('u_y'))}</span></div><div><b>${Fmt.n(r.toRetire.months)}</b><span>${esc(t('u_m'))}</span></div><div><b>${Fmt.n(r.toRetire.days)}</b><span>${esc(t('u_d'))}</span></div></div></div>`}
        <div class="list">
          ${li(t('turn60'),esc(Fmt.date(ret.turn60)))}
          ${li(t('rule'),esc(ret.step?t('rule_step',Fmt.date(ret.step.rd),ret.step.age):t('rule_base',Fmt.date(LXID.STEPS[0].rd))))}
          ${ret.date!==ret.exact?li(t('exact_bday'),esc(Fmt.date(ret.exact)),esc(t('round_'+LXID.settings.retireRound))):''}
        </div>
        ${ret.differs?`<div class="callout warn">${ic('info')}<span>${esc(t('alt_reading',t('mode_'+(ret.mode==='cohort'?'inforce':'cohort')),ret.altAge,Fmt.date(ret.altDate)))} <button type="button" class="btn btn-ghost btn-sm" data-act="mode" style="padding:.1rem .4rem">${esc(t('change'))}</button></span></div>`:''}
      </section>
    </div>
    <section class="card pad stack-sm">
      <div class="between"><h3 class="card-title">${ic('shield')}${esc(t('checks_t',r.passed,r.total))}</h3>
        <div class="row-wrap noprint">
          <button type="button" class="btn btn-ghost btn-sm" data-act="share">${ic('link')}${esc(t('share'))}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-act="print">${ic('print')}${esc(t('print'))}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-act="summary">${ic('copy')}${esc(t('copy_summary'))}</button>
          <button type="button" class="btn btn-soft btn-sm" data-act="ics" title="${esc(t('ics_hint'))}">${ic('calplus')}${esc(t('add_cal'))}</button>
        </div>
      </div>
      ${checksHtml(r)}
      <p class="tiny faint" style="margin:.4rem 0 0">${esc(t('disclaimer'))}</p>
    </section>
    ${traceHtml(r)}`;
  }
  function summary(r){
    const g=LXID.govName(r.govCode,I18N.lang)||t('unknown');
    return [t('c_id')+': '+r.id,t('birth')+': '+D.iso(r.birth)+' ('+Fmt.wd(r.weekday)+')',t('age')+': '+Fmt.ymd(r.age),t('c_gender')+': '+t(r.gender==='M'?'male':'female'),t('gov_birth')+': '+g+' ('+r.govCode+')',t('c_retage')+': '+r.ret.age,t('c_retdate')+': '+D.iso(r.ret.date),t('hijri')+': '+Fmt.hijri(r.birth)].join('\n');
  }
  function bind(box,r){
    box.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>copyText(b.dataset.copy,b));
    box.querySelectorAll('[data-sug]').forEach(b=>b.onclick=()=>{const i=$('#id-input');i.value=b.dataset.sug;inspect(b.dataset.sug);toast(t('t_fixed'));});
    box.querySelectorAll('.tr[data-seg]').forEach(tr=>{
      const on=()=>tr.dataset.seg.split(' ').forEach(s=>box.querySelectorAll(s==='all'?'.sg':'.sg[data-seg="'+s+'"]').forEach(x=>x.classList.add('hl')));
      const off=()=>box.querySelectorAll('.sg.hl').forEach(x=>x.classList.remove('hl'));
      tr.addEventListener('mouseenter',on);tr.addEventListener('mouseleave',off);
    });
    const act=k=>box.querySelector('[data-act="'+k+'"]');
    if(!r.valid)return;
    act('print').onclick=()=>print();
    act('summary').onclick=e=>copyText(summary(r),e.currentTarget,t('t_summary'));
    act('share').onclick=e=>copyText(location.href.split('#')[0]+'#/id/'+r.id,e.currentTarget,t('t_link'));
    act('ics').onclick=()=>{
      const ev=[{rd:r.nextBirthday.rd,title:t('ics_bday'),yearly:true}];
      if(!r.retired)ev.push({rd:r.ret.date,title:t('ics_ret',r.ret.age),desc:t('law'),alarm:30});
      download(LXHolidays.ics(ev,t('brand')),'raqam-'+r.id.slice(-4)+'.ics','text/calendar');toast(t('t_ics'));
    };
    const m=act('mode');if(m)m.onclick=()=>App.openSettings('retire');
  }

  let batch={rows:[],filter:'all',q:'',sort:null,page:0,cols:null,inject:false,scope:RowScope.make()};
  const charts={};
  const abort={v:false};
  function busyBtn(btn,on,label){
    if(on){btn.classList.add('busy');btn.disabled=false;btn.style.setProperty('--p',0);btn.innerHTML=ic('x')+'<span>'+esc(t('cancel'))+'</span><span class="num bpct">0%</span>';}
    else{btn.classList.remove('busy');btn.style.removeProperty('--p');btn.innerHTML=label;}
  }
  function prog(btn,p){if(!btn)return;btn.style.setProperty('--p',p);const s=btn.querySelector('.bpct');if(s)s.textContent=Math.round(p*100)+'%';}
  const scopeLbl=(s,rows)=>RowScope.active(s)?t('sc_of',Fmt.n(RowScope.apply(s,rows).length),Fmt.n(rows.length)):t('sc_all');
  const scopeBtn=(id,s,rows)=>`<button type="button" class="btn btn-line btn-sm${RowScope.active(s)?' scoped':''}" id="${id}" aria-haspopup="menu">${ic('filter')}<span>${esc(t('rows_btn'))}</span><span class="bcount num">${esc(scopeLbl(s,rows))}</span></button>`;
  const colsBtn=(id,set)=>`<button type="button" class="btn btn-line btn-sm" id="${id}" aria-haspopup="menu">${ic('cols')}<span>${esc(t('columns'))}</span><span class="bcount num">${Fmt.n(set.size)}</span></button>`;
  function bindCharts(box){box.querySelectorAll('[data-png]').forEach(b=>b.onclick=()=>{const s=charts[b.dataset.png];if(s)ChartPNG.save(s,'raqam-'+b.dataset.png+'-'+LXDate.iso(LXDate.today()));});}
  const PAGE=100;
  function batchView(el){
    batch.cols=batch.cols||new Set(Store.get('batchCols',IDCols.C.filter(c=>c.def).map(c=>c.k)));
    batch.inject=Store.get('inject',false);
    el.innerHTML=`
      <div class="card pad stack noprint">
        <div class="between"><label class="card-title" for="b-input">${ic('rows')}${esc(t('b_title'))}</label><span class="chip" id="b-count"></span></div>
        <textarea id="b-input" class="field" rows="7" spellcheck="false" placeholder="29805121401234&#10;30101011509876&#10;27510202100001"></textarea>
        <div class="between">
          <div class="row-wrap">
            <button type="button" class="btn btn-line btn-sm" id="b-paste">${ic('paste')}${esc(t('paste'))}</button>
            <button type="button" class="btn btn-ghost btn-sm" id="b-sample">${ic('spark')}${esc(t('sample'))}</button>
            <button type="button" class="btn btn-ghost btn-sm" id="b-clear">${ic('trash')}${esc(t('clear'))}</button>
          </div>
          <div class="row-wrap">${sw('b-nulls',t('b_skip_blank'),Store.get('bNulls',false))}${sw('b-extract',t('b_extract'),Store.get('bExtract',false),t('b_extract_h'))}</div>
        </div>
        <button type="button" class="btn btn-primary btn-block" id="b-run">${ic('play')}${esc(t('b_run'))}</button>
      </div>
      <div id="b-result" style="margin-top:1rem"></div>`;
    const ta=$('#b-input',el);
    ta.value=Store.get('batch','');
    const cnt=()=>{const n=$('#b-extract').checked?LXID.tokens(ta.value).length:LXID.splitLines(ta.value).length;$('#b-count').textContent=t('b_detected',n);};
    cnt();
    ta.addEventListener('input',debounce(()=>{cnt();Store.set('batch',ta.value);},200));
    ta.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();run();}});
    $('#b-paste',el).onclick=async()=>{const s=await readClipboard();if(s==null)return;if(!s.trim()){toast(t('t_clip_empty'),'info');return;}loadBatch(s,true);};
    $('#b-sample',el).onclick=()=>{loadBatch(LXID.SAMPLES.concat(['','12345','29813451401234',LXID.SAMPLES[0]]).join('\n'),true);};
    $('#b-clear',el).onclick=async()=>{
      const prev=ta.value,rows=batch.rows;if(!prev&&!rows.length)return;
      if(rows.length>20&&!await Kit.confirm({title:t('cf_batch_t'),body:t('cf_batch_b',rows.length),ok:t('clear'),danger:true}))return;
      ta.value='';batch.rows=[];cnt();Store.set('batch','');renderBatch();
      toast(t('t_cleared'),'info',{action:t('undo'),onAction:()=>{ta.value=prev;batch.rows=rows;cnt();Store.set('batch',prev);renderBatch();}});
    };
    $('#b-nulls',el).onchange=e=>{Store.set('bNulls',e.target.checked);if(batch.rows.length)run();};
    $('#b-extract',el).onchange=e=>{Store.set('bExtract',e.target.checked);cnt();};
    $('#b-run',el).onclick=()=>{const b=$('#b-run');if(b.classList.contains('busy')){abort.v=true;Jobs.cancel();return;}run();};
    renderBatch();
  }
  function loadBatch(text,go){const ta=$('#b-input');if(!ta)return;ta.value=text;ta.dispatchEvent(new Event('input'));Store.set('batch',text);if(go)setTimeout(run,10);}
  function chunk(items,fn,onProg){
    return new Promise(res=>{
      const out=new Array(items.length);let i=0;
      const step=()=>{if(abort.v){res(null);return;}const st=performance.now();while(i<items.length&&performance.now()-st<14){out[i]=fn(items[i],i);i++;}onProg&&onProg(i/items.length);if(i<items.length)setTimeout(step,0);else res(out);};
      step();
    });
  }
  const WORKER_MIN=1500;
  async function analyse(items,opts){
    abort.v=false;
    const today=D.today(),pick=x=>x;
    if(Jobs.ok()&&items.length>=WORKER_MIN){
      try{return(await Jobs.run(opts.msg,{onProg:opts.onProg})).rows;}
      catch(e){if(e.message==='cancelled'||abort.v)return null;}
    }
    let src=items;
    if(opts.skipNull)src=items.filter(s=>!LXID.parse(pick(s)).isNull);
    const rows=await chunk(src,s=>LXID.parse(pick(s),{today}),opts.onProg);
    return rows&&LXID.finalize(rows);
  }
  async function run(){
    const ta=$('#b-input');if(!ta)return;
    let lines=$('#b-extract').checked?LXID.tokens(ta.value):LXID.splitLines(ta.value);
    if(!lines.length){toast(t('t_need_ids'),'info');return;}
    const btn=$('#b-run'),label=ic('play')+esc(t('b_run'));
    busyBtn(btn,true);
    const skip=$('#b-nulls').checked;
    const rows=await analyse(lines,{skipNull:skip,msg:{type:'lines',lines,skipNull:skip},onProg:p=>prog(btn,p)});
    busyBtn(btn,false,label);
    if(!rows){toast(t('t_cancelled'),'info');return;}
    batch.rows=rows;batch.page=0;batch.filter='all';batch.q='';batch.sort=null;batch.scope=RowScope.make();
    renderBatch();
    toast(t('t_analyzed',rows.length));
    $('#b-result').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function insights(rows,pfx){
    pfx=pfx||'b';
    const v=rows.filter(r=>r.valid);if(v.length<2)return'';
    const m=v.filter(r=>r.gender==='M').length,f=v.length-m,pm=m/v.length*100;
    const gc={};v.forEach(r=>gc[r.govCode]=(gc[r.govCode]||0)+1);
    const top=Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,5),mx=top[0][1];
    const bands=[['<18',0,17],['18–29',18,29],['30–44',30,44],['45–59',45,59],['60+',60,999]].map(([l,a,b])=>[l,v.filter(r=>r.age.years>=a&&r.age.years<=b).length]);
    const mb=Math.max(1,...bands.map(x=>x[1]));
    const y0=D.toG(D.today()).y,yrs=Array.from({length:11},(_,i)=>y0+i),hy=yrs.map(y=>v.filter(r=>D.toG(r.ret.date).y===y).length),mh=Math.max(1,...hy);
    const ages=v.map(r=>r.age.years).sort((a,b)=>a-b),med=ages[Math.floor(ages.length/2)];
    const avg=v.reduce((s,r)=>s+r.age.totalDays/365.2425,0)/v.length;
    const sub=t('i_based',Fmt.n(v.length));
    charts[pfx+'-gender']={title:t('i_gender'),sub,items:[{l:t('male'),v:m,c:'--azure'},{l:t('female'),v:f,c:'--rose'}]};
    charts[pfx+'-gov']={title:t('i_gov'),sub,items:Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([c,n])=>({l:LXID.govName(c,I18N.lang)||c,v:n}))};
    charts[pfx+'-age']={title:t('i_age'),sub,items:bands.map(([l,n])=>({l,v:n}))};
    charts[pfx+'-ret']={kind:'hist',title:t('i_ret_by_year'),sub,items:yrs.map((y,i)=>({l:String(y),v:hy[i]}))};
    const png=k=>`<button type="button" class="btn btn-ghost btn-sm chart-png noprint" data-png="${pfx}-${k}" title="${esc(t('png_h'))}">${ic('image')}<span>PNG</span></button>`;
    const head=(k,lbl)=>`<div class="chart-head"><span class="eyebrow" style="margin:0">${esc(lbl)}</span>${png(k)}</div>`;
    const bar=(l,n,mx2,cls)=>`<div class="bar"><span class="bl" title="${esc(l)}">${esc(l)}</span><span class="bt"><span class="bf ${cls||''}" style="width:${Math.max(2,n/mx2*100)}%"></span></span><span class="bv">${Fmt.n(n)}</span></div>`;
    const due12=v.filter(r=>r.daysToRetire>0&&r.daysToRetire<=365).length,due5=v.filter(r=>r.daysToRetire>0&&r.daysToRetire<=1826).length,elig=v.filter(r=>r.retired).length;
    return `<div class="split even" style="margin-top:.2rem">
      <div class="well stack-sm">${head('gender',t('i_gender'))}<div class="split-bar"><span class="m" style="width:${pm}%"></span><span class="f" style="width:${100-pm}%"></span></div>
        <div class="bars">${bar(t('male'),m,v.length,'m')}${bar(t('female'),f,v.length,'f')}</div>
        <div class="list">${li(t('i_avg'),Fmt.n(avg,1))}${li(t('i_median'),Fmt.n(med))}${li(t('i_range'),Fmt.n(ages[0])+' – '+Fmt.n(ages[ages.length-1]))}</div></div>
      <div class="well stack-sm">${head('gov',t('i_gov'))}<div class="bars">${top.map(([c,n])=>bar(LXID.govName(c,I18N.lang)||c,n,mx)).join('')}</div>
        <div style="margin-top:.5rem">${head('age',t('i_age'))}</div><div class="bars">${bands.map(([l,n])=>bar(l,n,mb)).join('')}</div></div>
      <div class="well stack-sm">${head('ret',t('i_ret_by_year'))}<div class="hist">${hy.map((n,i)=>`<div style="height:${n?Math.max(6,n/mh*100):2}%;animation-delay:${i*30}ms" title="${yrs[i]}: ${n}"></div>`).join('')}</div><div class="hist-axis"><span>${yrs[0]}</span><span>${yrs[5]}</span><span>${yrs[10]}</span></div></div>
      <div class="well stack-sm"><div class="eyebrow">${esc(t('i_ret'))}</div><div class="list">${li(t('i_due12'),'<span style="color:var(--amber-text)">'+Fmt.n(due12)+'</span>')}${li(t('i_due5'),Fmt.n(due5))}${li(t('i_elig'),'<span style="color:var(--mint)">'+Fmt.n(elig)+'</span>')}${li(t('i_dupes'),Fmt.n(v.filter(r=>r.flags.includes('dup')).length))}${li(t('i_twins'),Fmt.n(v.filter(r=>r.flags.includes('twin')).length))}${li(t('i_unknown_gov'),Fmt.n(v.filter(r=>r.flags.includes('gov')).length))}</div></div>
    </div>`;
  }
  function filtered(){
    let rows=RowScope.apply(batch.scope,batch.rows);
    if(batch.filter==='valid')rows=rows.filter(r=>r.valid);
    else if(batch.filter==='error')rows=rows.filter(r=>!r.valid&&!r.isNull);
    else if(batch.filter==='null')rows=rows.filter(r=>r.isNull);
    else if(batch.filter==='flag')rows=rows.filter(r=>r.valid&&r.flags.length);
    if(batch.q){const q=batch.q.toLowerCase();rows=rows.filter(r=>(r.raw+' '+(r.id||'')+' '+(r.valid?(LXID.govName(r.govCode,'en')+' '+LXID.govName(r.govCode,'ar')+' '+D.iso(r.birth)+' '+D.iso(r.ret.date)):errText(r.error))).toLowerCase().includes(q));}
    if(batch.sort){
      const c=IDCols.MAP[batch.sort.k],dir=batch.sort.dir;
      const val=r=>{if(!r.valid)return null;if(batch.sort.k==='birth')return r.birth;if(batch.sort.k==='retireDate')return r.ret.date;if(batch.sort.k==='age'||batch.sort.k==='days')return r.age.totalDays;return c.v(r);};
      rows=rows.slice().sort((a,b)=>{const x=val(a),y=val(b);if(x==null&&y==null)return a.line-b.line;if(x==null)return 1;if(y==null)return-1;return(x<y?-1:x>y?1:0)*dir;});
    }
    return rows;
  }
  function tableHtml(rows,keys,start,opts){
    opts=opts||{};
    const vis=rows.slice(start,start+PAGE);
    const head='<tr>'+(opts.copy?'<th></th>':'')+keys.map(k=>`<th${opts.sortable?` data-sort="${k}" style="cursor:pointer"`:''}>${esc(t(IDCols.MAP[k].l))}${batch.sort&&batch.sort.k===k&&opts.sortable?(batch.sort.dir>0?' ↑':' ↓'):''}</th>`).join('')+'</tr>';
    const body=vis.map((r,i)=>{
      const cells=keys.map(k=>{
        const c=IDCols.MAP[k];
        if(k==='status')return`<td><span class="row" style="gap:.4rem"><span class="dot ${r.valid?'ok':r.isNull?'warn':'bad'}"></span>${esc(c.v(r))}</span></td>`;
        if(k==='error')return r.valid?'<td></td>':`<td class="${r.isNull?'nul':'err'}">${esc(c.v(r))}</td>`;
        if(k==='gender'&&r.valid)return`<td>${genderBadge(r.gender)}</td>`;
        if(k==='id')return`<td class="mono" style="font-weight:600">${esc(c.v(r)||'—')}</td>`;
        if(k==='flags'&&r.valid)return`<td>${r.flags.map(f=>`<span class="chip ${['fake','gov','dup','checksum'].includes(f)?'scarlet':'sun'}" style="padding:.12rem .5rem">${esc(t('flag_'+f))}</span>`).join(' ')}</td>`;
        const v=c.v(r);
        return`<td class="${['birth','retireDate','govCode','serial','check','hijri','days'].includes(k)?'mono':''}">${esc(v===''?'':typeof v==='number'?Fmt.n(v):v)}</td>`;
      }).join('');
      return'<tr>'+(opts.copy?`<td><button type="button" class="iconbtn sm rc" data-rc="${start+i}" aria-label="${esc(t('copy_row'))}">${ic('copy')}</button></td>`:'')+cells+'</tr>';
    }).join('');
    return`<table class="t"><thead>${head}</thead><tbody>${body||`<tr><td colspan="${keys.length+1}" style="text-align:center;padding:2.5rem" class="faint">${esc(t('no_rows'))}</td></tr>`}</tbody></table>`;
  }
  function renderBatch(){
    const box=$('#b-result');if(!box)return;
    const R=batch.rows;
    if(!R.length){paint(box,`<div class="card pad">${emptyState('chart',esc(t('b_empty')))}</div>`);return;}
    const nv=R.filter(r=>r.valid).length,nn=R.filter(r=>r.isNull).length,ne=R.length-nv-nn,nf=R.filter(r=>r.valid&&r.flags.length).length;
    const keys=IDCols.C.map(c=>c.k).filter(k=>batch.cols.has(k));
    box._html=null;
    paint(box,`<section class="card pad stack">
      <div class="between"><div><h3 class="card-title">${ic('chart')}${esc(t('results'))}</h3><p class="card-sub">${esc(t('b_summary',R.length,nv,ne,nn))}</p></div>
        <div class="row-wrap noprint">
          <button type="button" class="btn btn-line btn-sm" id="b-copy">${ic('copy')}${esc(t('copy'))}</button>
          <button type="button" class="btn btn-soft btn-sm" id="b-xlsx">${ic('down')}Excel</button>
          <button type="button" class="btn btn-ghost btn-sm" id="b-csv">${ic('down')}CSV</button>
        </div></div>
      <div class="row-wrap noprint tool-row">${scopeBtn('b-scope',batch.scope,R)}${colsBtn('b-cols',batch.cols)}</div>
      <div class="grid-auto">${stat(t('k_total'),Fmt.n(R.length),{icon:'rows'})}${stat(t('k_valid'),Fmt.n(nv),{tone:'mint',icon:'checkc'})}${stat(t('k_err'),Fmt.n(ne),{tone:ne?'scarlet':'',icon:'alert'})}${nn?stat(t('k_null'),Fmt.n(nn),{tone:'sun',icon:'minus'}):''}${stat(t('k_flag'),Fmt.n(nf),{icon:'warn'})}</div>
      <div id="b-ins">${insights(RowScope.apply(batch.scope,R))}</div>
      <div class="between noprint">
        <div class="scrollx">${seg('bf',[['all',t('f_all')],['valid',t('f_valid')],['error',t('f_error')],['flag',t('f_flag')]].concat(nn?[['null',t('f_null')]]:[]),batch.filter)}</div>
        <div class="row grow" style="max-width:22rem">${sw('b-inject',t('inject'),batch.inject,t('inject_h'))}</div>
        <input type="search" class="field field-sm grow" id="b-q" placeholder="${esc(t('search_rows'))}" value="${esc(batch.q)}" style="max-width:18rem">
      </div>
      <div id="b-table"></div>
    </section>`);
    bindSeg(box,'bf',v=>{batch.filter=v;batch.page=0;drawTable();});
    $('#b-q').addEventListener('input',debounce(e=>{batch.q=e.target.value;batch.page=0;drawTable();},150));
    $('#b-inject').onchange=e=>{batch.inject=e.target.checked;Store.set('inject',batch.inject);};
    $('#b-copy').onclick=e=>{const rows=filtered(),k=keys;if(!rows.length){toast(t('t_no_rows'),'info');return;}copyText(toTSV([k.map(x=>t(IDCols.MAP[x].l))].concat(rows.map(r=>k.map(x=>IDCols.MAP[x].v(r))))),e.currentTarget,t('t_rows_copied',rows.length));};
    $('#b-csv').onclick=()=>exportRows(filtered(),keys,'csv','raqam-batch');
    $('#b-xlsx').onclick=()=>exportRows(filtered(),keys,'xlsx','raqam-batch',batch.inject);
    $('#b-cols').onclick=e=>colsMenu(e.currentTarget,batch.cols,()=>{Store.set('batchCols',[...batch.cols]);$('#b-cols .bcount').textContent=Fmt.n(batch.cols.size);drawTable();});
    $('#b-scope').onclick=e=>RowScope.menu(e.currentTarget,batch.scope,R,debounce(()=>{const b=$('#b-scope');b.classList.toggle('scoped',RowScope.active(batch.scope));b.querySelector('.bcount').textContent=scopeLbl(batch.scope,R);batch.page=0;paint($('#b-ins'),insights(RowScope.apply(batch.scope,R)));bindCharts($('#b-ins'));drawTable();},60));
    bindCharts(box);
    drawTable();
  }
  function drawTable(){
    const box=$('#b-table');if(!box)return;
    const rows=filtered(),keys=IDCols.C.map(c=>c.k).filter(k=>batch.cols.has(k));
    const pages=Math.max(1,Math.ceil(rows.length/PAGE));batch.page=Math.min(batch.page,pages-1);
    const tb=box.querySelector('.tablebox'),st=tb?tb.scrollLeft:0;
    box.innerHTML=`<div class="tablebox">${tableHtml(rows,keys,batch.page*PAGE,{copy:true,sortable:true})}</div>
      <div class="pager" style="margin-top:.6rem"><span>${esc(t('showing',rows.length?batch.page*PAGE+1:0,Math.min(rows.length,(batch.page+1)*PAGE),rows.length))}</span>
      ${pages>1?`<div class="row"><button type="button" class="btn btn-ghost btn-sm" data-pg="-1"${batch.page===0?' disabled':''}>${ic(document.dir==='rtl'?'chevr':'chevl')}</button><span class="mono">${batch.page+1}/${pages}</span><button type="button" class="btn btn-ghost btn-sm" data-pg="1"${batch.page>=pages-1?' disabled':''}>${ic(document.dir==='rtl'?'chevl':'chevr')}</button></div>`:''}</div>`;
    if(st)box.querySelector('.tablebox').scrollLeft=st;
    box.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>{batch.page+=+b.dataset.pg;drawTable();box.querySelector('.tablebox').scrollTop=0;});
    box.querySelectorAll('[data-sort]').forEach(th=>th.onclick=()=>{const k=th.dataset.sort;batch.sort=batch.sort&&batch.sort.k===k?(batch.sort.dir>0?{k,dir:-1}:null):{k,dir:1};drawTable();});
    box.querySelectorAll('[data-rc]').forEach(b=>b.onclick=()=>{const r=rows[+b.dataset.rc];copyText(keys.map(k=>IDCols.MAP[k].v(r)).join('\t'),b,t('t_row'));});
  }
  function colsMenu(anchor,set,onChange){
    const all=IDCols.C;
    const html=`<div class="mh"><span>${esc(t('columns'))}</span><span><button type="button" class="btn btn-ghost btn-sm" data-all style="padding:.15rem .5rem">${esc(t('all'))}</button></span></div>`+all.map(c=>`<label class="mi"><input type="checkbox" data-k="${c.k}"${set.has(c.k)?' checked':''}>${esc(t(c.l))}</label>`).join('');
    Menu.open(anchor,html,m=>{
      m.querySelectorAll('[data-k]').forEach(i=>i.onchange=()=>{i.checked?set.add(i.dataset.k):set.delete(i.dataset.k);onChange();});
      m.querySelector('[data-all]').onclick=()=>{const full=set.size===all.length;all.forEach(c=>full?set.delete(c.k):set.add(c.k));m.querySelectorAll('[data-k]').forEach(i=>i.checked=!full);onChange();};
    });
  }
  async function exportRows(rows,keys,kind,name,inject,base){
    if(!rows.length){toast(t('t_no_rows'),'info');return;}
    const stamp=D.iso(D.today());
    if(kind==='csv'){
      const head=(base?base.head:[]).concat(keys.map(k=>t(IDCols.MAP[k].l)));
      const body=rows.map((r,i)=>(base?base.rows[r.line-1]||[]:[]).concat(keys.map(k=>IDCols.MAP[k].v(r))));
      download(toCSV([head].concat(body)),name+'-'+stamp+'.csv','text/csv;charset=utf-8');toast(t('t_downloaded',rows.length));return;
    }
    let X;try{X=await XL.need();}catch(e){return;}
    const head=(base?base.head:[]).concat(keys.map(k=>t(IDCols.MAP[k].l)));
    const aoa=[head];
    rows.forEach((r,i)=>aoa.push((base?base.rows[r.line-1]||[]:[]).concat(keys.map(k=>{const c=IDCols.MAP[k];if(c.xl&&r.valid)return c.xl(r);return c.v(r);}))));
    const ws=X.utils.aoa_to_sheet(aoa);
    const off=base?base.head.length:0;
    const idCol=base&&base.idCol!=null?base.idCol:keys.indexOf('id')+off;
    rows.forEach((r,i)=>{
      keys.forEach((k,j)=>{
        const c=IDCols.MAP[k],ref=X.utils.encode_cell({r:i+1,c:j+off});
        if(c.z&&ws[ref]&&r.valid)ws[ref].z=c.z;
        if(inject&&r.valid&&c.f&&idCol>=0){
          const idRef=X.utils.encode_cell({r:i+1,c:idCol});
          const f=LXID.F(idRef,{lang:I18N.lang,male:t('male'),female:t('female'),unknown:t('unknown')})[c.f].replace(/^=/,'');
          ws[ref]=Object.assign(ws[ref]||{},{f});
        }
      });
      if(idCol>=0){const ref=X.utils.encode_cell({r:i+1,c:idCol});if(ws[ref]&&r.valid){ws[ref].t='s';ws[ref].v=r.id;delete ws[ref].w;}}
    });
    ws['!cols']=head.map((h,i)=>({wch:Math.min(40,Math.max(10,String(h).length+2))}));
    ws['!autofilter']={ref:X.utils.encode_range({s:{r:0,c:0},e:{r:rows.length,c:head.length-1}})};
    const wb=X.utils.book_new();wb.Workbook={CalcPr:{fullCalcOnLoad:true},Views:[{RTL:I18N.lang==='ar'}]};
    X.utils.book_append_sheet(wb,ws,'Raqam');
    X.writeFile(wb,name+'-'+stamp+'.xlsx');
    toast(t('t_downloaded',rows.length));
  }

  let up={wb:null,sheets:[],viaWorker:false,name:'',sheet:'',hdr:1,data:[],head:[],idCol:-1,res:[],cols:null,inject:false,scope:RowScope.make()};
  function heads(h,width){const seen={};return Array.from({length:width},(_,i)=>{let n=(h[i]||'').trim()||t('u_col_n',i+1);const b=n;let k=2;while(seen[n.toLowerCase()]){n=b+' ('+k+')';k++;}seen[n.toLowerCase()]=1;return n;});}
  function fileBusy(on,label,p){
    const d=$('#u-drop');if(!d)return;
    d.classList.toggle('busy',on);
    let s=d.querySelector('.drop-prog');
    if(on){if(!s){s=document.createElement('span');s.className='drop-prog';s.innerHTML='<span class="progress"><i></i></span><span class="tiny faint dp-l"></span><button type="button" class="btn btn-ghost btn-sm" data-cx>'+esc(t('cancel'))+'</button>';d.appendChild(s);s.querySelector('[data-cx]').onclick=e=>{e.preventDefault();e.stopPropagation();abort.v=true;Jobs.cancel();};}s.querySelector('.dp-l').textContent=label||'';s.querySelector('i').style.width=((p||0)*100)+'%';s.querySelector('.progress').classList.toggle('indet',p==null);}
    else if(s)s.remove();
  }
  function upload(el){
    up.cols=up.cols||new Set(Store.get('upCols',['status','birth','age','gender','gov','retireAge','retireDate','flags','error']));
    el.innerHTML=`
      <label class="drop noprint" id="u-drop" tabindex="0" for="u-file">
        <input type="file" id="u-file" accept=".xlsx,.xls,.xlsm,.csv,.txt,.ods" class="hide">
        <span class="bubble">${ic('cloud')}</span>
        <span class="card-title" style="justify-content:center">${esc(t('u_drop'))}</span>
        <span class="small muted">${esc(t('u_types'))}</span>
        <span class="tiny faint">${esc(t('u_private'))}</span>
      </label>
      <div id="u-map" class="card pad stack hide" style="margin-top:1rem"></div>
      <div id="u-res" class="card pad stack hide" style="margin-top:1rem"></div>`;
    const drop=$('#u-drop',el),fi=$('#u-file',el);
    fi.onchange=e=>{const f=e.target.files[0];if(f)readFile(f);fi.value='';};
    drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fi.click();}});
    ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over');}));
    ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over');}));
    drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)readFile(f);});
    if(up.sheets.length){renderMap();if(up.res.length)renderUpRes();}
    XL.load().catch(()=>{});
  }
  async function readFile(f){
    if(f.size>40*1024*1024){toast(t('t_too_big'),'bad');return;}
    if(Jobs.busy())return;
    abort.v=false;
    const raw=/\.csv$|\.txt$/i.test(f.name);
    fileBusy(true,t('t_reading',f.name),null);
    try{
      const buf=await f.arrayBuffer();
      up.name=f.name;up.hdr=1;up.res=[];up.scope=RowScope.make();
      if(Jobs.ok()){
        try{
          const m=await Jobs.run({type:'file',buf,raw,xlsxUrl:XL.SRC},{transfer:[buf],until:['book']});
          up.viaWorker=true;up.wb=null;up.sheets=m.sheets;up.sheet=m.sheets[0];
          await loadSheet();
        }catch(e){if(abort.v||e.message==='cancelled'){fileBusy(false);toast(t('t_cancelled'),'info');return;}up.viaWorker=false;}
      }
      if(!up.viaWorker){
        let X;try{X=await XL.need();}catch(e){fileBusy(false);return;}
        const b2=buf.byteLength?buf:await f.arrayBuffer();
        up.wb=X.read(b2,{type:'array',cellDates:false,raw});up.sheets=up.wb.SheetNames;up.sheet=up.sheets[0];
        await loadSheet();
      }
      fileBusy(false);renderMap();$('#u-res').classList.add('hide');
    }catch(e){fileBusy(false);toast(t('t_parse_fail'),'bad');}
  }
  function cellStr(v){if(v==null)return'';if(typeof v==='number')return Number.isInteger(v)?v.toFixed(0):String(v);return String(v);}
  async function loadSheet(){
    if(up.viaWorker){
      const m=await Jobs.run({type:'sheet',sheet:up.sheet,hdr:up.hdr},{until:['sheet']});
      up.head=heads(m.head,m.width);up.data=m.data;up.idCol=m.idCol;return;
    }
    const X=window.XLSX,ws=up.wb.Sheets[up.sheet];
    const aoa=X.utils.sheet_to_json(ws,{header:1,raw:true,defval:'',blankrows:false});
    const h=(aoa[up.hdr-1]||[]).map(cellStr);
    const width=Math.max(h.length,...aoa.slice(up.hdr,up.hdr+50).map(r=>r.length),1);
    up.head=heads(h,width);
    up.data=aoa.slice(up.hdr).map(r=>Array.from({length:width},(_,i)=>cellStr(r[i])));
    let best=-1,bs=0;
    for(let c=0;c<width;c++){const s=up.data.slice(0,300).reduce((a,r)=>a+(LXID.normalize(r[c]).digits.length===14?1:0),0)+(/national|id|رقم|قومي|هوية/i.test(up.head[c])?3:0);if(s>bs){bs=s;best=c;}}
    up.idCol=best>=0?best:0;
  }
  function renderMap(){
    const box=$('#u-map');if(!box)return;box.classList.remove('hide');
    const prev=up.data.slice(0,6);
    box.innerHTML=`
      <div class="filecard"><span class="fi">${ic('file')}</span><div class="grow"><div style="font-weight:640;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(up.name)}</div><div class="tiny faint">${esc(t('u_rows',up.data.length,up.head.length))}</div></div><button type="button" class="iconbtn sm" id="u-rm" aria-label="${esc(t('remove'))}">${ic('x')}</button></div>
      <div class="grid-3">
        ${up.sheets.length>1?`<div><label class="label" for="u-sheet">${esc(t('u_sheet'))}</label><select class="field" id="u-sheet">${up.sheets.map(s=>`<option${s===up.sheet?' selected':''}>${esc(s)}</option>`).join('')}</select></div>`:''}
        <div><label class="label" for="u-hdr">${esc(t('u_hdr'))}</label><input class="field" id="u-hdr" type="number" min="1" value="${up.hdr}"></div>
        <div><label class="label" for="u-col">${esc(t('u_idcol'))}</label><select class="field" id="u-col">${up.head.map((h,i)=>`<option value="${i}"${i===up.idCol?' selected':''}>${esc(h)}</option>`).join('')}</select></div>
      </div>
      <div><div class="eyebrow">${esc(t('u_preview'))}</div><div class="tablebox" style="max-height:16rem"><table class="t"><thead><tr>${up.head.map((h,i)=>`<th class="${i===up.idCol?'hl':''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${prev.map(r=>'<tr>'+r.map((v,i)=>`<td class="${i===up.idCol?'hl mono':''}">${esc(v)}</td>`).join('')+'</tr>').join('')}</tbody></table></div></div>
      <div class="between"><div class="row-wrap"><span class="small muted">${esc(t('u_out'))}</span>${colsBtn('u-cols',up.cols)}</div>
      <button type="button" class="btn btn-primary" id="u-go">${ic('bolt')}${esc(t('u_process'))}</button></div>`;
    $('#u-rm').onclick=async()=>{if(up.res.length&&!await Kit.confirm({title:t('cf_file_t'),body:t('cf_file_b',up.name),ok:t('remove'),danger:true}))return;up.wb=null;up.sheets=[];up.data=[];up.res=[];box.classList.add('hide');$('#u-res').classList.add('hide');};
    const reload=async()=>{if(up.viaWorker&&!Jobs.alive()){toast(t('t_reload_file'),'info');return;}try{await loadSheet();up.res=[];$('#u-res').classList.add('hide');renderMap();}catch(e){toast(t('t_parse_fail'),'bad');}};
    const sh=$('#u-sheet');if(sh)sh.onchange=e=>{up.sheet=e.target.value;up.hdr=1;reload();};
    $('#u-hdr').onchange=e=>{up.hdr=Math.max(1,parseInt(e.target.value,10)||1);reload();};
    $('#u-col').onchange=e=>{up.idCol=+e.target.value;renderMap();};
    $('#u-cols').onclick=e=>colsMenu(e.currentTarget,up.cols,()=>{Store.set('upCols',[...up.cols]);$('#u-cols .bcount').textContent=Fmt.n(up.cols.size);});
    $('#u-go').onclick=()=>{const b=$('#u-go');if(b.classList.contains('busy')){abort.v=true;Jobs.cancel();return;}processUp();};
  }
  async function processUp(){
    const btn=$('#u-go'),label=ic('bolt')+esc(t('u_process'));
    busyBtn(btn,true);
    const col=up.data.map(r=>r[up.idCol]);
    const rows=await analyse(col,{msg:{type:'lines',lines:col},onProg:p=>prog(btn,p)});
    busyBtn(btn,false,label);
    if(!rows){toast(t('t_cancelled'),'info');return;}
    up.res=rows;up.scope=RowScope.make();
    renderUpRes();toast(t('t_processed'));
    $('#u-res').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderUpRes(){
    const box=$('#u-res');box.classList.remove('hide');
    const R=up.res,nv=R.filter(r=>r.valid).length,nn=R.filter(r=>r.isNull).length;
    const K=()=>IDCols.C.map(c=>c.k).filter(k=>up.cols.has(k)&&k!=='id');
    up.inject=Store.get('inject',false);
    const S=()=>RowScope.apply(up.scope,R);
    const body=()=>{const r=S();return`${insights(r,'u')}<div class="tablebox">${tableHtml(r,['id'].concat(K()),0)}</div><p class="tiny faint" style="margin:0">${esc(t('u_shown',Math.min(PAGE,r.length),r.length))}</p>`;};
    box.innerHTML=`<div class="between"><div><h3 class="card-title">${ic('file')}${esc(t('u_results'))}</h3><p class="card-sub">${esc(t('b_summary',R.length,nv,R.length-nv-nn,nn))}</p></div>
      <div class="row-wrap">${sw('u-inject',t('inject'),up.inject,t('inject_h'))}<button type="button" class="btn btn-primary btn-sm" id="u-xlsx">${ic('down')}Excel</button><button type="button" class="btn btn-ghost btn-sm" id="u-csv">${ic('down')}CSV</button></div></div>
      <div class="row-wrap tool-row">${scopeBtn('u-scope',up.scope,R)}${colsBtn('u-cols2',up.cols)}</div>
      <div id="u-body" class="stack">${body()}</div>`;
    const ub=$('#u-body');bindCharts(ub);
    const base={head:up.head,rows:up.data,idCol:up.idCol};
    $('#u-inject').onchange=e=>{up.inject=e.target.checked;Store.set('inject',up.inject);};
    const nm=up.name.replace(/\.[^.]+$/,'')+'-raqam';
    $('#u-xlsx').onclick=()=>exportRows(S(),K(),'xlsx',nm,up.inject,base);
    $('#u-csv').onclick=()=>exportRows(S(),K(),'csv',nm,false,base);
    $('#u-cols2').onclick=e=>colsMenu(e.currentTarget,up.cols,debounce(()=>{Store.set('upCols',[...up.cols]);$('#u-cols2 .bcount').textContent=Fmt.n(up.cols.size);const c1=$('#u-cols .bcount');if(c1)c1.textContent=Fmt.n(up.cols.size);paint(ub,body());bindCharts(ub);},120));
    $('#u-scope').onclick=e=>RowScope.menu(e.currentTarget,up.scope,R,debounce(()=>{const b=$('#u-scope');b.classList.toggle('scoped',RowScope.active(up.scope));b.querySelector('.bcount').textContent=scopeLbl(up.scope,R);paint(ub,body());bindCharts(ub);},80));
  }
  function builder(el){
    const st=Store.get('bld',{gov:'01',gender:'M',serial:'',sex:''});
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <p class="card-sub" style="margin:0">${esc(t('bld_desc'))}</p>
        <div><label class="label" for="df-bldB">${esc(t('birth'))}</label><div id="h-bld"></div></div>
        <div><label class="label" for="bld-gov">${esc(t('gov_birth'))}</label><select class="field" id="bld-gov">${Object.entries(LXID.GOV).map(([k,v])=>`<option value="${k}"${k===st.gov?' selected':''}>${k} · ${esc(I18N.lang==='ar'?v[1]:v[0])}</option>`).join('')}</select></div>
        ${seg('bld-g',[['M',t('male'),'male'],['F',t('female'),'female']],st.gender)}
        <div class="grid-2"><div><label class="label" for="bld-ser">${esc(t('bld_serial'))}</label><input class="field mono" id="bld-ser" inputmode="numeric" maxlength="3" placeholder="${esc(t('random'))}" value="${esc(st.serial)}"></div><div><label class="label" for="bld-n">${esc(t('bld_count'))}</label><input class="field num" id="bld-n" type="number" min="1" max="1000" value="${Store.get('bldN',1)}"></div></div>
        <div class="callout warn">${ic('shield')}<span>${esc(t('bld_warn'))}</span></div>
      </section>
      <section class="card pad stack" id="bld-out" aria-live="polite"></section></div>`;
    let g=st.gender;
    const b=DateField.create($('#h-bld'),{id:'df-bldB',onChange:make});
    b.set(Store.get('bldB',D.fromG(1995,6,15)),true);
    bindSeg(el,'bld-g',v=>{g=v;make();});
    ['bld-gov','bld-ser','bld-n'].forEach(i=>$('#'+i).addEventListener('input',make));
    function make(){
      const gov=$('#bld-gov').value,ser=$('#bld-ser').value.replace(/\D/g,''),n=clamp(parseInt($('#bld-n').value,10)||1,1,1000),bd=b.get();
      Store.set('bld',{gov,gender:g,serial:ser});Store.set('bldN',n);Store.set('bldB',bd);
      const out=$('#bld-out');
      if(bd==null){paint(out,emptyState('build',esc(t('pick_birth'))));return;}
      const gy=D.toG(bd).y;if(gy<1900||gy>2099||bd>D.today()){paint(out,emptyState('alert',esc(t('bld_range')),true));return;}
      const set=new Set();let guard=0;
      while(set.size<n&&guard<n*20){const id=LXID.compose({birth:bd,gov,gender:g,serial:ser&&set.size===0?ser:null});if(id)set.add(id);guard++;}
      const ids=[...set];
      paint(out,`<div class="hero"><div class="hero-act"><button type="button" class="iconbtn sm" data-cp aria-label="${esc(t('copy'))}">${ic('copy')}</button><button type="button" class="iconbtn sm" data-re aria-label="${esc(t('regen'))}">${ic('repeat')}</button></div><div class="k">${esc(t('bld_result'))}</div><div class="builder-out" style="margin-top:.35rem">${ids[0]}</div><div class="s">${esc(Fmt.date(bd))} · ${esc(LXID.govName(gov,I18N.lang))} · ${esc(t(g==='M'?'male':'female'))}</div></div>
        ${ids.length>1?`<div class="tablebox" style="max-height:18rem"><table class="t"><tbody>${ids.map((x,i)=>`<tr><td class="faint mono">${i+1}</td><td class="mono" style="font-weight:600">${x}</td></tr>`).join('')}</tbody></table></div>`:''}
        <div class="row-wrap"><button type="button" class="btn btn-primary btn-sm" data-open>${ic('id')}${esc(t('bld_inspect'))}</button>${ids.length>1?`<button type="button" class="btn btn-line btn-sm" data-batch>${ic('rows')}${esc(t('bld_batch'))}</button>`:''}</div>`);
      out.querySelector('[data-cp]').onclick=e=>copyText(ids.join('\n'),e.currentTarget);
      out.querySelector('[data-re]').onclick=make;
      out.querySelector('[data-open]').onclick=()=>App.go('#/id/'+ids[0]);
      const bb=out.querySelector('[data-batch]');if(bb)bb.onclick=()=>{App.go('#/id/batch');setTimeout(()=>loadBatch(ids.join('\n'),true),40);};
    }
    make();
  }
  return{single,batch:batchView,upload,builder,loadBatch,inspect,exportRows,summary};
})();
