const Jobs=(()=>{
  let w=null,seq=0,pend=null;
  function spawn(){
    if(w)return w;
    try{w=new Worker('js/worker.js');}catch(e){w=null;return null;}
    w.onmessage=e=>{const m=e.data;if(!pend)return;if(m.type==='progress'){pend.onProg&&pend.onProg(m.p,m.phase);return;}if(m.job!==pend.job)return;const p=pend;if(m.type==='error'){pend=null;p.rej(new Error(m.msg));}else if(m.type!=='progress'&&p.until.includes(m.type)){pend=null;p.res(m);}};
    w.onerror=e=>{e.preventDefault();const p=pend;pend=null;w.terminate();w=null;p&&p.rej(new Error('worker'));};
    return w;
  }
  const cfg=()=>({date:{hijri:LXDate.cfg.hijri,offset:LXDate.cfg.offset,feb29:LXDate.cfg.feb29},id:{...LXID.settings}});
  function run(msg,opts){
    opts=opts||{};
    const wk=spawn();if(!wk)return Promise.reject(new Error('noworker'));
    if(pend){pend.rej(new Error('cancelled'));}
    const job=++seq;
    return new Promise((res,rej)=>{pend={job,res,rej,hard:msg.type==='file'||msg.type==='sheet',onProg:opts.onProg,until:opts.until||['done']};wk.postMessage(Object.assign({job,cfg:cfg(),today:LXDate.today()},msg),opts.transfer||[]);});
  }
  function cancel(){if(!pend)return;const p=pend;pend=null;if(w){if(p.hard){w.terminate();w=null;}else w.postMessage({type:'cancel'});}p.rej(new Error('cancelled'));}
  const alive=()=>!!w;
  const busy=()=>!!pend;
  const ok=()=>typeof Worker!=='undefined'&&location.protocol!=='file:';
  return{run,cancel,busy,ok,alive};
})();

