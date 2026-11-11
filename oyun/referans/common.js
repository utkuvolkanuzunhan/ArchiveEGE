(function(){
var $=function(i){return document.getElementById(i)};
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- canavar çizimi: ortak baş + bilim insanına özgü parçalar ---------- */
var BODY='<path class="body" d="M40 350 Q44 262 112 248 L150 266 L188 248 Q256 262 260 350Z"/><path class="collar" d="M112 248 L136 290 L150 266Z"/><path class="collar" d="M188 248 L164 290 L150 266Z"/>';
var HAIR={
 wild:'<path class="hair" d="M80 158 L52 112 L86 120 L72 74 L106 98 L110 54 L136 90 L150 44 L166 90 L192 56 L196 98 L228 76 L214 120 L248 114 L220 158Z"/><path class="hair" d="M92 170 L46 176 L90 196Z"/><path class="hair" d="M208 170 L254 176 L210 196Z"/>',
 slick:'<path class="hair" d="M90 150 Q88 92 150 88 Q212 92 210 150 Q196 116 150 114 Q104 116 90 150Z"/>',
 side:'<path class="hair" d="M88 154 Q84 90 152 84 Q216 88 212 152 Q204 108 170 104 Q124 100 88 154Z"/>',
 sideburn:'<path class="hair" d="M96 130 Q108 100 130 104 Q112 112 106 142Z"/><path class="hair" d="M204 130 Q192 100 170 104 Q188 112 194 142Z"/><path class="hair" d="M92 150 L86 208 L106 200 L106 150Z"/><path class="hair" d="M208 150 L214 208 L194 200 L194 150Z"/>',
 bald:'<path class="hair" d="M92 152 Q80 122 98 106 Q94 130 104 152Z"/><path class="hair" d="M208 152 Q220 122 202 106 Q206 130 196 152Z"/>',
 curly:'<circle class="hair" cx="98" cy="118" r="22"/><circle class="hair" cx="124" cy="98" r="24"/><circle class="hair" cx="152" cy="92" r="24"/><circle class="hair" cx="180" cy="98" r="24"/><circle class="hair" cx="204" cy="118" r="22"/><circle class="hair" cx="90" cy="146" r="16"/><circle class="hair" cx="210" cy="146" r="16"/>'
};
var MOUS={
 bushy:'<path class="mous" d="M102 200 Q128 184 150 196 Q172 184 198 200 Q178 224 150 210 Q122 224 102 200Z"/>',
 thin:'<path class="accl" d="M108 206 Q130 194 150 202 Q170 194 192 206 Q200 208 202 198 M108 206 Q100 208 98 198"/>'
};
var MOUTH='<path class="mouth" d="M120 226 Q150 262 180 226 Q150 236 120 226Z"/><path class="fang" d="M130 229 L137 247 L144 232Z"/><path class="fang" d="M170 229 L163 247 L156 232Z"/>';
var GLASS='<circle class="glass" cx="126" cy="152" r="21"/><circle class="glass" cx="174" cy="152" r="21"/><path class="glass" d="M147 150 L153 150"/>';
var ACC={
 cube:'<path class="accl" d="M150 36 L244 92 L244 208 L150 264 L56 208 L56 92Z M150 150 L56 92 M150 150 L244 92 M150 150 L150 264"/>',
 orbits:'<ellipse class="accl" cx="150" cy="172" rx="150" ry="46" transform="rotate(-28 150 172)"/><ellipse class="accl" cx="150" cy="172" rx="150" ry="46" transform="rotate(28 150 172)"/><circle class="acc" cx="300" cy="172" r="10" transform="rotate(-28 150 172)"/><circle class="acc" cx="0" cy="172" r="10" transform="rotate(28 150 172)"/>',
 wave:'<path class="accl" d="M-30 300 Q0 250 30 300 T90 300 T150 300 T210 300 T270 300 T330 300"/><path class="accl" d="M-30 56 Q0 16 30 56 T90 56 T150 56 T210 56 T270 56 T330 56"/>',
 ghost:'<ellipse class="ghost" cx="178" cy="172" rx="60" ry="70"/><ellipse class="ghost" cx="122" cy="172" rx="60" ry="70"/>',
 bolts:'<path class="accl" d="M16 120 l24 -18 l-8 26 l24 -16"/><path class="accl" d="M284 120 l-24 -18 l8 26 l-24 -16"/>',
 crystals:'<path class="acc" d="M100 108 L90 44 L126 90Z"/><path class="acc" d="M200 108 L210 44 L174 90Z"/><path class="accl" d="M138 104 L146 130 L136 152"/>',
 ears:'<path class="acc" d="M98 118 L102 60 L142 98Z"/><path class="acc" d="M202 118 L198 60 L158 98Z"/><path class="accl" d="M100 190 L52 182 M100 200 L50 206 M200 190 L248 182 M200 200 L250 206"/>'
};
function txt(s){return '<text class="label" x="150" y="324">'+s+'</text>'}
var SCI=[
 {id:'miller',kisi:'William H. Miller',yil:1839,canavar:'Düzlem Canavarı',konu:'Miller indisleri',soru:'Kesişimlerim 2, ∞, ∞. Hangi düzlemdeyim?',zayif:'Kesişimin tersini al, kesirleri temizle: (100).',hair:'sideburn',back:ACC.cube,chest:txt('(hkl)')},
 {id:'einstein',kisi:'Albert Einstein',yil:1905,canavar:'Foton Canavarı',konu:'Fotoelektrik olay',soru:'Eşiğin altındaki ışığı 10 kat parlattın. Kaç elektron kopar?',zayif:'Hiç. Tek foton yetmez, şiddet foton sayısını artırır.',hair:'wild',eyes:3,mous:'bushy',rays:true,front:ACC.bolts},
 {id:'bohr',kisi:'Niels Bohr',yil:1913,canavar:'Yörünge Canavarı',konu:'Atom spektrumu',soru:'Elektron neden çekirdeğe düşmüyor?',zayif:'Seviyeler ayrık, en alt seviyenin altı yok.',hair:'slick',back:ACC.orbits},
 {id:'czoch',kisi:'Jan Czochralski',yil:1916,canavar:'Tane Sınırı Canavarı',konu:'Tek kristal büyütme (CZ)',soru:'Neden tek kristal istiyorsunuz?',zayif:'Tane sınırı yok, taşıyıcılar saçılmaz.',hair:'bald',glasses:true,front:ACC.crystals},
 {id:'broglie',kisi:'Louis de Broglie',yil:1924,canavar:'Dalga Canavarı',konu:'Madde dalgası',soru:'Bilardo topu neden dalga gibi davranmıyor?',zayif:'λ = h/p, topta λ çok küçük.',hair:'slick',mous:'thin',back:ACC.wave},
 {id:'schro',kisi:'Erwin Schrödinger',yil:1926,canavar:'Kuantum Kedisi',konu:'Schrödinger denklemi',soru:'Denklem ψ\'yi çökertir mi?',zayif:'Hayır. Denklem düzgün evriltir, çökme ölçümle olur.',hair:'side',glasses:true,closed:true,front:ACC.ears,chest:txt('ψ')},
 {id:'heis',kisi:'Werner Heisenberg',yil:1927,canavar:'Belirsizlik Canavarı',konu:'Belirsizlik ilkesi',soru:'Konumu keskinleştirirsem momentum ne olur?',zayif:'Yayılır. Alet kusuru değil, dalga doğası.',hair:'curly',back:ACC.ghost,chest:txt('ΔxΔp')}
];
function eyes(n,closed){
  var s='<circle class="eye" cx="126" cy="152" r="16"/><circle class="pupil" cx="130" cy="154" r="6"/>';
  if(closed) s+='<path class="brow" d="M160 144 L188 164 M188 144 L160 164"/>';
  else s+='<circle class="eye" cx="174" cy="152" r="16"/><circle class="pupil" cx="170" cy="154" r="6"/>';
  if(n===3) s+='<circle class="eye" cx="150" cy="122" r="9"/><circle class="pupil" cx="150" cy="123" r="4"/>';
  return s;
}
function mon(k,cls){
  var s='<svg class="'+(cls||'mon')+'" viewBox="-30 -10 360 360" role="img" aria-label="'+k.canavar+': '+k.kisi+' karikatürü">';
  s+='<circle class="aura" cx="150" cy="175" r="165"/>';
  if(k.rays){for(var a=0;a<360;a+=45)s+='<path class="ray" d="M150 4 L160 40 L140 40Z" transform="rotate('+a+' 150 175)"/>'}
  s+=(k.back||'')+BODY+(k.chest||'')+HAIR[k.hair]+'<ellipse class="face" cx="150" cy="172" rx="60" ry="70"/>';
  s+=eyes(k.eyes||2,k.closed)+'<path class="brow" d="M104 130 L140 142"/><path class="brow" d="M196 130 L160 142"/><path class="nose" d="M150 164 Q140 184 152 188"/>';
  s+=MOUTH+(k.mous?MOUS[k.mous]:'')+(k.glasses?GLASS:'')+(k.front||'');
  return s+'</svg>';
}

/* ---------- savaş sahnesi ---------- */
var OPTS=[{t:'Çok elektron kopar'},{t:'Hiç elektron kopmaz',ok:true},{t:'Elektronlar gecikmeyle kopar'}];
var CONF=['Bilmiyorum','Emin değilim','Eminim'];
var RULES=['Bilmiyorum: yanlışsa hasar çok küçük, doğruysa vuruş yarım.','Emin değilim: vuruş ve hasar normal.','Eminim: doğruysa 2× vuruş, yanlışsa 2× hasar.'];
var OK_MSG=['Hafif vuruş (−12). Şans mı içgüdü mü? Gerekçeni oturtalım.','İsabet (−25). Bir dahaki sefere "Eminim" de.','Kritik vuruş (−50)! Eminliğin doğru çıktı.'];
var NO_MSG=['Küçük hasar (−6). Bilmediğini söylemek işe yaradı, temel kart açıldı.','Yanlış, hasar normal (−25). Hata defterine yazıldı.','Emin ama yanlış: çifte hasar (−50). Hata defterine "emin yanlış" yazıldı.'];
var EXPL=' Eşik altında tek foton yetmez; şiddet foton sayısını artırır, enerjisini değil.';
var pv=100,mv=100,pick=-1,conf=1,over=false;
var foe=$('foe'),monwrap=$('monwrap'),go=$('go'),runway=$('runway');
monwrap.innerHTML=mon(SCI[1]);
OPTS.forEach(function(o,i){var b=el('button','opt',o.t);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){if(over)return;pick=i;sync()});$('opts').appendChild(b)});
CONF.forEach(function(c,i){var b=el('button','cbtn',c);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){conf=i;sync()});$('conf').appendChild(b)});
function sync(){
  Array.prototype.forEach.call($('opts').children,function(b,i){b.setAttribute('aria-pressed',String(i===pick))});
  Array.prototype.forEach.call($('conf').children,function(b,i){b.setAttribute('aria-pressed',String(i===conf))});
  $('rule').textContent=RULES[conf];
  go.disabled=over||pick<0;
}
function bars(){$('pbar').style.width=pv+'%';$('mbar').style.width=mv+'%';$('pv').textContent=pv;$('mv').textContent=mv}
function restart(el2,cls){el2.classList.remove(cls);void el2.offsetWidth;el2.classList.add(cls)}
go.addEventListener('click',function(){
  var ok=!!OPTS[pick].ok,dealt=0,taken=0,msg;
  if(ok){dealt=[12,25,50][conf];msg=OK_MSG[conf]}else{taken=[6,25,50][conf];msg=NO_MSG[conf]}
  mv=Math.max(0,mv-dealt);pv=Math.max(0,pv-taken);bars();
  var d=$('dmg');d.textContent='−'+(dealt||taken);d.className='dmg '+(ok?'dealt':'taken');void d.offsetWidth;d.classList.add('show');
  foe.classList.remove('enter');
  if(ok)restart(monwrap,'hit');else restart(runway,'hit');
  var res=msg+EXPL;
  if(mv===0){res+=' Canavar yenildi, Einstein kartı senin. Fabrikada yeni makine kuruldu.';over=true;factory(3)}
  else if(pv===0){res+=' Voltaj bitti: önceki istasyonun temel turuna dönersin.';over=true}
  $('result').textContent=res;pick=-1;sync();
});

