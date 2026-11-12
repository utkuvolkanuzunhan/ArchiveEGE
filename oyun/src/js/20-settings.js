/* 20-settings.js (A8) Ayarlar penceresi, harita menüsü (istasyon seçimi), süre sayacı ve hız önerisi.
 * Ekler: Q.settings.open/close/openMap/closeMap/istasyonAcik/get/set/refreshClaudeStatus/init/checkSuggest.
 * Bağımlılık: 00-q.js, 10-state.js (çalışma anında: Q.ui, Q.claude, Q.runner, Q.art, Q.data, kabuk kimlikleri).
 * Pencereler kendi katmanında (#a8-layer) durur; yalnızca yerleşim için satır içi stil kullanır, görünüm 05 sınıflarından gelir. */
(function(){
  'use strict';
  var S = Q.settings;
  var HEDEF_SN = 240 * 60, ESIK_SN = Math.floor(HEDEF_SN * 0.7);
  var STATIONS = [
    ['s01', 'Kristal fırını', 'Katı türleri, neden kristal, CZ ile tek kristal'],
    ['s02', 'Kesim testeresi', 'Kafes, birim hücre, Miller indisleri'],
    ['s03', 'Işık-test odası', 'Neden kuantum: kara cisim, fotoelektrik'],
    ['s04', 'Atom mikroskobu', 'H atomu kararlılığı, madde dalgası'],
    ['s05', 'Dalga odası', 'Schrödinger, ψ, sonsuz kuyu'],
    ['s06', 'Tünel istasyonu', 'Basamak, yansıma, tünelleme'],
    ['s07', 'Ölçüm laboratuvarı', 'Postülatlar, ölçüm, çökme'],
    ['s08', 'Kalibrasyon odası', 'Belirsizlik ilkesi'],
    ['s09', 'Bant testi', 'Periyodik yapı, enerji bantları'],
    ['s10', 'Paketleme (bonus)', 'Taşıyıcılar, Fermi, drift']
  ];
  var PATRON = { s01: 'czoch', s02: 'miller', s03: 'einstein', s04: 'bohr', s05: 'schro', s06: 'broglie', s07: 'born', s08: 'heis', s09: 'pauli', s10: 'fermi' };
  var MODELLER = ['claude-sonnet-5-5', 'claude-opus-4-5', 'claude-haiku-4-5'];
  var oneriGosterildi = false, inited = false, pauseSay = 0, claudeBilgi = null;
  var settingsEl = null, mapEl = null, panelEl = null, listEl = null, layer = null, yanEl = null, kartPanelEl = null, kolek = null, sonSecili = null;

  function A(){ return Q.state.ayarlar; }
  function doc(){ return (typeof document !== 'undefined') ? document : null; }
  function el(tag, cls, text){
    var e = Q.util.el(tag, cls);
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(text, cls, fn){
    var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function stList(){
    var out = STATIONS.map(function(r, i){
      var d = (Q.data && Q.data.stations && Q.data.stations[r[0]]) || null;
      return { id: r[0], sira: i + 1, ad: d ? d.ad : r[1], konu: d ? d.konu : r[2], sure: d ? d.sureHedefDk : null,
               renk: d && d.renk || '', engeller: d ? d.engeller : null, patronId: d ? d.patronId : PATRON[r[0]] };
    });
    return out.filter(function(s){ return s.sira < 10 || A().istasyon10; });
  }
  function prog(id){ return Q.state.ilerleme[id] || {}; }
  function tamamSayisi(){
    return Object.keys(Q.state.ilerleme).filter(function(k){ return Q.state.ilerleme[k] && Q.state.ilerleme[k].tamam; }).length;
  }
  function dogalAcik(sira){
    if (sira === 1) return true;
    if (sira === 10 && !A().istasyon10) return false;
    var onceki = 's' + (sira - 1 < 10 ? '0' : '') + (sira - 1);
    return !!prog(onceki).tamam;
  }
  S.istasyonAcik = function(id){
    var sira = parseInt(String(id).replace(/\D/g, ''), 10) || 0;
    if (!sira) return false;
    if (A().kilitleriAc) return true;
    return dogalAcik(sira) || (sira === 10 && A().istasyon10 && !!prog('s09').tamam);
  };

  /* ---------- ayar okuma/yazma ---------- */
  S.get = function(k){ return A()[k]; };
  S.set = function(k, v){
    var d = Q.save.defaults().ayarlar;
    if (!(k in d) || typeof v !== typeof d[k]) return false;
    if (k === 'hiz') v = Q.util.clamp(+v || 1, 0.6, 1.4);
    if (k === 'efor' && ['low', 'medium', 'high'].indexOf(v) < 0) return false;
    A()[k] = v;
    Q.bus.emit('settings:change', { anahtar: k, deger: v });
    Q.save.write();
    if (mapEl && (k === 'kilitleriAc' || k === 'istasyon10')) renderMap();
    return true;
  };

  /* ---------- katman ve dondurma ---------- */
  function getLayer(){
    var d = doc(); if (!d) return null;
    if (layer && layer.parentNode) return layer;
    layer = d.getElementById('a8-layer');
    if (!layer) {
      layer = el('div'); layer.id = 'a8-layer';
      layer.style.cssText = 'position:fixed;inset:0;z-index:55;pointer-events:none';
      (d.getElementById('app') || d.body).appendChild(layer);
    }
    return layer;
  }
  function backdrop(full){
    var b = el('div', 'a8-back'), s = b.style;
    s.cssText = 'position:absolute;inset:0;display:flex;align-items:' + (full ? 'stretch' : 'center') + ';justify-content:center;' +
      'pointer-events:auto;overflow:auto;padding:' + (full ? '0' : '16px') + ';background:' + (full ? 'var(--bg)' : 'rgba(11,6,32,.72)');
    return b;
  }
  function freeze(){
    pauseSay++;
    if (pauseSay === 1 && !mapEl) { try { if (Q.runner.hold) Q.runner.hold(); } catch (e) { /* motor yok */ } }
  }
  function thaw(){
    if (pauseSay > 0) pauseSay--;
    if (pauseSay === 0 && !mapEl && Q.state.aktif.stationId) { try { if (Q.runner.resume) Q.runner.resume(); } catch (e) { /* motor yok */ } }
  }

  /* ---------- ayarlar penceresi ---------- */
  function sw(label, key, onChange){
    var row = el('div', 'a8-row'), b = btn('', 'opt');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0';
    function paint(){ var on = !!A()[key]; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'Açık' : 'Kapalı'; }
    b.addEventListener('click', function(){ S.set(key, !A()[key]); paint(); if (onChange) onChange(); });
    row.appendChild(el('span', '', label)); row.appendChild(b); paint();
    row._paint = paint;
    return row;
  }
  function selectRow(label, key, opts){
    var row = el('div', 'a8-row'), sel = el('select', 'btn');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0';
    if (opts.indexOf(A()[key]) < 0) opts = [A()[key]].concat(opts);
    opts.forEach(function(o){ var op = el('option', '', o); op.value = o; sel.appendChild(op); });
    sel.value = A()[key];
    sel.addEventListener('change', function(){ S.set(key, sel.value); });
    row.appendChild(el('span', '', label)); row.appendChild(sel);
    return row;
  }
  S.open = function(){
    var d = doc(); if (!d || settingsEl) return;
    var L = getLayer(), back = backdrop(false), p = el('div', 'panel modal');
    freeze();
    p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Ayarlar');
    p.style.cssText = 'width:min(560px,100%);max-height:100%;overflow:auto;padding:16px';
    p.appendChild(el('h2', '', 'Ayarlar'));
    var rows = [];
    function add(r){ rows.push(r); p.appendChild(r); return r; }
    add(sw('Her yere eriş (kilitleri aç)', 'kilitleriAc'));
    add(sw('Hızlı mod: yalnızca patronlar', 'sadecePatron'));
    add(sw('Hikâye sahnelerini atla', 'hikayeAtla'));
    var hr = el('div', 'a8-row'), rng = el('input'), hv = el('b', '', A().hiz.toFixed(1) + '×');
    hr.style.cssText = 'display:flex;align-items:center;gap:12px;margin:8px 0';
    rng.type = 'range'; rng.min = '0.6'; rng.max = '1.4'; rng.step = '0.1'; rng.value = String(A().hiz);
    rng.setAttribute('aria-label', 'Oyun hızı'); rng.style.flex = '1';
    rng.addEventListener('input', function(){ S.set('hiz', +rng.value); hv.textContent = (+rng.value).toFixed(1) + '×'; });
    hr.appendChild(el('span', '', 'Oyun hızı')); hr.appendChild(rng); hr.appendChild(hv); p.appendChild(hr);
    add(sw('Ders bu konuyu işledi (İstasyon 10)', 'istasyon10'));
    add(sw('Ses', 'ses'));
    /* Claude durumu */
    var cr = el('div', 'a8-row'), ct = el('span', '', 'Claude: bakılıyor'), cb = btn('Bağlantıyı dene', '');
    cr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0';
    cr.id = 'a8-claude'; ct.id = 'a8-claude-text';
    cb.addEventListener('click', function(){
      if (!Q.claude.test) { ct.textContent = 'Claude: istemci yok'; return; }
      ct.textContent = 'Claude: deneniyor...';
      Q.claude.test().then(function(r){
        ct.textContent = r && r.ok ? 'Claude: bağlantı tamam' : 'Claude: olmadı' + (r && r.hata ? ' (' + r.hata + ')' : '');
      }, function(){ ct.textContent = 'Claude: olmadı'; });
    });
    cr.appendChild(ct); cr.appendChild(cb); p.appendChild(cr);
    p.appendChild(selectRow('Model', 'modelAdi', MODELLER));
    p.appendChild(selectRow('Efor', 'efor', ['low', 'medium', 'high']));
    /* Gelişmiş: API anahtarı */
    var det = el('details', ''), sm = el('summary', '', 'Gelişmiş: API anahtarı');
    var key = el('input'), rem = el('input'), kb = btn('Kaydet', 'primary'), rl = el('label', '', ' Bu oturum için hatırla');
    key.type = 'password'; key.autocomplete = 'off'; key.setAttribute('aria-label', 'API anahtarı'); key.style.cssText = 'width:100%;margin:8px 0';
    rem.type = 'checkbox'; rl.insertBefore(rem, rl.firstChild);
    kb.addEventListener('click', function(){
      if (!key.value || !Q.claude.setApiKey) return;
      Q.claude.setApiKey(key.value, !!rem.checked);
      key.value = '';
      S.refreshClaudeStatus();
      if (Q.ui.toast) Q.ui.toast('Anahtar kaydedildi.', { tur: 'iyi' });
    });
    det.appendChild(sm); det.appendChild(key); det.appendChild(rl); det.appendChild(kb);
    det.appendChild(el('p', '', 'Yayınlanmış sayfada çalışmaz. Yerel dosyada çalışır.'));
    p.appendChild(det);
    p.appendChild(btn('Haritaya dön', 'primary', function(){ S.close(); try { if (Q.runner.abort) Q.runner.abort(); } catch (e) { /* motor yok */ } S.openMap(); }));
    /* Kopyala / yapıştır */
    var ta = el('textarea'); ta.rows = 3; ta.setAttribute('aria-label', 'İlerleme metni'); ta.style.cssText = 'width:100%;margin-top:12px';
    var tr = el('div'); tr.style.cssText = 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap';
    tr.appendChild(btn('İlerlemeyi kopyala', '', function(){
      var t = Q.save.exportText(); ta.value = t;
      var ok = false;
      try { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(t).then(function(){ if (Q.ui.toast) Q.ui.toast('Kopyalandı.', { tur: 'iyi' }); }, function(){ ta.focus(); ta.select(); }); ok = true; } } catch (e) { ok = false; }
      if (!ok) { ta.focus(); ta.select(); }
    }));
    tr.appendChild(btn('Yapıştır', '', function(){
      function ice(t){
        if (Q.save.importText(t)) {
          Object.keys(A()).forEach(function(k){ Q.bus.emit('settings:change', { anahtar: k, deger: A()[k] }); });
          if (Q.ui.toast) Q.ui.toast('İlerleme yüklendi.', { tur: 'iyi' });
          S.close(); if (mapEl) renderMap();
        } else if (Q.ui.toast) Q.ui.toast('Metin okunamadı.', { tur: 'kotu' });
      }
      if (ta.value.trim()) { ice(ta.value); return; }
      try { navigator.clipboard.readText().then(ice, function(){ ta.focus(); }); } catch (e) { ta.focus(); }
    }));
    p.appendChild(ta); p.appendChild(tr);
    var rs = btn('Her şeyi sıfırla', '', function(){
      var q = Q.ui.confirm ? Q.ui.confirm({ metin: 'Tüm ilerleme silinir. Emin misin?', evet: 'Sil', hayir: 'Vazgeç' }) : Promise.resolve(false);
      q.then(function(ok){
        if (!ok) return;
        Q.save.reset();
        if (Q.ui.toast) Q.ui.toast('Sıfırlandı.', { tur: 'bilgi' });
        S.close(); if (mapEl) renderMap();
      });
    });
    rs.style.marginTop = '16px'; p.appendChild(rs);
    p.appendChild(btn('Kapat', '', function(){ S.close(); }));
    back.appendChild(p);
    back.addEventListener('click', function(e){ if (e.target === back) S.close(); });
    L.appendChild(back); settingsEl = back;
    S.refreshClaudeStatus();
    var first = p.querySelector('button'); if (first) first.focus();
  };
  S.close = function(){
    if (!settingsEl) return;
    if (settingsEl.parentNode) settingsEl.parentNode.removeChild(settingsEl);
    settingsEl = null; thaw();
  };

  S.refreshClaudeStatus = function(){
    var p = Q.claude.available ? Q.claude.available() : Promise.resolve({ backend: 'none', model: '' });
    return p.then(function(r){ return r; }, function(){ return { backend: 'none', model: '' }; }).then(function(r){
      claudeBilgi = r;
      var ad = { sample: 'örnek cevap', apikey: 'API anahtarı', none: 'bağlı değil' }[r.backend] || r.backend;
      var t = 'Claude: ' + ad + (r.model ? ' · ' + r.model : '');
      var d = doc();
      if (d) {
        var a = d.getElementById('a8-claude-text'); if (a) a.textContent = t;
        var h = d.getElementById('hud-claude'); if (h) h.textContent = 'Claude: ' + ad;
      }
      return r;
    });
  };

  /* ---------- harita menüsü ---------- */
  function ozet(s){
    if (prog(s.id).tamam) return 'tamam';
    if (!S.istasyonAcik(s.id)) return 'kilitli';
    return dogalAcik(s.sira) ? 'sirada' : 'acik';
  }
  var DURUM_AD = { tamam: 'çalışıyor', sirada: 'sıradaki', kilitli: 'kilitli', acik: 'açık' };
  function machineIcon(renk, kilit){
    var span = el('span', 'a8-icon');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 48 40" width="48" height="40"><rect x="4" y="12" width="40" height="24" rx="4" fill="' + (renk || 'var(--panel2)') + '" stroke="var(--ink-dark)" stroke-width="3"/>' +
      '<rect x="12" y="4" width="8" height="8" fill="var(--panel2)" stroke="var(--ink-dark)" stroke-width="3"/>' +
      (kilit ? '<rect x="18" y="20" width="12" height="10" rx="2" fill="var(--muted)" stroke="var(--ink-dark)" stroke-width="2"/><path d="M21 20v-3a3 3 0 0 1 6 0v3" fill="none" stroke="var(--muted)" stroke-width="2.5"/>' :
        '<circle cx="24" cy="26" r="6" fill="var(--bg)" stroke="var(--ink-dark)" stroke-width="3"/>') + '</svg>';
    return span;
  }
  S.machineIcon = machineIcon;
  function startStation(s, from){
    var p = Q.state.ilerleme[s.id] = Q.state.ilerleme[s.id] || {};
    if (from != null && from > 0) { p.atladi = true; atlamaEtiketi(true); } else { atlamaEtiketi(false); }
    Q.state.voltaj = 100;
    Q.save.write();
    S.closeMap();
    if (Q.runner.start) Q.runner.start(s.id, from || 0);
  }
  function atlamaEtiketi(goster){
    var d = doc(); if (!d) return;
    var e = d.getElementById('hud-atlamali');
    if (goster && !e) {
      var t = d.getElementById('topbar'); if (!t) return;
      e = el('span', 'chip', 'Atlamalı mod'); e.id = 'hud-atlamali'; t.appendChild(e);
    } else if (!goster && e && e.parentNode) e.parentNode.removeChild(e);
  }
  function yanAc(){
    if (!yanEl) return;
    var bos = yanEl.querySelector('.a8-yan-bos'); if (bos) bos.style.display = 'none';
    yanEl.dataset.acik = '1';
  }
  function yanKapat(odakKart){
    if (!yanEl) return false;
    var acikti = yanEl.dataset.acik === '1';
    if (panelEl) { panelEl.textContent = ''; panelEl.style.display = 'none'; }
    if (kartPanelEl) { kartPanelEl.textContent = ''; kartPanelEl.style.display = 'none'; }
    var bos = yanEl.querySelector('.a8-yan-bos'); if (bos) bos.style.display = '';
    yanEl.dataset.acik = '0';
    if (kolek && sonSecili) { kolek.sec(null); if (odakKart && acikti) kolek.odak(sonSecili); }
    sonSecili = null;
    return acikti;
  }
  function kapatDugme(){
    var bar = el('div', 'a8-yan-bar'), k = btn('Kapat (Esc)', '', function(){ yanKapat(true); });
    k.id = 'a8-yan-kapat'; bar.appendChild(k); return bar;
  }
  function kartAc(k){
    if (!kartPanelEl) return;
    if (panelEl) { panelEl.textContent = ''; panelEl.style.display = 'none'; }
    sonSecili = k.id;
    kartPanelEl.textContent = ''; kartPanelEl.style.display = '';
    kartPanelEl.appendChild(kapatDugme());
    kartPanelEl.appendChild(Q.kartlar.detayDom(k.id));
    yanAc();
    var h = kartPanelEl.querySelector('.kd-ad'); if (h) { try { h.focus({ preventScroll: true }); } catch (e) { /* odak yok */ } }
    yanEl.scrollTop = 0;
  }
  function showPanel(s){
    if (kartPanelEl) { kartPanelEl.textContent = ''; kartPanelEl.style.display = 'none'; }
    if (kolek) kolek.sec(null);
    sonSecili = null;
    yanAc();
    panelEl.textContent = ''; panelEl.style.display = '';
    panelEl.appendChild(kapatDugme());
    var p = prog(s.id), acik = S.istasyonAcik(s.id);
    panelEl.appendChild(el('h3', '', s.sira + '. ' + s.ad));
    panelEl.appendChild(el('p', '', s.konu));
    if (s.sure) panelEl.appendChild(el('p', '', 'Süre hedefi: ' + s.sure + ' dk'));
    if (!acik) { panelEl.appendChild(el('p', '', 'Kilitli. Önceki istasyonu bitir.')); return; }
    var b = btn(p.tamam ? 'Yeniden oyna' : (p.enSon ? 'Devam et' : 'Başla'), 'primary', function(){ startStation(s, p.tamam ? 0 : (p.enSon || 0)); });
    panelEl.appendChild(b);
    if (s.engeller && s.engeller.length) {
      panelEl.appendChild(el('h4', '', 'İstediğin engele atla'));
      var l = el('ol'); l.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0';
      s.engeller.forEach(function(ob, i){
        var li = el('li'); li.appendChild(btn((i + 1) + '. ' + (ob.baslik || ob.tip), '', function(){ startStation(s, Q.runner.indexOf ? Q.runner.indexOf(s.id, ob.id) : i); }));
        l.appendChild(li);
      });
      panelEl.appendChild(l);
    }
  }
  function hataOzeti(){
    var acik = Q.state.hataDefteri.filter(function(h){ return !h.cozuldu; });
    var agirlik = { 'emin-yanlis': 3, yanlis: 2, bilinmeyen: 1, sans: 0.5 }, by = {};
    acik.forEach(function(h){
      var o = by[h.kavram] = by[h.kavram] || { kavram: h.kavram, w: 0 };
      o.w += (agirlik[h.tur] || 1) + (h.tekrar || 0);
    });
    var top = Object.keys(by).map(function(k){ return by[k]; }).sort(function(a, b){ return b.w - a.w; }).slice(0, 3);
    return { sayi: acik.length, top: top };
  }
  function kavramAd(k){ return String(k || '?').replace(/_/g, ' '); }
  var TUR_AD = { 'emin-yanlis': 'Emindin, yanlış', yanlis: 'Yanlış', bilinmeyen: 'Bilmiyordun', sans: 'Şans eseri doğru' };
  function openHata(){
    var L = getLayer(), back = backdrop(false), p = el('div', 'panel modal');
    p.style.cssText = 'width:min(520px,100%);max-height:100%;overflow:auto;padding:16px';
    p.appendChild(el('h2', '', 'Hata defteri'));
    var kayit = Q.state.hataDefteri.filter(function(h){ return !h.cozuldu; });
    if (!kayit.length) p.appendChild(el('p', '', 'Defter temiz.'));
    var renk = { 'emin-yanlis': 'var(--red)', yanlis: 'orange', bilinmeyen: 'var(--yellow)', sans: 'var(--muted)' };
    kayit.forEach(function(h){
      var r = el('div'); r.style.cssText = 'display:flex;justify-content:space-between;gap:8px;margin:6px 0';
      var c = el('span', 'chip', TUR_AD[h.tur] || String(h.tur || '?')); c.style.borderColor = renk[h.tur] || 'var(--line)'; c.style.color = renk[h.tur] || 'var(--ink)';
      r.appendChild(el('span', '', kavramAd(h.kavram) + (h.istasyon ? ' · ' + String(h.istasyon).toUpperCase() : ''))); r.appendChild(c); r.appendChild(el('span', '', (h.tekrar || 0) + '×'));
      p.appendChild(r);
    });
    var close = btn('Kapat', 'primary', function(){ if (back.parentNode) back.parentNode.removeChild(back); });
    p.appendChild(close); back.appendChild(p);
    back.addEventListener('click', function(e){ if (e.target === back) close.click(); });
    L.appendChild(back);
  }
  function renderMap(){
    if (!mapEl) return;
    var box = mapEl.firstChild, st = stList();
    box.textContent = '';
    box.className = 'panel modal fm-box';
    /* üst çubuk: başlık, üretim, ilerleme, gezinme */
    var bar = el('header', 'fm-bar');
    var bas = el('div', 'fm-bas');
    bas.appendChild(el('h2', 'fm-baslik', 'Fabrika haritası'));
    bas.appendChild(el('span', 'chip fm-uretim', 'Üretim: ' + (Q.state.fabrika.kurulu.length * 6) + ' wafer/saat'));
    bar.appendChild(bas);
    var nav = el('nav', 'fm-nav'); nav.setAttribute('aria-label', 'Harita gezinmesi');
    bar.appendChild(nav);
    box.appendChild(bar);
    /* gövde: solda şema + kartlar, sağda ayrıntı paneli */
    var cerceve = el('div', 'a8-ana-yan fm-govde'), ana = el('div', 'a8-ana');
    yanEl = el('aside', 'a8-yan'); yanEl.id = 'a8-yan'; yanEl.tabIndex = -1; yanEl.dataset.acik = '0';
    yanEl.setAttribute('aria-label', 'Ayrıntı paneli');
    yanEl.appendChild(el('div', 'a8-yan-bos', 'Bir bölüm ya da bilim insanı kartı seç; ayrıntısı burada açılır.'));
    cerceve.appendChild(ana); cerceve.appendChild(yanEl);
    box.appendChild(cerceve);
    panelEl = el('div', 'panel'); panelEl.id = 'a8-station-panel'; panelEl.style.padding = '12px'; panelEl.style.display = 'none';
    kartPanelEl = el('div', 'panel'); kartPanelEl.id = 'a8-kart-panel'; kartPanelEl.style.padding = '12px'; kartPanelEl.style.display = 'none';
    yanEl.appendChild(panelEl); yanEl.appendChild(kartPanelEl);
    var fr = Q.fabrika.render({
      st: st,
      durum: ozet,
      tamam: function(x){ return !!prog(x.id).tamam; },
      acik: function(x){ return S.istasyonAcik(x.id); },
      prog: prog,
      baslat: startStation,
      engelAtla: function(x, ob, i){ startStation(x, Q.runner.indexOf ? Q.runner.indexOf(x.id, ob.id) : i); },
      final: function(){ return (Q.final && Q.final.start && Q.final.acik && Q.final.acik()) ? function(){ Q.final.start(); } : null; },
      panel: panelEl, ust: kapatDugme,
      onSec: function(){
        if (kartPanelEl) { kartPanelEl.textContent = ''; kartPanelEl.style.display = 'none'; }
        try { if (kolek) kolek.sec(null); } catch (e) { /* eski koleksiyon yok */ }
        sonSecili = null; yanAc();
      }
    });
    bar.insertBefore(fr.header, nav);
    ana.appendChild(fr.root); listEl = fr.root;
    /* kartlar */
    var kh = el('div'); kh.id = 'a8-kartlar'; ana.appendChild(kh);
    kolek = Q.kartlar.koleksiyon(kh, { onSec: kartAc });
    sonSecili = null;
    /* gezinme düğmeleri */
    var h = hataOzeti();
    function nb(t, cls, fn, id){ var b = btn(t, cls, fn); if (id) b.id = id; nav.appendChild(b); return b; }
    nb('Ana menü', '', function(){ S.closeMap(); if (Q.hosGeldin) Q.hosGeldin(); }, 'fm-ana');
    nb('Kartlar', '', function(){ try { kh.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { kh.scrollIntoView(); } }, 'fm-kartlar');
    nb('Hata defteri (' + h.sayi + ')', '', openHata, 'a8-hata').title = h.top.length ? h.top.map(function(t){ return kavramAd(t.kavram); }).join(', ') : 'Defter temiz';
    nb('Tekrar Merkezi', 'primary', function(){ if (Q.tekrar && Q.tekrar.open) Q.tekrar.open(); }, 'a10-tekrar');
    nb('Ayarlar', '', function(){ S.open(); }, 'fm-ayarlar');
    if (Q.final && Q.final.start) {
      var fb = nb('Sınav Günü (Final)', '', function(){ Q.final.start(); }, 'a7-final');
      if (!Q.final.acik()) { fb.disabled = true; fb.title = 'Önce 9 istasyonu bitir'; fb.style.opacity = '.55'; }
    }
  }
  S.openMap = function(){
    var d = doc(); if (!d) return;
    if (mapEl) { renderMap(); return; }
    var L = getLayer(), back = backdrop(true), box = el('div', 'panel modal');
    box.style.cssText = 'width:100%;max-width:none;height:100%;margin:0;overflow:auto;padding:12px 16px;border-radius:0;box-shadow:none;display:block';
    back.appendChild(box); L.appendChild(back); mapEl = back;
    if (pauseSay === 0) { try { if (Q.runner.hold) Q.runner.hold(); } catch (e) { /* motor yok */ } }
    renderMap();
  };
  S.closeMap = function(){
    if (!mapEl) return;
    if (mapEl.parentNode) mapEl.parentNode.removeChild(mapEl);
    mapEl = null; panelEl = null; listEl = null; yanEl = null; kartPanelEl = null; kolek = null; sonSecili = null;
  };

  /* ---------- hız önerisi ve süre ---------- */
  S.checkSuggest = function(){
    var d = doc();
    if (oneriGosterildi || !d) return false;
    if (Q.state.sure.toplamSn < ESIK_SN || tamamSayisi() >= 5) return false;
    oneriGosterildi = true;
    var box = el('div', 'panel'), host = d.getElementById('toast-layer') || d.body;
    box.id = 'a8-oneri'; box.setAttribute('role', 'alert'); box.style.cssText = 'padding:12px;pointer-events:auto;margin:8px';
    box.appendChild(el('p', '', 'Süre azalıyor. Hızlı mod açılsın mı?'));
    function kapat(){ if (box.parentNode) box.parentNode.removeChild(box); }
    box.appendChild(btn('Aç', 'primary', function(){ S.set('sadecePatron', true); S.set('kilitleriAc', true); kapat(); }));
    box.appendChild(btn('Hayır', '', kapat));
    host.appendChild(box);
    return true;
  };
  function tick(){
    var d = doc();
    if (d && d.hidden) return;
    Q.state.sure.toplamSn += 1;
    if (Q.ui.hud && Q.ui.hud.setTimer) Q.ui.hud.setTimer(Q.state.sure.toplamSn);
    if (Q.state.sure.toplamSn % 15 === 0) Q.save.write();
    S.checkSuggest();
  }

  /* ---------- başlatma ---------- */
  S.init = function(){
    var d = doc();
    if (!d || inited) return;
    inited = true;
    d.addEventListener('click', function(e){
      var t = e.target && e.target.closest ? e.target.closest('#btn-settings') : null;
      if (t) { if (settingsEl) S.close(); else S.open(); }
    });
    d.addEventListener('keydown', function(e){
      var tg = e.target, tag = tg && tg.tagName;
      if (e.key === 'Escape') {
        if (settingsEl) { S.close(); e.stopPropagation(); e.preventDefault(); }
        else if (yanEl && yanEl.dataset.acik === '1') { yanKapat(true); e.stopPropagation(); e.preventDefault(); }
        return;
      }
      if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.metaKey && !e.altKey &&
          tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && !settingsEl) { S.open(); e.preventDefault(); }
    }, true);
    Q.bus.on('station:end', function(){ atlamaEtiketi(false); });
    setInterval(tick, 1000);
    S.refreshClaudeStatus();
  };
  S._tick = tick;
  if (doc()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', S.init);
    else S.init();
  }
})();
