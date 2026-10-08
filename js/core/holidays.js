const LXHolidays=(()=>{
  const D=LXDate;
  const PACK=[
    {k:'h_coptic_xmas',kind:'coptic'},
    {k:'h_jan25',kind:'fixed',m:1,d:25},
    {k:'h_sinai',kind:'fixed',m:4,d:25},
    {k:'h_labour',kind:'fixed',m:5,d:1},
    {k:'h_june30',kind:'fixed',m:6,d:30},
    {k:'h_july23',kind:'fixed',m:7,d:23},
    {k:'h_oct6',kind:'fixed',m:10,d:6},
    {k:'h_easter',kind:'easter',off:0,optional:true},
    {k:'h_sham',kind:'easter',off:1},
    {k:'h_hijri_ny',kind:'hijri',m:1,d:1},
    {k:'h_mawlid',kind:'hijri',m:3,d:12},
    {k:'h_fitr1',kind:'hijri',m:10,d:1},
    {k:'h_fitr2',kind:'hijri',m:10,d:2},
    {k:'h_fitr3',kind:'hijri',m:10,d:3},
    {k:'h_arafat',kind:'hijri',m:12,d:9},
    {k:'h_adha1',kind:'hijri',m:12,d:10},
    {k:'h_adha2',kind:'hijri',m:12,d:11},
    {k:'h_adha3',kind:'hijri',m:12,d:12}
  ];
  let OV={};
  const isoOK=s=>typeof s==='string'&&D.parseISO(s)!=null;
  function clean(o){
    const out={};if(!o||typeof o!=='object')return out;
    const ys=o.years&&typeof o.years==='object'?o.years:o;
    for(const y in ys){
      if(!/^\d{4}$/.test(y))continue;const v=ys[y]||{},r={set:{},extra:[]};
      if(v.set&&typeof v.set==='object')for(const k in v.set){const e=v.set[k]||{},d=(Array.isArray(e)?e:e.d||[]).filter(isoOK);if(PACK.some(p=>p.k===k))r.set[k]={d,src:String(e.src||'').slice(0,200)};}
      if(Array.isArray(v.extra))v.extra.forEach(e=>{if(e&&isoOK(e.d))r.extra.push({d:e.d,label:String(e.label||'').slice(0,120),src:String(e.src||'').slice(0,200)});});
      if(Object.keys(r.set).length||r.extra.length)out[y]=r;
    }
    return out;
  }
  function setOverrides(o){OV=clean(o);}
  const overrides=()=>OV;
  function computed(y,opts){
    const out=[];
    for(const h of PACK){
      if(h.optional&&!opts.includeOptional)continue;
      if(h.kind==='fixed')out.push({rd:D.fromG(y,h.m,h.d),k:h.k,est:false});
      else if(h.kind==='coptic')out.push({rd:D.copticChristmas(y),k:h.k,est:false});
      else if(h.kind==='easter')out.push({rd:D.orthodoxEaster(y)+h.off,k:h.k,est:false});
      else D.hijriInGYear(y,h.m,h.d).forEach(r=>out.push({rd:r,k:h.k,est:true}));
    }
    return out;
  }
  function forYear(y,opts){
    opts=opts||{};
    let out=computed(y,opts);
    const o=!opts.raw&&OV[y];
    if(o){
      const keep=[];
      out.forEach(h=>{const s=o.set[h.k];if(!s)keep.push(h);});
      for(const k in o.set){
        const p=PACK.find(x=>x.k===k);if(!p||(p.optional&&!opts.includeOptional))continue;
        const was=out.filter(h=>h.k===k).map(h=>h.rd),s=o.set[k];
        if(!s.d.length&&opts.withCancelled)keep.push({rd:was[0],k,est:false,ov:true,cancelled:true,src:s.src,was});
        s.d.forEach(d=>keep.push({rd:D.parseISO(d),k,est:false,ov:true,src:s.src,was}));
      }
      o.extra.forEach((e,i)=>keep.push({rd:D.parseISO(e.d),k:null,label:e.label,est:false,ov:true,extra:i,src:e.src}));
      out=keep;
    }
    return out.filter(h=>h.rd!=null).sort((a,b)=>a.rd-b.rd);
  }
  function parseLine(line,order){
    const s=line.trim();if(!s||s.startsWith('#'))return null;
    let datePart=s,label='';
    const m=/^(.+?)\s*(?:,|;|\t|\s-\s|\s–\s)\s*(.*)$/.exec(s);
    if(m){datePart=m[1];label=m[2].replace(/^"|"$/g,'').trim();}
    const range=/^(.+?)\s*(?:→|->|\.\.|to|إلى)\s*(.+)$/i.exec(datePart);
    if(range){
      const a=LXParse.parse(range[1],order),b=LXParse.parse(range[2],order);
      if(!a||!b||a.rd==null||b.rd==null)return{ok:false,raw:s,reason:'h_reason_format'};
      if(b.rd<a.rd||b.rd-a.rd>60)return{ok:false,raw:s,reason:'h_reason_range'};
      const out=[];for(let r=a.rd;r<=b.rd;r++)out.push(r);
      return{ok:true,raw:s,rds:out,label};
    }
    const p=LXParse.parse(datePart,order);
    if(!p)return{ok:false,raw:s,reason:'h_reason_format'};
    if(p.rd==null)return{ok:false,raw:s,reason:'h_reason_invalid'};
    return{ok:true,raw:s,rds:[p.rd],label};
  }
  function parseText(text,existing,order){
    const ok=[],issues=[],seen=new Set();
    String(text||'').split(/\r?\n/).forEach((line,i)=>{
      const p=parseLine(line,order);
      if(!p)return;
      if(!p.ok){issues.push({line:i+1,raw:p.raw,reason:p.reason,kind:'bad'});return;}
      p.rds.forEach(r=>{
        const k=D.iso(r);
        if(seen.has(k)){issues.push({line:i+1,raw:p.raw,reason:'h_reason_dup',kind:'warn'});return;}
        if(existing&&existing.has(k)){issues.push({line:i+1,raw:p.raw,reason:'h_reason_saved',kind:'warn'});return;}
        seen.add(k);ok.push({key:k,label:p.label});
      });
    });
    return{ok,issues};
  }
  function ics(events,name){
    const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
    const esc=s=>String(s).replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n');
    const d8=r=>D.iso(r).replace(/-/g,'');
    const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Raqam//Toolkit 3//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:'+esc(name||'Raqam')];
    events.forEach((e,i)=>{
      L.push('BEGIN:VEVENT','UID:raqam-'+d8(e.rd)+'-'+i+'-'+Math.random().toString(36).slice(2,8)+'@raqam','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d8(e.rd),'DTEND;VALUE=DATE:'+d8(e.rd+1),'SUMMARY:'+esc(e.title),'TRANSP:TRANSPARENT');
      if(e.desc)L.push('DESCRIPTION:'+esc(e.desc));
      if(e.yearly)L.push('RRULE:FREQ=YEARLY');
      if(e.alarm)L.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+esc(e.title),'TRIGGER:-P'+e.alarm+'D','END:VALARM');
      L.push('END:VEVENT');
    });
    L.push('END:VCALENDAR');
    return L.join('\r\n');
  }
  return{PACK,forYear,computed,setOverrides,overrides,clean,parseLine,parseText,ics};
})();