/* koşucu */
var cv=$('run'),ctx=cv.getContext('2d'),W=640,H=170,G=124,px=90,t=0,ex=0,state='fight',last=0;
function tk(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function draw(){
  var sky=tk('--sky'),gr=tk('--ground'),grid=tk('--grid'),pl=tk('--runner'),fo=tk('--foe'),ink=tk('--ink');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  if(grid&&grid!=='none'){ctx.strokeStyle=grid;ctx.lineWidth=1;for(var gx=-((t*90)%40);gx<W;gx+=40){ctx.beginPath();ctx.moveTo(gx,G+20);ctx.lineTo(gx-30,H);ctx.stroke()}for(var gy=G+34;gy<H;gy+=16){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke()}}
  ctx.strokeStyle=gr;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,G+20);ctx.lineTo(W,G+20);ctx.stroke();
  var bob=state==='run'?Math.sin(t*14)*3:0;
  ctx.fillStyle=pl;ctx.fillRect(px,G-34,22,26);ctx.fillRect(px+2,G-8,7,22+bob*.3);ctx.fillRect(px+13,G-8,7,22-bob*.3);
  ctx.fillStyle=ink;ctx.fillRect(px+4,G-52,16,16);
  ctx.fillStyle=fo;ctx.fillRect(px+18,G-46,6,4);
  ctx.fillStyle=fo;ctx.fillRect(ex,G-40,34,46);
  ctx.fillStyle=sky;ctx.fillRect(ex+6,G-28,8,8);ctx.fillRect(ex+20,G-28,8,8);
  ctx.fillStyle=ink;ctx.fillRect(ex+8,G-26,4,4);ctx.fillRect(ex+22,G-26,4,4);
  ctx.fillStyle=sky;ctx.fillRect(ex+8,G-8,18,4);
  if(state==='fight'){ctx.strokeStyle=fo;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+40,G-20);ctx.lineTo(ex-6,G-20);ctx.stroke()}
}
function frame(ts){
  if(state!=='run')return;
  var dt=Math.min(.05,(ts-last)/1000);last=ts;t+=dt;ex-=170*dt;
  if(ex<=px+90){ex=px+90;state='fight';reveal();draw();return}
  draw();requestAnimationFrame(frame);
}
function reveal(){foe.classList.remove('wait');restart(foe,'enter')}
function reset(){pv=100;mv=100;over=false;pick=-1;bars();sync();$('result').textContent='';$('dmg').className='dmg'}
$('replay').addEventListener('click',function(){
  reset();foe.classList.remove('enter');
  if(reduce){state='fight';ex=px+90;foe.classList.remove('wait');draw();return}
  foe.classList.add('wait');state='run';ex=W+20;last=performance.now();requestAnimationFrame(frame);
});
ex=px+90;bars();sync();draw();

