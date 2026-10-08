importScripts('core/dates.js','core/id.js');
let cancelled=false,X=null;
const post=(m,tr)=>self.postMessage(m,tr||[]);
function cfg(c){if(!c)return;Object.assign(LXDate.cfg,c.date||{});Object.assign(LXID.settings,c.id||{});}
function cellStr(v){if(v==null)return'';if(typeof v==='number')return Number.isInteger(v)?v.toFixed(0):String(v);return String(v);}
function slim(r){
  if(!r.valid)return{raw:r.raw,valid:false,isNull:r.isNull,error:r.error,digits:r.digits,flags:r.flags};
  return{raw:r.raw,valid:true,isNull:false,error:null,digits:r.digits,id:r.id,birth:r.birth,weekday:r.weekday,age:r.age,gender:r.gender,govCode:r.govCode,serial:r.serial,check:r.check,ret:{age:r.ret.age,date:r.ret.date},daysToRetire:r.daysToRetire,retired:r.retired,toRetire:r.toRetire,career:r.career,flags:r.flags,checksum:r.checksum};
}
async function parseAll(items,today,dupMode){
  const n=items.length,out=new Array(n);let last=0;
  for(let i=0;i<n;i++){
    if(cancelled)throw new Error('cancelled');
    out[i]=slim(LXID.parse(items[i],{today}));
    if(i-last>=4000){last=i;post({type:'progress',phase:'parse',p:i/n});await new Promise(r=>setTimeout(r,0));}
  }
  LXID.finalize(out,dupMode);
  post({type:'progress',phase:'parse',p:1});
  return out;
}
self.onmessage=async e=>{
  const m=e.data;
  try{
    if(m.type==='cancel'){cancelled=true;return;}
    cancelled=false;cfg(m.cfg);
    if(m.type==='lines'){
      const src=m.skipNull?m.lines.filter(s=>{const x=String(s??'').trim();if(!x)return false;const n=LXID.normalize(x);return n.digits.length||n.sci;}):m.lines;
      const rows=await parseAll(src,m.today,m.dupMode);
      post({type:'done',job:m.job,rows});
    }else if(m.type==='file'){
      if(!X){post({type:'progress',phase:'load',p:0});importScripts(m.xlsxUrl);X=self.XLSX;}
      post({type:'progress',phase:'read',p:0});
      const wb=X.read(m.buf,{type:'array',cellDates:false,raw:m.raw,dense:true});
      self.__wb=wb;
      post({type:'book',job:m.job,sheets:wb.SheetNames});
    }else if(m.type==='sheet'){
      const wb=self.__wb,ws=wb.Sheets[m.sheet];
      const aoa=X.utils.sheet_to_json(ws,{header:1,raw:true,defval:'',blankrows:false});
      const h=(aoa[m.hdr-1]||[]).map(cellStr);
      const width=Math.max(h.length,...aoa.slice(m.hdr,m.hdr+50).map(r=>r.length),1);
      const data=new Array(Math.max(0,aoa.length-m.hdr));
      for(let i=m.hdr,j=0;i<aoa.length;i++,j++){const r=aoa[i],o=new Array(width);for(let c=0;c<width;c++)o[c]=cellStr(r[c]);data[j]=o;}
      let best=-1,bs=0;
      for(let c=0;c<width;c++){let s=0;for(let i=0;i<Math.min(300,data.length);i++)if(LXID.normalize(data[i][c]).digits.length===14)s++;s+=/national|id|رقم|قومي|هوية/i.test(h[c]||'')?3:0;if(s>bs){bs=s;best=c;}}
      post({type:'sheet',job:m.job,head:h,width,data,idCol:best>=0?best:0});
    }
  }catch(err){post({type:'error',job:m.job,msg:String(err&&err.message||err)});}
};
