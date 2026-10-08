const ICONS={
  id:'<circle cx="12" cy="12" r="8.4" stroke-dasharray="35 60" transform="rotate(-40 12 12)"/><circle cx="12" cy="12" r="5.6" stroke-dasharray="24 40" transform="rotate(25 12 12)"/><circle cx="12" cy="12" r="3" stroke-dasharray="12 30" transform="rotate(80 12 12)"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>',
  fx:'<path d="M17.5 5H7l5.6 7L7 19h10.5"/>',
  cal:'<rect x="3.75" y="5" width="16.5" height="15.25" rx="3.5"/><path d="M3.75 10h16.5M8.25 3v3.5M15.75 3v3.5"/><circle cx="8.3" cy="13.8" r=".95" fill="currentColor" stroke="none"/><circle cx="12" cy="13.8" r=".95" fill="currentColor" stroke="none"/><circle cx="15.7" cy="13.8" r=".95" fill="currentColor" stroke="none"/><circle cx="8.3" cy="17" r=".95" fill="currentColor" stroke="none"/>',
  book:'<path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19v14H6.5a2 2 0 0 0-2 2z"/><path d="M4.5 19.5a2 2 0 0 0 2 2H19v-4"/><path d="M8.5 7.5h6"/>',
  globe:'<circle cx="12" cy="12" r="8.75"/><path d="M3.5 12h17"/><path d="M12 3.25c2.4 2.4 3.6 5.3 3.6 8.75S14.4 18.35 12 20.75C9.6 18.35 8.4 15.45 8.4 12S9.6 5.65 12 3.25Z"/>',
  search:'<circle cx="11" cy="11" r="6.75"/><path d="m20 20-4.2-4.2"/>',
  gear:'<path d="M12.22 2.75h-.44a1.8 1.8 0 0 0-1.8 1.8v.16a1.8 1.8 0 0 1-.9 1.56l-.39.22a1.8 1.8 0 0 1-1.8 0l-.13-.07a1.8 1.8 0 0 0-2.46.66l-.22.38a1.8 1.8 0 0 0 .66 2.46l.13.09a1.8 1.8 0 0 1 .9 1.55v.46a1.8 1.8 0 0 1-.9 1.57l-.13.08a1.8 1.8 0 0 0-.66 2.46l.22.38a1.8 1.8 0 0 0 2.46.66l.13-.07a1.8 1.8 0 0 1 1.8 0l.39.22a1.8 1.8 0 0 1 .9 1.56v.16a1.8 1.8 0 0 0 1.8 1.8h.44a1.8 1.8 0 0 0 1.8-1.8v-.16a1.8 1.8 0 0 1 .9-1.56l.39-.22a1.8 1.8 0 0 1 1.8 0l.13.07a1.8 1.8 0 0 0 2.46-.66l.22-.39a1.8 1.8 0 0 0-.66-2.46l-.13-.07a1.8 1.8 0 0 1-.9-1.57v-.45a1.8 1.8 0 0 1 .9-1.57l.13-.08a1.8 1.8 0 0 0 .66-2.46l-.22-.38a1.8 1.8 0 0 0-2.46-.66l-.13.07a1.8 1.8 0 0 1-1.8 0l-.39-.22a1.8 1.8 0 0 1-.9-1.56v-.16a1.8 1.8 0 0 0-1.8-1.8Z"/><circle cx="12" cy="12" r="2.75"/>',
  moon:'<path d="M20.2 14.6A8.3 8.3 0 1 1 9.4 3.8a6.6 6.6 0 0 0 10.8 10.8Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v1.9M12 19.3v1.9M4.9 4.9l1.35 1.35M17.75 17.75l1.35 1.35M2.8 12h1.9M19.3 12h1.9M4.9 19.1l1.35-1.35M17.75 6.25l1.35-1.35"/>',
  paste:'<path d="M15.5 4.5h.75A2.75 2.75 0 0 1 19 7.25V10"/><path d="M8.5 4.5h-.75A2.75 2.75 0 0 0 5 7.25v11A2.75 2.75 0 0 0 7.75 21H12"/><rect x="8.75" y="2.75" width="6.5" height="3.5" rx="1.2"/><path d="M14.5 16.5h6.5M18 13.5l3 3-3 3"/>',
  spark:'<path d="M11 3.5c.55 3.9 2.1 5.45 6 6-3.9.55-5.45 2.1-6 6-.55-3.9-2.1-5.45-6-6 3.9-.55 5.45-2.1 6-6Z"/><path d="M18.5 14.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5Z"/>',
  x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  xc:'<circle cx="12" cy="12" r="8.75"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkc:'<circle cx="12" cy="12" r="8.75"/><path d="m8.2 12.3 2.6 2.6 5-5.3"/>',
  minus:'<path d="M6 12h12"/>',
  plus:'<path d="M12 5.5v13M5.5 12h13"/>',
  alert:'<circle cx="12" cy="12" r="8.75"/><path d="M12 7.6v5.2"/><circle cx="12" cy="16.2" r="1" fill="currentColor" stroke="none"/>',
  info:'<circle cx="12" cy="12" r="8.75"/><path d="M12 11v5.2"/><circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none"/>',
  warn:'<path d="M10.3 4.2 2.9 17.5A2 2 0 0 0 4.6 20.5h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9.5v4"/><circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none"/>',
  copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.75"/><path d="M15.5 8.5V6.25A2.75 2.75 0 0 0 12.75 3.5h-6.5A2.75 2.75 0 0 0 3.5 6.25v6.5a2.75 2.75 0 0 0 2.75 2.75H8.5"/>',
  down:'<path d="M12 3.75v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
  up:'<path d="M12 20V9M7.5 13.5 12 9l4.5 4.5"/><path d="M4.5 4.5h15"/>',
  cloud:'<path d="M7.25 18.5a4.25 4.25 0 0 1-.6-8.46 5.5 5.5 0 0 1 10.6-1.3 4.6 4.6 0 0 1-.5 9.76"/><path d="M12 11.5v8M9 14.5l3-3 3 3"/>',
  file:'<path d="M14 3.5H7.25A2.25 2.25 0 0 0 5 5.75v12.5a2.25 2.25 0 0 0 2.25 2.25h9.5A2.25 2.25 0 0 0 19 18.25V8.5Z"/><path d="M14 3.5v5h5"/><path d="M8.75 13h6.5M8.75 16.5h4.5"/>',
  rows:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.75"/><path d="M3.5 9.5h17M3.5 14.5h17"/>',
  cols:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.75"/><path d="M9.2 4.5v15M14.8 4.5v15"/>',
  trash:'<path d="M4.5 6.75h15"/><path d="M9.25 6.75V5a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 1.5 1.5v1.75"/><path d="m6.25 6.75.8 11.6a2.2 2.2 0 0 0 2.2 2.15h5.5a2.2 2.2 0 0 0 2.2-2.15l.8-11.6"/>',
  play:'<path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.9-6.8a.8.8 0 0 0 0-1.4L9.2 4.5a.8.8 0 0 0-1.2.7Z" fill="currentColor" stroke="none"/>',
  print:'<path d="M7 8.5V4.75A1.25 1.25 0 0 1 8.25 3.5h7.5A1.25 1.25 0 0 1 17 4.75V8.5"/><rect x="3.5" y="8.5" width="17" height="8.5" rx="2.5"/><path d="M7 14.5h10v6H7z"/>',
  cake:'<path d="M4 20.5h16"/><path d="M5.5 20.5v-6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6"/><path d="M5.5 16.2c1.3 0 1.9-1 3.2-1s1.9 1 3.3 1 2-1 3.3-1 1.9 1 3.2 1"/><path d="M12 12.5V9.3"/><path d="M12 7c-.9 0-1.5-.6-1.5-1.4 0-1 1.5-2.4 1.5-2.4s1.5 1.4 1.5 2.4c0 .8-.6 1.4-1.5 1.4Z"/>',
  pin:'<path d="M12 21s-6.75-6.2-6.75-11.25a6.75 6.75 0 0 1 13.5 0C18.75 14.8 12 21 12 21Z"/><circle cx="12" cy="9.75" r="2.4"/>',
  clock:'<circle cx="12" cy="12" r="8.75"/><path d="M12 7.5V12l3 2"/>',
  hour:'<path d="M6.5 3.5h11M6.5 20.5h11"/><path d="M7.5 3.5c0 4 4.5 5.5 4.5 8.5s-4.5 4.5-4.5 8.5M16.5 3.5c0 4-4.5 5.5-4.5 8.5s4.5 4.5 4.5 8.5"/>',
  gavel:'<path d="m13.5 4 6.5 6.5"/><path d="m10.5 7 6.5 6.5"/><path d="m12 5.5 5 5-2.5 2.5-5-5z"/><path d="m11 11-7 7a1.4 1.4 0 0 0 2 2l7-7"/><path d="M13 21h7"/>',
  mosque:'<path d="M6.5 11c0-3.1 2.5-5.3 5.5-7 3 1.7 5.5 3.9 5.5 7"/><path d="M12 4V2.5"/><path d="M4 11h16"/><path d="M5 11v9.5h14V11"/><path d="M10 20.5v-3a2 2 0 0 1 4 0v3"/>',
  range:'<rect x="3.75" y="5" width="16.5" height="15.25" rx="3.5"/><path d="M3.75 10h16.5M8.25 3v3.5M15.75 3v3.5"/><path d="M9 15h6"/><circle cx="8" cy="15" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r="1.2" fill="currentColor" stroke="none"/>',
  calplus:'<rect x="3.75" y="5" width="16.5" height="15.25" rx="3.5"/><path d="M3.75 10h16.5M8.25 3v3.5M15.75 3v3.5"/><path d="M12 12.8v4.4M9.8 15h4.4"/>',
  today:'<rect x="3.75" y="5" width="16.5" height="15.25" rx="3.5"/><path d="M3.75 10h16.5M8.25 3v3.5M15.75 3v3.5"/><rect x="8.5" y="12.8" width="4" height="4" rx="1.1" fill="currentColor" stroke="none"/>',
  repeat:'<path d="M20.25 11V8.5A3.5 3.5 0 0 0 16.75 5H7.25a3.5 3.5 0 0 0-3.5 3.5v8.25a3.5 3.5 0 0 0 3.5 3.5H11"/><path d="M3.75 10h16.5M8.25 3v3.5M15.75 3v3.5"/><path d="M21 17.5a3.5 3.5 0 1 1-1-2.45"/><path d="M20.4 13.4v1.9h-1.9"/>',
  layers:'<path d="m12 3.75 8.25 4.5L12 12.75l-8.25-4.5Z"/><path d="m3.75 12.5 8.25 4.5 8.25-4.5"/><path d="m3.75 16.25 8.25 4.5 8.25-4.5"/>',
  swap:'<path d="M4.5 8.5h14M15 5l3.5 3.5L15 12"/><path d="M19.5 15.5h-14M9 12l-3.5 3.5L9 19"/>',
  chevd:'<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
  chevl:'<path d="m14.5 6-6 6 6 6"/>',
  chevr:'<path d="m9.5 6 6 6-6 6"/>',
  male:'<circle cx="10" cy="14" r="5.5"/><path d="M14 10l6-6"/><path d="M15.5 4H20v4.5"/>',
  female:'<circle cx="12" cy="9" r="5.5"/><path d="M12 14.5v7M9 18.5h6"/>',
  chart:'<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="5.5" rx="1"/><rect x="10.5" y="8" width="3" height="9.5" rx="1"/><rect x="15.5" y="4.5" width="3" height="13" rx="1"/>',
  bolt:'<path d="M13 3 5.5 13.2h5.8L10.5 21 18.5 10.6h-5.8Z"/>',
  history:'<path d="M3.75 12a8.25 8.25 0 1 0 2.5-5.9"/><path d="M3.5 4.5v3.9h3.9"/><path d="M12 8v4.3l2.8 1.7"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  key:'<rect x="2.75" y="6" width="18.5" height="12" rx="2.75"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M8 14h8" stroke-width="2"/>',
  party:'<path d="m4 20 4.5-11.5 7 7Z"/><path d="M14 4.5c.3 1.2 1 1.9 2.2 2.2M19.5 9c-1.5-.4-2.9.3-3.5 1.6"/><circle cx="19" cy="4.5" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="14" r="1" fill="currentColor" stroke="none"/>',
  compass:'<circle cx="12" cy="12" r="8.75"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  sort:'<path d="M8 19.5V5M4.5 8.5 8 5l3.5 3.5"/><path d="M16 4.5v14.5M12.5 15.5 16 19l3.5-3.5"/>',
  filter:'<path d="M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"/>',
  shield:'<path d="M12 3.5 5 6v5.5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  ext:'<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14v3.75A2.25 2.25 0 0 1 15.75 20h-9.5A2.25 2.25 0 0 1 4 17.75v-9.5A2.25 2.25 0 0 1 6.25 6H10"/>',
  type:'<path d="M5 6.5V5h14v1.5M12 5v14M9 19h6"/>',
  eye:'<path d="M2.75 12S6.25 5.5 12 5.5 21.25 12 21.25 12 17.75 18.5 12 18.5 2.75 12 2.75 12Z"/><circle cx="12" cy="12" r="2.75"/>',
  eyeoff:'<path d="M9.9 5.75A9.6 9.6 0 0 1 12 5.5c5.75 0 9.25 6.5 9.25 6.5a16 16 0 0 1-2.4 3.2M6.4 7.2C4.1 8.9 2.75 12 2.75 12S6.25 18.5 12 18.5a8.7 8.7 0 0 0 4.1-1"/><path d="M10 10.1a2.75 2.75 0 0 0 3.9 3.9"/><path d="M3.5 3.5l17 17"/>',
  wand:'<path d="m4 20 11-11"/><path d="m13.5 7.5 3 3"/><path d="M17.5 2.8c.3 1.6.8 2.1 2.4 2.4-1.6.3-2.1.8-2.4 2.4-.3-1.6-.8-2.1-2.4-2.4 1.6-.3 2.1-.8 2.4-2.4Z"/><path d="M8 3.5v2M7 4.5h2M19.5 14v2M18.5 15h2"/>',
  users:'<circle cx="9" cy="8.5" r="3.25"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.5a3.25 3.25 0 0 1 0 6.3M17.5 14.2a6 6 0 0 1 3.5 5.3"/>',
  image:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="9.75" r="1.6"/><path d="m20.5 15.5-4.6-4.6a1.5 1.5 0 0 0-2.1 0L5 19.5"/>',
  pen:'<path d="M14.5 5.5l4 4"/><path d="M4.5 19.5l1-4.2L16 4.8a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.7 18.5z"/>',
  build:'<rect x="3.5" y="6" width="17" height="12" rx="3"/><path d="M7 10h4M7 14h6"/><circle cx="16.5" cy="12" r="1.8"/>'
};
const MARK={stroke:'M33 12c3.8 15 1.4 26-16.5 34',dots:[[34.84,45.55,'#8FB8E3'],[45.24,37.43,'#E79DB9'],[52.23,26.23,'#F2E8D8']],r:4.4,shift:[-2.2,2.6]};
function markSvg(mono,cls){
  const id='mg'+Math.random().toString(36).slice(2,7);
  const defs=mono?'':'<defs><linearGradient id="'+id+'" x1="20" y1="10" x2="26" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F8D2AA"/><stop offset=".55" stop-color="#E39563"/><stop offset="1" stop-color="#C2652F"/></linearGradient></defs>';
  return '<svg class="'+(cls||'')+'" viewBox="0 0 64 64" aria-hidden="true" focusable="false">'+defs+'<g transform="translate('+MARK.shift.join(' ')+')"><path class="bm-stroke" pathLength="1" d="'+MARK.stroke+'" fill="none" stroke="'+(mono?'currentColor':'url(#'+id+')')+'" stroke-width="9.5" stroke-linecap="round"/>'+MARK.dots.map((d,i)=>'<circle class="bm-dot" style="--i:'+i+'" cx="'+d[0]+'" cy="'+d[1]+'" r="'+MARK.r+'" fill="'+(mono?'currentColor':d[2])+'"/>').join('')+'</g></svg>';
}
const themeIcon=()=>'<svg class="ic theme-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g class="ti-sun">'+ICONS.sun+'</g><g class="ti-moon">'+ICONS.moon+'</g></svg>';
const ic=(n,cls)=>'<svg class="ic'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(ICONS[n]||ICONS.info)+'</svg>';
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr=s=>esc(JSON.stringify(s));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}