/* ---------- galeri ---------- */
var gt=$('gthumbs');
SCI.forEach(function(k,i){
  var b=el('button','th',mon(k,'mon')+'<span class="y">'+k.yil+'</span><b>'+k.kisi.split(' ').pop()+'</b>');
  b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){show(i)});gt.appendChild(b);
});
function show(i){
  var k=SCI[i];
  $('gart').innerHTML=mon(k,'mon');$('gname').textContent=k.canavar;$('gwho').textContent=k.kisi+' · '+k.yil;
  $('gtopic').textContent=k.konu;$('gq').textContent=k.soru;$('gweak').textContent=k.zayif;
  Array.prototype.forEach.call(gt.children,function(b,j){b.setAttribute('aria-pressed',String(j===i))});
}
show(1);

/* ---------- keşfet, tahmin et, doğrula ---------- */
var wl=$('wl'),wn=$('wn'),wc=$('well'),wx=wc.getContext('2d'),PRED=['Yarıya iner','Değişmez','4 katına çıkar'],pred=-1;
function fmtE(e){return e>=1?e.toFixed(2)+' eV':(e*1000).toFixed(1)+' meV'}
function drawWell(){
  var L=+wl.value,n=+wn.value,E=0.376*n*n/(L*L);
  $('wlv').textContent=L+' nm';$('wnv').textContent=n;
  $('wread').textContent='E'+['₁','₂','₃','₄'][n-1]+' = '+fmtE(E);
  var sky=tk('--sky'),ac=tk('--accent'),ac2=tk('--accent2'),wall=tk('--ink'),mu=tk('--muted');
  var w=560,h=200,x0=40,x1=40+480*L/10,y0=150;
  wx.fillStyle=sky;wx.fillRect(0,0,w,h);
  wx.strokeStyle=mu;wx.lineWidth=1;wx.setLineDash([4,4]);wx.beginPath();wx.moveTo(0,y0);wx.lineTo(w,y0);wx.stroke();wx.setLineDash([]);
  wx.strokeStyle=wall;wx.lineWidth=5;wx.beginPath();wx.moveTo(x0,30);wx.lineTo(x0,y0+20);wx.moveTo(x1,30);wx.lineTo(x1,y0+20);wx.stroke();
  wx.fillStyle=ac2;wx.globalAlpha=.28;wx.beginPath();wx.moveTo(x0,y0);
  var i,x,s;
  for(i=0;i<=120;i++){x=x0+(x1-x0)*i/120;s=Math.sin(n*Math.PI*i/120);wx.lineTo(x,y0-s*s*95)}
  wx.lineTo(x1,y0);wx.closePath();wx.fill();wx.globalAlpha=1;
  wx.strokeStyle=ac;wx.lineWidth=3;wx.beginPath();
  for(i=0;i<=120;i++){x=x0+(x1-x0)*i/120;s=Math.sin(n*Math.PI*i/120);if(i===0)wx.moveTo(x,y0-s*70);else wx.lineTo(x,y0-s*70)}
  wx.stroke();
  wx.fillStyle=wall;wx.font='13px sans-serif';wx.textAlign='center';wx.fillText('L = '+L+' nm',(x0+x1)/2,y0+36);
  wx.textAlign='left';wx.fillStyle=ac;wx.fillText('ψ',x0+8,50);wx.fillStyle=ac2;wx.fillText('|ψ|²',x0+30,50);
}
wl.addEventListener('input',drawWell);wn.addEventListener('input',drawWell);
PRED.forEach(function(p,i){var b=el('button','cbtn',p);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){pred=i;Array.prototype.forEach.call($('pred').children,function(c,j){c.setAttribute('aria-pressed',String(j===i))})});$('pred').appendChild(b)});
$('verify').addEventListener('click',function(){
  if(pred<0){$('pres').textContent='Önce bir tahmin seç.';return}
  wl.value=2;wn.value=1;drawWell();$('pres').textContent='L = 2 nm iken E₁ = 94 meV...';
  setTimeout(function(){wl.value=1;drawWell();
    $('pres').textContent=(pred===2?'Doğru tahmin. ':'Tahminin tutmadı. ')+'E₁: 94 meV → 376 meV. E ∝ 1/L², yani L yarıya inince enerji 4 katına çıkar.'},reduce?0:800);
});
drawWell();

