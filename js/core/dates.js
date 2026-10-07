const LXDate=(()=>{
  const fl=Math.floor;
  const mod=(a,b)=>a-b*fl(a/b);
  const EPOCH_UNIX=719163;
  const isLeap=y=>mod(y,4)===0&&(mod(y,100)!==0||mod(y,400)===0);
  const MDAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
  const dim=(y,m)=>m===2&&isLeap(y)?29:MDAYS[m-1];

  function fromG(y,m,d){
    return 365*(y-1)+fl((y-1)/4)-fl((y-1)/100)+fl((y-1)/400)+fl((367*m-362)/12)+(m<=2?0:isLeap(y)?-1:-2)+d;
  }
  function gYear(rd){
    const d0=rd-1,n400=fl(d0/146097),d1=mod(d0,146097),n100=fl(d1/36524),d2=mod(d1,36524),n4=fl(d2/1461),d3=mod(d2,1461),n1=fl(d3/365);
    const y=400*n400+100*n100+4*n4+n1;
    return(n100===4||n1===4)?y:y+1;
  }
  function toG(rd){
    const y=gYear(rd),prior=rd-fromG(y,1,1),corr=rd<fromG(y,3,1)?0:isLeap(y)?1:2;
    const m=fl((12*(prior+corr)+373)/367);
    return{y,m,d:rd-fromG(y,m,1)+1};
  }
  const validG=(y,m,d)=>Number.isInteger(y)&&Number.isInteger(m)&&Number.isInteger(d)&&y>=1&&y<=9999&&m>=1&&m<=12&&d>=1&&d<=dim(y,m);
  const rd=(y,m,d)=>validG(y,m,d)?fromG(y,m,d):null;
  const dow=r=>mod(r,7);
  const fromJS=dt=>fromG(dt.getFullYear(),dt.getMonth()+1,dt.getDate());
  const today=()=>fromJS(new Date());
  function todayIn(tz){
    try{
      const p=new Intl.DateTimeFormat('en-US',{timeZone:tz,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date());
      const g=k=>+p.find(x=>x.type===k).value;
      return fromG(g('year'),g('month'),g('day'));
    }catch(e){return today();}
  }
  const toUTCms=r=>(r-EPOCH_UNIX)*86400000;
  const fromUTCms=ms=>fl(ms/86400000)+EPOCH_UNIX;
  function toUTCDate(r){return new Date(toUTCms(r));}
  const pad=(n,w=2)=>String(Math.abs(n)).padStart(w,'0');
  function iso(r){if(r==null)return'';const g=toG(r);return pad(g.y,4)+'-'+pad(g.m)+'-'+pad(g.d);}
  function parseISO(s){
    const m=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s||'').trim());
    return m?rd(+m[1],+m[2],+m[3]):null;
  }
  function addMonths(r,n,overflow){
    const g=toG(r),t=g.y*12+(g.m-1)+n,y=fl(t/12),m=mod(t,12)+1;
    if(overflow&&g.d>dim(y,m))return fromG(y,m,1)+g.d-1;
    return fromG(y,m,Math.min(g.d,dim(y,m)));
  }
  const addYears=(r,n,overflow)=>addMonths(r,12*n,overflow);
  function monthsBetween(a,b,overflow){
    const ga=toG(a),gb=toG(b);
    let n=(gb.y-ga.y)*12+(gb.m-ga.m);
    while(n>0&&addMonths(a,n,overflow)>b)n--;
    return n;
  }
  function diff(a,b,overflow){
    const sign=b<a?-1:1;
    if(sign<0){const t=a;a=b;b=t;}
    const months=monthsBetween(a,b,overflow);
    const anchor=addMonths(a,months,overflow);
    const days=b-anchor;
    return{sign,years:fl(months/12),months:months%12,days,totalMonths:months,totalDays:b-a,weeks:fl((b-a)/7),weekDays:(b-a)%7};
  }
  function isoWeek(r){
    const th=r-mod(dow(r)+6,7)+3,y=toG(th).y;
    return{year:y,week:fl((th-fromG(y,1,1))/7)+1};
  }
  function weekOfYear(r,startDow){
    const g=toG(r),j1=fromG(g.y,1,1),off=mod(dow(j1)-startDow,7);
    return fl((r-j1+off)/7)+1;
  }
  const dayOfYear=r=>r-fromG(toG(r).y,1,1)+1;
  const yearLength=y=>isLeap(y)?366:365;
  const kdayOnOrBefore=(k,r)=>r-mod(r-k,7);
  const kdayAfter=(k,r)=>kdayOnOrBefore(k,r+7);
  const kdayOnOrAfter=(k,r)=>kdayOnOrBefore(k,r+6);
  function nthKday(n,k,y,m){
    if(n>0)return kdayOnOrBefore(k,fromG(y,m,1)-1)+7*n;
    return kdayOnOrAfter(k,fromG(y,m,dim(y,m))+1)+7*n;
  }
  function weekdayCounts(lo,hiEx){
    const c=[0,0,0,0,0,0,0],n=hiEx-lo;
    if(n<=0)return c;
    const full=fl(n/7);
    for(let i=0;i<7;i++)c[i]=full;
    const s=dow(lo);
    for(let i=0;i<n%7;i++)c[(s+i)%7]++;
    return c;
  }
  const excelSerial=r=>{const s=r-fromG(1899,12,30);return r<fromG(1900,3,1)?s-1:s;};
  const fromExcel=s=>s<61?s+fromG(1899,12,30)+1:s+fromG(1899,12,30);
  const jdn=r=>r+1721425;

  const JE=fromG(0,12,30);
  const jLeap=y=>mod(y,4)===(y>0?0:3);
  function fromJ(y,m,d){
    const yy=y<0?y+1:y;
    return JE-1+365*(yy-1)+fl((yy-1)/4)+fl((367*m-362)/12)+(m<=2?0:jLeap(y)?-1:-2)+d;
  }
  function toJ(r){
    const ap=fl((4*(r-JE)+1464)/1461),y=ap<=0?ap-1:ap;
    const prior=r-fromJ(y,1,1),corr=r<fromJ(y,3,1)?0:jLeap(y)?1:2;
    const m=fl((12*(prior+corr)+373)/367);
    return{y,m,d:r-fromJ(y,m,1)+1};
  }
  const jdim=(y,m)=>m===2&&jLeap(y)?29:MDAYS[m-1];

  const CE=fromJ(284,8,29);
  const fromC=(y,m,d)=>CE-1+365*(y-1)+fl(y/4)+30*(m-1)+d;
  function toC(r){
    const y=fl((4*(r-CE)+1463)/1461),m=fl((r-fromC(y,1,1))/30)+1;
    return{y,m,d:r+1-fromC(y,m,1)};
  }
  const cdim=(y,m)=>m<13?30:(mod(y,4)===3?6:5);

  const IE=fromJ(622,7,16);
  const hLeap=y=>mod(14+11*y,30)<11;
  const fromHt=(y,m,d)=>IE-1+(y-1)*354+fl((3+11*y)/30)+29*(m-1)+fl(m/2)+d;
  function toHt(r){
    const y=fl((30*(r-IE)+10646)/10631),prior=r-fromHt(y,1,1),m=fl((11*prior+330)/325);
    return{y,m,d:r-fromHt(y,m,1)+1};
  }
  const htdim=(y,m)=>m%2===1||(m===12&&hLeap(y))?30:29;

  let uqFmt=null,uqOK=null;
  const uqCache=new Map();
  function uqSupported(){
    if(uqOK!==null)return uqOK;
    try{
      const f=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura-nu-latn',{timeZone:'UTC',year:'numeric',month:'numeric',day:'numeric'});
      uqOK=f.resolvedOptions().calendar==='islamic-umalqura';
      if(uqOK){uqFmt=f;const t=uqParts(fromG(2025,3,1));uqOK=!!t&&t.y===1446&&t.m===9&&t.d===1;}
    }catch(e){uqOK=false;}
    return uqOK;
  }
  function uqParts(r){
    if(uqCache.has(r))return uqCache.get(r);
    const p=uqFmt.formatToParts(toUTCDate(r));
    let y=0,m=0,d=0;
    for(const x of p){if(x.type==='year'||x.type==='relatedYear')y=y||parseInt(x.value,10);else if(x.type==='month')m=parseInt(x.value,10);else if(x.type==='day')d=parseInt(x.value,10);}
    const out=y&&m&&d?{y,m,d}:null;
    if(uqCache.size>20000)uqCache.clear();
    uqCache.set(r,out);
    return out;
  }
  const UQ_MIN=fromG(1900,4,30),UQ_MAX=fromG(2076,11,16);
  const cfg={hijri:'umalqura',offset:0,feb29:'clamp'};
  function hijriMethod(){return cfg.hijri==='umalqura'&&uqSupported()?'umalqura':'tabular';}
  function toHraw(r,method){
    if(method==='umalqura'&&r>=UQ_MIN&&r<=UQ_MAX){const u=uqParts(r);if(u)return u;}
    return toHt(r);
  }
  function toH(r){return toHraw(r+cfg.offset,hijriMethod());}
  function fromH(y,m,d){
    if(!(y>=1&&y<=9666&&m>=1&&m<=12&&d>=1&&d<=30))return null;
    const method=hijriMethod();
    const est=fromHt(y,m,Math.min(d,29));
    if(method==='umalqura'&&est>=UQ_MIN&&est<=UQ_MAX){
      const base=fromHt(y,m,1);
      for(let k=-4;k<=4;k++){const u=uqParts(base+k);if(u&&u.y===y&&u.m===m&&u.d===1){const r=base+k+d-1,c=uqParts(r);return c&&c.m===m&&c.d===d?r-cfg.offset:null;}}
    }
    if(d>htdim(y,m))return null;
    return fromHt(y,m,d)-cfg.offset;
  }
  function hdim(y,m){
    const s=fromH(y,m,1);if(s==null)return 30;
    return fromH(y,m,30)!=null?30:29;
  }
  function hijriInGYear(gy,hm,hd){
    const a=toH(fromG(gy,1,1)).y,b=toH(fromG(gy,12,31)).y,out=[];
    for(let y=a;y<=b;y++){const r=fromH(y,hm,hd);if(r!=null&&toG(r).y===gy)out.push(r);}
    return out;
  }
  function orthodoxEaster(gy){
    const ep=mod(14+11*mod(gy,19),30),jy=gy>0?gy:gy-1;
    return kdayAfter(0,fromJ(jy,4,19)-ep);
  }
  function westernEaster(gy){
    const c=fl(gy/100)+1,ep=mod(14+11*mod(gy,19)-fl(3*c/4)+fl((5+8*c)/25),30);
    const adj=(ep===0||(ep===1&&10<mod(gy,19)))?ep+1:ep;
    return kdayAfter(0,fromG(gy,4,19)-adj);
  }
  const copticChristmas=gy=>fromC(gy-284,4,29);
  const nayrouz=gy=>fromC(gy-283,1,1);
  function zodiac(r){
    const g=toG(r),cut=[20,19,21,20,21,21,23,23,23,23,22,22];
    return(g.d>=cut[g.m-1]?g.m:g.m-1+12)%12;
  }
  function chineseZodiac(gy){return mod(gy-4,12);}
  return{fl,mod,isLeap,dim,fromG,toG,validG,rd,dow,fromJS,today,todayIn,toUTCms,fromUTCms,toUTCDate,pad,iso,parseISO,addMonths,addYears,monthsBetween,diff,isoWeek,weekOfYear,dayOfYear,yearLength,kdayOnOrBefore,kdayAfter,kdayOnOrAfter,nthKday,weekdayCounts,excelSerial,fromExcel,jdn,fromJ,toJ,jdim,jLeap,fromC,toC,cdim,fromHt,toHt,htdim,hLeap,uqSupported,hijriMethod,toH,fromH,hdim,hijriInGYear,orthodoxEaster,westernEaster,copticChristmas,nayrouz,zodiac,chineseZodiac,cfg};
})();