const ChartPNG=(()=>{
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function render(spec){
    const S=2,W=spec.w||880,pad=40,font=css('--font-body')||'sans-serif',disp=css('--font-display')||'serif';
    const rtl=document.dir==='rtl',ink=css('--ink'),ink2=css('--ink-2'),ink3=css('--ink-3'),bg=css('--bg'),edge=css('--edge-2'),amber=css('--amber'),amberHi=css('--amber-hi');
    const rowH=34,H=spec.kind==='hist'?380:pad*2+64+spec.items.length*rowH+(spec.foot?28:0);
    const c=document.createElement('canvas');c.width=W*S;c.height=H*S;const x=c.getContext('2d');x.scale(S,S);
    x.fillStyle=bg;x.fillRect(0,0,W,H);
    x.direction=rtl?'rtl':'ltr';x.textBaseline='alphabetic';
    const L=rtl?W-pad:pad,R=rtl?pad:W-pad,al=rtl?'right':'left',ar=rtl?'left':'right';
    x.fillStyle=ink;x.font='600 22px '+disp;x.textAlign=al;x.fillText(spec.title,L,pad+18);
    if(spec.sub){x.fillStyle=ink3;x.font='500 13px '+font;x.fillText(spec.sub,L,pad+40);}
    const top=pad+64;
    const max=Math.max(1,...spec.items.map(i=>i.v));
    const grad=(a,b,x0,x1)=>{const g=x.createLinearGradient(x0,0,x1,0);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
    const rr=(X,Y,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h);x.fill();};
    if(spec.kind==='hist'){
      const n=spec.items.length,ch=H-top-pad-28,gw=(W-pad*2)/n,bw=Math.min(46,gw*.64);
      x.strokeStyle=edge;x.lineWidth=1;for(let k=0;k<=4;k++){const y=top+ch-ch*k/4+.5;x.beginPath();x.moveTo(pad,y);x.lineTo(W-pad,y);x.stroke();}
      spec.items.forEach((it,i)=>{
        const idx=rtl?n-1-i:i,h=Math.max(2,it.v/max*ch),X=pad+idx*gw+(gw-bw)/2,Y=top+ch-h;
        const g=x.createLinearGradient(0,Y,0,Y+h);g.addColorStop(0,amber);g.addColorStop(1,amberHi);x.fillStyle=g;rr(X,Y,bw,h,[6,6,2,2]);
        x.textAlign='center';x.fillStyle=ink2;x.font='600 12px '+font;if(it.v)x.fillText(Fmt.n(it.v),X+bw/2,Y-6);
        x.fillStyle=ink3;x.font='500 11px '+font;x.fillText(it.l,X+bw/2,top+ch+18);
      });
    }else{
      const lw=Math.min(220,W*.3),vw=64,bx0=rtl?R+vw:L+lw,bw=W-pad*2-lw-vw;
      spec.items.forEach((it,i)=>{
        const y=top+i*rowH;
        x.fillStyle=ink2;x.font='550 13px '+font;x.textAlign=al;
        let lbl=it.l;while(x.measureText(lbl).width>lw-14&&lbl.length>2)lbl=lbl.slice(0,-2)+'…';
        x.fillText(lbl,L,y+18);
        x.fillStyle=css('--surface-3')||edge;rr(rtl?pad+vw:bx0,y+8,bw,12,6);
        const w2=Math.max(4,it.v/max*bw);
        x.fillStyle=it.c?css(it.c):grad(amber,amberHi,0,W);
        rr(rtl?pad+vw+bw-w2:bx0,y+8,w2,12,6);
        x.fillStyle=ink;x.font='650 13px '+font;x.textAlign=ar;x.fillText(Fmt.n(it.v),R,y+18);
      });
    }
    x.textAlign=al;x.fillStyle=ink3;x.font='500 11px '+font;
    x.fillText(spec.foot||(t('brand')+' · '+Fmt.date(LXDate.today(),'short')),L,H-pad/2);
    return c;
  }
  function save(spec,name){
    const c=render(spec);
    c.toBlob(b=>{if(!b){toast(t('t_copy_fail'),'bad');return;}download(b,name+'.png','image/png');toast(t('t_png'));},'image/png');
  }
  async function copy(spec,btn){
    const c=render(spec);
    try{const b=await new Promise(r=>c.toBlob(r,'image/png'));await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);toast(t('t_png_copied'));btn&&btn.classList.add('ok');setTimeout(()=>btn&&btn.classList.remove('ok'),1100);}
    catch(e){save(spec,'raqam-chart');}
  }
  return{render,save,copy};
})();