/* ---------- kanıt panosu ---------- */
var EV=[['Kara cisim ışıması','planck'],['Fotoelektrik olay','einstein'],['Ayrık atom çizgileri','bohr'],['Elektron kırınımı','broglie']];
var TH=[['Elektron seviyeler arasında atlar','bohr'],['Enerji paket paket gelir','planck'],['Madde de dalga gibi davranır','broglie'],['Işık foton taneciklerinden oluşur','einstein']];
var sel=null,okn=0;
function pair(host,list,isEv){
  list.forEach(function(p){
    var b=el('button','bt',p[0]);b.type='button';b.dataset.id=p[1];b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(){
      if(b.classList.contains('ok'))return;
      if(isEv){sel=p[1];Array.prototype.forEach.call($('bev').children,function(c){c.setAttribute('aria-pressed',String(c===b))});$('bmsg').textContent='Şimdi bu kanıtı açıklayan fikre dokun.';return}
      if(!sel){$('bmsg').textContent='Önce soldan bir kanıt seç.';return}
      if(sel===p[1]){
        b.classList.add('ok');
        Array.prototype.forEach.call($('bev').children,function(c){if(c.dataset.id===sel){c.classList.add('ok');c.setAttribute('aria-pressed','false')}});
        okn++;sel=null;$('bmsg').textContent=okn+' / 4 eşleşti.'+(okn===4?' Dosya kapandı.':'');
      }else{restart(b,'no');$('bmsg').textContent='Olmadı, başka fikri dene.'}
    });
    host.appendChild(b);
  });
}
pair($('bev'),EV,true);pair($('bth'),TH,false);