const Store=(()=>{
  const KEY='raqam-v3',SKEY='raqam-v3-session';
  const SENSITIVE=new Set(['single','batch','ageBirth']);
  let local={},sess={};
  try{local=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('lxid-v3')||'{}')||{};}catch(e){}
  try{sess=JSON.parse(sessionStorage.getItem(SKEY)||'{}')||{};}catch(e){}
  const remember=()=>!!local.rememberSensitive;
  function get(k,def){if(SENSITIVE.has(k))return remember()&&k in sess?sess[k]:def;return k in local?local[k]:def;}
  let tmr=null;
  function flush(){clearTimeout(tmr);tmr=null;try{localStorage.setItem(KEY,JSON.stringify(local));if(remember())sessionStorage.setItem(SKEY,JSON.stringify(sess));}catch(e){}}
  function set(k,v){if(SENSITIVE.has(k)){if(!remember())return;sess[k]=v;}else local[k]=v;if(!tmr)tmr=setTimeout(flush,250);}
  function patch(o){for(const k in o)set(k,o[k]);}
  function setRemember(on){local.rememberSensitive=!!on;if(!on){sess={};try{sessionStorage.removeItem(SKEY);}catch(e){}}flush();}
  function snapshot(){return{local:JSON.parse(JSON.stringify(local)),sess:JSON.parse(JSON.stringify(sess))};}
  function restore(s){local=s.local;sess=s.sess;flush();}
  function clear(){local={};sess={};try{localStorage.removeItem(KEY);sessionStorage.removeItem(SKEY);}catch(e){}}
  addEventListener('pagehide',flush);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});
  return{get,set,patch,flush,setRemember,remember,snapshot,restore,clear};
})();

