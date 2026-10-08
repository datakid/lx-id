const ViewFormulas=(()=>{
  const FIELDS=[['birth','fx_birth','cake'],['gender','fx_gender','male'],['gov','fx_gov','pin'],['age','fx_age','hour'],['ageFull','fx_agefull','hour'],['retireAge','fx_retage','gavel'],['retireDate','fx_retdate','gavel'],['yearsLeft','fx_yearsleft','clock'],['valid','fx_valid','shield']];
  function hl(s){return esc(s).replace(/\b([A-Z]{2,}[A-Z0-9.]*)\(/g,'<span class="fn">$1</span>(').replace(/&quot;([^&]*)&quot;/g,'<span class="st">&quot;$1&quot;</span>').replace(/\b(\d+)\b/g,'<span class="nm">$1</span>');}
  function view(el){
    let mode=Store.get('fxMode','cell'),uselet=Store.get('fxLet',false);
    el.innerHTML=`<div class="stack">
      <section class="card pad stack">
        <div class="between"><div><h3 class="card-title">${ic('fx')}${esc(t('fx_ref'))}</h3><p class="card-sub">${esc(t('fx_ref_d'))}</p></div>${seg('fxm',[['cell',t('fx_cell')],['table',t('fx_table')]],mode)}</div>
        <div class="grid-3">
          <div id="fx-cellbox"><label class="label" for="fx-cell">${esc(t('fx_cellref'))}</label><input class="field mono" id="fx-cell" value="${esc(Store.get('fxCell','A2'))}" spellcheck="false"></div>
          <div id="fx-colbox"><label class="label" for="fx-col">${esc(t('fx_colname'))}</label><input class="field" id="fx-col" value="${esc(Store.get('fxCol','National ID'))}" spellcheck="false"></div>
          <div><label class="label" for="fx-lang">${esc(t('fx_labels'))}</label><select class="field" id="fx-lang"><option value="en">English</option><option value="ar">العربية</option></select></div>
        </div>
        <div class="row-wrap">${sw('fx-let',t('fx_let'),uselet,t('fx_let_h'))}<span class="chip amber">${esc(t('mode_'+LXID.settings.retireMode))}</span><button type="button" class="btn btn-ghost btn-sm" id="fx-set">${ic('gear')}${esc(t('change'))}</button></div>
      </section>
      <div class="split even" id="fx-list"></div>
      <div class="callout">${ic('info')}<span>${esc(t('fx_note'))}</span></div></div>`;
    $('#fx-lang').value=Store.get('fxLang',I18N.lang);
    const draw=()=>{
      $('#fx-cellbox').classList.toggle('hide',mode!=='cell');$('#fx-colbox').classList.toggle('hide',mode!=='table');
      const ref=mode==='cell'?($('#fx-cell').value.trim()||'A2'):'[@['+($('#fx-col').value.trim()||'National ID')+']]';
      const lang=$('#fx-lang').value;
      const L=k=>I18N.dict(lang)[k];
      const F=LXID.F(ref,{let:uselet,lang,male:L('male'),female:L('female'),unknown:L('unknown')});
      Store.patch({fxMode:mode,fxLet:uselet,fxCell:$('#fx-cell').value,fxCol:$('#fx-col').value,fxLang:lang});
      paint($('#fx-list'),FIELDS.map(([k,l,i],n)=>`<section class="card pad stack-sm"><div class="between"><h3 class="card-title"><span class="chip amber" style="padding:.15rem .55rem">${n+1}</span>${esc(t(l))}</h3><button type="button" class="btn btn-soft btn-sm" data-cp="${k}">${ic('copy')}${esc(t('copy'))}</button></div><pre class="code" id="fx-${k}">${hl(F[k])}</pre>${k==='birth'||k==='retireDate'?`<p class="tiny faint" style="margin:0">${esc(t('fx_fmt_date'))}</p>`:''}</section>`).join(''));
      $$('#fx-list [data-cp]').forEach(b=>b.onclick=()=>copyText(F[b.dataset.cp],b,t('t_formula')));
    };
    bindSeg(el,'fxm',v=>{mode=v;draw();});
    ['fx-cell','fx-col'].forEach(i=>$('#'+i).addEventListener('input',debounce(draw,150)));
    $('#fx-lang').onchange=draw;
    $('#fx-let').onchange=e=>{uselet=e.target.checked;draw();};
    $('#fx-set').onclick=()=>App.openSettings('retire');
    draw();
  }
  return{view};
})();

const ViewRef=(()=>{
  const D=LXDate;
  function structure(el){
    const P=[['a1','1','r1'],['a2','2–7','r2'],['a3','8–9','r3'],['a4','10–12','r4'],['a5','13','r5'],['a6','14','r6']];
    el.innerHTML=`<div class="stack"><section class="card pad stack"><h3 class="card-title">${ic('id')}${esc(t('r_title'))}</h3><p class="card-sub" style="margin:0">${esc(t('r_desc'))}</p>
      <div class="anatomy"><span class="a1">3</span><span class="a2">0</span><span class="a2">1</span><span class="a2">0</span><span class="a2">1</span><span class="a2">0</span><span class="a2">1</span><span class="a3">1</span><span class="a3">5</span><span class="a4">0</span><span class="a4">9</span><span class="a4">8</span><span class="a5">7</span><span class="a6">6</span></div></section>
      <div class="ref-grid">${P.map(([c,pos,k],i)=>`<div class="ref-item"><span class="anatomy" style="flex-shrink:0"><span class="${c}" style="min-width:3rem;padding:.45rem .3rem;font-size:.74rem">${pos}</span></span><div><b>${esc(t(k+'_t'))}</b><p>${esc(t(k+'_d'))}</p></div></div>`).join('')}</div>
      <section class="card pad stack-sm"><h3 class="card-title">${ic('shield')}${esc(t('r_checks'))}</h3><div class="checks">${LXID.CHECKS.map(k=>`<div class="check"><span class="ci pass">${ic('check')}</span>${esc(t('chk_'+k))}</div>`).join('')}</div><p class="tiny faint" style="margin:.3rem 0 0">${esc(t('disclaimer'))}</p></section></div>`;
  }
  function govs(el){
    el.innerHTML=`<section class="card pad stack"><div class="between"><h3 class="card-title">${ic('pin')}${esc(t('r_gov'))}</h3><span class="chip" id="g-n"></span></div><input class="field" type="search" id="g-q" placeholder="${esc(t('g_search'))}"><div id="g-t"></div></section>`;
    const draw=()=>{
      const q=$('#g-q').value.trim().toLowerCase();
      const rows=Object.entries(LXID.GOV).filter(([k,v])=>!q||k.includes(q)||v[0].toLowerCase().includes(q)||v[1].includes(q)||v[2].toLowerCase().includes(q));
      $('#g-n').textContent=t('g_count',rows.length,Object.keys(LXID.GOV).length);
      paint($('#g-t'),`<div class="tablebox"><table class="t"><thead><tr><th>${esc(t('code'))}</th><th>${esc(t('c_gov'))}</th><th>${I18N.lang==='ar'?'English':'العربية'}</th><th>${esc(t('c_region'))}</th><th></th></tr></thead><tbody>${rows.map(([k,v])=>`<tr><td class="mono" style="font-weight:700">${k}</td><td style="font-weight:600">${esc(I18N.lang==='ar'?v[1]:v[0])}</td><td>${esc(I18N.lang==='ar'?v[0]:v[1])}</td><td class="muted small">${esc(LXID.govRegion(k,I18N.lang))}</td><td><button type="button" class="iconbtn sm rc" data-cp="${k}" aria-label="${esc(t('copy'))}">${ic('copy')}</button></td></tr>`).join('')||`<tr><td colspan="5" class="faint" style="text-align:center;padding:2rem">${esc(t('no_rows'))}</td></tr>`}</tbody></table></div>`);
      $$('#g-t [data-cp]').forEach(b=>b.onclick=()=>copyText(b.dataset.cp,b));
    };
    $('#g-q').addEventListener('input',draw);draw();
  }
  function law(el){
    const now=D.today();
    const cur=LXID.ageInForce(now);
    el.innerHTML=`<div class="split">
      <section class="card pad stack"><div class="between"><h3 class="card-title">${ic('gavel')}${esc(t('law_title'))}</h3><span class="chip amber">${esc(t('law'))}</span></div><p class="card-sub" style="margin:0">${esc(t('law_desc'))}</p>
        <div class="law-steps"><div class="law-step${cur===60?' now':''}"><b>60</b><span class="small">${esc(t('law_before',Fmt.date(LXID.STEPS[0].rd)))}</span><span class="tiny faint"></span></div>${LXID.STEPS.map(s=>`<div class="law-step${cur===s.age?' now':''}"><b>${s.age}</b><span class="small">${esc(t('law_from',Fmt.date(s.rd)))}</span><span class="tiny faint">${esc(t('born_window',s.y-60))}</span></div>`).join('')}</div>
        <div class="callout">${ic('info')}<span>${esc(t('law_modes'))}</span></div></section>
      <section class="card pad stack"><h3 class="card-title">${ic('calplus')}${esc(t('law_calc'))}</h3><div><label class="label" for="df-lawB">${esc(t('birth'))}</label><div id="h-lawB"></div></div><div id="law-out"></div></section></div>`;
    const f=DateField.create($('#h-lawB'),{id:'df-lawB',onChange:calc});
    function calc(){
      const b=f.get(),o=$('#law-out');
      if(b==null){paint(o,emptyState('cake',esc(t('pick_birth'))));return;}
      const A=LXID.retirement(b,{mode:'cohort'}),B=LXID.retirement(b,{mode:'inforce'});
      paint(o,`<div class="grid-2">${stat(t('mode_cohort'),Fmt.n(A.age),{tone:LXID.settings.retireMode==='cohort'?'amber':'',s:esc(Fmt.date(A.date,'short'))})}${stat(t('mode_inforce'),Fmt.n(B.age),{tone:LXID.settings.retireMode==='inforce'?'amber':'',s:esc(Fmt.date(B.date,'short'))})}</div><div class="list" style="margin-top:.5rem">${li(t('turn60'),esc(Fmt.date(A.turn60)))}${li(t('ret_in'),A.date>now?esc(Fmt.ymd(D.diff(now,A.date))):esc(t('eligible')))}</div>`);
    }
    calc();
  }
  function dates(el){
    const S=[['ref_h','ref_h1','ref_h2','ref_h3'],['ref_c','ref_c1','ref_c2'],['ref_hp','ref_hp1','ref_hp2','ref_hp3'],['ref_p','ref_p1','ref_p2','ref_p3','ref_p4'],['ref_e','ref_e1','ref_e2','ref_e3']];
    el.innerHTML=`<div class="stack"><section class="card pad stack-sm"><div class="row-wrap"><span class="chip amber">${esc(t('ref_badge'))}</span><h3 class="card-title">${esc(t('ref_dt'))}</h3></div><p class="card-sub" style="margin:0">${esc(t('ref_dd'))}</p></section>
      <div class="split even">${S.map(([h,...ps])=>`<section class="card pad stack-sm"><h3 class="card-title">${esc(t(h))}</h3>${ps.map(p=>`<div class="check"><span class="ci">${ic('minus')}</span><span style="font-weight:450">${esc(t(p))}</span></div>`).join('')}</section>`).join('')}</div></div>`;
  }
  return{structure,govs,law,dates};
})();

const Settings=(()=>{
  const STYLES=[['buttery','linear-gradient(135deg,#F3E7D3,#EFE4D2)'],['airy','linear-gradient(135deg,#FCFAF5,#F1ECE2)'],['mellow','linear-gradient(135deg,#E7D8C7,#D8C4AC)'],['glassy','linear-gradient(135deg,rgba(255,255,255,.9),rgba(198,115,63,.3))'],['rounded','linear-gradient(135deg,#F2E2CB,#E9D3B2)']];
  const FONTS=[['fraunces',"'Fraunces',serif","'Inter',sans-serif",null],['newsreader',"'Newsreader',serif","'Inter',sans-serif",'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,450;6..72,600&display=swap'],['jakarta',"'Plus Jakarta Sans',sans-serif","'Plus Jakarta Sans',sans-serif",'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'],['system',"ui-serif,Georgia,serif","system-ui,-apple-system,sans-serif",null]];
  const loaded=new Set();
  function applyFont(id){
    const f=FONTS.find(x=>x[0]===id)||FONTS[0];
    if(f[3]&&!loaded.has(f[3])){const l=document.createElement('link');l.rel='stylesheet';l.href=f[3];document.head.appendChild(l);loaded.add(f[3]);}
    const r=document.documentElement.style;
    if(I18N.lang==='ar'){r.removeProperty('--font-display');r.removeProperty('--font-body');}else{r.setProperty('--font-display',f[1]);r.setProperty('--font-body',f[2]);}
  }
  function applyStyle(id){if(id==='buttery')document.documentElement.removeAttribute('data-style');else document.documentElement.setAttribute('data-style',id);}
  function applyTheme(){
    const pref=Store.get('theme','system'),dark=pref==='dark'||(pref==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark',dark);
    $('#meta-theme').setAttribute('content',dark?'#0E0C0A':'#F6F2EA');
    const b=$('#btn-theme');if(b){if(!b.querySelector('.theme-ic'))b.innerHTML=themeIcon();b.title=b.ariaLabel=t('theme');b.setAttribute('aria-pressed',dark);}
  }
  function apply(){
    applyTheme();applyStyle(Store.get('style','buttery'));applyFont(Store.get('font','fraunces'));
    LXHolidays.setOverrides(Store.get('hOverrides',{}));
    LXDate.cfg.hijri=Store.get('hijriMethod','umalqura');LXDate.cfg.offset=+Store.get('hijriOffset',0);LXDate.cfg.feb29=Store.get('feb29','clamp');
    LXID.settings.retireMode=Store.get('retireMode','inforce');LXID.settings.retireRound=Store.get('retireRound','exact');LXID.settings.checksum=Store.get('checksum',false);
  }
  function render(focus){
    const b=$('#settings-body');
    const sel=(id,opts,val)=>`<select class="field field-sm" id="${id}" style="max-width:15rem">${opts.map(([v,l])=>`<option value="${v}"${String(v)===String(val)?' selected':''}>${esc(l)}</option>`).join('')}</select>`;
    const row=(lbl,hint,ctrl,id)=>`<div class="switch-block"${id?` id="${id}"`:''} style="cursor:default;align-items:center"><span class="txt">${esc(lbl)}${hint?`<small>${esc(hint)}</small>`:''}</span>${ctrl}</div>`;
    const tog=(id,lbl,hint,on)=>`<label class="switch-block" for="${id}"><span class="txt">${esc(lbl)}${hint?`<small>${esc(hint)}</small>`:''}</span><span class="switch"><input type="checkbox" id="${id}"${on?' checked':''}><span class="track"></span></span></label>`;
    b.innerHTML=`
      <div class="set-sec"><h4>${esc(t('s_look'))}</h4>
        ${seg('s-theme',[['system',t('th_system'),'grid'],['light',t('th_light'),'sun'],['dark',t('th_dark'),'moon']],Store.get('theme','system'))}
        <div class="swatches" style="margin-top:.8rem">${STYLES.map(([id,bg])=>`<button type="button" class="swatch${Store.get('style','buttery')===id?' active':''}" data-style="${id}"><i style="background:${bg}"></i>${esc(t('st_'+id))}</button>`).join('')}</div>
        <div class="optlist" style="margin-top:.8rem">${FONTS.map(([id,d])=>`<button type="button" class="opt${Store.get('font','fraunces')===id?' active':''}" data-font="${id}"><span style="font-family:${d};font-size:1.15rem;font-weight:600;min-width:5.5rem">Aa 14</span><span><b>${esc(t('f_'+id))}</b></span></button>`).join('')}</div>
      </div>
      <div class="set-sec" id="set-retire"><h4>${esc(t('s_retire'))}</h4>
        ${row(t('s_mode'),t('s_mode_h'),sel('s-mode',[['cohort',t('mode_cohort')],['inforce',t('mode_inforce')]],LXID.settings.retireMode))}
        ${row(t('s_round'),t('s_round_h'),sel('s-round',[['exact',t('round_exact')],['eom',t('round_eom')],['nextmonth',t('round_nextmonth')]],LXID.settings.retireRound))}
        ${row(t('s_feb29'),t('s_feb29_h'),sel('s-feb29',[['clamp',t('feb29_clamp')],['overflow',t('feb29_overflow')]],LXDate.cfg.feb29))}
        ${tog('s-checksum',t('s_checksum'),t('s_checksum_h'),LXID.settings.checksum)}
      </div>
      <div class="set-sec"><h4>${esc(t('s_dates'))}</h4>
        ${row(t('s_hijri'),LXDate.uqSupported()?t('s_hijri_h'):t('s_hijri_nouq'),sel('s-hijri',[['umalqura',t('method_umalqura')],['tabular',t('method_tabular')]],LXDate.cfg.hijri))}
        ${row(t('s_hoff'),t('s_hoff_h'),sel('s-hoff',[[-2,'−2'],[-1,'−1'],[0,'0'],[1,'+1'],[2,'+2']],LXDate.cfg.offset))}
        ${row(t('s_order'),t('s_order_h'),sel('s-order',[['dmy','DD/MM/YYYY'],['mdy','MM/DD/YYYY'],['ymd','YY/MM/DD']],Store.get('dateOrder','dmy')))}
        ${row(t('s_week'),'',sel('s-week',[[6,Fmt.wd(6)],[0,Fmt.wd(0)],[1,Fmt.wd(1)]],Store.get('weekStart',I18N.lang==='ar'?6:0)))}
        ${I18N.lang==='ar'?row(t('s_digits'),'',sel('s-digits',[['latn','0123'],['arab','٠١٢٣']],Store.get('digits','latn'))):''}
      </div>
      <div class="set-sec"><h4>${esc(t('s_privacy'))}</h4>
        ${tog('s-remember',t('s_remember'),t('s_remember_h'),Store.remember())}
        <div class="row-wrap" style="margin-top:.7rem"><button type="button" class="btn btn-ghost btn-sm" id="s-export">${ic('down')}${esc(t('s_export'))}</button><label class="btn btn-ghost btn-sm" style="cursor:pointer">${ic('up')}${esc(t('s_import'))}<input type="file" id="s-import" accept=".json" class="hide"></label><button type="button" class="btn btn-danger btn-sm" id="s-clear">${ic('trash')}${esc(t('s_clear'))}</button></div>
        <p class="tiny faint" style="margin:.8rem 0 0">${esc(t('s_foot'))}</p>
      </div>`;
    bindSeg(b,'s-theme',v=>{Store.set('theme',v);const r=b.querySelector('[data-seg="s-theme"] .active').getBoundingClientRect();Kit.theme(applyTheme,r.left+r.width/2,r.top+r.height/2);});
    b.querySelectorAll('[data-style]').forEach(x=>x.onclick=()=>{Store.set('style',x.dataset.style);applyStyle(x.dataset.style);b.querySelectorAll('[data-style]').forEach(y=>y.classList.toggle('active',y===x));});
    b.querySelectorAll('[data-font]').forEach(x=>x.onclick=()=>{Store.set('font',x.dataset.font);applyFont(x.dataset.font);b.querySelectorAll('[data-font]').forEach(y=>y.classList.toggle('active',y===x));});
    const on=(id,fn)=>{const e=$('#'+id,b);if(e)e.onchange=ev=>{fn(ev.target.type==='checkbox'?ev.target.checked:ev.target.value);apply();App.soft();toast(t('t_saved'));};};
    on('s-mode',v=>Store.set('retireMode',v));on('s-round',v=>Store.set('retireRound',v));on('s-feb29',v=>Store.set('feb29',v));on('s-checksum',v=>Store.set('checksum',v));
    on('s-hijri',v=>Store.set('hijriMethod',v));on('s-hoff',v=>Store.set('hijriOffset',+v));on('s-order',v=>Store.set('dateOrder',v));on('s-week',v=>Store.set('weekStart',+v));on('s-digits',v=>Store.set('digits',v));
    $('#s-remember',b).onchange=e=>{Store.setRemember(e.target.checked);toast(t('t_saved'));};
    $('#s-export',b).onclick=()=>{const s=Store.snapshot();download(JSON.stringify(s.local,null,2),'raqam-settings.json','application/json');};
    $('#s-import',b).onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const x=await f.text();let o;try{o=JSON.parse(x);if(!o||typeof o!=='object')throw 0;}catch(er){toast(t('t_parse_fail'),'bad');return;}if(!await Kit.confirm({title:t('cf_import_t'),body:t('cf_import_b',f.name),ok:t('s_import'),icon:'up'}))return;const s=Store.snapshot();Store.restore({local:o,sess:{}});I18N.set(Store.get('lang',I18N.lang));apply();App.refresh();render();toast(t('t_imported'),'ok',{action:t('undo'),onAction:()=>{Store.restore(s);I18N.set(Store.get('lang',I18N.lang));apply();App.refresh();render();}});};
    $('#s-clear',b).onclick=async()=>{if(!await Kit.confirm({title:t('cf_reset_t'),body:t('cf_reset_b'),ok:t('s_clear'),danger:true}))return;const s=Store.snapshot();Store.clear();apply();App.refresh();render();toast(t('t_cache_cleared'),'info',{action:t('undo'),onAction:()=>{Store.restore(s);apply();App.refresh();render();}});};
    if(focus){const x=$('#set-'+focus,b);x&&setTimeout(()=>x.scrollIntoView({block:'start',behavior:'smooth'}),80);}
  }
  return{apply,applyTheme,render};
})();

const Cmdk=(()=>{
  let items=[],act=0;
  function base(){
    const nav=[['#/id','g_id_single','id'],['#/id/batch','g_id_batch','rows'],['#/id/upload','g_id_upload','cloud'],['#/id/build','g_build','build'],['#/dates','g_between','range'],['#/dates/add','g_add','calplus'],['#/dates/age','g_age','cake'],['#/dates/day','g_day','today'],['#/dates/convert','g_convert','moon'],['#/dates/holidays','g_holidays','party'],['#/dates/prayer','g_prayer','mosque'],['#/dates/leap','g_leap','repeat'],['#/formulas','g_formulas','fx'],['#/ref','g_structure','book'],['#/ref/gov','g_gov','pin'],['#/ref/law','g_law','gavel'],['#/ref/dates','g_refdates','info']];
    return nav.map(([h,k,i])=>({g:'cg_nav',l:t(k),i,run:()=>App.go(h)})).concat([
      {g:'cg_act',l:t('a_sample'),i:'spark',run:()=>{App.go('#/id/'+LXID.sample());}},
      {g:'cg_act',l:t('a_paste'),i:'paste',run:async()=>{const s=await readClipboard();if(s)smart(s,true);}},
      {g:'cg_act',l:t('a_theme'),i:'moon',run:()=>App.toggleTheme()},
      {g:'cg_act',l:t('a_lang'),i:'globe',run:()=>App.toggleLang()},
      {g:'cg_act',l:t('a_settings'),i:'gear',run:()=>App.openSettings()},
      {g:'cg_act',l:t('a_holidays'),i:'repeat',run:()=>App.openHolidays()},
      {g:'cg_act',l:t('a_print'),i:'print',run:()=>print()}
    ]);
  }
  function smart(q,go){
    const toks=LXID.tokens(q);const out=[];
    if(toks.length>1)out.push({g:'cg_smart',l:t('s_batch',toks.length),i:'rows',run:()=>{App.go('#/id/batch');setTimeout(()=>ViewID.loadBatch(toks.join('\n'),true),40);}});
    else{
      const n=LXID.normalize(q).digits;
      if(n.length===14||toks.length===1)out.push({g:'cg_smart',l:t('s_single',toks[0]||n),i:'id',run:()=>App.go('#/id/'+(toks[0]||n))});
      const p=LXParse.parse(q,Store.get('dateOrder','dmy'));
      if(p&&p.rd!=null){out.push({g:'cg_smart',l:t('s_date',Fmt.date(p.rd,'full')),i:'today',sub:Fmt.hijri(p.rd),run:()=>{Store.set('wdDate',p.rd);App.go('#/dates/day');}});out.push({g:'cg_smart',l:t('s_age',Fmt.date(p.rd)),i:'cake',run:()=>{Store.set('ageBirth',p.rd);App.go('#/dates/age');}});}
    }
    if(go&&out.length){out[0].run();return[];}
    return out;
  }
  function draw(){
    const q=$('#cmdk-input').value.trim(),ql=q.toLowerCase();
    items=(q?smart(q):[]).concat(base().filter(x=>!ql||x.l.toLowerCase().includes(ql)));
    act=clamp(act,0,Math.max(0,items.length-1));
    let g='',h='';
    items.forEach((x,i)=>{if(x.g!==g){g=x.g;h+=`<div class="cmdk-group">${esc(t(g))}</div>`;}h+=`<div class="cmdk-item${i===act?' active':''}" role="option" aria-selected="${i===act}" data-i="${i}">${ic(x.i)}<span class="grow">${esc(x.l)}${x.sub?`<span class="faint small"> · ${esc(x.sub)}</span>`:''}</span></div>`;});
    $('#cmdk-list').innerHTML=h||`<div class="empty"><span class="bubble">${ic('search')}</span><span>${esc(t('no_cmd'))}</span></div>`;
    $$('#cmdk-list [data-i]').forEach(e=>{e.onclick=()=>pick(+e.dataset.i);e.onmousemove=()=>{if(act!==+e.dataset.i){act=+e.dataset.i;$$('#cmdk-list .cmdk-item').forEach((x,j)=>x.classList.toggle('active',j===act));}};});
  }
  function pick(i){const x=items[i];if(!x)return;Overlay.close('ov-cmdk');setTimeout(()=>x.run(),30);}
  function open(){const i=$('#cmdk-input');i.value='';i.placeholder=t('cmdk_ph');act=0;draw();Overlay.open('ov-cmdk');}
  function init(){
    const i=$('#cmdk-input');
    i.addEventListener('input',()=>{act=0;draw();});
    i.addEventListener('keydown',e=>{
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!items.length)return;act=(act+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;$$('#cmdk-list .cmdk-item').forEach((x,j)=>x.classList.toggle('active',j===act));const a=$('#cmdk-list .cmdk-item.active');a&&a.scrollIntoView({block:'nearest'});}
      else if(e.key==='Enter'){e.preventDefault();pick(act);}
    });
  }
  return{open,init};
})();