/* ---------- fabrika ---------- */
var STN=[['Kristal fırını','<rect x="8" y="14" width="28" height="22" rx="3"/><path d="M16 14V6h6v8M14 28h16"/>'],
 ['Kesim testeresi','<circle cx="22" cy="22" r="11"/><path d="M22 8v-4M22 40v-4M8 22H4M40 22h-4M12 12l-3-3M35 35l-3-3M32 12l3-3M12 32l-3 3"/>'],
 ['Işık-test odası','<circle cx="22" cy="20" r="8"/><path d="M22 6v3M22 31v3M8 20h3M33 20h3M12 10l2 2M32 28l2 2M32 12l-2 2M12 30l2-2M14 40h16"/>'],
 ['Atom mikroskobu','<ellipse cx="22" cy="22" rx="16" ry="6"/><ellipse cx="22" cy="22" rx="16" ry="6" transform="rotate(60 22 22)"/><ellipse cx="22" cy="22" rx="16" ry="6" transform="rotate(120 22 22)"/><circle cx="22" cy="22" r="2.5"/>'],
 ['Dalga odası','<path d="M4 22Q10 6 16 22T28 22T40 22"/><path d="M4 36h36"/>'],
 ['Tünel istasyonu','<path d="M6 36V20Q6 8 22 8T38 20V36M16 36V24Q16 18 22 18T28 24V36"/>'],
 ['Ölçüm lab.','<circle cx="22" cy="24" r="14"/><path d="M22 24L30 14M22 10v3"/>'],
 ['Kalibrasyon','<path d="M8 36V22M16 36V14M24 36V20M32 36V10M40 36V26"/>'],
 ['Bant testi','<rect x="10" y="10" width="24" height="24" rx="3"/><path d="M16 10V4M22 10V4M28 10V4M16 34v6M22 34v6M28 34v6M10 16H4M10 22H4M10 28H4M34 16h6M34 22h6M34 28h6"/>']];
function factory(built){
  var f=$('fact');f.innerHTML='';
  STN.forEach(function(s,i){
    var st=i<built?'built':(i===built?'now':'lock');
    var tile=el('div','tile '+st,'<svg viewBox="0 0 44 44" aria-hidden="true">'+s[1]+'</svg><b>'+s[0]+'</b><span>'+(st==='built'?'çalışıyor':st==='now'?'kuruluyor':'kilitli')+'</span>');
    f.appendChild(tile);
  });
  $('prod').textContent='Üretim: '+(built*6)+' wafer/saat';
}
factory(2);
})();