const Fmt={
  loc(){return I18N.lang==='ar'?'ar-EG':'en-GB';},
  nu(){return Store.get('digits','latn')==='arab'&&I18N.lang==='ar'?'arab':'latn';},
  n(v,d){if(v==null||Number.isNaN(v))return'—';return new Intl.NumberFormat(Fmt.loc()+'-u-nu-'+Fmt.nu(),{maximumFractionDigits:d??0,minimumFractionDigits:d&&d>0?0:0}).format(v);},
  pct(v,d){return Fmt.n(v,d??0)+'%';},
  date(rd,style){
    if(rd==null)return'—';
    const o={timeZone:'UTC',numberingSystem:Fmt.nu()};
    if(style==='short')Object.assign(o,{day:'numeric',month:'short',year:'numeric'});
    else if(style==='md')Object.assign(o,{day:'numeric',month:'long'});
    else if(style==='my')Object.assign(o,{month:'long',year:'numeric'});
    else if(style==='full')Object.assign(o,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    else Object.assign(o,{day:'numeric',month:'long',year:'numeric'});
    try{return new Intl.DateTimeFormat(Fmt.loc(),o).format(LXDate.toUTCDate(rd));}catch(e){return LXDate.iso(rd);}
  },
  wd(i,short){return new Intl.DateTimeFormat(Fmt.loc(),{weekday:short?'short':'long',timeZone:'UTC'}).format(LXDate.toUTCDate(LXDate.fromG(2023,1,1)+i));},
  mon(m,short){return new Intl.DateTimeFormat(Fmt.loc(),{month:short?'short':'long',timeZone:'UTC'}).format(new Date(Date.UTC(2023,m-1,15)));},
  time(dt,tz){if(!dt)return'—';return new Intl.DateTimeFormat(Fmt.loc()+'-u-nu-'+Fmt.nu(),{hour:'2-digit',minute:'2-digit',hour12:Store.get('clock','24')==='12',timeZone:tz}).format(dt);},
  hijri(rd){const h=LXDate.toH(rd);return Fmt.n(h.d)+' '+t('hijriMonths')[h.m-1]+' '+Fmt.n(h.y)+' '+t('ah');},
  coptic(rd){const c=LXDate.toC(rd);return Fmt.n(c.d)+' '+t('copticMonths')[c.m-1]+' '+Fmt.n(c.y)+' '+t('am');},
  julian(rd){const j=LXDate.toJ(rd);return Fmt.n(j.d)+' '+Fmt.mon(j.m)+' '+Fmt.n(j.y);},
  ymd(a){return t('ymd',a.years,a.months,a.days);},
  rel(days){return days===0?t('rel_today'):days>0?t('rel_in',days):t('rel_ago',-days);}
};

const Toast=(()=>{
  let box,last={msg:'',el:null,at:0};
  function show(msg,kind,opts){
    box=box||$('#toasts');
    opts=opts||{};kind=kind||'ok';
    const now=performance.now();
    if(last.el&&last.el.isConnected&&!last.el._gone&&last.msg===msg&&now-last.at<2500&&!opts.action){last.el._bump();last.at=now;return last.el._kill;}
    const live=[...box.children].filter(x=>!x._gone);
    if(live.length>=3)live[0]._kill();
    const el=document.createElement('div');
    el.className='toast '+kind;
    el.setAttribute('role',kind==='bad'?'alert':'status');
    el.innerHTML='<div class="toast-in"><span class="tic">'+ic(kind==='bad'?'alert':kind==='info'?'info':'check')+'</span><span class="tmsg">'+esc(msg)+'</span>'+(opts.action?'<button type="button" class="tact">'+esc(opts.action)+'</button>':'')+'</div>';
    box.appendChild(el);
    const ms=opts.ms||(opts.action?6000:2600);
    let timer=null,left=ms,started=0;
    const run=()=>{started=performance.now();timer=setTimeout(kill,left);};
    const pause=()=>{clearTimeout(timer);left=Math.max(900,left-(performance.now()-started));};
    function kill(){
      if(el._gone)return;el._gone=true;clearTimeout(timer);
      el.style.height=el.offsetHeight+'px';void el.offsetHeight;
      el.classList.add('out');
      const rm=()=>el.remove();el.addEventListener('transitionend',e=>{if(e.propertyName==='height')rm();});setTimeout(rm,420);
    }
    el._kill=kill;
    el._bump=()=>{clearTimeout(timer);left=ms;run();el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');};
    if(opts.action)el.querySelector('.tact').onclick=()=>{opts.onAction&&opts.onAction();kill();};
    el.addEventListener('pointerenter',pause);el.addEventListener('pointerleave',run);
    run();
    last={msg,el,at:now};
    return kill;
  }
  return{show};
})();
const toast=(m,k,o)=>Toast.show(m,k,o);

async function copyText(text,btn,msg){
  let ok=false;
  try{await navigator.clipboard.writeText(text);ok=true;}catch(e){
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{ok=document.execCommand('copy');}catch(e2){}ta.remove();
  }
  if(ok){toast(msg||t('t_copied'));if(btn){btn.classList.add('ok');setTimeout(()=>btn.classList.remove('ok'),1100);}}
  else toast(t('t_copy_fail'),'bad');
}
async function readClipboard(){
  try{return await navigator.clipboard.readText();}catch(e){toast(t('t_clip_denied'),'bad');return null;}
}
function download(content,name,mime){
  const b=content instanceof Blob?content:new Blob([content],{type:mime||'text/plain'});
  const u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),1500);
}
function toCSV(rows){
  const e=v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s)&&!/^-?\d+(\.\d+)?$/.test(s))s="'"+s;return/[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
  return'\uFEFF'+rows.map(r=>r.map(e).join(',')).join('\r\n');
}
const toTSV=rows=>rows.map(r=>r.map(v=>String(v??'').replace(/[\t\r\n]+/g,' ')).join('\t')).join('\n');

