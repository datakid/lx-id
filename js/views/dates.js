const Holidays=(()=>{
  let map=new Map(Store.get('holidays',[]).map(h=>[h.date,h.label||'']));
  const save=()=>Store.set('holidays',[...map].sort((a,b)=>a[0]<b[0]?-1:1).map(([date,label])=>({date,label})));
  const keys=()=>new Set(map.keys());
  const has=k=>map.has(k);
  const size=()=>map.size;
  function add(list){let n=0;list.forEach(({key,label})=>{if(!map.has(key)){map.set(key,label||'');n++;}});save();return n;}
  function remove(k){map.delete(k);save();}
  function clear(){const prev=new Map(map);map.clear();save();return prev;}
  function restore(prev){map=prev;save();}
  function entries(){return[...map].sort((a,b)=>a[0]<b[0]?-1:1);}
  function workSet(){return new Set(Store.get('workDays',[0,1,2,3,4]));}
  function countIn(lo,hiEx,ws){let c=0;const a=LXDate.iso(lo),b=LXDate.iso(hiEx);map.forEach((_,k)=>{if(k>=a&&k<b){const r=LXDate.parseISO(k);if(r!=null&&ws.has(LXDate.dow(r)))c++;}});return c;}
  return{keys,has,size,add,remove,clear,restore,entries,workSet,countIn};
})();

