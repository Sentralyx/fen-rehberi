// Devre Ustası – seri/paralel devre kurma bulmacası (5-7. sınıf, elektrik üniteleri)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var NS = 'http://www.w3.org/2000/svg';
  var KAYIT = 'fen-devre-ustasi-v1';
  var YOLLAR = { ana: ['M1', 'M2'], d1: ['P1a', 'P1b'], d2: ['P2a', 'P2b'] };
  var SLOTLAR = ['M1', 'M2', 'P1a', 'P1b', 'P2a', 'P2b'];
  var PIL_V = 3;
  var D = ['kapalı', 'çok sönük', 'sönük', 'normal', 'çok parlak', 'patladı'];

  /* ---------- Benzetim ---------- */
  function simule(t, pil, dal, ov) {
    function kapali(slot, p) {
      if (ov === 'kapali') return true;
      if (ov === 'acik') return false;
      if (ov && typeof ov === 'object' && ov[slot] !== undefined) return ov[slot];
      return !!p.kapali;
    }
    function yol(adlar) {
      var ok = true, R = 0;
      adlar.forEach(function (k) {
        var p = t[k];
        if (!p) { ok = false; return; }
        if (p.t === 'anahtar' && !kapali(k, p)) ok = false;
        if (p.t === 'ampul') R += 1;
      });
      return { ok: ok, R: R };
    }
    var res = { V: pil * PIL_V, I: 0, durum: {}, kisa: false, kisaTam: false, acik: false,
                akim: { ana: false, d1: false, d2: false } };
    SLOTLAR.forEach(function (k) { if (t[k] && t[k].t === 'ampul') res.durum[k] = 0; });
    var ana = yol(YOLLAR.ana);
    var dallar = [];
    if (dal) { dallar.push({ ad: 'd1', y: yol(YOLLAR.d1) }); dallar.push({ ad: 'd2', y: yol(YOLLAR.d2) }); }
    var iletenler = dallar.filter(function (d) { return d.y.ok; });
    if (!ana.ok || (dal && !iletenler.length)) { res.acik = true; return res; }
    var Rpar = 0;
    if (dal) {
      var kisaKol = iletenler.some(function (d) { return d.y.R === 0; });
      res.kisa = kisaKol;
      if (!kisaKol) Rpar = 1 / iletenler.reduce(function (s, d) { return s + 1 / d.y.R; }, 0);
    }
    var Rt = ana.R + Rpar;
    if (Rt === 0) { res.kisaTam = true; res.kisa = true; return res; }
    var I = res.V / Rt, Vpar = I * Rpar;
    res.I = I;
    res.akim.ana = true;
    function ampulYaz(adlar, akim) {
      adlar.forEach(function (k) {
        if (t[k] && t[k].t === 'ampul') {
          var r = (akim * akim) / (PIL_V * PIL_V);
          var d = r <= 1e-9 ? 0 : r < 0.15 ? 1 : r < 0.6 ? 2 : r <= 1.3 ? 3 : r < 2.5 ? 4 : 5;
          res.durum[k] = d;
        }
      });
    }
    ampulYaz(YOLLAR.ana, I);
    dallar.forEach(function (d) {
      if (!d.y.ok) return;
      var ik = d.y.R === 0 ? 0 : Vpar / d.y.R;
      if (res.kisa && d.y.R === 0) { res.akim[d.ad] = true; } else if (ik > 1e-9) { res.akim[d.ad] = true; }
      ampulYaz(YOLLAR[d.ad], ik);
    });
    return res;
  }
  function ampulDurumlari(res) { return Object.keys(res.durum).map(function (k) { return res.durum[k]; }); }
  function say(t, tur) { return SLOTLAR.filter(function (k) { return t[k] && t[k].t === tur; }).length; }
  function hepsi(res, f) { var a = ampulDurumlari(res); return a.length > 0 && a.every(f); }

  /* ---------- Görevler ---------- */
  var SEVIYELER = [
    { ad: 'Işığı yak', hikaye: 'Pilin ve bir ampulün var. Ampulün yanması için ne gerekir?',
      hedef: 'Ampulü normal parlaklıkta yak.', pil: 1, pilAyar: false, dal: false,
      env: { ampul: 1, anahtar: 0, kablo: 9 }, bas: {},
      ipucu: 'Akım pilin bir ucundan çıkıp ampulden geçerek diğer uca dönmeli. Boş kalan kutular devreyi keser; boşlukları kabloyla doldur.',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return say(t, 'ampul') >= 1 && hepsi(r, function (d) { return d === 3; }); },
      acik: 'Akımın geçebilmesi için devrenin kapalı olması gerekir: pilin bir ucundan çıkan akım ampulden geçip diğer uca dönmelidir. Devrede bir kopukluk varsa akım geçmez.' },
    { ad: 'Anahtarlı lamba', hikaye: 'Işığı istediğin zaman açıp kapatmak istiyorsun.',
      hedef: 'Anahtar kapalıyken ampul yansın, açıkken sönsün. (Anahtarı tıklayarak çevir.)', pil: 1, pilAyar: false, dal: false,
      env: { ampul: 1, anahtar: 1, kablo: 9 }, bas: {},
      ipucu: 'Anahtarı devreye ampulle aynı hatta yerleştir. Anahtar aracı seçiliyken anahtara tıklarsan açılıp kapanır.',
      kontrol: function (t, p, dal) {
        return say(t, 'ampul') >= 1 && say(t, 'anahtar') >= 1 &&
          hepsi(simule(t, p, dal, 'kapali'), function (d) { return d === 3; }) &&
          hepsi(simule(t, p, dal, 'acik'), function (d) { return d === 0; });
      },
      acik: 'Anahtar devreyi açıp kapatır. Açıkken devrede kopukluk oluşur ve akım geçmez; kapalıyken akım dolaşır ve ampul yanar.' },
    { ad: 'Kısa devreyi bul', hikaye: 'Pil çok ısınıyor! Birisi ampullerden birinin yanına doğrudan bir tel bağlamış.',
      hedef: 'Kısa devreyi gider ve iki ampulün de yanmasını sağla.', pil: 1, pilAyar: false, dal: true,
      env: { ampul: 0, anahtar: 0, kablo: 9 },
      bas: { M1: { t: 'ampul' }, M2: { t: 'kablo' }, P1a: { t: 'kablo' }, P1b: { t: 'kablo' }, P2a: { t: 'ampul' }, P2b: { t: 'kablo' } },
      ipucu: 'Akım, yalnızca tellerden oluşan kolu tercih eder. Hangi kol ampulü atlıyor?',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return !r.kisa && say(t, 'ampul') === 2 && hepsi(r, function (d) { return d >= 1 && d <= 4; }); },
      acik: 'Ampulle paralel bağlı dirençsiz bir tel (yalnızca kablolardan oluşan kol) akımın tamamını kendi üzerinden geçirir. Ampul yanmaz, devre akımı çok artar, pil ısınır ve çabuk biter. Buna kısa devre denir.' },
    { ad: 'Ampulleri seri bağla', hikaye: 'İki ampulü arka arkaya, aynı hatta bağla.',
      hedef: 'İki ampulü de yak. Parlaklıklarını tek ampullü devreyle karşılaştır.', pil: 1, pilAyar: false, dal: false,
      env: { ampul: 2, anahtar: 0, kablo: 9 }, bas: {},
      ipucu: 'İki ampulü ana hattaki iki kutuya yerleştir.',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return say(t, 'ampul') === 2 && hepsi(r, function (d) { return d >= 1 && d <= 4; }); },
      acik: 'Seri bağlı ampullerin toplam direnci artar, devreden geçen akım azalır. Aynı akım iki ampulden de geçtiği için ikisi de tek ampule göre sönük yanar. Seri devrede bir ampul sökülürse diğeri de söner.' },
    { ad: 'Ampulleri paralel bağla', hikaye: 'Bu kez iki ampulün de tam parlak yanmasını istiyorsun.',
      hedef: 'İki ampulü de normal parlaklıkta yak.', pil: 1, pilAyar: false, dal: true,
      env: { ampul: 2, anahtar: 0, kablo: 9 }, bas: {},
      ipucu: 'Ampulleri aynı hatta değil, yan yana iki ayrı kola yerleştir. Ana hatta (üstteki iki kutu) kablo kullan.',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return say(t, 'ampul') === 2 && !r.kisa && hepsi(r, function (d) { return d === 3; }); },
      acik: 'Paralel bağlı her ampule pilin gerilimi uygulanır; bu yüzden iki ampul de tek ampul kadar parlak yanar. Karşılığında pilden çekilen toplam akım artar ve pil daha çabuk tükenir.' },
    { ad: 'Bağımsız anahtarlar', hikaye: 'Her ampulün kendi anahtarı olsun; biri kapanınca diğeri yanmaya devam etsin.',
      hedef: 'Her kola bir ampul ve bir anahtar koy. Biri açıkken diğeri tam parlak yanmalı.', pil: 1, pilAyar: false, dal: true,
      env: { ampul: 2, anahtar: 2, kablo: 9 }, bas: {},
      ipucu: 'Üst kola ampul ve anahtar, alt kola da ampul ve anahtar koy. Ana hatta kablo kullan, anahtarları kapat.',
      kontrol: function (t, p, dal) {
        function say2(adlar, tur) { return adlar.filter(function (k) { return t[k] && t[k].t === tur; }).length; }
        if (say2(YOLLAR.d1, 'ampul') !== 1 || say2(YOLLAR.d2, 'ampul') !== 1 || say2(YOLLAR.d1, 'anahtar') !== 1 || say2(YOLLAR.d2, 'anahtar') !== 1) return false;
        function bul(adlar, tur) { return adlar.filter(function (k) { return t[k].t === tur; })[0]; }
        var a1 = bul(YOLLAR.d1, 'ampul'), a2 = bul(YOLLAR.d2, 'ampul'), s1 = bul(YOLLAR.d1, 'anahtar'), s2 = bul(YOLLAR.d2, 'anahtar');
        var hep = {}; hep[s1] = true; hep[s2] = true;
        var r0 = simule(t, p, dal, hep);
        var o1 = {}; o1[s1] = false; o1[s2] = true;
        var r1 = simule(t, p, dal, o1);
        var o2 = {}; o2[s1] = true; o2[s2] = false;
        var r2 = simule(t, p, dal, o2);
        return r0.durum[a1] === 3 && r0.durum[a2] === 3 && r1.durum[a1] === 0 && r1.durum[a2] === 3 && r2.durum[a2] === 0 && r2.durum[a1] === 3;
      },
      acik: 'Paralel kollar birbirinden bağımsızdır: bir koldaki anahtar açılınca yalnızca o koldaki ampul söner, diğer kol çalışmaya devam eder. Evlerdeki lambaların paralel bağlanmasının nedeni budur.' },
    { ad: 'Pil sayısını ayarla', hikaye: 'İki ampulü seri bağladın ama sönük yanıyorlar. Daha fazla pil kullanabilirsin.',
      hedef: 'Seri bağlı iki ampulü normal parlaklıkta yak. (Pil sayısını sen seç.)', pil: 1, pilAyar: true, dal: false,
      env: { ampul: 2, anahtar: 0, kablo: 9 }, bas: {},
      ipucu: 'Seri bağlı piller gerilimi toplar. İki ampul arasında paylaşılan gerilimi düşün: her ampul kaç volt istiyor?',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return say(t, 'ampul') === 2 && hepsi(r, function (d) { return d === 3; }); },
      acik: 'Seri bağlı piller gerilimi toplar (2 pil = 6 V). Bu gerilim iki seri ampul arasında paylaşılır ve her birine 3 V düşer; böylece ikisi de tek pilli tek ampul kadar parlak yanar.' },
    { ad: 'Üç ampul', hikaye: 'Üç ampulün hepsini normal parlaklıkta yakmak istiyorsun. Çok pil kullanma, ampul patlamasın!',
      hedef: 'Üç ampulü de normal parlaklıkta yak. Hiçbiri patlamasın.', pil: 1, pilAyar: true, dal: true,
      env: { ampul: 3, anahtar: 0, kablo: 9 }, bas: {},
      ipucu: 'Seri bağlı ampul sayısı ile pil sayısı arasında bir ilişki var. Üç ampulü tek hatta sığdırmak için üst kolu da kullan, alt kolu boş bırak.',
      kontrol: function (t, p, dal) { var r = simule(t, p, dal); return say(t, 'ampul') === 3 && !r.kisa && hepsi(r, function (d) { return d === 3; }); },
      acik: 'Seri bağlı her ampul için bir pil gerekir: gerilim ampuller arasında paylaşılır. 3 pil (9 V) ile üç seri ampulün her birine 3 V düşer ve hepsi normal parlak yanar.' }
  ];
  var SERBEST = { ad: 'Serbest mod', hikaye: 'İstediğin gibi devre kur ve dene.', hedef: '', pil: 1, pilAyar: true, dal: true,
    env: { ampul: 99, anahtar: 99, kablo: 99 }, bas: {}, serbest: true };

  /* ---------- Durum ---------- */
  var kayit = {};
  try { kayit = JSON.parse(localStorage.getItem(KAYIT) || '{}'); } catch (e) { kayit = {}; }
  kayit.bitti = kayit.bitti || [];
  function kaydet() { try { localStorage.setItem(KAYIT, JSON.stringify(kayit)); } catch (e) {} }

  var sev = 0, seviye = SEVIYELER[0], tahta = {}, pil = 1, arac = 'dokun', ipucuAcik = false;

  function yukle(i) {
    sev = i;
    seviye = i === 'serbest' ? SERBEST : SEVIYELER[i];
    tahta = {};
    Object.keys(seviye.bas).forEach(function (k) { tahta[k] = { t: seviye.bas[k].t, kapali: false }; });
    pil = seviye.pil;
    arac = 'dokun';
    ipucuAcik = false;
    cizUI();
  }
  function kalan(tur) { return seviye.env[tur] - say(tahta, tur); }

  /* ---------- Arayüz ---------- */
  function e(tag, attrs, ic) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (a) {
      if (a === 'class') n.className = attrs[a]; else if (a === 'html') n.innerHTML = attrs[a]; else n.setAttribute(a, attrs[a]);
    });
    if (ic) n.textContent = ic;
    return n;
  }
  function sv(tag, attrs, ust) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (a) { n.setAttribute(a, attrs[a]); });
    if (ust) ust.appendChild(n);
    return n;
  }

  var el = {};
  function cizUI() {
    kok.innerHTML = '';
    var chips = e('div', { class: 'oy-chips' });
    SEVIYELER.forEach(function (s, i) {
      var tamam = kayit.bitti.indexOf(i) >= 0;
      var b = e('button', { type: 'button', class: 'oy-chip' + (sev === i ? ' aktif' : '') + (tamam ? ' bitti' : '') });
      b.textContent = (tamam ? '✓ ' : '') + (i + 1);
      b.title = s.ad;
      b.addEventListener('click', function () { yukle(i); });
      chips.appendChild(b);
    });
    var bs = e('button', { type: 'button', class: 'oy-chip' + (sev === 'serbest' ? ' aktif' : '') }, '🧪 Serbest');
    bs.addEventListener('click', function () { yukle('serbest'); });
    chips.appendChild(bs);
    kok.appendChild(chips);

    var gorev = e('div', { class: 'oy-gorev' });
    gorev.appendChild(e('h2', {}, sev === 'serbest' ? '🧪 Serbest mod' : 'Görev ' + (sev + 1) + ': ' + seviye.ad));
    gorev.appendChild(e('p', { class: 'oy-hikaye' }, seviye.hikaye));
    if (seviye.hedef) gorev.appendChild(e('p', { class: 'oy-hedef' }, '🎯 ' + seviye.hedef));
    el.hedefDurum = e('div', { class: 'oy-hedef-durum' });
    if (!seviye.serbest) gorev.appendChild(el.hedefDurum);
    kok.appendChild(gorev);

    el.arac = e('div', { class: 'oy-araclar' });
    kok.appendChild(el.arac);

    var sahne = e('div', { class: 'oy-sahne' });
    el.svg = sv('svg', { viewBox: '0 0 700 380', class: 'devre-svg', role: 'img', 'aria-label': 'Elektrik devresi kurma alanı' });
    sahne.appendChild(el.svg);
    kok.appendChild(sahne);
    el.durum = e('div', { class: 'oy-durum', 'aria-live': 'polite' });
    kok.appendChild(el.durum);
    el.sonuc = e('div', { class: 'oy-sonuc' });
    kok.appendChild(el.sonuc);
    cizAraclar();
    cizDevre();
  }

  function cizAraclar() {
    el.arac.innerHTML = '';
    var liste = [
      ['dokun', '👆', 'Anahtarı çevir'],
      ['ampul', '💡', 'Ampul'],
      ['anahtar', '⏻', 'Anahtar'],
      ['kablo', '➖', 'Kablo'],
      ['sil', '🗑️', 'Sil']
    ];
    liste.forEach(function (a) {
      var parca = a[0] === 'ampul' || a[0] === 'anahtar' || a[0] === 'kablo';
      if (parca && seviye.env[a[0]] === 0) return;
      var k = parca ? kalan(a[0]) : null;
      var b = e('button', { type: 'button', class: 'oy-arac' + (arac === a[0] ? ' aktif' : '') + (parca && k <= 0 && arac !== a[0] ? ' tukendi' : '') });
      b.innerHTML = '<span class="ik">' + a[1] + '</span><span>' + a[2] + '</span>' +
        (parca && seviye.env[a[0]] < 50 && a[0] !== 'kablo' ? '<em>' + Math.max(k, 0) + '</em>' : '');
      b.addEventListener('click', function () { arac = a[0]; cizAraclar(); });
      el.arac.appendChild(b);
    });
    if (seviye.pilAyar) {
      var pk = e('div', { class: 'oy-pil' });
      pk.appendChild(e('span', {}, '🔋 Pil sayısı:'));
      [1, 2, 3].forEach(function (n) {
        var b = e('button', { type: 'button', class: 'oy-pilbtn' + (pil === n ? ' aktif' : '') }, String(n));
        b.addEventListener('click', function () { pil = n; cizAraclar(); cizDevre(); });
        pk.appendChild(b);
      });
      el.arac.appendChild(pk);
    }
    var sf = e('button', { type: 'button', class: 'oy-arac oy-sifir' }, '↺ Sıfırla');
    sf.addEventListener('click', function () { yukle(sev); });
    el.arac.appendChild(sf);
  }

  /* ---------- Devre çizimi ---------- */
  var KONUM = {
    d0: { M1: [190, 60], M2: [350, 60] },
    d1: { M1: [150, 60], M2: [270, 60], P1a: [470, 130], P1b: [560, 130], P2a: [470, 230], P2b: [560, 230] }
  };
  function cizDevre() {
    var s = el.svg, dal = seviye.dal, kon = dal ? KONUM.d1 : KONUM.d0;
    s.innerHTML = '';
    var res = simule(tahta, pil, dal);

    function tel(pts, grup) {
      var akim = res.akim[grup];
      var d = 'M' + pts.map(function (p) { return p.join(' '); }).join(' L');
      sv('path', { d: d, class: 'kb' + (akim ? ' akim' : '') }, s);
      if (akim) sv('path', { d: d, class: 'kb-nokta' }, s);
    }
    var X0 = 60, XR = dal ? 620 : 500, YT = 60, YB = 330;
    s.setAttribute('viewBox', dal ? '20 10 640 350' : '20 10 520 350');
    if (!dal) {
      tel([[X0, 195], [X0, YT], [XR, YT], [XR, YB], [X0, YB], [X0, 195]], 'ana');
    } else {
      var XA = 380;
      tel([[X0, 195], [X0, YT], [XA, YT]], 'ana');
      tel([[XR, 130], [XR, YB], [X0, YB], [X0, 195]], 'ana');
      tel([[XA, YT], [XA, 130], [XR, 130]], 'd1');
      tel([[XA, 130], [XA, 230], [XR, 230]], 'd2');
      tel([[XR, 130], [XR, 230]], 'd2');
    }
    // Pil
    var h = 34 * pil + 18, y0 = 195 - h / 2;
    var g = sv('g', {}, s);
    sv('rect', { x: X0 - 30, y: y0, width: 60, height: h, rx: 10, class: 'pil-kutu' }, g);
    for (var i = 1; i < pil; i++) sv('line', { x1: X0 - 30, x2: X0 + 30, y1: y0 + 9 + 34 * i, y2: y0 + 9 + 34 * i, class: 'pil-cizgi' }, g);
    var t1 = sv('text', { x: X0, y: y0 + 15, class: 'pil-yazi' }, g); t1.textContent = '+';
    var t2 = sv('text', { x: X0, y: y0 + h - 5, class: 'pil-yazi' }, g); t2.textContent = '−';
    var tv = sv('text', { x: X0 + 40, y: 200, class: 'pil-v' }, g); tv.textContent = (pil * PIL_V) + ' V';

    // Kutular
    var kullan = dal ? SLOTLAR : ['M1', 'M2'];
    kullan.forEach(function (k) {
      var c = kon[k], cx = c[0], cy = c[1];
      var p = tahta[k];
      var grup = k[0] === 'M' ? 'ana' : (k.indexOf('P1') === 0 ? 'd1' : 'd2');
      var gg = sv('g', { class: 'slot', 'data-slot': k, tabindex: 0, role: 'button', 'aria-label': 'Kutu ' + k }, s);
      sv('rect', { x: cx - 36, y: cy - 30, width: 72, height: 60, rx: 12, class: 'slot-kutu' + (p ? '' : ' bos') }, gg);
      if (!p) {
        var pl = sv('text', { x: cx, y: cy + 8, class: 'slot-arti' }, gg); pl.textContent = '+';
        return;
      }
      var akim = res.akim[grup];
      var stub = function (x1, x2) { sv('line', { x1: x1, x2: x2, y1: cy, y2: cy, class: 'kb ic' + (akim ? ' akim' : '') }, gg); };
      if (p.t === 'kablo') { stub(cx - 36, cx + 36); }
      if (p.t === 'ampul') {
        stub(cx - 36, cx - 19); stub(cx + 19, cx + 36);
        var d = res.durum[k] || 0;
        var glow = [0, 0.35, 0.6, 0.9, 1, 0][d];
        if (d >= 1 && d <= 4) sv('circle', { cx: cx, cy: cy, r: 24 + d * 3, fill: '#fde047', 'fill-opacity': 0.25 * glow + 0.05 }, gg);
        sv('circle', { cx: cx, cy: cy, r: 19, class: 'ampul-cam', fill: d === 5 ? '#475569' : d === 0 ? '#e2e8f0' : '#fde047', 'fill-opacity': d === 0 || d === 5 ? 1 : 0.35 + 0.65 * glow }, gg);
        sv('path', { d: 'M' + (cx - 9) + ' ' + (cy + 8) + ' L' + (cx - 5) + ' ' + (cy - 3) + ' L' + cx + ' ' + (cy + 5) + ' L' + (cx + 5) + ' ' + (cy - 3) + ' L' + (cx + 9) + ' ' + (cy + 8), class: 'ampul-tel' }, gg);
        if (d === 5) { var x = sv('text', { x: cx, y: cy + 7, class: 'ampul-x' }, gg); x.textContent = '✖'; }
        var et = sv('text', { x: cx, y: cy + 46, class: 'ampul-et' }, gg);
        et.textContent = D[d];
      }
      if (p.t === 'anahtar') {
        stub(cx - 36, cx - 20); stub(cx + 20, cx + 36);
        sv('circle', { cx: cx - 20, cy: cy, r: 4, class: 'ank-nokta' }, gg);
        sv('circle', { cx: cx + 20, cy: cy, r: 4, class: 'ank-nokta' }, gg);
        if (p.kapali) sv('line', { x1: cx - 20, y1: cy, x2: cx + 20, y2: cy, class: 'ank-kol' + (akim ? ' akim' : '') }, gg);
        else sv('line', { x1: cx - 20, y1: cy, x2: cx + 12, y2: cy - 24, class: 'ank-kol' }, gg);
        var at = sv('text', { x: cx, y: cy + 46, class: 'ampul-et' }, gg);
        at.textContent = p.kapali ? 'kapalı' : 'açık';
      }
    });
    el.svg.querySelectorAll('.slot').forEach(function (n) {
      n.addEventListener('click', function () { tikla(n.getAttribute('data-slot')); });
      n.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tikla(n.getAttribute('data-slot')); } });
    });
    durumYaz(res);
    hedefKontrol();
  }

  function durumYaz(res) {
    var mesaj = '', tur = '';
    var patlayan = Object.keys(res.durum).some(function (k) { return res.durum[k] === 5; });
    if (res.kisaTam) { mesaj = '⚠️ Kısa devre! Akım yalnızca tellerden geçiyor, pil çok ısınır.'; tur = 'tehlike'; }
    else if (res.kisa) { mesaj = '⚠️ Kısa devre! Bir kol yalnızca tellerden oluşuyor; akım ampulleri atlayıp o koldan geçiyor.'; tur = 'tehlike'; }
    else if (patlayan) { mesaj = '💥 Ampul patladı! Üzerine düşen gerilim ampulün dayanabileceğinden (3 V) çok fazla.'; tur = 'tehlike'; }
    else if (res.acik) { mesaj = 'Devre açık: akım geçmiyor. Bir kopukluk (boş kutu ya da açık anahtar) var.'; tur = 'bilgi'; }
    else { mesaj = '✅ Devre kapalı: akım dolaşıyor.'; tur = 'iyi'; }
    el.durum.className = 'oy-durum ' + tur;
    el.durum.textContent = mesaj;
  }

  function tikla(k) {
    var p = tahta[k];
    if (arac === 'sil') { delete tahta[k]; }
    else if (arac === 'dokun') { if (p && p.t === 'anahtar') p.kapali = !p.kapali; }
    else if (p && p.t === arac) { if (p.t === 'anahtar') p.kapali = !p.kapali; else delete tahta[k]; }
    else {
      if (kalan(arac) <= 0) { el.durum.textContent = 'Bu parçadan kalmadı. Önce kullandığın birini sil.'; el.durum.className = 'oy-durum bilgi'; return; }
      tahta[k] = { t: arac, kapali: false };
    }
    cizAraclar();
    cizDevre();
  }

  function hedefKontrol() {
    if (seviye.serbest) return;
    var ok = seviye.kontrol(tahta, pil, seviye.dal);
    el.hedefDurum.className = 'oy-hedef-durum' + (ok ? ' tamam' : '');
    el.hedefDurum.innerHTML = ok ? '✅ Hedef tamam!' : '⏳ Hedef henüz tamamlanmadı. ' +
      '<button type="button" class="oy-ipucu">💡 İpucu</button>' + (ipucuAcik ? '<span class="oy-ipucu-metin">' + seviye.ipucu + '</span>' : '');
    var ib = el.hedefDurum.querySelector('.oy-ipucu');
    if (ib) ib.addEventListener('click', function () { ipucuAcik = true; hedefKontrol(); });
    el.sonuc.innerHTML = '';
    if (ok) {
      if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
      var chip = kok.querySelectorAll('.oy-chip')[sev];
      if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
      var kutu = e('div', { class: 'oy-basari' });
      kutu.appendChild(e('h3', {}, '🎉 Harika, görev tamamlandı!'));
      kutu.appendChild(e('p', { html: '<strong>Neden böyle oldu?</strong> ' + seviye.acik }));
      var son = sev === SEVIYELER.length - 1;
      var b = e('button', { type: 'button', class: 'btn btn-sari' }, son ? '🧪 Serbest moda geç' : 'Sonraki görev ▶');
      b.addEventListener('click', function () { yukle(son ? 'serbest' : sev + 1); });
      kutu.appendChild(b);
      el.sonuc.appendChild(kutu);
    }
  }

  yukle(0);
})();
