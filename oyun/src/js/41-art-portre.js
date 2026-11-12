/* 41-art-portre.js — Bilim insanı portreleri (kart koleksiyonu, Tekrar Merkezi, detay paneli).
 * Ekler: Q.art.portre(id, opts) -> SVG metni (viewBox 0 0 200 200, kare, kendi renkleri satır içi), Q.art.PORTRE_IDS.
 * Her kişi: yüz şekli, saç, kaş, bıyık/sakal, gözlük, giysi, renk paleti ve arka plan rengi ile ayırt edilir.
 * Tanımsız id -> id'den türetilmiş renkli varsayılan silüet (asla boş dönmez). Saygılı, stilize karikatür; bağımlılık yok. */
(function(){
'use strict';
var Q = window.Q; Q.art = Q.art || {};
var INK = '#0b0620', SW = 3;

/* ---------- veri tablosu (id -> özellikler) ---------- */
var P = {
  einstein: { n: 'Albert Einstein', bg: '#3a5bff', bg2: '#00e5ff', skin: '#f2c6a0', hair: '#f3f3f3', hs: 'cloud', fw: 46, fh: 54, brow: 'bushy', browc: '#e8e8e8', mou: 'thick', mouc: '#6b6b72', eyes: 'sad', age: 2, cloth: '#8a8fa3', cl: 'sweater' },
  bohr: { n: 'Niels Bohr', bg: '#14b8a6', bg2: '#0b6e66', skin: '#f0bf98', hair: '#9b8f84', hs: 'thin', hl: .2, fw: 52, fh: 56, jaw: .8, brow: 'heavy', mou: 'none', eyes: 'heavy', age: 1, cloth: '#1f2a52', cl: 'suit', tie: '#b3122a', motif: 'n=2' },
  planck: { n: 'Max Planck', bg: '#5b2bd6', bg2: '#2a1170', skin: '#ecbd96', hair: '#c9c9cf', hs: 'bald', fw: 44, fh: 60, brow: 'bushy', browc: '#b5b5bb', mou: 'thick', mouc: '#b0b0b6', gl: 'pince', eyes: 'normal', age: 3, cloth: '#15131f', cl: 'high', motif: 'h' },
  schro: { n: 'Erwin Schrödinger', bg: '#ff8a1f', bg2: '#b34a00', skin: '#f2c6a0', hair: '#5a4a40', hs: 'curlside', fw: 42, fh: 56, jaw: .6, brow: 'thin', mou: 'none', gl: 'round', eyes: 'normal', age: 1, cloth: '#3d4a3a', cl: 'suit', tie: '#e8d9a8', bow: true, motif: 'ψ' },
  broglie: { n: 'Louis de Broglie', bg: '#00b8d9', bg2: '#006f86', skin: '#f2cba6', hair: '#2a1d1a', hs: 'neat', hl: .3, fw: 40, fh: 56, jaw: .55, brow: 'thin', mou: 'curl', mouc: '#2a1d1a', eyes: 'normal', age: 0, cloth: '#2c2f45', cl: 'suit', tie: '#7a1731', motif: 'λ' },
  born: { n: 'Max Born', bg: '#d6249f', bg2: '#7a0f5b', skin: '#f0c4a0', hair: '#e1e1e6', hs: 'side', hl: .34, fw: 44, fh: 56, jaw: .6, brow: 'bushy', browc: '#cfcfd6', mou: 'none', eyes: 'normal', age: 2, cloth: '#7b5a3c', cl: 'sweater', motif: '|ψ|²' },
  heis: { n: 'Werner Heisenberg', bg: '#ffd23f', bg2: '#e08a00', skin: '#f6cfae', hair: '#a8793a', hs: 'swept', hl: .36, fw: 43, fh: 54, jaw: .7, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#3e8a4f', cl: 'sweater', motif: 'Δx' },
  pauli: { n: 'Wolfgang Pauli', bg: '#7ed957', bg2: '#2d7a1d', skin: '#f0bd99', hair: '#6b5a4c', hs: 'thin', hl: .24, fw: 52, fh: 52, jaw: .95, brow: 'heavy', mou: 'none', eyes: 'heavy', age: 1, dchin: true, cloth: '#5d6068', cl: 'suit', tie: '#2a2a2a', motif: '↑↓' },
  fermi: { n: 'Enrico Fermi', bg: '#ff4d6d', bg2: '#a3162f', skin: '#eec19b', hair: '#1c1612', hs: 'flat', hl: .3, fw: 48, fh: 50, jaw: .9, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#f4f4f4', cl: 'shirt', tie: '#1f3a8a', motif: 'EF' },
  dirac: { n: 'Paul Dirac', bg: '#6b7a99', bg2: '#2f3a55', skin: '#f2cdb0', hair: '#1a1620', hs: 'center', hl: .3, fw: 36, fh: 60, jaw: .5, brow: 'thin', mou: 'pencil', mouc: '#1a1620', mouth: 'flat', eyes: 'normal', age: 0, cloth: '#1b1b26', cl: 'suit', tie: '#6b7a99', motif: '|⟩' },
  czoch: { n: 'Jan Czochralski', bg: '#9aa83a', bg2: '#586315', skin: '#e9b78f', hair: '#6a5a46', hs: 'neat', hl: .34, fw: 44, fh: 54, brow: 'strong', mou: 'thick', mouc: '#5a4a38', eyes: 'normal', age: 1, hat: 'straw', cloth: '#7a4a24', cl: 'apron', motif: 'Si' },
  miller: { n: 'William H. Miller', bg: '#8d5a2b', bg2: '#4b2a0f', skin: '#f2cfae', hair: '#ececec', hs: 'bald', fw: 44, fh: 58, brow: 'bushy', browc: '#d8d8d8', mou: 'none', beard: 'mutton', beardc: '#ececec', gl: 'small', eyes: 'normal', age: 3, cloth: '#1d1b22', cl: 'high', motif: '(hkl)' },
  bragg: { n: 'W. H. Bragg', bg: '#2e8bc0', bg2: '#16506f', skin: '#f0c4a0', hair: '#d9d9df', hs: 'side', hl: .3, fw: 43, fh: 56, jaw: .65, brow: 'bushy', browc: '#cfcfd6', mou: 'thick', mouc: '#d0d0d6', eyes: 'normal', age: 2, cloth: '#7a6a4c', cl: 'suit', tie: '#2c4a2c', motif: 'nλ' },
  braggl: { n: 'W. L. Bragg', bg: '#7fd1b9', bg2: '#2f7f68', skin: '#f6d0b0', hair: '#7a5a3a', hs: 'swept', hl: .32, fw: 41, fh: 52, jaw: .7, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#365a7a', cl: 'suit', tie: '#e8c86a', motif: '2d sinθ' },
  rutherford: { n: 'Ernest Rutherford', bg: '#a3202a', bg2: '#5a0f16', skin: '#e9a98a', hair: '#b9b9b9', hs: 'thin', hl: .26, fw: 56, fh: 56, jaw: .95, brow: 'heavy', browc: '#b9b9b9', mou: 'walrus', mouc: '#c8c8c8', eyes: 'heavy', age: 2, cloth: '#6b5a3a', cl: 'suit', tie: '#3a2a1a', motif: 'α' },
  hertz: { n: 'Heinrich Hertz', bg: '#3b7a57', bg2: '#173d2a', skin: '#f0c4a0', hair: '#2a2018', hs: 'neat', hl: .28, fw: 41, fh: 55, jaw: .6, brow: 'strong', mou: 'chevron', mouc: '#2a2018', eyes: 'normal', age: 0, cloth: '#2a2a35', cl: 'high', motif: 'Hz' },
  bravais: { n: 'Auguste Bravais', bg: '#b08d3a', bg2: '#5e4710', skin: '#f0cdad', hair: '#e6e6e6', hs: 'bald', fw: 45, fh: 57, brow: 'bushy', browc: '#e6e6e6', mou: 'none', beard: 'full', beardc: '#e6e6e6', eyes: 'normal', age: 3, cloth: '#24222c', cl: 'high', motif: '14' },
  gamow: { n: 'George Gamow', bg: '#00c2a8', bg2: '#ff9f1c', skin: '#f4c9a4', hair: '#c9a14a', hs: 'wavy', hl: .3, fw: 49, fh: 52, jaw: .9, brow: 'strong', mou: 'none', mouth: 'grin', eyes: 'bright', age: 0, cloth: '#b8412e', cl: 'shirt', tie: '#1f3a8a', motif: 'α→' },
  neumann: { n: 'John von Neumann', bg: '#4a3aa8', bg2: '#251a6b', skin: '#f2c8a2', hair: '#2b1d14', hs: 'back', hl: .3, fw: 49, fh: 52, jaw: .9, brow: 'thin', mou: 'none', eyes: 'normal', age: 1, cloth: '#252a3a', cl: 'vest', tie: '#a3202a', motif: '∑' },
  kennard: { n: 'Earle H. Kennard', bg: '#8e9eab', bg2: '#4b5963', skin: '#f2cdae', hair: '#8a6a44', hs: 'side', hl: .32, fw: 42, fh: 54, jaw: .7, brow: 'thin', mou: 'none', gl: 'round', eyes: 'normal', age: 0, cloth: '#4a5a6a', cl: 'suit', tie: '#d96a2a', bow: true, motif: 'σ' },
  kronig: { n: 'Ralph Kronig', bg: '#e5586d', bg2: '#7a1d30', skin: '#f2c8a2', hair: '#3a2a20', hs: 'wavy', hl: .3, fw: 42, fh: 56, jaw: .65, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#6a3a5a', cl: 'sweater', motif: 'V(x)' },
  penney: { n: 'William G. Penney', bg: '#7a8cff', bg2: '#2c3aa8', skin: '#f4cfb0', hair: '#c8b27a', hs: 'crew', fw: 44, fh: 53, jaw: .8, brow: 'thin', mou: 'none', gl: 'thick', eyes: 'normal', age: 1, cloth: '#2d2d3a', cl: 'suit', tie: '#e5586d', motif: 'V0' },
  shockley: { n: 'William Shockley', bg: '#ff6a00', bg2: '#8a2d00', skin: '#f0bf9a', hair: '#1e1a18', hs: 'receding', hl: .16, fw: 49, fh: 54, jaw: 1, brow: 'heavy', mou: 'none', mouth: 'flat', eyes: 'heavy', age: 1, cloth: '#f2f2f2', cl: 'lab', tie: '#1f3a8a', motif: 'pn' },
  davisson: { n: 'Clinton Davisson', bg: '#3e6ea8', bg2: '#1c3b66', skin: '#f2c8a4', hair: '#8a8a8a', hs: 'receding', hl: .2, fw: 43, fh: 56, jaw: .7, brow: 'thin', mou: 'none', gl: 'round', eyes: 'normal', age: 2, cloth: '#e4e4ea', cl: 'lab', tie: '#444', motif: 'Ni' },
  germer: { n: 'Lester Germer', bg: '#a0d911', bg2: '#4d6b00', skin: '#f4cdac', hair: '#5a3a22', hs: 'crew', fw: 44, fh: 52, jaw: .85, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#e4e4ea', cl: 'lab', tie: '#2a6a3a', motif: 'e⁻' },
  bloch: { n: 'Felix Bloch', bg: '#9b5de5', bg2: '#4a1f8a', skin: '#f0c6a2', hair: '#3a2a22', hs: 'curly', fw: 44, fh: 52, jaw: .8, brow: 'strong', mou: 'none', eyes: 'bright', age: 0, cloth: '#5a4a8a', cl: 'sweater', motif: 'ψk' }
};
var ALIAS = { heisenberg: 'heis', schrodinger: 'schro', 'schrödinger': 'schro', debroglie: 'broglie', de_broglie: 'broglie', vonneumann: 'neumann', von_neumann: 'neumann', neuman: 'neumann',
  bragg_h: 'bragg', braggh: 'bragg', bragg_l: 'braggl', bragg2: 'braggl', braggs: 'bragg', kp: 'kronig', kronigpenney: 'kronig', kronig_penney: 'kronig', penney2: 'penney',
  davisson_germer: 'davisson', czochralski: 'czoch', ruther: 'rutherford', rutherf: 'rutherford', shock: 'shockley' };

/* ---------- yardımcılar ---------- */
function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function f(n){ return Math.round(n * 10) / 10; }
function shade(hex, a){ /* a: -1..1 */
  var m = /^#([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function c(v){ return Math.max(0, Math.min(255, Math.round(a < 0 ? v * (1 + a) : v + (255 - v) * a))); }
  return '#' + [c(r), c(g), c(b)].map(function(v){ return (v < 16 ? '0' : '') + v.toString(16); }).join('');
}
function path(d, fill, extra){ return '<path d="' + d + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + SW + '" stroke-linejoin="round" stroke-linecap="round"' + (extra || '') + '/>'; }
function line(d, w, col){ return '<path d="' + d + '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
function circ(x, y, r, fill, nostroke){ return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + fill + '"' + (nostroke ? '' : ' stroke="' + INK + '" stroke-width="' + SW + '"') + '/>'; }
function hash(s){ var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } h ^= h >>> 15; h = Math.imul(h, 2246822507) >>> 0; h ^= h >>> 13; return h >>> 0; }

/* ---------- saç ---------- */
function cap(c, h, o){
  var cx = c.cx, cy = c.cy, fw = c.fw, fh = c.fh;
  var x0 = cx - fw - 3, x1 = cx + fw + 3, yb = cy + 6, top = o.top == null ? 9 : o.top;
  var ctrl = yb + (cy - fh - top - yb) / .75;
  var hy = cy - fh + fh * (o.hl || .3), yt = o.yt != null ? o.yt : cy - fh * .3;
  var d = 'M' + x0 + ' ' + yb + ' C' + (x0 - 8) + ' ' + f(ctrl) + ' ' + (x1 + 8) + ' ' + f(ctrl) + ' ' + x1 + ' ' + yb +
    ' L' + (x1 - 5) + ' ' + f(yt) + ' Q' + cx + ' ' + f(2 * hy - yt) + ' ' + (x0 + 5) + ' ' + f(yt) + ' Z';
  var s = path(d, h);
  if (o.part != null) s += line('M' + (cx + o.part) + ' ' + f(hy - 1) + ' Q' + (cx + o.part - 3) + ' ' + f(hy - fh * .3) + ' ' + (cx + o.part + 8) + ' ' + f(cy - fh - top + 4), 2, INK);
  if (o.sweep) s += line('M' + (cx - fw + 6) + ' ' + f(hy + 2) + ' Q' + cx + ' ' + f(hy - fh * .45) + ' ' + (cx + fw - 4) + ' ' + f(hy - fh * .12), 2, INK);
  if (o.strands) for (var i = -2; i <= 2; i++) s += line('M' + (cx + i * 14) + ' ' + f(hy - 2) + ' Q' + (cx + i * 14 + 4) + ' ' + f(hy - fh * .35) + ' ' + (cx + i * 12) + ' ' + f(cy - fh - top + 6), 1.6, shade(h, -.45));
  return s;
}
function hairParts(c, s){
  var cx = c.cx, cy = c.cy, fw = c.fw, fh = c.fh, h = s.hair, back = '', front = '', i, a;
  switch (s.hs) {
    case 'cloud': /* Einstein: dağınık, havada duran beyaz saç */
      var pts = [[-fw - 14, -6, 17], [-fw - 18, -30, 17], [-fw - 6, -52, 18], [-fw * .55, -fh - 6, 18], [-8, -fh - 10, 18], [fw * .5, -fh - 7, 18], [fw + 8, -fh * .9, 18], [fw + 18, -26, 17], [fw + 14, -4, 15], [-fw - 8, 14, 13], [fw + 8, 14, 13]];
      pts.forEach(function(p){ back += circ(cx + p[0], cy + p[1], p[2], h); });
      back += line('M' + (cx - fw - 20) + ' ' + (cy - 44) + ' l-10 -8 M' + (cx + fw + 20) + ' ' + (cy - 40) + ' l11 -9 M' + (cx - 6) + ' ' + (cy - fh - 26) + ' l-2 -5 M' + (cx + 24) + ' ' + (cy - fh - 20) + ' l8 -8', 3, INK);
      front = path('M' + (cx - fw + 2) + ' ' + (cy - fh * .5) + ' Q' + (cx - fw * .5) + ' ' + (cy - fh - 6) + ' ' + cx + ' ' + (cy - fh - 4) + ' Q' + (cx + fw * .6) + ' ' + (cy - fh - 6) + ' ' + (cx + fw - 2) + ' ' + (cy - fh * .55) +
        ' Q' + (cx + fw * .45) + ' ' + (cy - fh * .66) + ' ' + (cx + fw * .22) + ' ' + (cy - fh * .5) + ' Q' + (cx - 2) + ' ' + (cy - fh * .72) + ' ' + (cx - fw * .3) + ' ' + (cy - fh * .5) + ' Q' + (cx - fw * .6) + ' ' + (cy - fh * .66) + ' ' + (cx - fw + 2) + ' ' + (cy - fh * .5) + 'Z', h);
      break;
    case 'bald': /* kel alın: yalnız yan ve arka saç */
      [-1, 1].forEach(function(sg){
        var xe = cx + sg * (fw + 3);
        front += path('M' + xe + ' ' + (cy + 10) + ' Q' + (xe + sg * 6) + ' ' + (cy - fh * .3) + ' ' + (xe - sg * 6) + ' ' + (cy - fh * .5) + ' Q' + (xe - sg * 8) + ' ' + (cy - fh * .1) + ' ' + (xe - sg * 8) + ' ' + (cy + 10) + 'Z', h);
      });
      front += '<ellipse cx="' + (cx - 10) + '" cy="' + (cy - fh * .72) + '" rx="12" ry="5" fill="#fff" opacity=".4" transform="rotate(-18 ' + (cx - 10) + ' ' + (cy - fh * .72) + ')"/>';
      break;
    case 'thin': front = cap(c, h, { hl: s.hl || .22, top: 4, yt: cy - fh * .5, part: -12 }); break;
    case 'receding': front = cap(c, h, { hl: s.hl || .18, top: 6, yt: cy - fh * .55, part: 10 }); front += path('M' + (cx - 14) + ' ' + (cy - fh + 6) + ' Q' + cx + ' ' + (cy - fh - 2) + ' ' + (cx + 16) + ' ' + (cy - fh + 7), h); break;
    case 'curlside': /* Schrödinger: geriye taralı, yanlarda kıvrık */
      front = cap(c, h, { hl: .3, top: 6, yt: cy - fh * .3, sweep: true });
      [-1, 1].forEach(function(sg){ back += circ(cx + sg * (fw + 4), cy - 6, 12, h) + circ(cx + sg * (fw + 8), cy + 12, 10, h) + circ(cx + sg * (fw - 4), cy - fh * .55, 11, h); });
      break;
    case 'swept': front = cap(c, h, { hl: s.hl || .35, top: 12, yt: cy - fh * .28, sweep: true }); break;
    case 'neat': front = cap(c, h, { hl: s.hl || .3, top: 7, yt: cy - fh * .3, part: -fw * .35 }); break;
    case 'side': front = cap(c, h, { hl: s.hl || .3, top: 8, yt: cy - fh * .35, part: fw * .4, strands: true }); break;
    case 'center': front = cap(c, h, { hl: s.hl || .3, top: 7, yt: cy - fh * .25, part: 0 }); break;
    case 'flat': front = cap(c, h, { hl: s.hl || .3, top: 6, yt: cy - fh * .3 }); break;
    case 'back': front = cap(c, h, { hl: s.hl || .3, top: 12, yt: cy - fh * .35, strands: true }); break;
    case 'crew': front = cap(c, h, { hl: .24, top: 3, yt: cy - fh * .55 }); break;
    case 'wavy':
      front = cap(c, h, { hl: s.hl || .3, top: 14, yt: cy - fh * .25, strands: true });
      for (i = -3; i <= 3; i++) back += circ(cx + i * (fw / 3), cy - fh - 4 + Math.abs(i) * 5, 11, h);
      break;
    case 'curly':
      for (i = 0; i < 9; i++) { a = Math.PI + i * Math.PI / 8; back += circ(cx + Math.cos(a) * (fw + 6), cy - 4 + Math.sin(a) * (fh + 4), 13, h); }
      front = '';
      for (i = -2; i <= 2; i++) front += circ(cx + i * 15, cy - fh + 6 + Math.abs(i) * 2, 11, h);
      break;
    default: front = cap(c, h, { hl: .3 });
  }
  return { back: back, front: front };
}

/* ---------- yüz parçaları ---------- */
function facePath(c, jaw){
  var cx = c.cx, cy = c.cy, fw = c.fw, fh = c.fh, jw = fw * (jaw || .7);
  return 'M' + (cx - fw) + ' ' + cy + ' A' + fw + ' ' + f(fh * .92) + ' 0 0 1 ' + (cx + fw) + ' ' + cy + ' C' + (cx + fw) + ' ' + f(cy + fh * .62) + ' ' + f(cx + jw) + ' ' + (cy + fh) + ' ' + cx + ' ' + (cy + fh) +
    ' C' + f(cx - jw) + ' ' + (cy + fh) + ' ' + (cx - fw) + ' ' + f(cy + fh * .62) + ' ' + (cx - fw) + ' ' + cy + 'Z';
}
function mousFn(c, type, col){
  var cx = c.cx, y = c.cy + c.fh * .42, s = '';
  switch (type) {
    case 'thick': return path('M' + cx + ' ' + (y - 5) + ' C' + (cx - 12) + ' ' + (y - 9) + ' ' + (cx - 30) + ' ' + (y - 4) + ' ' + (cx - 34) + ' ' + (y + 9) + ' C' + (cx - 20) + ' ' + (y + 11) + ' ' + (cx - 8) + ' ' + (y + 5) + ' ' + cx + ' ' + (y + 4) + ' C' + (cx + 8) + ' ' + (y + 5) + ' ' + (cx + 20) + ' ' + (y + 11) + ' ' + (cx + 34) + ' ' + (y + 9) + ' C' + (cx + 30) + ' ' + (y - 4) + ' ' + (cx + 12) + ' ' + (y - 9) + ' ' + cx + ' ' + (y - 5) + 'Z', col);
    case 'walrus': return path('M' + cx + ' ' + (y - 6) + ' C' + (cx - 16) + ' ' + (y - 12) + ' ' + (cx - 38) + ' ' + (y - 6) + ' ' + (cx - 44) + ' ' + (y + 14) + ' C' + (cx - 28) + ' ' + (y + 18) + ' ' + (cx - 10) + ' ' + (y + 8) + ' ' + cx + ' ' + (y + 6) + ' C' + (cx + 10) + ' ' + (y + 8) + ' ' + (cx + 28) + ' ' + (y + 18) + ' ' + (cx + 44) + ' ' + (y + 14) + ' C' + (cx + 38) + ' ' + (y - 6) + ' ' + (cx + 16) + ' ' + (y - 12) + ' ' + cx + ' ' + (y - 6) + 'Z', col);
    case 'chevron': return path('M' + cx + ' ' + (y - 4) + ' C' + (cx - 12) + ' ' + (y - 8) + ' ' + (cx - 24) + ' ' + (y - 2) + ' ' + (cx - 30) + ' ' + (y - 12) + ' C' + (cx - 26) + ' ' + (y + 6) + ' ' + (cx - 10) + ' ' + (y + 6) + ' ' + cx + ' ' + (y + 3) + ' C' + (cx + 10) + ' ' + (y + 6) + ' ' + (cx + 26) + ' ' + (y + 6) + ' ' + (cx + 30) + ' ' + (y - 12) + ' C' + (cx + 24) + ' ' + (y - 2) + ' ' + (cx + 12) + ' ' + (y - 8) + ' ' + cx + ' ' + (y - 4) + 'Z', col);
    case 'pencil': return line('M' + (cx - 20) + ' ' + (y + 3) + ' Q' + (cx - 8) + ' ' + (y - 4) + ' ' + cx + ' ' + (y - 1) + ' Q' + (cx + 8) + ' ' + (y - 4) + ' ' + (cx + 20) + ' ' + (y + 3), 3.2, col);
    case 'curl': s = line('M' + (cx - 22) + ' ' + (y + 3) + ' Q' + (cx - 8) + ' ' + (y - 5) + ' ' + cx + ' ' + (y - 1) + ' Q' + (cx + 8) + ' ' + (y - 5) + ' ' + (cx + 22) + ' ' + (y + 3), 3.2, col);
      return s + line('M' + (cx - 22) + ' ' + (y + 3) + ' q-6 -2 -6 -9 M' + (cx + 22) + ' ' + (y + 3) + ' q6 -2 6 -9', 2.6, col);
  }
  return s;
}
function beardFn(c, type, col){
  var cx = c.cx, cy = c.cy, fw = c.fw, fh = c.fh;
  if (type === 'mutton') {
    return [-1, 1].map(function(sg){ var xe = cx + sg * (fw - 1); return path('M' + xe + ' ' + (cy - 8) + ' Q' + (xe + sg * 10) + ' ' + (cy + fh * .4) + ' ' + (xe - sg * 8) + ' ' + (cy + fh * .78) + ' Q' + (xe - sg * 18) + ' ' + (cy + fh * .35) + ' ' + (xe - sg * 12) + ' ' + (cy - 8) + 'Z', col); }).join('');
  }
  if (type === 'full') {
    return path('M' + (cx - fw - 1) + ' ' + (cy + 4) + ' C' + (cx - fw - 2) + ' ' + (cy + fh * .8) + ' ' + (cx - fw * .5) + ' ' + (cy + fh + 18) + ' ' + cx + ' ' + (cy + fh + 18) + ' C' + (cx + fw * .5) + ' ' + (cy + fh + 18) + ' ' + (cx + fw + 2) + ' ' + (cy + fh * .8) + ' ' + (cx + fw + 1) + ' ' + (cy + 4) +
      ' C' + (cx + fw - 6) + ' ' + (cy + fh * .35) + ' ' + (cx + fw * .5) + ' ' + (cy + fh * .36) + ' ' + cx + ' ' + (cy + fh * .36) + ' C' + (cx - fw * .5) + ' ' + (cy + fh * .36) + ' ' + (cx - fw + 6) + ' ' + (cy + fh * .35) + ' ' + (cx - fw - 1) + ' ' + (cy + 4) + 'Z', col);
  }
  return '';
}
function glassesFn(c, type){
  var cx = c.cx, ey = c.cy - 3, dx = c.fw * .42, s = '', r = 11;
  if (type === 'round') s = '<circle cx="' + (cx - dx) + '" cy="' + ey + '" r="' + r + '" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="3"/><circle cx="' + (cx + dx) + '" cy="' + ey + '" r="' + r + '" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="3"/>' + line('M' + (cx - dx + r) + ' ' + ey + ' Q' + cx + ' ' + (ey - 4) + ' ' + (cx + dx - r) + ' ' + ey + ' M' + (cx - dx - r) + ' ' + ey + ' L' + (cx - c.fw - 2) + ' ' + (ey - 2) + ' M' + (cx + dx + r) + ' ' + ey + ' L' + (cx + c.fw + 2) + ' ' + (ey - 2), 2.5);
  else if (type === 'thick') s = '<rect x="' + (cx - dx - 12) + '" y="' + (ey - 9) + '" width="24" height="18" rx="4" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="5"/><rect x="' + (cx + dx - 12) + '" y="' + (ey - 9) + '" width="24" height="18" rx="4" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="5"/>' + line('M' + (cx - dx + 12) + ' ' + (ey - 3) + ' L' + (cx + dx - 12) + ' ' + (ey - 3), 4);
  else if (type === 'small') s = '<ellipse cx="' + (cx - dx) + '" cy="' + (ey + 1) + '" rx="9" ry="6.5" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="2.5"/><ellipse cx="' + (cx + dx) + '" cy="' + (ey + 1) + '" rx="9" ry="6.5" fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="2.5"/>' + line('M' + (cx - dx + 9) + ' ' + ey + ' L' + (cx + dx - 9) + ' ' + ey, 2.2);
  else if (type === 'pince') s = '<circle cx="' + (cx - dx) + '" cy="' + (ey + 1) + '" r="8" fill="rgba(255,255,255,.2)" stroke="' + INK + '" stroke-width="2.4"/><circle cx="' + (cx + dx) + '" cy="' + (ey + 1) + '" r="8" fill="rgba(255,255,255,.2)" stroke="' + INK + '" stroke-width="2.4"/>' + line('M' + (cx - dx + 8) + ' ' + ey + ' Q' + cx + ' ' + (ey - 6) + ' ' + (cx + dx - 8) + ' ' + ey + ' M' + (cx - dx - 8) + ' ' + (ey + 1) + ' L' + (cx - c.fw - 8) + ' ' + (ey + 26), 2);
  return s;
}
function eyesFn(c, kind, bright){
  var cx = c.cx, ey = c.cy - 3, dx = c.fw * .42, s = '';
  [-1, 1].forEach(function(sg){
    var x = cx + sg * dx;
    if (kind === 'heavy') s += '<ellipse cx="' + x + '" cy="' + ey + '" rx="7" ry="4.6" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>' + circ(x + sg * .5, ey + 1, 2.8, INK, true) + line('M' + (x - 8) + ' ' + (ey - 1) + ' Q' + x + ' ' + (ey - 7) + ' ' + (x + 8) + ' ' + (ey - 1), 3);
    else if (kind === 'sad') s += '<ellipse cx="' + x + '" cy="' + (ey + 1) + '" rx="6.5" ry="5.2" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>' + circ(x, ey + 2, 3, INK, true) + line('M' + (x - 8) + ' ' + (ey + 7) + ' Q' + x + ' ' + (ey + 10) + ' ' + (x + 8) + ' ' + (ey + 7), 1.6);
    else s += '<ellipse cx="' + x + '" cy="' + ey + '" rx="' + (bright ? 7 : 6.5) + '" ry="' + (bright ? 6 : 5) + '" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>' + circ(x + sg * 1, ey + 1, bright ? 3.6 : 3, INK, true) + (bright ? circ(x + sg * 1 + 1.2, ey - .4, 1.1, '#fff', true) : '');
  });
  return s;
}
function browsFn(c, kind, col){
  var cx = c.cx, by = c.cy - 14, dx = c.fw * .42, w = { thin: 2.6, strong: 5, heavy: 6, bushy: 8 }[kind] || 3.5, s = '';
  [-1, 1].forEach(function(sg){
    var x = cx + sg * dx;
    if (kind === 'bushy') s += path('M' + (x - 13) + ' ' + (by + 5) + ' Q' + x + ' ' + (by - 9) + ' ' + (x + 14) + ' ' + (by + 1) + ' Q' + (x + 4) + ' ' + (by + 1) + ' ' + (x - 13) + ' ' + (by + 8) + 'Z', col, ' transform="rotate(' + (sg * 4) + ' ' + x + ' ' + by + ')"');
    else s += line('M' + (x - 12) + ' ' + (by + (kind === 'heavy' ? 4 : 3)) + ' Q' + x + ' ' + (by - 5) + ' ' + (x + 12) + ' ' + (by + (kind === 'heavy' ? 1 : 3) - (sg > 0 ? 0 : 0)), w, col);
  });
  return s;
}
function mouthFn(c, kind, beard){
  var cx = c.cx, y = c.cy + c.fh * .66;
  if (kind === 'flat') return line('M' + (cx - 10) + ' ' + y + ' L' + (cx + 10) + ' ' + y, 3);
  if (kind === 'grin') return path('M' + (cx - 16) + ' ' + (y - 4) + ' Q' + cx + ' ' + (y + 16) + ' ' + (cx + 16) + ' ' + (y - 4) + ' Q' + cx + ' ' + (y + 2) + ' ' + (cx - 16) + ' ' + (y - 4) + 'Z', '#fff');
  return line('M' + (cx - 11) + ' ' + (y - 1) + ' Q' + cx + ' ' + (y + 6) + ' ' + (cx + 11) + ' ' + (y - 1), 3, beard ? '#ffffff' : INK);
}

/* ---------- giysi ---------- */
function clothFn(c, s){
  var cx = c.cx, cl = s.cloth, out = '', skin2 = shade(s.skin, -.14), ny = c.cy + c.fh - 10;
  var shoulders = 'M6 202 Q10 160 56 152 L100 168 L144 152 Q190 160 194 202Z';
  out += path(shoulders, cl);
  switch (s.cl) {
    case 'lab': out = path(shoulders, '#f4f4f8') + line('M100 168 L84 200 M100 168 L116 200', 2.5, '#9aa0b0'); out += '<path d="M84 156 L100 196 L116 156 L100 166Z" fill="#7aa8d8" stroke="' + INK + '" stroke-width="2.5"/>'; break;
    case 'suit': case 'vest': case 'high': case 'shirt':
      out += '<path d="M82 154 L100 202 L118 154 L100 166Z" fill="' + (s.cl === 'vest' ? '#d9d4c8' : '#f4f4f8') + '" stroke="' + INK + '" stroke-width="2.5"/>';
      if (s.cl === 'vest') out += path('M82 154 L100 202 L118 154 L132 202 L68 202Z', cl);
      break;
    case 'sweater': out += '<ellipse cx="100" cy="164" rx="22" ry="9" fill="' + shade(cl, -.2) + '" stroke="' + INK + '" stroke-width="2.5"/>'; break;
    case 'apron': out = path(shoulders, '#e9e4d6') + path('M72 160 L128 160 L134 202 L66 202Z', cl) + line('M72 160 L58 154 M128 160 L142 154', 3); break;
  }
  out += '<rect x="' + (cx - 13) + '" y="' + (ny - 4) + '" width="26" height="' + (172 - ny) + '" fill="' + skin2 + '" stroke="' + INK + '" stroke-width="2.5"/>';
  /* yaka/kravat */
  if (s.cl === 'suit' || s.cl === 'vest' || s.cl === 'shirt') {
    out += path('M100 166 L84 156 L80 172 Z', '#fff', ' stroke-width="2.4"') + path('M100 166 L116 156 L120 172 Z', '#fff', ' stroke-width="2.4"');
    if (s.bow) out += path('M100 172 L86 164 L86 180 Z M100 172 L114 164 L114 180 Z', s.tie || '#b3122a', ' stroke-width="2.4"') + circ(100, 172, 3.5, s.tie || '#b3122a');
    else if (s.tie) out += path('M96 170 L104 170 L102 178 L98 178 Z', s.tie, ' stroke-width="2.2"') + path('M98 178 L102 178 L108 202 L92 202 Z', s.tie, ' stroke-width="2.2"');
  }
  if (s.cl === 'high') out += path('M82 150 L96 168 L84 176 L76 160 Z', '#fff', ' stroke-width="2.4"') + path('M118 150 L104 168 L116 176 L124 160 Z', '#fff', ' stroke-width="2.4"') + path('M100 170 L92 178 L92 192 L100 184 L108 192 L108 178Z', '#15131f', ' stroke-width="2"');
  if (s.cl === 'lab') out += path('M100 166 L82 154 L74 176 Z', '#f4f4f8', ' stroke-width="2.4"') + path('M100 166 L118 154 L126 176 Z', '#f4f4f8', ' stroke-width="2.4"');
  if (s.cl === 'apron') out += path('M100 166 L84 156 L80 170 Z', '#fff', ' stroke-width="2.4"') + path('M100 166 L116 156 L120 170 Z', '#fff', ' stroke-width="2.4"');
  return out;
}
function hatFn(c){
  var cx = c.cx, cy = c.cy, fh = c.fh, fw = c.fw, by = cy - fh * .55;
  return path('M' + (cx - fw + 2) + ' ' + by + ' Q' + (cx - fw + 4) + ' ' + (by - 34) + ' ' + cx + ' ' + (by - 36) + ' Q' + (cx + fw - 4) + ' ' + (by - 34) + ' ' + (cx + fw - 2) + ' ' + by + 'Z', '#ecc96a') +
    line('M' + (cx - fw + 3) + ' ' + (by - 6) + ' Q' + cx + ' ' + (by - 1) + ' ' + (cx + fw - 3) + ' ' + (by - 6), 8, '#b3122a') +
    '<ellipse cx="' + cx + '" cy="' + by + '" rx="' + (fw + 36) + '" ry="11" fill="#f1d684" stroke="' + INK + '" stroke-width="3"/>' +
    line('M' + (cx - fw - 24) + ' ' + (by + 2) + ' Q' + (cx - 20) + ' ' + (by + 8) + ' ' + (cx + 10) + ' ' + (by + 8), 1.6, '#b99a3a') + line('M' + (cx + fw + 24) + ' ' + (by + 2) + ' Q' + (cx + 30) + ' ' + (by + 8) + ' ' + (cx + 10) + ' ' + (by + 8), 1.6, '#b99a3a');
}
function wrinkles(c, age){
  var cx = c.cx, cy = c.cy, fw = c.fw, s = '', col = 'rgba(11,6,32,.45)';
  if (age >= 1) s += line('M' + (cx - fw * .42 - 12) + ' ' + (cy + 4) + ' l-4 3 M' + (cx + fw * .42 + 12) + ' ' + (cy + 4) + ' l4 3', 1.6, col);
  if (age >= 2) s += line('M' + (cx - 14) + ' ' + (cy - c.fh * .72) + ' q14 -4 28 0', 1.6, col) + line('M' + (cx - 12) + ' ' + (cy - c.fh * .6) + ' q12 -3 24 0', 1.6, col);
  if (age >= 3) s += line('M' + (cx - fw + 8) + ' ' + (cy + 14) + ' q4 14 14 22 M' + (cx + fw - 8) + ' ' + (cy + 14) + ' q-4 14 -14 22', 1.8, col);
  return s;
}

/* ---------- ana çizici ---------- */
function build(s, id, opts){
  var c = { cx: 100, cy: 88, fw: s.fw || 44, fh: s.fh || 54 };
  var out = '', uid = 'pr' + (hash(id) % 99999);
  out += '<defs><linearGradient id="' + uid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + s.bg + '"/><stop offset="1" stop-color="' + (s.bg2 || shade(s.bg, -.4)) + '"/></linearGradient></defs>';
  out += '<rect width="200" height="200" fill="url(#' + uid + ')"/>';
  out += '<g opacity=".16" fill="#fff"><circle cx="30" cy="30" r="20"/><circle cx="176" cy="150" r="30"/><path d="M0 120 L60 200 L0 200Z"/></g>';
  if (s.motif) out += '<text x="192" y="30" text-anchor="end" font-family="Impact,\'Arial Black\',sans-serif" font-size="' + (s.motif.length > 4 ? 16 : 22) + '" fill="#fff" opacity=".55" stroke="' + INK + '" stroke-width="3" paint-order="stroke fill" aria-hidden="true">' + esc(s.motif) + '</text>';
  out += clothFn(c, s);
  /* kulaklar */
  out += '<ellipse cx="' + (c.cx - c.fw) + '" cy="' + (c.cy + 4) + '" rx="7" ry="10" fill="' + s.skin + '" stroke="' + INK + '" stroke-width="3"/><ellipse cx="' + (c.cx + c.fw) + '" cy="' + (c.cy + 4) + '" rx="7" ry="10" fill="' + s.skin + '" stroke="' + INK + '" stroke-width="3"/>';
  var h = hairParts(c, s);
  out += h.back;
  out += path(facePath(c, s.jaw), s.skin);
  if (s.dchin) out += line('M' + (c.cx - 20) + ' ' + (c.cy + c.fh - 6) + ' Q' + c.cx + ' ' + (c.cy + c.fh + 4) + ' ' + (c.cx + 20) + ' ' + (c.cy + c.fh - 6), 2, 'rgba(11,6,32,.4)');
  /* yanak tonu */
  out += '<ellipse cx="' + (c.cx - c.fw * .55) + '" cy="' + (c.cy + c.fh * .3) + '" rx="8" ry="5" fill="#ff7a8a" opacity=".22"/><ellipse cx="' + (c.cx + c.fw * .55) + '" cy="' + (c.cy + c.fh * .3) + '" rx="8" ry="5" fill="#ff7a8a" opacity=".22"/>';
  out += h.front;
  out += wrinkles(c, s.age || 0);
  out += eyesFn(c, s.eyes, s.eyes === 'bright');
  out += browsFn(c, s.brow || 'thin', s.browc || s.hair);
  out += line('M' + c.cx + ' ' + (c.cy - 2) + ' Q' + (c.cx - 7) + ' ' + (c.cy + c.fh * .25) + ' ' + (c.cx + 1) + ' ' + (c.cy + c.fh * .3), 2.6);
  if (s.beard) out += beardFn(c, s.beard, s.beardc || s.hair);
  out += mouthFn(c, s.mouth, !!s.beard);
  if (s.mou && s.mou !== 'none') out += mousFn(c, s.mou, s.mouc || s.hair);
  if (s.gl) out += glassesFn(c, s.gl);
  if (s.hat === 'straw') out += hatFn(c);
  var label = esc((s.n || id) + ' portresi');
  var cls = opts && opts.cls ? ' class="' + esc(opts.cls) + '"' : '';
  return '<svg' + cls + ' viewBox="0 0 200 200" role="img" aria-label="' + label + '" preserveAspectRatio="xMidYMid meet">' + out + '</svg>';
}

/* tanımsız id: id'den türetilmiş renkli genel silüet */
function fallbackSpec(id){
  var h = hash(String(id)), hue = h % 360, hue2 = (hue + 40) % 360;
  function hsl(hh, sat, l){ /* hsl -> hex */
    var a = sat * Math.min(l, 1 - l);
    function k(n){ var kk = (n + hh / 30) % 12; var col = l - a * Math.max(-1, Math.min(kk - 3, Math.min(9 - kk, 1))); return Math.round(col * 255); }
    return '#' + [k(0), k(8), k(4)].map(function(v){ return (v < 16 ? '0' : '') + v.toString(16); }).join('');
  }
  return { n: String(id), bg: hsl(hue, .6, .5), bg2: hsl(hue2, .6, .28), skin: ['#f2c6a0', '#e6b08a', '#d29a74', '#f6d3b4'][h % 4], hair: ['#2a1d1a', '#6a5a4c', '#c9c9cf', '#a8793a'][(h >> 3) % 4], hs: ['neat', 'flat', 'side', 'thin'][(h >> 5) % 4], fw: 42 + (h % 7), fh: 52 + ((h >> 4) % 6), brow: 'thin', eyes: 'normal', cloth: hsl(hue2, .35, .3), cl: 'suit', tie: '#e8c86a', motif: '?' };
}
function resolve(id){
  var k = String(id == null ? '' : id).toLowerCase().replace(/[\s-]+/g, '_');
  if (P[k]) return k;
  if (ALIAS[k] && P[ALIAS[k]]) return ALIAS[k];
  var k2 = k.replace(/_/g, '');
  if (P[k2]) return k2;
  if (ALIAS[k2] && P[ALIAS[k2]]) return ALIAS[k2];
  return null;
}

function silhouette(opts){
  var cls = opts && opts.cls ? ' class="' + esc(opts.cls) + '"' : '';
  return '<svg' + cls + ' viewBox="0 0 200 200" role="img" aria-label="Gizli bilim insanı"><rect width="200" height="200" fill="#25164f"/>' +
    '<path d="M6 202 Q10 160 56 152 L144 152 Q190 160 194 202Z" fill="#120a30" stroke="#6b5aa8" stroke-width="3"/>' +
    '<ellipse cx="100" cy="88" rx="44" ry="54" fill="#120a30" stroke="#6b5aa8" stroke-width="3"/><rect x="87" y="130" width="26" height="30" fill="#120a30"/>' +
    '<text x="100" y="104" text-anchor="middle" font-family="Impact,\'Arial Black\',sans-serif" font-size="54" fill="#6b5aa8">?</text></svg>';
}
Q.art.portre = function(id, opts){
  if (opts && opts.sil) return silhouette(opts);
  var r = resolve(id);
  try { return build(r ? P[r] : fallbackSpec(id), r || String(id), opts); }
  catch (e) { return ''; }
};
Q.art.portreVarMi = function(id){ return !!resolve(id); };
Q.art.PORTRE_IDS = Object.keys(P);
})();
