/* test/harness.js (A1) Test yardımcısı.
 * Node: loadCore({localStorage}) -> vm bağlamında 00-q.js + 10-state.js yükler, {Q, win} döndürür.
 * Playwright: injectTokens(page) 05 §1.1 :root token bloğunu sayfaya ekler.
 * Q sahtesi yok: gerçek dosyalar yüklenir. */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var SRC = path.join(__dirname, '..', 'src', 'js');

var TOKENS = ':root{--bg:#0e0724;--bg2:#1a0f3d;--panel:#1a0f3d;--panel2:#25164f;--ink:#ffffff;--ink-dark:#0b0620;--muted:#c4b9ec;--line:#f4f0ff;' +
'--yellow:#ffd23f;--cyan:#00e5ff;--magenta:#ff3df0;--lime:#39ff88;--red:#ff4d6d;--blue:#3a5bff;--accent:var(--yellow);--accent2:var(--cyan);--accent-ink:#0b0620;' +
'--good:var(--lime);--bad:var(--red);--sel:#0a3a52;--sel-ink:#ffffff;--track:#0b0620;--bubble:#ffffff;--bubble-ink:#0b0620;--bubble-line:#0b0620;--bubble-shadow:#00e5ff;' +
'--bw:3px;--r:10px;--rs:8px;--shadow:6px 6px 0 var(--magenta);--shadow-sm:4px 4px 0 var(--ink-dark);--glow-cyan:0 0 14px rgba(0,229,255,.65);' +
'--glow-magenta:0 0 14px rgba(255,61,240,.6);--glow-lime:0 0 12px rgba(57,255,136,.6);' +
"--font-d:'Lilita One','Impact','Arial Black',sans-serif;--font-b:'Nunito','Trebuchet MS',system-ui,sans-serif;--fs-body:17px;--fs-small:14px;" +
'--sky:#120a30;--ground:#00e5ff;--grid:rgba(255,61,240,.22);--runner:#ffd23f;--foe:#ff3df0;--m-line:#0b0620;--m-line2:#0b0620;--m-lw:5;--m-lw2:3;--m-lws:3.5;' +
'--m-aura:rgba(0,229,255,.10);--m-auraline:#00e5ff;--m-dash:5 7;--m-ray:#ffd23f;--m-rayl:#0b0620;--m-body:#3a5bff;--m-collar:#ffffff;--m-hair:#f4f4f4;--m-skin:#ffc99b;' +
'--m-eye:#ffffff;--m-pupil:#0b0620;--m-mous:#9aa0ad;--m-mouth:#b3122a;--m-acc:#00e5ff;--m-label:#ffffff;color-scheme:dark}';

function memStorage(){
  var m = {};
  return { getItem: function(k){ return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
           setItem: function(k, v){ m[k] = String(v); }, removeItem: function(k){ delete m[k]; } };
}

/* opts.localStorage: nesne | null (yok) | 'throw' (erişimde hata); opts.files: yüklenecek dosyalar */
function loadCore(opts){
  opts = opts || {};
  var win = { setTimeout: setTimeout, clearTimeout: clearTimeout, console: console, Promise: Promise };
  win.window = win;
  if (opts.localStorage === 'throw') {
    Object.defineProperty(win, 'localStorage', { get: function(){ throw new Error('blocked'); } });
  } else if (opts.localStorage !== null) {
    win.localStorage = opts.localStorage || memStorage();
  }
  var ctx = vm.createContext(win);
  (opts.files || ['00-q.js', '10-state.js']).forEach(function(f){
    vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
  });
  return { Q: win.Q, win: win };
}

async function injectTokens(page){ await page.addStyleTag({ content: TOKENS }); }

module.exports = { loadCore: loadCore, memStorage: memStorage, injectTokens: injectTokens, TOKENS: TOKENS, SRC: SRC };
