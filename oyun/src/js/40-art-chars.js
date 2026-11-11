/* 40-art-chars.js (A5a) Karakter ve canavar SVG üreticisi.
 * Ekler: Q.art.registerChar, Q.art.monster, Q.art.cameo, Q.art.CHAR_IDS, Q.art.MONSTER_IDS.
 * Doldurur: Q.data.chars (10 canavar + planck, bloch).
 * Bağımlılık: 00-q.js. Tarayıcıda yedek SVG sınıf kuralları için bir kez <style id="art-chars-css"> ekler. */
(function(){
'use strict';
var Q = window.Q;

var BODY = '<path class="body" d="M40 350 Q44 262 112 248 L150 266 L188 248 Q256 262 260 350Z"/><path class="collar" d="M112 248 L136 290 L150 266Z"/><path class="collar" d="M188 248 L164 290 L150 266Z"/>';
var HAIR = {
  wild: '<path class="hair" d="M80 158 L52 112 L86 120 L72 74 L106 98 L110 54 L136 90 L150 44 L166 90 L192 56 L196 98 L228 76 L214 120 L248 114 L220 158Z"/><path class="hair" d="M92 170 L46 176 L90 196Z"/><path class="hair" d="M208 170 L254 176 L210 196Z"/>',
  slick: '<path class="hair" d="M90 150 Q88 92 150 88 Q212 92 210 150 Q196 116 150 114 Q104 116 90 150Z"/>',
  side: '<path class="hair" d="M88 154 Q84 90 152 84 Q216 88 212 152 Q204 108 170 104 Q124 100 88 154Z"/>',
  sideburn: '<path class="hair" d="M96 130 Q108 100 130 104 Q112 112 106 142Z"/><path class="hair" d="M204 130 Q192 100 170 104 Q188 112 194 142Z"/><path class="hair" d="M92 150 L86 208 L106 200 L106 150Z"/><path class="hair" d="M208 150 L214 208 L194 200 L194 150Z"/>',
  bald: '<path class="hair" d="M92 152 Q80 122 98 106 Q94 130 104 152Z"/><path class="hair" d="M208 152 Q220 122 202 106 Q206 130 196 152Z"/>',
  curly: '<circle class="hair" cx="98" cy="118" r="22"/><circle class="hair" cx="124" cy="98" r="24"/><circle class="hair" cx="152" cy="92" r="24"/><circle class="hair" cx="180" cy="98" r="24"/><circle class="hair" cx="204" cy="118" r="22"/><circle class="hair" cx="90" cy="146" r="16"/><circle class="hair" cx="210" cy="146" r="16"/>'
};
var MOUS = {
  bushy: '<path class="mous" d="M102 200 Q128 184 150 196 Q172 184 198 200 Q178 224 150 210 Q122 224 102 200Z"/>',
  thin: '<path class="accl" d="M108 206 Q130 194 150 202 Q170 194 192 206 Q200 208 202 198 M108 206 Q100 208 98 198"/>'
};
var MOUTH = '<g class="mouth-g"><path class="mouth" d="M120 226 Q150 262 180 226 Q150 236 120 226Z"/><path class="fang" d="M130 229 L137 247 L144 232Z"/><path class="fang" d="M170 229 L163 247 L156 232Z"/></g>' +
  '<path class="mouth mouth-open" d="M122 224 Q150 276 178 224 Q150 238 122 224Z"/>';
var SMILE = '<path class="accl smile" d="M124 228 Q150 252 176 228"/>';
var GLASS = '<circle class="glass" cx="126" cy="152" r="21"/><circle class="glass" cx="174" cy="152" r="21"/><path class="glass" d="M147 150 L153 150"/>';

function boxes(){
  var s = '';
  [0, 1, 2].forEach(function(i){
    var y = 250 + i * 34, x = 218;
    s += '<rect class="acc" x="' + x + '" y="' + (y - 16) + '" width="74" height="30" rx="6"/>' +
      '<path class="accl" d="M' + (x + 22) + ' ' + (y + 10) + ' L' + (x + 22) + ' ' + (y - 10) + ' M' + (x + 15) + ' ' + (y - 3) + ' L' + (x + 22) + ' ' + (y - 11) + ' L' + (x + 29) + ' ' + (y - 3) + '"/>' +
      '<path class="accl" d="M' + (x + 52) + ' ' + (y - 10) + ' L' + (x + 52) + ' ' + (y + 10) + ' M' + (x + 45) + ' ' + (y + 3) + ' L' + (x + 52) + ' ' + (y + 11) + ' L' + (x + 59) + ' ' + (y + 3) + '"/>';
  });
  return s + '<circle class="ban" cx="255" cy="284" r="46"/><path class="ban" d="M222 252 L288 316"/>';
}

var ACC = {
  cube: '<path class="accl" d="M150 36 L244 92 L244 208 L150 264 L56 208 L56 92Z M150 150 L56 92 M150 150 L244 92 M150 150 L150 264"/>',
  orbits: '<ellipse class="accl" cx="150" cy="172" rx="150" ry="46" transform="rotate(-28 150 172)"/><ellipse class="accl" cx="150" cy="172" rx="150" ry="46" transform="rotate(28 150 172)"/><circle class="acc" cx="300" cy="172" r="10" transform="rotate(-28 150 172)"/><circle class="acc" cx="0" cy="172" r="10" transform="rotate(28 150 172)"/>',
  wave: '<path class="accl" d="M-30 300 Q0 250 30 300 T90 300 T150 300 T210 300 T270 300 T330 300"/><path class="accl" d="M-30 56 Q0 16 30 56 T90 56 T150 56 T210 56 T270 56 T330 56"/>',
  ghost: '<ellipse class="ghost" cx="178" cy="172" rx="60" ry="70"/><ellipse class="ghost" cx="122" cy="172" rx="60" ry="70"/>',
  bolts: '<path class="accl" d="M16 120 l24 -18 l-8 26 l24 -16"/><path class="accl" d="M284 120 l-24 -18 l8 26 l-24 -16"/>',
  crystals: '<path class="acc" d="M100 108 L90 44 L126 90Z"/><path class="acc" d="M200 108 L210 44 L174 90Z"/><path class="accl" d="M138 104 L146 130 L136 152"/>',
  ears: '<path class="acc" d="M98 118 L102 60 L142 98Z"/><path class="acc" d="M202 118 L198 60 L158 98Z"/><path class="accl" d="M100 190 L52 182 M100 200 L50 206 M200 190 L248 182 M200 200 L250 206"/>',
  sigmoid: '<path class="accl sigd" d="M150 24 L150 330 M-20 172 L320 172"/>' +
    '<path class="accl sig" d="M-20 262 L40 262 Q100 262 120 214 Q140 172 150 172 Q160 172 180 130 Q200 82 260 82 L320 82"/>' +
    '<circle class="acc" cx="150" cy="172" r="9"/>',
  dice: '<g transform="rotate(-12 62 262)"><rect class="acc" x="22" y="224" width="80" height="80" rx="14"/>' +
    '<circle class="pip" cx="46" cy="248" r="7"/><circle class="pip" cx="62" cy="264" r="7"/><circle class="pip" cx="78" cy="280" r="7"/></g>' +
    '<g transform="rotate(14 238 262)"><rect class="acc" x="198" y="224" width="80" height="80" rx="14"/>' +
    '<circle class="pip" cx="222" cy="248" r="7"/><circle class="pip" cx="254" cy="248" r="7"/><circle class="pip" cx="238" cy="264" r="7"/><circle class="pip" cx="222" cy="280" r="7"/><circle class="pip" cx="254" cy="280" r="7"/></g>',
  boxes: boxes()
};

function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function txt(s){ return '<text class="label" x="150" y="324">' + esc(s) + '</text>'; }

function eyes(n, closed){
  var s = '<circle class="eye" cx="126" cy="152" r="16"/><circle class="pupil" cx="130" cy="154" r="6"/>';
  if (closed) s += '<path class="brow" d="M160 144 L188 164 M188 144 L160 164"/>';
  else s += '<circle class="eye" cx="174" cy="152" r="16"/><circle class="pupil" cx="170" cy="154" r="6"/>';
  if (n === 3) s += '<circle class="eye" cx="150" cy="122" r="9"/><circle class="pupil" cx="150" cy="123" r="4"/>';
  s += '<g class="xeye"><path d="M114 140 L138 164 M138 140 L114 164 M162 140 L186 164 M186 140 L162 164"/></g>';
  return s;
}

var CHARS = {};
function registerChar(id, spec){
  if (!id || !spec) return null;
  var c = {};
  for (var k in spec) if (Object.prototype.hasOwnProperty.call(spec, k)) c[k] = spec[k];
  c.id = id;
  if (!c.hair || !HAIR[c.hair]) c.hair = 'slick';
  CHARS[id] = c;
  Q.data.chars[id] = c;
  return c;
}

var DEFS = [
  { id: 'czoch', kisi: 'Jan Czochralski', yil: 1916, canavar: 'Grain Boundary (Tane Sınırı) Canavarı', konu: 'Tek kristal büyütme (CZ)', soru: 'Neden tek kristal istiyorsunuz?', zayif: 'Zayıf noktası: tane sınırı yok, taşıyıcılar saçılmaz.', hair: 'bald', eyes: 2, glasses: true, front: 'crystals' },
  { id: 'miller', kisi: 'William H. Miller', yil: 1839, canavar: 'Plane (Düzlem) Canavarı', konu: 'Miller indisleri', soru: 'Kesişimlerim 2, ∞, ∞. Hangi düzlemdeyim?', zayif: 'Zayıf noktası: kesişimin tersini al, kesirleri temizle: (100).', hair: 'sideburn', eyes: 2, back: 'cube', chest: '(hkl)' },
  { id: 'einstein', kisi: 'Albert Einstein', yil: 1905, canavar: 'Photon (Foton) Canavarı', konu: 'Fotoelektrik olay', soru: 'Eşiğin altındaki ışığı 10 kat parlattın. Kaç elektron kopar?', zayif: 'Zayıf noktası: tek foton yetmez, şiddet foton sayısını artırır.', hair: 'wild', eyes: 3, mous: 'bushy', rays: true, front: 'bolts' },
  { id: 'bohr', kisi: 'Niels Bohr', yil: 1913, canavar: 'Orbit (Yörünge) Canavarı', konu: 'Atom spektrumu', soru: 'Elektron neden çekirdeğe düşmüyor?', zayif: 'Zayıf noktası: seviyeler ayrık, en alt seviyenin altı yok.', hair: 'slick', eyes: 2, back: 'orbits' },
  { id: 'broglie', kisi: 'Louis de Broglie', yil: 1924, canavar: 'Wave (Dalga) Canavarı', konu: 'Madde dalgası', soru: 'Bilardo topu neden dalga gibi davranmıyor?', zayif: 'Zayıf noktası: λ = h/p, topta λ çok küçük.', hair: 'slick', eyes: 2, mous: 'thin', back: 'wave' },
  { id: 'schro', kisi: 'Erwin Schrödinger', yil: 1926, canavar: 'Kuantum Kedisi', konu: 'Schrödinger denklemi', soru: 'Denklem ψ\'yi çökertir mi?', zayif: 'Zayıf noktası: denklem düzgün evriltir, çökme ölçümle olur.', hair: 'side', eyes: 2, glasses: true, closed: true, front: 'ears', chest: 'ψ' },
  { id: 'born', kisi: 'Max Born', yil: 1926, canavar: 'Probability (Olasılık) Canavarı', konu: 'Ölçüm ve olasılık yorumu', soru: '|ψ|² neyi verir?', zayif: 'Zayıf noktası: |ψ|² bulunma olasılık yoğunluğudur.', hair: 'side', eyes: 2, glasses: true, front: 'dice', chest: '|ψ|²' },
  { id: 'heis', kisi: 'Werner Heisenberg', yil: 1927, canavar: 'Uncertainty (Belirsizlik) Canavarı', konu: 'Belirsizlik ilkesi', soru: 'Konumu keskinleştirirsem momentum ne olur?', zayif: 'Zayıf noktası: yayılır. Alet kusuru değil, dalga doğası.', hair: 'curly', eyes: 2, back: 'ghost', chest: 'ΔxΔp' },
  { id: 'pauli', kisi: 'Wolfgang Pauli', yil: 1925, canavar: 'Exclusion (Dışlama) Canavarı', konu: 'Pauli dışlama ilkesi', soru: 'İki elektron aynı kuantum halinde olabilir mi?', zayif: 'Zayıf noktası: aynı dört kuantum sayısı iki elektronda olamaz.', hair: 'slick', eyes: 2, front: 'boxes', chest: 'n,l,m,s' },
  { id: 'fermi', kisi: 'Enrico Fermi', yil: 1926, canavar: 'Fermi Canavarı', konu: 'Fermi-Dirac dağılımı', soru: 'Mutlak sıfırda dolu seviyeler nerede biter?', zayif: 'Zayıf noktası: Fermi seviyesinde, basamak gibi.', hair: 'slick', eyes: 2, mous: 'thin', back: 'sigmoid', chest: 'f(E)' },
  { id: 'planck', kisi: 'Max Planck', yil: 1900, canavar: null, konu: 'Kuantum fikri', soru: 'Enerji paket paket verilir.', zayif: null, hair: 'bald', eyes: 2, mous: 'bushy', glasses: true, chest: 'E=hf', cameo: true },
  { id: 'bloch', kisi: 'Felix Bloch', yil: 1928, canavar: null, konu: 'Periyodik yapıda dalga', soru: 'Kristalde dalga periyodik zarf taşır.', zayif: null, hair: 'curly', eyes: 2, back: 'wave', chest: 'ψk', cameo: true }
];
DEFS.forEach(function(d){ registerChar(d.id, d); });

var MONSTER_IDS = DEFS.filter(function(d){ return !d.cameo; }).map(function(d){ return d.id; });
var CAMEO_IDS = DEFS.filter(function(d){ return d.cameo; }).map(function(d){ return d.id; });

var CSS = [
  '.mon *{stroke-linejoin:round;stroke-linecap:round}',
  '.mon .aura{fill:var(--m-aura,rgba(0,229,255,.1));stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lw2,3);stroke-dasharray:var(--m-dash,5 7)}',
  '.mon .ray{fill:var(--m-ray,#ffd23f);stroke:var(--m-rayl,#0b0620);stroke-width:var(--m-lw,5)}',
  '.mon .body{fill:var(--m-body,#3a5bff);stroke:var(--m-line,#0b0620);stroke-width:var(--m-lw,5)}',
  '.mon .collar{fill:var(--m-collar,#fff);stroke:var(--m-line,#0b0620);stroke-width:var(--m-lw,5)}',
  '.mon .hair{fill:var(--m-hair,#f4f4f4);stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lw,5)}',
  '.mon .face{fill:var(--m-skin,#ffc99b);stroke:var(--m-line,#0b0620);stroke-width:var(--m-lw,5)}',
  '.mon .eye{fill:var(--m-eye,#fff);stroke:var(--m-line,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .pupil{fill:var(--m-pupil,#0b0620);stroke:none}',
  '.mon .brow{fill:none;stroke:var(--m-line2,#0b0620);stroke-width:7}',
  '.mon .nose{fill:none;stroke:var(--m-line,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .mous{fill:var(--m-mous,#9aa0ad);stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .mouth{fill:var(--m-mouth,#b3122a);stroke:var(--m-line,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .fang{fill:#fff;stroke:none}',
  '.mon .acc{fill:var(--m-acc,#00e5ff);stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .accl{fill:none;stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lws,3.5)}',
  '.mon .ghost{fill:none;stroke:var(--m-line2,#0b0620);stroke-width:var(--m-lws,3.5);stroke-dasharray:6 6;opacity:.75}',
  '.mon .glass{fill:none;stroke:var(--m-line,#0b0620);stroke-width:4}',
  '.mon .label{fill:var(--m-label,#fff);stroke:var(--m-line,#0b0620);stroke-width:6px;paint-order:stroke fill;font-family:var(--font-d,Impact,"Arial Black",sans-serif);font-size:32px;font-weight:700;text-anchor:middle;letter-spacing:0;text-transform:none}',
  '.mon .pip{fill:var(--m-pupil,#0b0620);stroke:none}',
  '.mon .ban{fill:none;stroke:var(--red,#ff4d6d);stroke-width:9}',
  '.mon .sig{stroke:var(--m-acc,#00e5ff);stroke-width:7}',
  '.mon .sigd{stroke-dasharray:6 8;opacity:.6}',
  '.mon .smile{stroke-width:6}',
  '.mon .xeye,.mon .mouth-open{display:none}',
  '.mon .xeye path{fill:none;stroke:var(--m-line,#0b0620);stroke-width:8}',
  '.mon.konus .mouth-g{display:none}.mon.konus .mouth-open{display:inline}',
  '.mon.vuruldu .pupil,.mon.vuruldu .eye{display:none}.mon.vuruldu .xeye{display:inline}',
  '.mon.vuruldu{animation:artMonShake .45s linear}',
  '.mon.guldu .brow{transform:translateY(-9px)}.mon.guldu .mouth-g{display:none}.mon.guldu .mouth-open{display:inline}',
  '@keyframes artMonShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(5px)}}',
  '@media (prefers-reduced-motion:reduce){.mon.vuruldu{animation:none}}'
].join('\n');

var cssDone = false;
function ensureCss(){
  if (cssDone) return;
  cssDone = true;
  try {
    if (typeof document === 'undefined' || !document.head) return;
    if (document.getElementById('art-chars-css')) return;
    var st = document.createElement('style');
    st.id = 'art-chars-css';
    st.textContent = CSS;
    document.head.insertBefore(st, document.head.firstChild);
  } catch (e) { /* sessiz */ }
}

function build(id, opts, cameo){
  var k = CHARS[id];
  if (!k) return '';
  opts = opts || {};
  ensureCss();
  var cls = opts.cls || 'mon';
  if (cls.split(/\s+/).indexOf('mon') < 0) cls = 'mon ' + cls;
  if (opts.durum && /^(idle|konus|vuruldu|guldu)$/.test(opts.durum)) cls += ' ' + opts.durum;
  var label = cameo ? (k.kisi + ' portresi') : (k.canavar + ': ' + k.kisi + ' karikatürü');
  var style = opts.renk ? ' style="--m-body:' + esc(opts.renk) + '"' : '';
  var s = '<svg class="' + esc(cls) + '" viewBox="-30 -10 360 360" role="img" aria-label="' + esc(label) + '"' + style + '>';
  if (!cameo) {
    s += '<circle class="aura" cx="150" cy="175" r="165"/>';
    if (k.rays) for (var a = 0; a < 360; a += 45) s += '<path class="ray" d="M150 4 L160 40 L140 40Z" transform="rotate(' + a + ' 150 175)"/>';
  }
  s += (k.back ? ACC[k.back] || '' : '') + BODY + (k.chest ? txt(k.chest) : '') + HAIR[k.hair];
  s += '<ellipse class="face" cx="150" cy="172" rx="60" ry="70"/>';
  s += eyes(k.eyes || 2, k.closed && !cameo);
  s += '<path class="brow" d="M104 130 L140 142"/><path class="brow" d="M196 130 L160 142"/><path class="nose" d="M150 164 Q140 184 152 188"/>';
  s += (cameo ? SMILE : MOUTH) + (k.mous ? MOUS[k.mous] : '') + (k.glasses ? GLASS : '');
  if (!cameo && k.front) s += ACC[k.front] || '';
  return s + '</svg>';
}

Q.art.registerChar = registerChar;
Q.art.monster = function(id, opts){ return build(id, opts, false); };
Q.art.cameo = function(id, opts){ return build(id, opts, true); };
Q.art.MONSTER_IDS = MONSTER_IDS;
Q.art.CAMEO_IDS = CAMEO_IDS;
Q.art.CHAR_IDS = MONSTER_IDS.concat(CAMEO_IDS);
})();