const XL=(()=>{
  const SRC='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
  let p=null;
  function load(){
    if(window.XLSX)return Promise.resolve(window.XLSX);
    if(p)return p;
    p=new Promise((res,rej)=>{const s=document.createElement('script');s.src=SRC;s.async=true;s.onload=()=>res(window.XLSX);s.onerror=()=>{p=null;s.remove();rej(new Error('xlsx'));};document.head.appendChild(s);});
    return p;
  }
  async function need(){try{return await load();}catch(e){toast(t('t_xlsx_fail'),'bad');throw e;}}
  return{load,need,SRC};
})();

const Overlay=(()=>{
  const FOC='button:not([disabled]),[href],input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const stack=[];
  function open(id){
    const ov=document.getElementById(id);if(!ov||ov.classList.contains('open'))return;
    ov._restore=document.activeElement;
    ov.classList.add('open');ov.setAttribute('aria-hidden','false');
    if(!stack.length){const sw=innerWidth-document.documentElement.clientWidth;document.documentElement.style.setProperty('--sbw',sw+'px');document.documentElement.classList.add('locked');}
    stack.push(ov);Menu.close();
    setTimeout(()=>{const f=ov.querySelector('[autofocus]')||[...ov.querySelectorAll(FOC)].find(e=>e.offsetParent);f&&f.focus({preventScroll:true});},60);
  }
  function close(id){
    const ov=id?document.getElementById(id):stack[stack.length-1];if(!ov||!ov.classList.contains('open'))return;
    ov.classList.remove('open');ov.setAttribute('aria-hidden','true');
    const i=stack.indexOf(ov);if(i>=0)stack.splice(i,1);
    if(!stack.length){document.documentElement.classList.remove('locked');document.documentElement.style.removeProperty('--sbw');}
    if(ov._restore&&document.contains(ov._restore))try{ov._restore.focus({preventScroll:true});}catch(e){}
    ov.dispatchEvent(new Event('closed'));
  }
  function init(){
    $$('.overlay').forEach(ov=>{
      ov.setAttribute('aria-hidden','true');
      ov.addEventListener('mousedown',e=>{if(e.target===ov)close(ov.id);});
      ov.addEventListener('keydown',e=>{
        if(e.key!=='Tab')return;
        const it=[...ov.querySelectorAll(FOC)].filter(x=>x.offsetParent);if(!it.length)return;
        const a=it[0],b=it[it.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();}
        else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();}
      });
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(Menu.close())return;if(stack.length){e.preventDefault();close();}}});
  }
  const isOpen=()=>stack.length>0;
  return{open,close,init,isOpen};
})();

