const LXPrayer=(()=>{
  const D=LXDate;
  const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
  const sin=x=>Math.sin(rad(x)),cos=x=>Math.cos(rad(x)),tan=x=>Math.tan(rad(x));
  const asin=x=>deg(Math.asin(x)),acos=x=>deg(Math.acos(x)),atan2=(y,x)=>deg(Math.atan2(y,x)),acot=x=>deg(Math.atan(1/x));
  const fixA=a=>a-360*Math.floor(a/360),fixH=a=>a-24*Math.floor(a/24);
  const METHODS={
    egypt:{fajr:19.5,isha:17.5,dhuhr:1},
    mwl:{fajr:18,isha:17},
    isna:{fajr:15,isha:15},
    makkah:{fajr:18.5,ishaMin:90,ramadanIshaMin:120},
    karachi:{fajr:18,isha:18},
    dubai:{fajr:18.2,isha:18.2},
    kuwait:{fajr:18,isha:17.5},
    qatar:{fajr:18,ishaMin:90},
    jordan:{fajr:18,isha:18,maghribMin:5},
    singapore:{fajr:20,isha:18},
    turkey:{fajr:18,isha:17},
    tehran:{fajr:17.7,isha:14,maghrib:4.5,midnight:'jafari'},
    france:{fajr:12,isha:12},
    russia:{fajr:16,isha:15},
    gulf:{fajr:19.5,ishaMin:90}
  };
  const COUNTRY_METHOD={EG:'egypt',SD:'egypt',LY:'egypt',SA:'makkah',YE:'makkah',AE:'dubai',OM:'dubai',BH:'dubai',KW:'kuwait',QA:'qatar',JO:'jordan',PS:'jordan',SY:'mwl',LB:'mwl',IQ:'mwl',US:'isna',CA:'isna',PK:'karachi',IN:'karachi',BD:'karachi',AF:'karachi',SG:'singapore',MY:'singapore',ID:'singapore',BN:'singapore',TR:'turkey',IR:'tehran',FR:'france',RU:'russia',DZ:'mwl',MA:'mwl',TN:'mwl'};
  const KAABA={lat:21.42252,lng:39.82621};
  function julian(y,m,d){if(m<=2){y-=1;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;}
  function sunPos(jd){
    const Dd=jd-2451545,g=fixA(357.529+.98560028*Dd),q=fixA(280.459+.98564736*Dd),L=fixA(q+1.915*sin(g)+.020*sin(2*g));
    const e=23.439-.00000036*Dd,RA=atan2(cos(e)*sin(L),cos(L))/15;
    return{decl:asin(sin(e)*sin(L)),eqt:q/15-fixH(RA)};
  }
  function compute(y,m,d,loc,opts){
    opts=opts||{};
    const P=Object.assign({},METHODS[opts.method||'egypt']||METHODS.egypt);
    const lat=loc.lat,lng=loc.lng,elev=Math.max(0,loc.elev||0);
    const asrF=opts.asr==='hanafi'?2:1;
    const jDate=julian(y,m,d)-lng/(15*24);
    const mid=t=>fixH(12-sunPos(jDate+t).eqt);
    const angleTime=(a,t,ccw)=>{const s=sunPos(jDate+t),noon=mid(t);const v=(-sin(a)-sin(s.decl)*sin(lat))/(cos(s.decl)*cos(lat));if(v<-1||v>1)return NaN;const tt=acos(v)/15;return noon+(ccw?-tt:tt);};
    const asrTime=(f,t)=>{const s=sunPos(jDate+t);return angleTime(-acot(f+tan(Math.abs(lat-s.decl))),t);};
    const rs=.833+.0347*Math.sqrt(elev);
    let T={fajr:5,sunrise:6,dhuhr:12,asr:13,sunset:18,maghrib:18,isha:18};
    for(let it=0;it<2;it++){
      const p={};for(const k in T)p[k]=T[k]/24;
      T={
        fajr:angleTime(P.fajr,p.fajr,true),
        sunrise:angleTime(rs,p.sunrise,true),
        dhuhr:mid(p.dhuhr),
        asr:asrTime(asrF,p.asr),
        sunset:angleTime(rs,p.sunset),
        maghrib:P.maghrib?angleTime(P.maghrib,p.maghrib):angleTime(rs,p.maghrib),
        isha:P.isha?angleTime(P.isha,p.isha):NaN
      };
    }
    const adj=-lng/15;
    for(const k in T)T[k]+=adj;
    if(P.maghribMin&&isFinite(T.sunset))T.maghrib=T.sunset+P.maghribMin/60;
    if(P.ishaMin&&isFinite(T.maghrib)){const ram=opts.ramadan&&P.ramadanIshaMin;T.isha=T.maghrib+(ram?P.ramadanIshaMin:P.ishaMin)/60;}
    const night=isFinite(T.sunset)&&isFinite(T.sunrise)?24-(T.sunset-T.sunrise):NaN;
    const hl=opts.highLat||'middle';
    const portion=a=>hl==='seventh'?1/7:hl==='angle'?a/60:.5;
    let adjusted=false;
    if(isFinite(night)){
      const fp=portion(P.fajr)*night;
      if(!isFinite(T.fajr)||T.sunrise-T.fajr>fp){T.fajr=T.sunrise-fp;adjusted=true;}
      if(P.isha){const ip=portion(P.isha)*night;if(!isFinite(T.isha)||T.isha-T.sunset>ip){T.isha=T.sunset+ip;adjusted=true;}}
      if(P.maghrib){const mp=portion(P.maghrib)*night;if(!isFinite(T.maghrib)||T.maghrib-T.sunset>mp)T.maghrib=T.sunset+mp;}
    }
    T.dhuhr+=((opts.dhuhrMin!=null?opts.dhuhrMin:P.dhuhr)||0)/60;
    if(isFinite(T.sunset)&&isFinite(T.sunrise)){
      const n=24-(T.sunset-T.sunrise);
      T.midnight=P.midnight==='jafari'&&isFinite(T.fajr)?T.sunset+(24-(T.sunset-T.fajr))/2:T.sunset+n/2;
      T.lastThird=T.sunset+n*2/3;
    }
    const base=Date.UTC(y,m-1,d);
    const off=opts.offsets||{};
    const out={adjusted,polar:!isFinite(T.sunrise)};
    for(const k of ['fajr','sunrise','dhuhr','asr','sunset','maghrib','isha','midnight','lastThird']){
      const h=T[k];
      out[k]=isFinite(h)?new Date(Math.round((base+h*3600000+(off[k]||0)*60000)/60000)*60000):null;
    }
    return out;
  }
  function forCity(city,opts,dayOffset){
    const r=D.todayIn(city.tz)+(dayOffset||0),g=D.toG(r);
    const h=D.toH(r);
    return Object.assign(compute(g.y,g.m,g.d,city,Object.assign({ramadan:h.m===9},opts)),{rd:r});
  }
  const ORDER=['fajr','sunrise','dhuhr','asr','maghrib','isha'];
  function next(city,opts,now){
    now=now||new Date();
    const t=forCity(city,opts,0);
    for(const k of ['fajr','dhuhr','asr','maghrib','isha'])if(t[k]&&t[k]>now)return{key:k,at:t[k],today:t};
    const tm=forCity(city,opts,1);
    return{key:'fajr',at:tm.fajr,today:t,tomorrow:true};
  }
  function qibla(lat,lng){
    const dl=rad(KAABA.lng-lng),p=rad(lat),pk=rad(KAABA.lat);
    return fixA(deg(Math.atan2(Math.sin(dl),Math.cos(p)*Math.tan(pk)-Math.sin(p)*Math.cos(dl))));
  }
  function distKm(a,b,c,d){const R=6371,dl=rad(c-a),dg=rad(d-b);const x=Math.sin(dl/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
  function month(city,opts,y,m){
    const out=[];
    for(let d=1;d<=D.dim(y,m);d++){const r=D.fromG(y,m,d),h=D.toH(r);out.push(Object.assign(compute(y,m,d,city,Object.assign({ramadan:h.m===9},opts)),{rd:r}));}
    return out;
  }
  return{METHODS,COUNTRY_METHOD,KAABA,compute,forCity,next,qibla,distKm,month,ORDER};
})();

const LXCities=(()=>{
  const EG=[
    ['Cairo','القاهرة',30.0444,31.2357,9606916],['Alexandria','الإسكندرية',31.2001,29.9187,5263542],['Giza','الجيزة',30.0131,31.2089,4367343],['Port Said','بورسعيد',31.2653,32.3019,780515],['Suez','السويس',29.9668,32.5498,699541],['Mansoura','المنصورة',31.0409,31.3785,621953],['Tanta','طنطا',30.7865,31.0004,576648],['Asyut','أسيوط',27.1783,31.1859,528669],['Fayoum','الفيوم',29.3084,30.8428,519047],['Zagazig','الزقازيق',30.5765,31.5041,430445],['Ismailia','الإسماعيلية',30.5965,32.2715,429465],['Luxor','الأقصر',25.6872,32.6396,422407],['Aswan','أسوان',24.0889,32.8998,379774],['6th of October City','مدينة 6 أكتوبر',29.9611,30.9296,368650],['Damanhur','دمنهور',31.0425,30.4728,318207],['New Cairo','القاهرة الجديدة',30.0363,31.4758,313139],['Damietta','دمياط',31.4175,31.8144,305920],['Minya','المنيا',28.0871,30.7618,283605],['Beni Suef','بني سويف',29.0661,31.0994,273151],['Shibin El Kom','شبين الكوم',30.5503,31.0106,267945],['Sohag','سوهاج',26.5591,31.6957,266944],['Qena','قنا',26.1551,32.716,252883],['Hurghada','الغردقة',27.2579,33.8116,207132],['Arish','العريش',31.1321,33.8033,199243],['Kafr El Sheikh','كفر الشيخ',31.1091,30.9426,191900],['Banha','بنها',30.466,31.1848,182254],['Marsa Matrouh','مرسى مطروح',31.3543,27.2373,176498],['Sharm El Sheikh','شرم الشيخ',27.9654,34.3618,73000],['Kharga','الخارجة',25.439,30.5586,72000],['El Tor','الطور',28.241,33.623,38285],['Siwa Oasis','سيوة',29.2032,25.5195,27000],['Marsa Alam','مرسى علم',25.0676,34.879,13000],['New Administrative Capital','العاصمة الإدارية الجديدة',30.0197,31.7625,50000],['El Alamein','العلمين',30.8167,28.95,30000],['Dahab','دهب',28.4913,34.5136,15000]
  ].map(([en,ar,lat,lng,pop])=>({en,ar,lat,lng,pop,cc:'EG',country:'Egypt',countryAr:'مصر',tz:'Africa/Cairo'}));
  let world=null,loading=null;
  function load(){
    if(world)return Promise.resolve(world);
    if(loading)return loading;
    loading=fetch('data/cities.json').then(r=>r.json()).then(list=>{
      world=list.filter(c=>c.iso2!=='EG'&&c.pop>=15000&&c.timezone).map(c=>({en:c.city,ascii:(c.city_ascii||c.city).toLowerCase(),lat:c.lat,lng:c.lng,pop:c.pop,cc:c.iso2,country:c.country,province:c.province,tz:c.timezone}));
      return world;
    }).catch(()=>{loading=null;return [];});
    return loading;
  }
  function score(q,t){if(!t)return Infinity;if(t===q)return 0;if(t.startsWith(q))return 1;const i=t.indexOf(q);if(i>=0)return 2+i*.01;let qi=0;for(let i2=0;i2<t.length&&qi<q.length;i2++)if(t[i2]===q[qi])qi++;return qi===q.length?4+(t.length-q.length)*.01:Infinity;}
  function search(query){
    const q=String(query||'').trim().toLowerCase();
    if(!q)return EG.slice(0,10);
    const pool=EG.concat(world||[]);
    return pool.map(c=>{
      const s=Math.min(score(q,c.en.toLowerCase()),c.ar?score(q,c.ar):Infinity,c.ascii?score(q,c.ascii):Infinity,score(q,(c.country||'').toLowerCase())+3,c.countryAr?score(q,c.countryAr)+3:Infinity);
      return{c,s};
    }).filter(x=>x.s!==Infinity).sort((a,b)=>a.s-b.s||b.c.pop-a.c.pop).slice(0,10).map(x=>x.c);
  }
  function nearest(lat,lng){
    const pool=EG.concat(world||[]);let best=null,bd=Infinity;
    for(const c of pool){const d=LXPrayer.distKm(lat,lng,c.lat,c.lng);if(d<bd){bd=d;best=c;}}
    return{city:best,km:bd};
  }
  return{EG,load,search,nearest};
})();