const ViewDates=(()=>{
  const D=LXDate;
  const fields={};
  const st=(k,d)=>Store.get(k,d);
  function df(host,key,opts){
    const api=DateField.create(host,Object.assign({id:'df-'+key},opts));
    const v=st(key,null);if(v!=null&&!(opts&&opts.sensitive))api.set(v,true);
    if(opts&&opts.sensitive){const s=Store.get('ageBirth',null);if(s!=null)api.set(s,true);}
    fields[key]=api;return api;
  }
  function workPicker(el,onChange){
    const ws=Holidays.workSet(),start=+Store.get('weekStart',I18N.lang==='ar'?6:0);
    el.innerHTML='<div class="qchips">'+Array.from({length:7},(_,i)=>{const d=(start+i)%7;return`<button type="button" class="qchip${ws.has(d)?' active':''}" data-d="${d}" aria-pressed="${ws.has(d)}">${esc(Fmt.wd(d,true))}</button>`;}).join('')+'</div>';
    el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const s=Holidays.workSet(),d=+b.dataset.d;s.has(d)?s.delete(d):s.add(d);Store.set('workDays',[...s]);workPicker(el,onChange);onChange();});
  }
  function holChip(){const n=Holidays.size();return`<button type="button" class="chip${n?' amber':''}" data-hol style="cursor:pointer">${ic('repeat')}${esc(n?t('hol_n',n):t('hol_none'))}</button>`;}

  function between(el){
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <div><label class="label" for="df-bStart">${esc(t('start'))}</label><div id="h-bStart"></div></div>
        <div class="row" style="justify-content:center;margin:-.5rem 0"><button type="button" class="btn btn-ghost btn-sm" id="b-swap">${ic('swap')}${esc(t('swap'))}</button></div>
        <div><label class="label" for="df-bEnd">${esc(t('end'))}</label><div id="h-bEnd"></div></div>
        <div><div class="eyebrow">${esc(t('quick'))}</div><div class="qchips" id="b-quick"></div></div>
        <div class="stack-sm">${sw('b-incl',t('incl_end'),st('bIncl',false))}</div>
        <div><div class="eyebrow">${esc(t('workdays'))}</div><div id="b-wd"></div></div>
        <div class="between"><span class="eyebrow" style="margin:0">${esc(t('holidays'))}</span>${holChip()}</div>
      </section>
      <section class="card pad" id="b-out" aria-live="polite"></section></div>`;
    const a=df($('#h-bStart'),'bStart',{onChange:calc}),b=df($('#h-bEnd'),'bEnd',{onChange:calc});
    if(a.get()==null)a.set(D.today(),true);
    $('#b-swap').onclick=()=>{const x=a.get(),y=b.get();a.set(y,true);b.set(x,true);calc();};
    $('#b-incl').onchange=e=>{Store.set('bIncl',e.target.checked);calc();};
    const Q=[['q_today',()=>D.today()],['q_eom',s=>{const g=D.toG(s);return D.fromG(g.y,g.m,D.dim(g.y,g.m));}],['q_eoy',s=>D.fromG(D.toG(s).y,12,31)],['q_p30',s=>s+30],['q_p90',s=>s+90],['q_p1y',s=>D.addYears(s,1)],['q_xmas',s=>{const y=D.toG(s).y;const r=D.copticChristmas(y);return r>s?r:D.copticChristmas(y+1);}],['q_ramadan',s=>{const h=D.toH(s);let r=D.fromH(h.y,9,1);if(r==null||r<=s)r=D.fromH(h.y+1,9,1);return r;}]];
    $('#b-quick').innerHTML=Q.map(([k],i)=>`<button type="button" class="qchip" data-q="${i}">${esc(t(k))}</button>`).join('');
    $('#b-quick').querySelectorAll('[data-q]').forEach(btn=>btn.onclick=()=>{const s=a.get()??D.today();if(a.get()==null)a.set(s,true);b.set(Q[+btn.dataset.q][1](s));});
    workPicker($('#b-wd'),calc);
    el.querySelector('[data-hol]').onclick=()=>App.openHolidays(calc);
    function calc(){
      Store.patch({bStart:a.get(),bEnd:b.get()});
      const out=$('#b-out');
      if(a.get()==null||b.get()==null){out.innerHTML=emptyState('range',esc(t('pick_two')));return;}
      const s=a.get(),e=b.get(),rev=e<s,lo=rev?e:s,hi=rev?s:e,incl=$('#b-incl').checked,hiEx=hi+(incl?1:0);
      const ov=D.cfg.feb29==='overflow';
      const span=D.diff(lo,hiEx,ov),total=hiEx-lo,ws=Holidays.workSet();
      const counts=D.weekdayCounts(lo,hiEx),work=[...ws].reduce((x,d)=>x+counts[d],0),hol=Holidays.countIn(lo,hiEx,ws),net=work-hol;
      const txt=`${D.iso(s)} → ${D.iso(e)}: ${total} ${t('u_days')} (${Fmt.ymd(span)}), ${work} ${t('workdays').toLowerCase()}${Holidays.size()?`, ${net} ${t('net').toLowerCase()}`:''}`;
      const wdBars=Array.from({length:7},(_,i)=>i).map(d=>`<div class="bar"><span class="bl">${esc(Fmt.wd(d,true))}</span><span class="bt"><span class="bf${ws.has(d)?'':' m'}" style="width:${Math.max(2,counts[d]/Math.max(1,...counts)*100)}%"></span></span><span class="bv">${Fmt.n(counts[d])}</span></div>`).join('');
      out.innerHTML=`<div class="stack">
        <div class="hero"><div class="hero-act"><button type="button" class="iconbtn sm" data-cp aria-label="${esc(t('copy'))}">${ic('copy')}</button></div>
          <div class="k">${esc(t('total_days'))}${rev?' · '+esc(t('reversed')):''}</div><div class="v"><span data-count="${total}">${Fmt.n(total)}</span> ${esc(t('u_days'))}</div><div class="s">${esc(Fmt.ymd(span))} · ${esc(t('wk_d',span.weeks,span.weekDays))}</div></div>
        <div class="grid-3">${stat(t('workdays'),Fmt.n(work),{tone:'amber'})}${stat(t('weekend'),Fmt.n(total-work))}${Holidays.size()?stat(t('net'),Fmt.n(net),{tone:'mint',s:esc(t('minus_hol',hol))}):stat(t('u_weeks'),Fmt.n(total/7,1))}</div>
        <div class="split even"><div class="list">
          ${li(t('total_months'),Fmt.n(span.totalMonths),esc(t('plus_days',span.days)))}
          ${li(t('total_years'),Fmt.n(total/365.2425,2))}
          ${li(t('u_hours'),Fmt.n(total*24))}
          ${li(t('u_minutes'),Fmt.n(total*1440))}
          ${li(t('start'),esc(Fmt.date(lo,'short')),esc(Fmt.wd(D.dow(lo))))}
          ${li(t('end'),esc(Fmt.date(hi,'short')),esc(Fmt.wd(D.dow(hi))))}
          ${li(t('hijri_span'),esc(hspan(lo,hiEx)))}
        </div><div class="well stack-sm"><div class="eyebrow">${esc(t('by_weekday'))}</div><div class="bars">${wdBars}</div></div></div>
      </div>`;
      out.querySelector('[data-cp]').onclick=ev=>copyText(txt,ev.currentTarget);
      animateIn(out);
    }
    calc();
  }
  function hspan(a,b){const x=D.toH(a),y=D.toH(b);let m=(y.y-x.y)*12+(y.m-x.m);if(y.d<x.d)m--;return t('ym',Math.floor(m/12),m%12);}

  function addsub(el){
    let op=st('asOp','add'),biz=st('asBiz',false);
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <div><label class="label" for="df-asStart">${esc(t('start'))}</label><div id="h-asStart"></div></div>
        ${seg('as-op',[['add',t('add'),'plus'],['sub',t('sub'),'minus']],op)}
        <div class="grid-2" id="as-grid">${['y','m','w','d'].map(k=>`<div class="as-${k}"><label class="label" for="as-${k}">${esc(t('u_'+k+'_l'))}</label><input class="field num" id="as-${k}" type="number" min="0" step="1" inputmode="numeric" placeholder="0" value="${esc(st('as_'+k,'')||'')}"></div>`).join('')}</div>
        <label class="switch-block" for="as-biz"><span class="txt">${esc(t('biz'))}<small>${esc(t('biz_h'))}</small></span><span class="switch"><input type="checkbox" id="as-biz"${biz?' checked':''}><span class="track"></span></span></label>
        <div><div class="eyebrow">${esc(t('presets'))}</div><div class="qchips" id="as-pre"></div></div>
      </section>
      <section class="card pad" id="as-out" aria-live="polite"></section></div>`;
    const s=df($('#h-asStart'),'asStart',{onChange:calc});
    if(s.get()==null)s.set(D.today(),true);
    bindSeg(el,'as-op',v=>{op=v;Store.set('asOp',v);calc();});
    const syncBiz=()=>{['y','m','w'].forEach(k=>el.querySelector('.as-'+k).classList.toggle('hide',biz));$('label[for=as-d]').textContent=t(biz?'u_wd_l':'u_d_l');};
    $('#as-biz').onchange=e=>{biz=e.target.checked;Store.set('asBiz',biz);syncBiz();calc();};
    syncBiz();
    ['y','m','w','d'].forEach(k=>$('#as-'+k).addEventListener('input',calc));
    const P=[['p_30d',0,0,0,30],['p_90d',0,0,0,90],['p_6m',0,6,0,0],['p_1y',1,0,0,0],['p_18y',18,0,0,0],['p_60y',60,0,0,0],['p_10wd',0,0,0,10,1],['p_22wd',0,0,0,22,1]];
    $('#as-pre').innerHTML=P.map((p,i)=>`<button type="button" class="qchip" data-p="${i}">${esc(t(p[0]))}</button>`).join('');
    $('#as-pre').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=P[+b.dataset.p];biz=!!p[5];$('#as-biz').checked=biz;Store.set('asBiz',biz);syncBiz();['y','m','w','d'].forEach((k,i)=>$('#as-'+k).value=p[i+1]||'');calc();});
    function calc(){
      const n=k=>Math.max(0,Math.floor(Math.abs(+$('#as-'+k).value||0)));
      const Y=n('y'),M=n('m'),W=n('w'),Dd=n('d');
      Store.patch({asStart:s.get(),as_y:Y||'',as_m:M||'',as_w:W||'',as_d:Dd||''});
      const out=$('#as-out'),start=s.get(),dir=op==='sub'?-1:1;
      if(start==null||(biz?!Dd:!(Y||M||W||Dd))){out.innerHTML=emptyState('calplus',esc(t('as_pick')));return;}
      let r,clamped=false,skipped=0;
      if(biz){
        const ws=Holidays.workSet();if(!ws.size){out.innerHTML=emptyState('alert',esc(t('no_workdays')),true);return;}
        r=start;let left=Dd,g=0;
        while(left>0&&g<400000){r+=dir;g++;if(ws.has(D.dow(r))&&!Holidays.has(D.iso(r)))left--;else skipped++;}
      }else{
        const ov=D.cfg.feb29==='overflow';
        r=D.addMonths(start,dir*(Y*12+M),ov);
        clamped=(Y||M)&&D.toG(r).d!==D.toG(start).d;
        r+=dir*(W*7+Dd);
      }
      if(r<D.fromG(1,1,1)||r>D.fromG(9999,12,31)){out.innerHTML=emptyState('alert',esc(t('out_range')),true);return;}
      const shift=r-start,rel=r-D.today(),iso=D.iso(r);
      out.innerHTML=`<div class="stack">
        <div class="hero"><div class="hero-act"><button type="button" class="iconbtn sm" data-cp aria-label="${esc(t('copy'))}">${ic('copy')}</button><button type="button" class="iconbtn sm" data-ics aria-label="${esc(t('add_cal'))}">${ic('calplus')}</button></div>
          <div class="k">${esc(t('result'))}</div><div class="v">${esc(Fmt.date(r))}</div><div class="s"><span class="mono">${iso}</span> · ${esc(Fmt.wd(D.dow(r)))}</div></div>
        <div class="grid-2">${stat(t('shift'),(shift>0?'+':'')+Fmt.n(shift),{s:esc(t('wk_d',Math.floor(Math.abs(shift)/7),Math.abs(shift)%7))})}${stat(t('from_today'),esc(Fmt.rel(rel)),{sm:1})}</div>
        <div class="list">${li(t('hijri'),esc(Fmt.hijri(r)))}${li(t('coptic'),esc(Fmt.coptic(r)))}${li(t('iso_week'),esc(D.isoWeek(r).year+'-W'+D.pad(D.isoWeek(r).week)))}${biz?li(t('skipped'),Fmt.n(skipped)):''}</div>
        ${clamped?`<div class="callout">${ic('info')}<span>${esc(t('clamped'))}</span></div>`:''}
        ${Holidays.has(iso)?`<div class="callout warn">${ic('warn')}<span>${esc(t('lands_holiday'))}</span></div>`:''}
      </div>`;
      out.querySelector('[data-cp]').onclick=e=>copyText(iso,e.currentTarget);
      out.querySelector('[data-ics]').onclick=()=>{download(LXHolidays.ics([{rd:r,title:t('ics_target'),desc:iso}],t('brand')),'date-'+iso+'.ics','text/calendar');toast(t('t_ics'));};
    }
    calc();
  }

  function age(el){
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <div><label class="label" for="df-ageBirth">${esc(t('birth'))}</label><div id="h-ageBirth"></div></div>
        <div><label class="label" for="df-ageAsOf">${esc(t('asof'))}</label><div id="h-ageAsOf"></div></div>
        <div class="callout">${ic('shield')}<span>${esc(t('age_private'))}</span></div>
      </section>
      <section class="card pad" id="age-out" aria-live="polite"></section></div>`;
    const b=DateField.create($('#h-ageBirth'),{id:'df-ageBirth',onChange:calc});
    const sb=Store.get('ageBirth',null);if(sb!=null)b.set(sb,true);
    const a=df($('#h-ageAsOf'),'ageAsOf',{onChange:calc,hint:t('asof_hint')});
    function calc(){
      Store.set('ageBirth',b.get());Store.set('ageAsOf',a.get());
      const out=$('#age-out'),bd=b.get();
      if(bd==null){out.innerHTML=emptyState('cake',esc(t('pick_birth')));return;}
      const now=a.get()??D.today();
      if(bd>now){out.innerHTML=emptyState('alert',esc(t('birth_after')),true);return;}
      const ov=D.cfg.feb29==='overflow',ag=D.diff(bd,now,ov),nb=LXID.nextBirthday(bd,now);
      const hb=D.toH(bd),hn=D.toH(now);let hy=hn.y-hb.y;if(hn.m<hb.m||(hn.m===hb.m&&hn.d<hb.d))hy--;
      const ms=[[10000,'d'],[15000,'d'],[20000,'d'],[25000,'d'],[1e9/86400,'s']].map(([n])=>bd+Math.round(n));
      const ret=LXID.retirement(bd);
      const mrow=(lbl,r)=>li(lbl,esc(Fmt.date(r,'short')),esc(Fmt.rel(r-D.today())));
      const txt=Fmt.ymd(ag);
      out.innerHTML=`<div class="stack">
        <div class="hero"><div class="hero-act"><button type="button" class="iconbtn sm" data-cp aria-label="${esc(t('copy'))}">${ic('copy')}</button></div>
          <div class="k">${esc(t('exact_age'))}</div><div class="v">${esc(txt)}</div><div class="s">${esc(t('born_on'))} ${esc(Fmt.date(bd,'full'))}</div></div>
        <div class="grid-3">${stat(t('next_bday'),nb.days===0?esc(t('bday_today')):Fmt.n(nb.days),{tone:'amber',s:esc(t('turns',nb.turns))+' · '+esc(Fmt.wd(D.dow(nb.rd),true)),count:nb.days||null})}${stat(t('days_lived_t'),Fmt.n(ag.totalDays),{count:ag.totalDays})}${stat(t('hijri_age'),Fmt.n(hy),{s:esc(t('hijri_years'))})}</div>
        <div class="split even">
          <div class="list">${li(t('u_months'),Fmt.n(ag.totalMonths))}${li(t('u_weeks'),Fmt.n(ag.weeks),esc(t('plus_days',ag.weekDays)))}${li(t('u_hours'),Fmt.n(ag.totalDays*24))}${li(t('decimal_age'),Fmt.n(ag.totalDays/365.2425,3))}${li(t('zodiac'),esc(t('zodiac_n')[D.zodiac(bd)]))}${li(t('chinese'),esc(t('chinese_n')[D.chineseZodiac(D.toG(bd).y)]))}${li(t('born_wd'),esc(Fmt.wd(D.dow(bd))))}</div>
          <div class="list">${mrow(t('ms_10k'),ms[0])}${mrow(t('ms_15k'),ms[1])}${mrow(t('ms_20k'),ms[2])}${mrow(t('ms_25k'),ms[3])}${mrow(t('ms_1g'),ms[4])}${mrow(t('ms_ret',ret.age),ret.date)}</div>
        </div></div>`;
      out.querySelector('[data-cp]').onclick=e=>copyText(txt,e.currentTarget);
      animateIn(out);
    }
    calc();
  }

  function anatomy(el){
    el.innerHTML=`<div class="split">
      <section class="card pad stack"><div><label class="label" for="df-wdDate">${esc(t('any_date'))}</label><div id="h-wd"></div></div><div id="wd-mini"></div></section>
      <section class="card pad" id="wd-out" aria-live="polite"></section></div>`;
    const f=df($('#h-wd'),'wdDate',{onChange:calc});
    if(f.get()==null)f.set(D.today(),true);
    function calc(){
      Store.set('wdDate',f.get());
      const out=$('#wd-out'),r=f.get();
      if(r==null){out.innerHTML=emptyState('today',esc(t('pick_date')));$('#wd-mini').innerHTML='';return;}
      const g=D.toG(r),iw=D.isoWeek(r),doy=D.dayOfYear(r),yl=D.yearLength(g.y),q=Math.ceil(g.m/3);
      const nth=Math.ceil(g.d/7),last=g.d+7>D.dim(g.y,g.m);
      const j=D.toJ(r);
      out.innerHTML=`<div class="stack">
        <div class="hero"><div class="k">${esc(t('weekday'))}</div><div class="v">${esc(Fmt.wd(D.dow(r)))}</div><div class="s">${esc(Fmt.date(r))} · ${esc(Fmt.rel(r-D.today()))}</div></div>
        <div class="grid-3">${stat(t('doy'),Fmt.n(doy),{s:esc(t('of_n',yl))})}${stat(t('iso_week'),'W'+D.pad(iw.week),{s:String(iw.year)})}${stat(t('quarter'),'Q'+q,{s:esc(t('pct_year',Math.round(doy/yl*100)))})}</div>
        <div class="split even"><div class="list">
          ${li(t('nth_wd'),esc(t('nth_of',nth,Fmt.wd(D.dow(r)),Fmt.mon(g.m))),last?esc(t('last_of_month')):'')}
          ${li(t('wk_sun'),Fmt.n(D.weekOfYear(r,0)))}
          ${li(t('wk_sat'),Fmt.n(D.weekOfYear(r,6)))}
          ${li(t('leap'),esc(D.isLeap(g.y)?t('yes_366'):t('no_365')))}
          ${li(t('days_left_y'),Fmt.n(yl-doy))}
          ${li(t('days_in_month'),Fmt.n(D.dim(g.y,g.m)))}
        </div><div class="list">
          ${li(t('hijri'),esc(Fmt.hijri(r)),esc(t('method_'+D.hijriMethod())))}
          ${li(t('coptic'),esc(Fmt.coptic(r)))}
          ${li(t('julian'),esc(Fmt.julian(r)))}
          ${li('ISO 8601',`<span class="mono">${D.iso(r)}</span>`)}
          ${li(t('excel_serial'),`<span class="mono">${D.excelSerial(r)}</span>`)}
          ${li(t('jdn'),`<span class="mono">${D.jdn(r)}</span>`)}
          ${li(t('unix'),`<span class="mono">${D.toUTCms(r)/1000}</span>`)}
        </div></div></div>`;
      const first=D.fromG(g.y,g.m,1),ws=+Store.get('weekStart',I18N.lang==='ar'?6:0),lead=D.mod(D.dow(first)-ws,7),wset=Holidays.workSet();
      let h=`<div class="eyebrow">${esc(Fmt.date(first,'my'))}</div><div class="mini-cal">`;
      for(let i=0;i<7;i++)h+=`<b>${esc(Fmt.wd((ws+i)%7,true))}</b>`;
      for(let i=0;i<lead;i++)h+='<span></span>';
      for(let d=1;d<=D.dim(g.y,g.m);d++){const x=first+d-1;h+=`<span class="${x===r?'on':''}${wset.has(D.dow(x))?'':' wk'}">${d}</span>`;}
      $('#wd-mini').innerHTML=h+'</div>';
    }
    calc();
  }

  function leap(el){
    const cy=D.toG(D.today()).y;
    el.innerHTML=`<div class="split even">
      <section class="card pad stack"><label class="label" for="ly-y">${esc(t('single_year'))}</label><input class="field num" id="ly-y" type="number" min="1" max="9999" value="${st('lyY',cy)}"><div id="ly-one" aria-live="polite"></div></section>
      <section class="card pad stack"><span class="label">${esc(t('year_range'))}</span><div class="grid-2"><input class="field num" id="ly-a" type="number" min="1" max="9999" value="${st('lyA',cy-24)}" aria-label="${esc(t('from'))}"><input class="field num" id="ly-b" type="number" min="1" max="9999" value="${st('lyB',cy+26)}" aria-label="${esc(t('to'))}"></div><div id="ly-range" aria-live="polite"></div></section></div>`;
    const one=()=>{
      const y=parseInt($('#ly-y').value,10),o=$('#ly-one');Store.set('lyY',y);
      if(!(y>=1&&y<=9999)){o.innerHTML=emptyState('alert',esc(t('bad_year')),true);return;}
      const L=D.isLeap(y);let p=y,n=y;do p--;while(p>0&&!D.isLeap(p));do n++;while(!D.isLeap(n));
      const f29=D.fromG(Math.max(1,L?y:n),2,29);
      o.innerHTML=`<div class="stack-sm"><div class="hero" style="${L?'':'background:var(--surface-3)'}"><div class="k">${y}</div><div class="v">${esc(L?t('is_leap'):t('not_leap'))}</div><div class="s">${esc(L?t('yes_366'):t('no_365'))}</div></div>
        <div class="list">${li(t('rule_check'),`<span class="mono">${y%4} · ${y%100} · ${y%400}</span>`,esc(t('rule_explain')))}${li(t('prev_leap'),p>0?String(p):'—')}${li(t('next_leap'),String(n))}${li(t('feb29_on'),esc(Fmt.wd(D.dow(f29))),String(D.toG(f29).y))}${li(t('hijri_leap'),esc(t(D.hLeap(D.toH(D.fromG(y,7,1)).y)?'yes':'no')),esc(t('tabular')))}${li(t('coptic_leap'),esc(t(D.mod(D.toC(D.fromG(y,7,1)).y,4)===3?'yes':'no')))}</div></div>`;
    };
    const range=()=>{
      let a=parseInt($('#ly-a').value,10),b=parseInt($('#ly-b').value,10),o=$('#ly-range');Store.patch({lyA:a,lyB:b});
      if(!(a>=1&&b>=1&&a<=9999&&b<=9999)){o.innerHTML=emptyState('alert',esc(t('bad_years')),true);return;}
      if(a>b)[a,b]=[b,a];
      if(b-a>2000){o.innerHTML=emptyState('alert',esc(t('range_big')),true);return;}
      const ys=[];for(let y=a;y<=b;y++)if(D.isLeap(y))ys.push(y);
      const days=D.fromG(b,12,31)-D.fromG(a,1,1)+1;
      o.innerHTML=`<div class="stack-sm"><div class="grid-2">${stat(t('leap_found'),Fmt.n(ys.length),{tone:'amber'})}${stat(t('total_days'),Fmt.n(days))}</div><div class="leap-grid">${ys.map(y=>`<span class="${y%100===0?'c':''}">${y}</span>`).join('')||`<span class="faint">${esc(t('none'))}</span>`}</div><button type="button" class="btn btn-ghost btn-sm" data-cp style="align-self:flex-start">${ic('copy')}${esc(t('copy_list'))}</button></div>`;
      o.querySelector('[data-cp]').onclick=e=>copyText(ys.join(', '),e.currentTarget);
    };
    $('#ly-y').addEventListener('input',one);$('#ly-a').addEventListener('input',range);$('#ly-b').addEventListener('input',range);
    one();range();
  }

  function convert(el){
    let mode=st('cvMode','greg');
    el.innerHTML=`<div class="split">
      <section class="card pad stack">
        <div class="scrollx">${seg('cv',[['greg',t('from_greg')],['hijri',t('from_hijri')],['coptic',t('from_coptic')],['julian',t('from_julian')]],mode)}</div>
        <div id="cv-in"></div>
        <div class="callout">${ic('info')}<span>${esc(t('hijri_note_'+D.hijriMethod()))}</span></div>
        <div class="row-wrap"><span class="small muted">${esc(t('hijri_adj'))}</span>${seg('hoff',[['-2','−2'],['-1','−1'],['0','0'],['1','+1'],['2','+2']],String(D.cfg.offset))}</div>
      </section>
      <section class="card pad" id="cv-out" aria-live="polite"></section></div>`;
    bindSeg(el,'cv',v=>{mode=v;Store.set('cvMode',v);drawIn();});
    bindSeg(el,'hoff',v=>{D.cfg.offset=+v;Store.set('hijriOffset',+v);drawIn();});
    let g=null;
    function drawIn(){
      const box=$('#cv-in');
      if(mode==='greg'){
        box.innerHTML=`<label class="label" for="df-cvDate">${esc(t('any_date'))}</label><div id="h-cv"></div>`;
        g=df($('#h-cv'),'cvDate',{onChange:calc});if(g.get()==null)g.set(D.today(),true);calc();return;
      }
      const names=mode==='hijri'?t('hijriMonths'):mode==='coptic'?t('copticMonths'):Array.from({length:12},(_,i)=>Fmt.mon(i+1));
      const cur=mode==='hijri'?D.toH(D.today()):mode==='coptic'?D.toC(D.today()):D.toJ(D.today());
      const sv=st('cvAlt_'+mode,null)||cur;
      box.innerHTML=`<div class="grid-3"><div><label class="label" for="cv-d">${esc(t('day'))}</label><input class="field num" id="cv-d" type="number" min="1" max="31" value="${sv.d}"></div><div><label class="label" for="cv-m">${esc(t('month'))}</label><select class="field" id="cv-m">${names.map((n,i)=>`<option value="${i+1}"${i+1===sv.m?' selected':''}>${i+1} · ${esc(n)}</option>`).join('')}</select></div><div><label class="label" for="cv-y">${esc(t('year'))}</label><input class="field num" id="cv-y" type="number" min="1" max="9999" value="${sv.y}"></div></div>`;
      ['cv-d','cv-m','cv-y'].forEach(i=>$('#'+i).addEventListener('input',calc));
      calc();
    }
    function calc(){
      const out=$('#cv-out');let r=null,bad=false;
      if(mode==='greg'){r=g&&g.get();Store.set('cvDate',r);}
      else{
        const d=+$('#cv-d').value,m=+$('#cv-m').value,y=+$('#cv-y').value;Store.set('cvAlt_'+mode,{d,m,y});
        if(mode==='hijri')r=D.fromH(y,m,d);
        else if(mode==='coptic')r=(y>=1&&m>=1&&m<=13&&d>=1&&d<=D.cdim(y,m))?D.fromC(y,m,d):null;
        else r=(y>=1&&m>=1&&m<=12&&d>=1&&d<=D.jdim(y,m))?D.fromJ(y,m,d):null;
        bad=r==null;
      }
      if(r==null){out.innerHTML=emptyState(bad?'alert':'cal',esc(bad?t('no_such_date'):t('pick_date')),bad);return;}
      const h=D.toH(r),c=D.toC(r);
      const hNext=(()=>{let y=h.y;let x=D.fromH(y,9,1);if(x==null||x<D.today())x=D.fromH(y+1,9,1);return x;})();
      out.innerHTML=`<div class="stack">
        <div class="hero"><div class="k">${esc(t('gregorian'))}</div><div class="v">${esc(Fmt.date(r))}</div><div class="s">${esc(Fmt.wd(D.dow(r)))} · <span class="mono">${D.iso(r)}</span></div></div>
        <div class="grid-2">${stat(t('hijri'),esc(Fmt.hijri(r)),{sm:1,tone:'azure',s:esc(t('method_'+D.hijriMethod()))+' · '+esc(t('hm_len',D.hdim(h.y,h.m)))})}${stat(t('coptic'),esc(Fmt.coptic(r)),{sm:1,tone:'rose',s:esc(t('cm_len',D.cdim(c.y,c.m)))})}</div>
        <div class="list">${li(t('julian'),esc(Fmt.julian(r)))}${li(t('hijri_tab'),esc((()=>{const x=D.toHt(r+D.cfg.offset);return x.d+' '+t('hijriMonths')[x.m-1]+' '+x.y;})()))}${li(t('next_ramadan'),esc(Fmt.date(hNext,'short')),esc(Fmt.rel(hNext-D.today())))}${li(t('easter_y',D.toG(r).y),esc(Fmt.date(D.orthodoxEaster(D.toG(r).y),'short')),esc(t('western'))+' '+esc(Fmt.date(D.westernEaster(D.toG(r).y),'short')))}${li(t('nayrouz'),esc(Fmt.date(D.nayrouz(D.toG(r).y),'short')))}${li(t('jdn'),`<span class="mono">${D.jdn(r)}</span>`)}</div>
        <button type="button" class="btn btn-ghost btn-sm" data-cp style="align-self:flex-start">${ic('copy')}${esc(t('copy_all'))}</button></div>`;
      out.querySelector('[data-cp]').onclick=e=>copyText([D.iso(r),Fmt.hijri(r),Fmt.coptic(r),Fmt.julian(r)].join('\n'),e.currentTarget);
    }
    drawIn();
  }

  function holidays(el){
    const cy=D.toG(D.today()).y;let year=st('hpY',cy);
    el.innerHTML=`<section class="card pad stack">
      <div class="between"><div><h3 class="card-title">${ic('party')}${esc(t('eg_hol'))}</h3><p class="card-sub">${esc(t('eg_hol_d'))}</p></div>
        <div class="row"><button type="button" class="iconbtn sm" data-y="-1" aria-label="${esc(t('prev'))}">${ic(document.dir==='rtl'?'chevr':'chevl')}</button><input class="field field-sm num" id="hp-y" type="number" min="1900" max="2200" value="${year}" style="width:6rem;text-align:center"><button type="button" class="iconbtn sm" data-y="1" aria-label="${esc(t('next'))}">${ic(document.dir==='rtl'?'chevl':'chevr')}</button></div></div>
      <div id="hp-list"></div>
      <div class="row-wrap"><button type="button" class="btn btn-primary btn-sm" id="hp-add">${ic('plus')}${esc(t('hol_add_year'))}</button><button type="button" class="btn btn-line btn-sm" id="hp-ics">${ic('calplus')}${esc(t('export_ics'))}</button><button type="button" class="btn btn-ghost btn-sm" id="hp-manage">${ic('repeat')}${esc(t('hol_manage'))}</button></div>
    </section>`;
    const draw=()=>{
      const list=LXHolidays.forYear(year,{includeOptional:true}),tdy=D.today();
      $('#hp-list').innerHTML=`<div class="tablebox"><table class="t"><thead><tr><th>${esc(t('date'))}</th><th>${esc(t('weekday'))}</th><th>${esc(t('holiday'))}</th><th>${esc(t('hijri'))}</th><th></th></tr></thead><tbody>${list.map(h=>`<tr style="${h.rd<tdy?'opacity:.55':''}"><td class="mono">${D.iso(h.rd)}</td><td>${esc(Fmt.wd(D.dow(h.rd)))}</td><td style="font-weight:600">${esc(t(h.k))}${h.est?` <span class="chip sun" style="padding:.1rem .45rem">${esc(t('est'))}</span>`:''}</td><td class="small muted">${esc(Fmt.hijri(h.rd))}</td><td class="small faint">${esc(Fmt.rel(h.rd-tdy))}</td></tr>`).join('')}</tbody></table></div>`;
    };
    const setY=y=>{year=clamp(y,1900,2200);$('#hp-y').value=year;Store.set('hpY',year);draw();};
    el.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>setY(year+ +b.dataset.y));
    $('#hp-y').onchange=e=>setY(parseInt(e.target.value,10)||cy);
    $('#hp-add').onclick=()=>{const n=Holidays.add(LXHolidays.forYear(year).map(h=>({key:D.iso(h.rd),label:t(h.k)+(h.est?' '+t('est_tag'):'')})));toast(n?t('t_hol_added',n):t('t_hol_none'),n?'ok':'info');};
    $('#hp-ics').onclick=()=>{download(LXHolidays.ics(LXHolidays.forYear(year,{includeOptional:true}).map(h=>({rd:h.rd,title:t(h.k)+(h.est?' '+t('est_tag'):'')})),t('eg_hol')+' '+year),'egypt-holidays-'+year+'.ics','text/calendar');toast(t('t_ics'));};
    $('#hp-manage').onclick=()=>App.openHolidays();
    draw();
  }

  function holidayDialog(onDone){
    const box=$('#holidays-body');
    const draw=()=>{
      const ents=Holidays.entries();
      box.innerHTML=`<div class="stack">
        <p class="small muted" style="margin:0">${esc(t('hol_hint'))}</p>
        <textarea class="field" id="hd-in" rows="5" placeholder="2026-01-07, Coptic Christmas&#10;25/04/2026, Sinai Liberation Day&#10;2026-03-20 → 2026-03-22, Eid al-Fitr"></textarea>
        <div class="row-wrap"><button type="button" class="btn btn-primary btn-sm" id="hd-add">${ic('check')}${esc(t('hol_import'))}</button><label class="btn btn-line btn-sm" style="cursor:pointer">${ic('up')}${esc(t('upload_file'))}<input type="file" id="hd-file" accept=".csv,.txt,.ics" class="hide"></label><span class="grow"></span><button type="button" class="btn btn-ghost btn-sm" id="hd-ics"${ents.length?'':' disabled'}>${ic('calplus')}.ics</button><button type="button" class="btn btn-danger btn-sm" id="hd-clear"${ents.length?'':' disabled'}>${ic('trash')}${esc(t('clear_all'))}</button></div>
        <div id="hd-issues"></div>
        <div class="between"><span class="eyebrow" style="margin:0">${esc(t('hol_saved'))}</span><span class="chip">${ents.length}</span></div>
        <div class="tablebox" style="max-height:15rem">${ents.length?`<table class="t"><tbody>${ents.map(([k,l])=>`<tr><td class="mono">${k}</td><td class="small muted">${esc(Fmt.wd(D.dow(D.parseISO(k)),true))}</td><td>${esc(l||'—')}</td><td style="text-align:end"><button type="button" class="iconbtn sm" data-rm="${k}" aria-label="${esc(t('remove'))}">${ic('x')}</button></td></tr>`).join('')}</tbody></table>`:`<div class="empty" style="padding:1.5rem">${esc(t('hol_empty'))}</div>`}</div>
        <p class="tiny faint" style="margin:0">${esc(t('hol_foot'))}</p></div>`;
      $('#hd-add').onclick=()=>{
        const v=$('#hd-in').value;if(!v.trim()){toast(t('hol_paste_first'),'info');return;}
        const r=LXHolidays.parseText(v,Holidays.keys(),Store.get('dateOrder','dmy'));
        const n=Holidays.add(r.ok);
        draw();
        if(r.issues.length)$('#hd-issues').innerHTML=`<div class="callout warn">${ic('warn')}<div class="stack-sm" style="gap:.2rem">${r.issues.slice(0,12).map(i=>`<span><b class="mono">#${i.line}</b> ${esc(i.raw)} — ${esc(t(i.reason))}</span>`).join('')}</div></div>`;
        toast(n?t('t_hol_added',n):t('t_hol_none'),n?'ok':'info');onDone&&onDone();
      };
      $('#hd-file').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{let s=String(rd.result||'').replace(/^\uFEFF/,'');if(/BEGIN:VCALENDAR/.test(s)){const ev=[];s.replace(/\r\n[ \t]/g,'').split('BEGIN:VEVENT').slice(1).forEach(b=>{const d=/DTSTART[^:]*:(\d{8})/.exec(b),n=/SUMMARY:(.*)/.exec(b);if(d)ev.push(d[1].slice(0,4)+'-'+d[1].slice(4,6)+'-'+d[1].slice(6,8)+', '+(n?n[1].trim():''));});s=ev.join('\n');}$('#hd-in').value=s;};rd.readAsText(f,'UTF-8');e.target.value='';};
      $('#hd-ics').onclick=()=>{download(LXHolidays.ics(Holidays.entries().map(([k,l])=>({rd:D.parseISO(k),title:l||t('holiday')})),t('holidays')),'holidays.ics','text/calendar');toast(t('t_ics'));};
      $('#hd-clear').onclick=()=>{const p=Holidays.clear();draw();onDone&&onDone();toast(t('t_hol_cleared'),'info',{action:t('undo'),onAction:()=>{Holidays.restore(p);draw();onDone&&onDone();}});};
      box.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{Holidays.remove(b.dataset.rm);draw();onDone&&onDone();});
    };
    draw();
  }
  return{between,addsub,age,anatomy,leap,convert,holidays,holidayDialog};
})();