const Menu=(()=>{
  let cur=null,anchor=null;
  function place(el,a){
    const r=a.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight;
    const wide=el.classList.contains('kmenu');
    let x=wide?(document.dir==='rtl'?r.right-w:r.left):(document.dir==='rtl'?r.left:r.right-w);
    x=clamp(x,8,innerWidth-w-8);
    let y=r.bottom+6,up=false;if(y+h>innerHeight-8&&r.top-h-6>8){y=r.top-h-6;up=true;}
    el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px';
    el.style.transformOrigin=(document.dir==='rtl'?'right':'left')+' '+(up?'bottom':'top');
    el.classList.toggle('up',up);
  }
  function open(a,html,onBind){
    if(cur&&anchor===a){close();return null;}
    close();
    const el=document.createElement('div');el.className='menu';el.innerHTML=html;el.setAttribute('role','menu');
    document.body.appendChild(el);cur=el;anchor=a;a.setAttribute('aria-expanded','true');a.classList.add('menu-open');
    onBind&&onBind(el);
    place(el,a);
    if(!el.classList.contains('kmenu'))setTimeout(()=>{const f=el.querySelector('button,input');f&&f.focus({preventScroll:true});},30);
    return el;
  }
  function close(){
    if(!cur)return false;
    const el=cur;cur=null;
    if(anchor&&el.contains(document.activeElement))try{anchor.focus({preventScroll:true});}catch(e){}
    if(anchor){anchor.setAttribute('aria-expanded','false');anchor.classList.remove('menu-open');}anchor=null;
    el.classList.add('out');el.style.pointerEvents='none';
    setTimeout(()=>el.remove(),170);
    return true;
  }
  const isOpen=()=>!!cur;
  const owns=n=>!!(cur&&cur.contains(n));
  document.addEventListener('mousedown',e=>{if(cur&&!cur.contains(e.target)&&anchor&&!anchor.contains(e.target))close();});
  addEventListener('resize',()=>close());
  let raf=0;
  addEventListener('scroll',e=>{
    if(!cur||cur.contains(e.target))return;const tg=e.target;
    if(!(tg===document||tg===document.documentElement||(tg.contains&&anchor&&tg.contains(anchor))))return;
    if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!cur||!anchor)return;const r=anchor.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!anchor.isConnected){close();return;}cur.style.animation='none';place(cur,anchor);});
  },true);
  return{open,close,isOpen,owns};
})();

