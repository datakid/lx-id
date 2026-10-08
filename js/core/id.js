const LXID=(()=>{
  const D=LXDate;
  const GOV={'01':['Cairo','القاهرة','Greater Cairo'],'02':['Alexandria','الإسكندرية','Mediterranean'],'03':['Port Said','بورسعيد','Canal'],'04':['Suez','السويس','Canal'],'11':['Damietta','دمياط','Delta'],'12':['Dakahlia','الدقهلية','Delta'],'13':['Sharqia','الشرقية','Delta'],'14':['Qalyubia','القليوبية','Greater Cairo'],'15':['Kafr El Sheikh','كفر الشيخ','Delta'],'16':['Gharbia','الغربية','Delta'],'17':['Monufia','المنوفية','Delta'],'18':['Beheira','البحيرة','Delta'],'19':['Ismailia','الإسماعيلية','Canal'],'21':['Giza','الجيزة','Greater Cairo'],'22':['Beni Suef','بني سويف','Upper Egypt'],'23':['Fayoum','الفيوم','Upper Egypt'],'24':['Minya','المنيا','Upper Egypt'],'25':['Asyut','أسيوط','Upper Egypt'],'26':['Sohag','سوهاج','Upper Egypt'],'27':['Qena','قنا','Upper Egypt'],'28':['Aswan','أسوان','Upper Egypt'],'29':['Luxor','الأقصر','Upper Egypt'],'31':['Red Sea','البحر الأحمر','Frontier'],'32':['New Valley','الوادي الجديد','Frontier'],'33':['Matrouh','مطروح','Frontier'],'34':['North Sinai','شمال سيناء','Frontier'],'35':['South Sinai','جنوب سيناء','Frontier'],'88':['Born abroad','خارج الجمهورية','Abroad']};
  const REGION_AR={'Greater Cairo':'القاهرة الكبرى','Mediterranean':'الساحل الشمالي','Canal':'مدن القناة','Delta':'الدلتا','Upper Egypt':'الصعيد','Frontier':'المحافظات الحدودية','Abroad':'خارج مصر'};
  const STEPS=[[2032,61],[2034,62],[2036,63],[2038,64],[2040,65]].map(([y,a])=>({rd:D.fromG(y,7,1),y,age:a}));
  const SAMPLES=['29805121401234','30101011509876','27510202100001','26501010100001','29202290201234','30501010100001','28811250102345','29607308800217'];
  const settings={retireMode:'inforce',retireRound:'exact',checksum:false,minAge:0};
  function ageInForce(r){let a=60;for(const s of STEPS)if(r>=s.rd)a=s.age;return a;}
  function retirementAge(b,mode,overflow){
    if((mode||settings.retireMode)==='inforce'){
      for(let a=60;a<65;a++)if(a>=ageInForce(D.addYears(b,a,overflow)))return a;
      return 65;
    }
    return ageInForce(D.addYears(b,60,overflow));
  }
  function roundRetire(r,how){
    const g=D.toG(r);
    if(how==='eom')return D.fromG(g.y,g.m,D.dim(g.y,g.m));
    if(how==='nextmonth')return D.addMonths(D.fromG(g.y,g.m,1),1);
    return r;
  }
  function retirement(b,opts){
    opts=opts||{};
    const overflow=(opts.feb29||D.cfg.feb29)==='overflow';
    const mode=opts.mode||settings.retireMode,round=opts.round||settings.retireRound;
    const age=retirementAge(b,mode,overflow);
    const other=retirementAge(b,mode==='cohort'?'inforce':'cohort',overflow);
    const turn60=D.addYears(b,60,overflow);
    const exact=D.addYears(b,age,overflow);
    const date=roundRetire(exact,round);
    const step=STEPS.filter(s=>turn60>=s.rd).pop()||null;
    return{age,date,exact,turn60,step,mode,altAge:other,altDate:roundRetire(D.addYears(b,other,overflow),round),differs:other!==age};
  }
  function normalize(raw){
    let s=String(raw??'').trim();
    if(/^[+-]?\d*\.?\d+e[+-]?\d+$/i.test(s)){
      const n=Number(s);
      if(Number.isFinite(n)&&Number.isInteger(n)&&Math.abs(n)<=Number.MAX_SAFE_INTEGER)return{digits:n.toFixed(0),sci:true,lossy:false};
      return{digits:'',sci:true,lossy:true};
    }
    s=LXParse.digits(s);
    if(/^\d+\.0+$/.test(s))s=s.replace(/\.0+$/,'');
    return{digits:s.replace(/\D/g,''),sci:false,lossy:false};
  }
  function luhn(d13){let s=0;for(let i=0;i<13;i++){let v=d13.charCodeAt(i)-48;if(i%2===0){v*=2;if(v>9)v-=9;}s+=v;}return(10-s%10)%10;}
  function isFake(d){
    if(/^(\d)\1{13}$/.test(d))return true;
    if('01234567890123456789'.includes(d)||'98765432109876543210'.includes(d))return true;
    if(/^(\d{2})\1{6}$/.test(d)||/^(\d{7})\1$/.test(d))return true;
    return false;
  }
  function parse(raw,opts){
    opts=opts||{};
    const now=opts.today!=null?opts.today:D.today();
    const tr=[];
    const T=(k,a,seg)=>{if(opts.trace)tr.push({k,a:a||[],seg:seg||null});};
    const checks={};
    const r={raw:String(raw??''),valid:false,isNull:false,error:null,digits:'',checks:[],flags:[],trace:tr,warn:[]};
    const done=()=>{r.checks=CHECKS.map(k=>({k,pass:k in checks?checks[k]:null}));r.passed=r.checks.filter(c=>c.pass===true).length;r.total=CHECKS.length;return r;};
    if(raw==null||String(raw).trim()===''){r.isNull=true;r.error={k:'err_empty'};T('tr_empty');return done();}
    const n=normalize(raw);
    if(n.sci){
      if(n.lossy){r.error={k:'err_sci'};T('tr_sci_bad');return done();}
      T('tr_sci',[String(raw).trim(),n.digits]);r.flags.push('sci');
    }
    const d=n.digits;r.digits=d;
    T('tr_norm',[String(raw).trim().slice(0,40),d.length]);
    if(!d.length){r.isNull=true;r.error={k:'err_empty'};T('tr_nodigits');return done();}
    checks.len=d.length===14;
    if(!checks.len){r.error={k:'err_len',a:[d.length]};T('tr_len_bad',[d.length]);return done();}
    checks.fake=!isFake(d);
    if(!checks.fake){r.flags.push('fake');T('tr_fake',[],'all');}
    r.govCode=d.slice(7,9);
    checks.gov=!!GOV[r.govCode];
    T(checks.gov?'tr_gov':'tr_gov_bad',[r.govCode],'gov');
    if(!checks.gov)r.flags.push('gov');
    const c=+d[0];
    checks.century=c===2||c===3;
    if(!checks.century){r.error={k:'err_century',a:[d[0]]};T('tr_century_bad',[d[0]],'century');return done();}
    const base=1700+100*c;
    r.century=c;r.centuryBase=base;
    T('tr_century',[d[0],base],'century');
    const yy=+d.slice(1,3),mm=+d.slice(3,5),dd=+d.slice(5,7);
    r.y=base+yy;r.m=mm;r.d=dd;
    T('tr_year',[base,yy,r.y],'year');
    if(mm<1||mm>12){checks.date=false;r.error={k:'err_month',a:[mm]};T('tr_month_bad',[mm],'month');return done();}
    if(dd<1||dd>D.dim(r.y,mm)){checks.date=false;r.error={k:'err_day',a:[dd,mm,r.y]};T('tr_day_bad',[dd,mm,r.y,D.dim(r.y,mm)],'day');return done();}
    checks.date=true;
    const b=D.fromG(r.y,mm,dd);
    r.birth=b;
    checks.future=b<=now;
    if(!checks.future){r.error={k:'err_future',a:[b]};T('tr_future',[b],['year','month','day']);return done();}
    T('tr_birth',[b],['year','month','day']);
    r.serial=d.slice(9,13);r.genderDigit=+d[12];r.gender=r.genderDigit%2?'M':'F';r.check=d[13];
    T('tr_serial',[r.serial],'serial');
    T('tr_gender',[d[12],r.gender],'serial');
    T('tr_check',[r.check],'check');
    const lx=luhn(d.slice(0,13));
    r.checksum={expected:lx,actual:+r.check,match:lx===+r.check};
    const overflow=D.cfg.feb29==='overflow';
    const age=D.diff(b,now,overflow);
    r.age=age;
    T('tr_age',[age.years,age.months,age.days,age.totalDays],['year','month','day']);
    const ret=retirement(b);
    r.ret=ret;
    T(ret.step?'tr_ret_step':'tr_ret_base',[ret.turn60,ret.step?ret.step.rd:STEPS[0].rd,ret.age],['year','month','day']);
    if(ret.differs)T('tr_ret_alt',[ret.altAge,ret.altDate]);
    T('tr_ret_date',[ret.date]);
    r.daysToRetire=ret.date-now;
    r.retired=r.daysToRetire<=0;
    r.toRetire=r.retired?null:D.diff(now,ret.date,overflow);
    r.career=Math.max(0,Math.min(100,(now-b)/Math.max(1,ret.date-b)*100));
    r.weekday=D.dow(b);
    const nb=nextBirthday(b,now);
    r.nextBirthday=nb;
    if(mm===2&&dd===29)r.flags.push('feb29');
    if(age.years>=110)r.flags.push('old');
    if(yy===0&&mm===1&&dd===1)r.flags.push('jan1');
    if(r.serial==='0000')r.flags.push('serial0');
    if(r.govCode==='88')r.flags.push('abroad');
    if(age.years<16)r.flags.push('minor');
    if(settings.checksum&&!r.checksum.match)r.flags.push('checksum');
    T('tr_summary',[CHECKS.filter(k=>checks[k]===true).length,CHECKS.length]);
    T('tr_disclaimer');
    r.valid=true;r.id=d;
    return done();
  }
  const CHECKS=['len','century','date','future','gov','fake'];
  function nextBirthday(b,now){
    const overflow=D.cfg.feb29==='overflow';
    const a=D.diff(b,now,overflow).years;
    let next=D.addYears(b,a,overflow);
    if(next<now)next=D.addYears(b,a+1,overflow);
    return{rd:next,days:next-now,turns:D.diff(b,next,overflow).years};
  }
  function tokens(text){
    const s=LXParse.digits(String(text||''));
    const out=s.match(/(?<!\d)[23]\d{13}(?!\d)/g);
    return out||[];
  }
  function splitLines(raw){
    const lines=String(raw||'').split(/\r?\n/).map(x=>x.trim());
    while(lines.length&&lines[lines.length-1]==='')lines.pop();
    return lines;
  }
  function suggest(raw,today){
    const d=normalize(raw).digits;
    if(d.length<12||d.length>16)return[];
    const now=today!=null?today:D.today();
    const cands=new Map();
    const add=(s,kind,w)=>{if(s.length!==14||cands.has(s)||s===d)return;cands.set(s,{id:s,kind,w});};
    if(d.length===14){
      for(let i=0;i<13;i++)add(d.slice(0,i)+d[i+1]+d[i]+d.slice(i+2),'swap',3);
      for(let i=0;i<14;i++)for(let v=0;v<10;v++)if(String(v)!==d[i])add(d.slice(0,i)+v+d.slice(i+1),'sub',2);
    }else if(d.length===13){
      for(let i=0;i<=13;i++)for(let v=0;v<10;v++)add(d.slice(0,i)+v+d.slice(i),'ins',1);
    }else if(d.length===15){
      for(let i=0;i<15;i++)add(d.slice(0,i)+d.slice(i+1),'del',1);
    }else if(d.length===16){
      for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)add((d.slice(0,i)+d.slice(i+1,j)+d.slice(j+1)),'del',.5);
    }
    const out=[];
    for(const c of cands.values()){
      const p=parse(c.id,{today:now});
      if(!p.valid||p.flags.includes('fake')||p.flags.includes('gov')||p.age.years>100)continue;
      let w=c.w;
      if(settings.checksum&&p.checksum.match)w+=1;
      if(c.kind==='sub'&&c.id[13]!==d[13])w-=.5;
      out.push({id:c.id,kind:c.kind,w,birth:p.birth,gov:p.govCode,gender:p.gender});
    }
    return out.sort((a,b)=>b.w-a.w).slice(0,6);
  }
  function compose(o){
    const g=D.toG(o.birth);
    if(g.y<1900||g.y>2099)return null;
    const c=g.y>=2000?3:2;
    let ser=String(o.serial??Math.floor(Math.random()*1000)).replace(/\D/g,'').padStart(3,'0').slice(-3);
    const pool=o.gender==='F'?[0,2,4,6,8]:[1,3,5,7,9];
    const sx=o.sexDigit!=null&&pool.includes(+o.sexDigit)?+o.sexDigit:pool[Math.floor(Math.random()*5)];
    const d13=c+D.pad(g.y%100)+D.pad(g.m)+D.pad(g.d)+o.gov+ser+sx;
    return d13+luhn(d13);
  }
  function govName(code,lang){const g=GOV[code];return g?(lang==='ar'?g[1]:g[0]):null;}
  function govRegion(code,lang){const g=GOV[code];return g?(lang==='ar'?REGION_AR[g[2]]:g[2]):null;}
  function sample(){
    const today=D.today();
    for(let i=0;i<50;i++){
      const b=today-Math.floor(Math.random()*365*60)-365*18;
      const g=D.toG(b),c=g.y>=2000?3:2;
      const codes=Object.keys(GOV).filter(k=>k!=='88');
      const gov=codes[Math.floor(Math.random()*codes.length)];
      const ser=String(Math.floor(Math.random()*10000)).padStart(4,'0');
      const d13=c+D.pad(g.y%100)+D.pad(g.m)+D.pad(g.d)+gov+ser;
      const id=d13+luhn(d13);
      if(!isFake(id))return id;
    }
    return SAMPLES[0];
  }

  function F(ref,o){
    o=o||{};
    const p=`TEXT(${ref},"00000000000000")`;
    const L=o.let;
    const P=L?'p':p;
    const birth=`DATE((VALUE(LEFT(${P},1))-2)*100+1900+VALUE(MID(${P},2,2)),VALUE(MID(${P},4,2)),VALUE(MID(${P},6,2)))`;
    const B=L?'b':birth;
    const male=o.male||'Male',female=o.female||'Female',unknown=o.unknown||'Unknown';
    const t60=`EDATE(${B},720)`;
    const ageCohort=`IF(${t60}>=DATE(2040,7,1),65,IF(${t60}>=DATE(2038,7,1),64,IF(${t60}>=DATE(2036,7,1),63,IF(${t60}>=DATE(2034,7,1),62,IF(${t60}>=DATE(2032,7,1),61,60)))))`;
    const ageInforce=`IF(EDATE(${B},720)<DATE(2032,7,1),60,IF(EDATE(${B},732)<DATE(2034,7,1),61,IF(EDATE(${B},744)<DATE(2036,7,1),62,IF(EDATE(${B},756)<DATE(2038,7,1),63,IF(EDATE(${B},768)<DATE(2040,7,1),64,65)))))`;
    const rAge=(o.mode||settings.retireMode)==='inforce'?ageInforce:ageCohort;
    let rDate=`EDATE(${B},(${rAge})*12)`;
    if((o.round||settings.retireRound)==='eom')rDate=`EOMONTH(${rDate},0)`;
    if((o.round||settings.retireRound)==='nextmonth')rDate=`EOMONTH(${rDate},0)+1`;
    const govPairs=Object.entries(GOV).map(([k,v])=>`"${k}","${o.lang==='ar'?v[1]:v[0]}"`).join(',');
    const wrap=(body,needsB)=>{
      if(!L)return `=IFERROR(${body},"")`;
      return needsB?`=IFERROR(LET(p,${p},b,${birth},${body}),"")`:`=IFERROR(LET(p,${p},${body}),"")`;
    };
    const valid=`AND(LEN(${P})=14,OR(LEFT(${P},1)="2",LEFT(${P},1)="3"),VALUE(MID(${P},4,2))>=1,VALUE(MID(${P},4,2))<=12,DAY(${B})=VALUE(MID(${P},6,2)),${B}<=TODAY())`;
    return{
      birth:wrap(birth,false),
      gender:wrap(`IF(ISODD(VALUE(MID(${P},13,1))),"${male}","${female}")`,false),
      gov:wrap(`SWITCH(MID(${P},8,2),${govPairs},"${unknown}")`,false),
      age:wrap(`DATEDIF(${B},TODAY(),"y")`,true),
      ageFull:wrap(`DATEDIF(${B},TODAY(),"y")&"y "&DATEDIF(${B},TODAY(),"ym")&"m "&DATEDIF(${B},TODAY(),"md")&"d"`,true),
      retireAge:wrap(rAge,true),
      retireDate:wrap(rDate,true),
      yearsLeft:wrap(`IF(${rDate}<=TODAY(),0,DATEDIF(TODAY(),${rDate},"y"))`,true),
      valid:L?`=IFERROR(LET(p,${p},b,${birth},${valid}),FALSE)`:`=IFERROR(${valid},FALSE)`
    };
  }
  function twins(rows){
    const g=new Map();
    rows.forEach(r=>{if(!r.valid)return;const k=r.birth+'|'+r.govCode;if(!g.has(k))g.set(k,[]);g.get(k).push(r);});
    let n=0;
    g.forEach(list=>{const ids=new Set(list.map(r=>r.id));if(ids.size>1){list.forEach(r=>{if(!r.flags.includes('twin'))r.flags.push('twin');});n+=ids.size;}});
    return n;
  }
  function finalize(rows,dupMode){
    const seen=new Map();
    rows.forEach((r,i)=>{
      r.line=i+1;delete r.trace;delete r.warn;delete r.checks;delete r.nextBirthday;
      if(!r.valid)return;
      if(seen.has(r.id)){r.dupFirst=false;r.flags.push('dup');if(dupMode!=='later'){const f=rows[seen.get(r.id)];if(!f.flags.includes('dup'))f.flags.push('dup');}}
      else seen.set(r.id,i);
    });
    twins(rows);
    return rows;
  }
  return{finalize,GOV,STEPS,SAMPLES,CHECKS,settings,ageInForce,retirementAge,retirement,normalize,luhn,isFake,parse,nextBirthday,tokens,splitLines,govName,govRegion,sample,F,suggest,compose,twins};
})();