const LXParse=(()=>{
  const D=LXDate;
  const EN_M=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const AR_M=[['يناير','كانون الثاني','جانفي'],['فبراير','شباط','فيفري'],['مارس','آذار'],['أبريل','ابريل','إبريل','نيسان','أفريل'],['مايو','أيار','ماي'],['يونيو','حزيران','يونيه','جوان'],['يوليو','تموز','يوليه','جويلية'],['أغسطس','اغسطس','آب','أوت'],['سبتمبر','أيلول'],['أكتوبر','اكتوبر','تشرين الأول'],['نوفمبر','تشرين الثاني'],['ديسمبر','كانون الأول']];
  const EN_D=['sun','mon','tue','wed','thu','fri','sat'];
  const AR_D=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  function digits(s){
    return String(s??'').replace(/[\u0660-\u0669]/g,c=>c.charCodeAt(0)-0x0660).replace(/[\u06F0-\u06F9]/g,c=>c.charCodeAt(0)-0x06F0).replace(/[\uFF10-\uFF19]/g,c=>c.charCodeAt(0)-0xFF10);
  }
  function monthIndex(tok){
    const t=tok.toLowerCase().replace(/\.$/,'');
    if(t.length>=3){const i=EN_M.findIndex(m=>t.startsWith(m));if(i>=0)return i+1;}
    const a=tok.replace(/^ال/,'');
    for(let i=0;i<12;i++)if(AR_M[i].some(n=>n===tok||n.replace(/^ال/,'')===a))return i+1;
    return 0;
  }
  function pivot(yy){const cur=D.toG(D.today()).y%100;return yy<=cur+10?2000+yy:1900+yy;}
  function parse(input,order){
    order=order||'dmy';
    let s=digits(input).trim().toLowerCase().replace(/\s+/g,' ');
    if(!s)return null;
    const t=D.today();
    const res=(r,extra)=>r==null?null:Object.assign({rd:r},extra||{});
    if(/^(today|now|tod|اليوم|النهارده|النهاردة)$/.test(s))return res(t);
    if(/^(tomorrow|tmr|tom|غدا|غداً|بكرة|بكره)$/.test(s))return res(t+1);
    if(/^(yesterday|yday|أمس|امس|امبارح|إمبارح)$/.test(s))return res(t-1);
    let m=/^([+-])\s*(\d{1,6})\s*([a-z\u0600-\u06ff]*)$/.exec(s);
    if(m){
      const n=(m[1]==='-'?-1:1)*+m[2],u=m[3]||'d';
      if(/^(d|days?|يوم|ايام|أيام)$/.test(u))return res(t+n);
      if(/^(w|wk|weeks?|اسبوع|أسبوع|اسابيع|أسابيع)$/.test(u))return res(t+7*n);
      if(/^(m|mo|months?|شهر|شهور|أشهر)$/.test(u))return res(D.addMonths(t,n));
      if(/^(y|yr|years?|سنة|سنه|سنوات|سنين)$/.test(u))return res(D.addYears(t,n));
      return null;
    }
    m=/^(next |this |last )?([a-z]{3,9}|[\u0600-\u06ff]+)$/.exec(s);
    if(m){
      let k=EN_D.findIndex(d=>m[2].startsWith(d));
      if(k<0)k=AR_D.findIndex(d=>d===m[2]||d.replace(/^ال/,'')===m[2].replace(/^ال/,''));
      if(k>=0){
        if(m[1]==='last ')return res(D.kdayOnOrBefore(k,t-1));
        if(m[1]==='next ')return res(D.kdayAfter(k,t));
        return res(D.kdayOnOrAfter(k,t));
      }
    }
    m=/^(\d{4})(\d{2})(\d{2})$/.exec(s);
    if(m&&+m[1]>=1000){const r=D.rd(+m[1],+m[2],+m[3]);if(r!=null)return res(r);}
    m=/^(\d{2})(\d{2})(\d{4})$/.exec(s);
    if(m){const a=+m[1],b=+m[2],y=+m[3];const r=order==='mdy'?D.rd(y,a,b):D.rd(y,b,a);if(r!=null)return res(r);}
    m=/^(\d{1,4})[\/\-.\s](\d{1,2})(?:[\/\-.\s](\d{1,4}))?$/.exec(s);
    if(m){
      const A=m[1],B=+m[2],C=m[3];
      if(A.length>=3){const r=D.rd(+A,B,C?+C:1);return C?res(r):null;}
      let y=C==null?D.toG(t).y:(C.length<=2?pivot(+C):+C);
      let d=+A,mo=B;
      if(order==='mdy'){d=B;mo=+A;}
      else if(order==='ymd'&&C&&C.length<=2&&A.length<=2){y=pivot(+A);mo=B;d=+C;}
      const r=D.rd(y,mo,d);
      const amb=d<=12&&mo<=12&&d!==mo;
      return res(r,{ambiguous:amb});
    }
    const toks=s.replace(/,/g,' ').replace(/(\d)(st|nd|rd|th)\b/g,'$1').split(' ').filter(Boolean);
    if(toks.length>=2&&toks.length<=3){
      let d=0,mo=0,y=0;
      for(const tk of toks){
        if(/^\d+$/.test(tk)){const n=+tk;if(tk.length>=3||n>31)y=n;else if(!d)d=n;else y=pivot(n);}
        else{const k=monthIndex(tk);if(k)mo=k;else return null;}
      }
      if(!mo||!d)return null;
      if(!y)y=D.toG(t).y;
      return res(D.rd(y,mo,d));
    }
    return null;
  }
  return{parse,digits,monthIndex};
})();