const DateField=(()=>{
  let pop=null,popFor=null;
  function closePop(){if(pop){const p=pop;pop=null;if(popFor){popFor.wrap.classList.remove('open');}popFor=null;p.classList.add('out');p.style.pointerEvents='none';setTimeout(()=>p.remove(),170);}}
  document.addEventListener('mousedown',e=>{if(pop&&!pop.contains(e.target)&&!Menu.owns(e.target)&&!(popFor&&popFor.wrap.contains(e.target)))closePop();});
  addEventListener('resize',closePop);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pop&&!Menu.isOpen()){closePop();e.stopPropagation();}},true);
  function create(host,opts){
    opts=opts||{};
    const id=opts.id||('df'+Math.random().toString(36).slice(2,8));
    host.innerHTML='<div class="df"><input class="field" id="'+id+'" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="'+esc(opts.placeholder||t('df_ph'))+'" aria-describedby="'+id+'-cap"><div class="df-acts"><button type="button" class="iconbtn sm" data-a="today" title="'+esc(t('today'))+'" aria-label="'+esc(t('today'))+'">'+ic('today')+'</button><button type="button" class="iconbtn sm" data-a="cal" title="'+esc(t('df_open'))+'" aria-label="'+esc(t('df_open'))+'" aria-haspopup="dialog">'+ic('cal')+'</button></div></div><div class="df-cap empty" id="'+id+'-cap" aria-live="polite"></div>';
    const wrap=host.firstChild,inp=wrap.querySelector('input'),cap=host.querySelector('.df-cap');
    const api={wrap,input:inp,rd:null,
      get(){return api.rd;},
      set(rd,silent){api.rd=rd;inp.value=rd==null?'':LXDate.iso(rd);inp.classList.remove('invalid');render();if(!silent)opts.onChange&&opts.onChange(rd);},
      clear(){api.set(null);}
    };
    function render(bad,amb){
      if(bad){cap.className='df-cap bad';cap.innerHTML='<span>'+esc(t('df_bad'))+'</span>';return;}
      if(api.rd==null){cap.className='df-cap empty';cap.innerHTML='<span>'+esc(opts.hint||t('df_hint'))+'</span>';return;}
      cap.className='df-cap';
      cap.innerHTML='<span>'+esc(Fmt.date(api.rd,'full'))+(amb?' · '+esc(t('df_amb')):'')+'</span><span class="alt">'+esc(Fmt.hijri(api.rd))+'</span>';
    }
    const commit=()=>{
      const v=inp.value.trim();
      if(!v){if(api.rd!=null){api.rd=null;render();opts.onChange&&opts.onChange(null);}else render();inp.classList.remove('invalid');return;}
      const p=LXParse.parse(v,Store.get('dateOrder','dmy'));
      if(!p||p.rd==null){inp.classList.add('invalid');render(true);return;}
      inp.classList.remove('invalid');
      const changed=p.rd!==api.rd;
      api.rd=p.rd;render(false,p.ambiguous);
      if(changed)opts.onChange&&opts.onChange(p.rd);
    };
    inp.addEventListener('input',debounce(()=>{const v=inp.value.trim();if(!v||/^\d{4}-\d{2}-\d{2}$/.test(v)||/^\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}$/.test(v)||/^\d{8}$/.test(v))commit();},260));
    inp.addEventListener('change',commit);
    inp.addEventListener('blur',()=>{commit();if(api.rd!=null&&!inp.classList.contains('invalid'))inp.value=LXDate.iso(api.rd);});
    inp.addEventListener('keydown',e=>{
      if(e.key==='Enter'){commit();if(api.rd!=null)inp.value=LXDate.iso(api.rd);}
      if((e.key==='ArrowUp'||e.key==='ArrowDown')&&api.rd!=null){e.preventDefault();const s=e.key==='ArrowUp'?1:-1;api.set(e.shiftKey?LXDate.addMonths(api.rd,s):e.altKey?LXDate.addYears(api.rd,s):api.rd+s);}
      if(e.key==='t'&&!inp.value){e.preventDefault();api.set(LXDate.today());}
    });
    wrap.querySelector('[data-a=today]').onclick=()=>api.set(LXDate.today());
    wrap.querySelector('[data-a=cal]').onclick=e=>openCal(api,e.currentTarget,opts);
    render();
    return api;
  }
  function openCal(api,btn,opts){
    if(popFor===api){closePop();return;}
    closePop();
    const D=LXDate;
    let view=api.rd!=null?D.toG(api.rd):D.toG(D.today());
    let vy=view.y,vm=view.m;
    pop=document.createElement('div');pop.className='cal';pop.setAttribute('role','dialog');pop.setAttribute('aria-label',t('df_open'));
    document.body.appendChild(pop);popFor=api;api.wrap.classList.add('open');
    const me=pop;let placed=false;
    const hol=typeof Holidays!=='undefined'?Holidays.keys():new Set();
    const ws=+Store.get('weekStart',I18N.lang==='ar'?6:0);
    function draw(dir){
      if(pop!==me)return;
      const first=D.fromG(vy,vm,1),lead=D.mod(D.dow(first)-ws,7),start=first-lead,tdy=D.today();
      let h='<div class="cal-head"><button type="button" class="iconbtn sm" data-n="-1" aria-label="'+esc(t('prev'))+'">'+ic(document.dir==='rtl'?'chevr':'chevl')+'</button>';
      h+='<select class="field field-sm" data-s="m" style="flex:1.4" aria-label="'+esc(t('month'))+'">'+Array.from({length:12},(_,i)=>'<option value="'+(i+1)+'"'+(i+1===vm?' selected':'')+'>'+esc(Fmt.mon(i+1))+'</option>').join('')+'</select>';
      h+='<input class="field field-sm mono" data-s="y" type="number" min="1" max="9999" value="'+vy+'" style="flex:1;min-width:0" aria-label="'+esc(t('year'))+'">';
      h+='<button type="button" class="iconbtn sm" data-n="1" aria-label="'+esc(t('next'))+'">'+ic(document.dir==='rtl'?'chevl':'chevr')+'</button></div><div class="cal-grid">';
      for(let i=0;i<7;i++)h+='<div class="cal-dow">'+esc(Fmt.wd((ws+i)%7,true))+'</div>';
      for(let i=0;i<42;i++){
        const r=start+i,g=D.toG(r),hj=D.toH(r);
        const cls=['cal-d'];if(g.m!==vm)cls.push('out');if(r===tdy)cls.push('today');if(r===api.rd)cls.push('sel');if(hol.has(D.iso(r)))cls.push('hol');
        h+='<button type="button" class="'+cls.join(' ')+'" data-r="'+r+'" aria-label="'+esc(Fmt.date(r,'full'))+'"><span>'+g.d+'</span><small>'+hj.d+'</small></button>';
      }
      h+='</div><div class="cal-foot"><button type="button" class="btn btn-ghost btn-sm" data-f="today">'+esc(t('today'))+'</button><span class="tiny faint" style="align-self:center">'+esc(Fmt.hijri(D.fromG(vy,vm,15)).replace(/^\S+\s/,''))+'</span><button type="button" class="btn btn-ghost btn-sm" data-f="clear">'+esc(t('clear'))+'</button></div>';
      pop.innerHTML=h;
      if(dir){const g2=pop.querySelector('.cal-grid');g2.classList.add(dir>0?'slide-next':'slide-prev');}
      pop.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;vm+=n;if(vm<1){vm=12;vy--;}if(vm>12){vm=1;vy++;}draw(n);const nb=pop&&pop.querySelector('[data-n="'+n+'"]');nb&&nb.focus({preventScroll:true});});
      pop.querySelector('[data-s=m]').onchange=e=>{const o=vm;vm=+e.target.value;draw(vm>o?1:-1);};
      pop.querySelector('[data-s=y]').onchange=e=>{const y=parseInt(e.target.value,10);if(y>=1&&y<=9999){const o=vy;vy=y;draw(vy>o?1:-1);}};
      pop.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{api.set(+b.dataset.r);closePop();api.input.focus();});
      pop.querySelector('[data-f=today]').onclick=()=>{api.set(D.today());closePop();};
      pop.querySelector('[data-f=clear]').onclick=()=>{api.set(null);closePop();};
      pop.querySelector('.cal-grid').addEventListener('keydown',e=>{
        const b=e.target.closest('[data-r]');if(!b)return;
        const mv={ArrowLeft:document.dir==='rtl'?1:-1,ArrowRight:document.dir==='rtl'?-1:1,ArrowUp:-7,ArrowDown:7}[e.key];
        if(mv){e.preventDefault();const r=+b.dataset.r+mv,g=D.toG(r);if(g.m!==vm||g.y!==vy){const fw=g.y*12+g.m>vy*12+vm;vy=g.y;vm=g.m;draw(fw?1:-1);}const nb=pop.querySelector('[data-r="'+r+'"]');nb&&nb.focus();}
      });
      if(!placed){place();placed=true;}
    }
    function place(){
      const r=btn.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
      let x=document.dir==='rtl'?r.left:r.right-w;x=clamp(x,8,innerWidth-w-8);
      let y=r.bottom+8,up=false;if(y+h>innerHeight-8&&r.top-h-8>8){y=r.top-h-8;up=true;}if(y<8)y=8;
      pop.style.left=Math.round(x)+'px';pop.style.top=Math.round(y)+'px';
      pop.style.transformOrigin=(document.dir==='rtl'?'left':'right')+' '+(up?'bottom':'top');
    }
    draw();
    const s=pop.querySelector('.cal-d.sel')||pop.querySelector('.cal-d.today');s&&s.focus();
  }
  return{create,closePop};
})();