const RowScope=(()=>{
  const GROUPS=[
    ['status',r=>r.valid?'valid':r.isNull?'null':'error',v=>t(v==='valid'?'f_valid':v==='null'?'f_null':'f_error')],
    ['gender',r=>r.valid?r.gender:null,v=>t(v==='M'?'male':'female')],
    ['gov',r=>r.valid?r.govCode:null,v=>LXID.govName(v,I18N.lang)||v],
    ['band',r=>{if(!r.valid)return null;const a=r.age.years;return a<18?'<18':a<30?'18–29':a<45?'30–44':a<60?'45–59':'60+';},v=>v],
    ['flag',r=>r.valid&&r.flags.length?r.flags:null,v=>t('flag_'+v)]
  ];
  const ORDER={band:['<18','18–29','30–44','45–59','60+'],status:['valid','error','null'],gender:['M','F']};
  function make(){return{ex:{},dup:'all'};}
  function key(r,g){const G=GROUPS.find(x=>x[0]===g);return G?G[1](r):null;}
  function keep(s,r){
    if(s.dup==='first'&&r.valid&&r.dupFirst===false)return false;
    for(const g in s.ex){const set=s.ex[g];if(!set||!set.size)continue;const k=key(r,g);if(k==null)continue;if(Array.isArray(k)){if(k.length&&k.every(v=>set.has(v)))return false;}else if(set.has(k))return false;}
    return true;
  }
  function apply(s,rows){return active(s)?rows.filter(r=>keep(s,r)):rows;}
  const active=s=>s.dup==='first'||Object.values(s.ex).some(v=>v&&v.size);
  function count(s){let n=Object.values(s.ex).reduce((a,v)=>a+(v?v.size:0),0);if(s.dup==='first')n++;return n;}
  function tally(rows,g){const m=new Map();rows.forEach(r=>{let k=key(r,g);if(k==null)return;[].concat(k).forEach(v=>m.set(v,(m.get(v)||0)+1));});let a=[...m];const o=ORDER[g];a.sort(o?(x,y)=>o.indexOf(x[0])-o.indexOf(y[0]):(x,y)=>y[1]-x[1]);return a;}
  function menu(anchor,s,rows,onChange){
    const sec=(g,title)=>{const list=tally(rows,g);if(!list.length)return'';const ex=s.ex[g]||new Set();return`<div class="mh"><span>${esc(title)}</span><button type="button" class="btn btn-ghost btn-sm" data-ga="${g}" style="padding:.15rem .5rem">${esc(t(ex.size?'all':'none_short'))}</button></div>`+list.map(([v,n])=>`<label class="mi"><input type="checkbox" data-g="${g}" data-v="${esc(v)}"${ex.has(v)?'':' checked'}><span class="grow">${esc(GROUPS.find(x=>x[0]===g)[2](v))}</span><span class="tiny faint num">${Fmt.n(n)}</span></label>`).join('');};
    const dupN=rows.filter(r=>r.valid&&r.dupFirst===false).length;
    const html=`<div class="scope-sum" id="sc-sum"></div>`+
      (dupN?`<div class="mh"><span>${esc(t('sc_dups'))}</span></div><label class="mi"><input type="checkbox" data-dup${s.dup==='first'?' checked':''}><span class="grow">${esc(t('sc_dup_first'))}</span><span class="tiny faint num">−${Fmt.n(dupN)}</span></label>`:'')+
      sec('status',t('c_status'))+sec('gender',t('c_gender'))+sec('band',t('i_age'))+sec('gov',t('c_gov'))+sec('flag',t('c_flags'))+
      `<div class="scope-foot"><button type="button" class="btn btn-ghost btn-sm" data-reset>${esc(t('sc_reset'))}</button></div>`;
    Menu.open(anchor,html,m=>{
      m.classList.add('scope-menu');
      const sum=()=>{const n=apply(s,rows).length;m.querySelector('#sc-sum').innerHTML=`<b class="num">${Fmt.n(n)}</b> / ${Fmt.n(rows.length)} <span class="faint">${esc(t('sc_rows'))}</span>`;};
      const ch=()=>{sum();onChange();};
      m.querySelectorAll('[data-g]').forEach(i=>i.onchange=()=>{const g=i.dataset.g,v=i.dataset.v;s.ex[g]=s.ex[g]||new Set();i.checked?s.ex[g].delete(v):s.ex[g].add(v);const ga=m.querySelector('[data-ga="'+g+'"]');ga.textContent=t(s.ex[g].size?'all':'none_short');ch();});
      m.querySelectorAll('[data-ga]').forEach(b=>b.onclick=()=>{const g=b.dataset.ga,boxes=[...m.querySelectorAll('[data-g="'+g+'"]')];const all=(s.ex[g]||new Set()).size>0;s.ex[g]=new Set(all?[]:boxes.map(x=>x.dataset.v));boxes.forEach(x=>x.checked=all);b.textContent=t(all?'none_short':'all');ch();});
      const d=m.querySelector('[data-dup]');if(d)d.onchange=()=>{s.dup=d.checked?'first':'all';ch();};
      m.querySelector('[data-reset]').onclick=()=>{s.ex={};s.dup='all';m.querySelectorAll('[data-g]').forEach(x=>x.checked=true);if(d)d.checked=false;m.querySelectorAll('[data-ga]').forEach(b=>b.textContent=t('none_short'));ch();};
      sum();
    });
  }
  return{make,apply,active,count,menu,keep};
})();