function ring(pct,size,stroke){
  const r=(size-stroke)/2,c=2*Math.PI*r,off=c*(1-clamp(pct,0,100)/100);
  return'<svg viewBox="0 0 '+size+' '+size+'"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--amber)"/><stop offset="1" stop-color="var(--amber-hi)"/></linearGradient></defs><circle class="bg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+stroke+'"/><circle class="fg" cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" stroke-width="'+stroke+'" stroke-dasharray="'+c.toFixed(2)+'" stroke-dashoffset="'+c.toFixed(2)+'" data-off="'+off.toFixed(2)+'"/></svg>';
}
const CountMem=new Map(),RingMem=new Map();
function animateIn(root){
  const quiet=root&&root.classList&&root.classList.contains('calm');
  $$('circle.fg[data-off]',root).forEach((c,i)=>{
    const key=(root&&root.id||'')+':r'+i,prev=RingMem.get(key);RingMem.set(key,c.dataset.off);
    if(quiet&&prev!=null){c.style.transition='none';c.style.strokeDashoffset=prev;void c.getBoundingClientRect();c.style.transition='';}
  });
  requestAnimationFrame(()=>requestAnimationFrame(()=>{$$('circle.fg[data-off]',root).forEach(c=>c.style.strokeDashoffset=c.dataset.off);}));
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('[data-count]',root).forEach((el,i)=>{
    const to=+el.dataset.count,fmt=el.dataset.fmt||'n',key=(root&&root.id||'')+':'+i;
    if(rm||!isFinite(to)){CountMem.set(key,to);return;}
    const from=CountMem.has(key)?CountMem.get(key):0;CountMem.set(key,to);
    if(from===to)return;
    const dur=from?520:900,st=performance.now();
    const paint=v=>{el.textContent=fmt==='pct'?Fmt.pct(v,0):Fmt.n(Math.round(v));};
    paint(from);
    const step=now=>{if(!el.isConnected)return;const p=Math.min(1,(now-st)/dur),e=1-Math.pow(1-p,4);paint(from+(to-from)*e);if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);
  });
}
function emptyState(icon,msg,bad){return'<div class="empty'+(bad?' bad':'')+'"><span class="bubble">'+ic(icon)+'</span><span>'+msg+'</span></div>';}
function genderBadge(g){return'<span class="gender '+(g==='M'?'m':'f')+'">'+ic(g==='M'?'male':'female')+esc(t(g==='M'?'male':'female'))+'</span>';}
function stat(k,v,o){o=o||{};return'<div class="stat'+(o.tone?' '+o.tone:'')+'"><div class="k">'+(o.icon?ic(o.icon):'')+esc(k)+'</div><div class="v'+(o.sm?' sm':'')+'"'+(o.count!=null?' data-count="'+o.count+'"':'')+'>'+v+'</div>'+(o.s?'<div class="s">'+o.s+'</div>':'')+'</div>';}
function li(k,v,s){return'<div class="li"><span class="k">'+esc(k)+'</span><span class="v">'+v+(s?'<small>'+s+'</small>':'')+'</span></div>';}
function sw(id,label,checked,hint){return'<label class="switch" for="'+id+'"'+(hint?' title="'+esc(hint)+'"':'')+'><input type="checkbox" id="'+id+'"'+(checked?' checked':'')+'><span class="track"></span><span>'+esc(label)+'</span></label>';}
function seg(name,opts,val){return'<div class="seg" role="radiogroup" data-seg="'+name+'">'+opts.map(([v,l,i])=>'<button type="button" role="radio" aria-checked="'+(v===val)+'" class="'+(v===val?'active':'')+'" data-v="'+esc(v)+'">'+(i?ic(i):'')+esc(l)+'</button>').join('')+'</div>';}
function bindSeg(root,name,fn){const s=root.querySelector('[data-seg="'+name+'"]');if(!s)return;s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.classList.contains('active'))return;s.querySelectorAll('button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-checked',x===b);});Kit.glide(s);fn(b.dataset.v);});}
const paint=(el,html)=>Kit.paint(el,html);
