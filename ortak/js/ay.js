// Ay ve Dünya – Ay'ın evreleri ile Güneş/Ay tutulmasını keşfet (5-6. sınıf, uzay üniteleri)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var NS = 'http://www.w3.org/2000/svg';
  var KAYIT = 'fen-ay-ve-dunya-v1';
  var EX = 330, EY = 210, R = 130; // Dünya merkezi ve Ay yörünge yarıçapı

  var GOREVLER = [
    { ad: 'Yeni Ay', a: 0, tol: 12, gorev: 'Ay’ı sürükleyerek <strong>Yeni Ay</strong> evresine getir ve onayla.', ad2: 'Yeni Ay',
      acik: 'Yeni Ay’da Ay, Güneş ile Dünya arasındadır. Ay’ın Güneş’i gören yüzü aydınlıktır ama biz karanlık yüzünü görürüz; bu yüzden Ay gökyüzünde görünmez. Yeni Ay’dan bir sonraki Yeni Ay’a yaklaşık 29,5 gün geçer.' },
    { ad: 'İlk dördün', a: 90, tol: 12, gorev: 'Ay’ı <strong>İlk dördün</strong> evresine getir ve onayla.', ad2: 'İlk dördün',
      acik: 'İlk dördünde Dünya’dan Ay’ın yarısı (sağ yarısı) aydınlık görünür. Ay, Dünya çevresindeki yolculuğunun dörtte birini tamamlamıştır ve her gün biraz daha büyüyerek görünür.' },
    { ad: 'Dolunay', a: 180, tol: 12, gorev: 'Ay’ı <strong>Dolunay</strong> evresine getir ve onayla.', ad2: 'Dolunay',
      acik: 'Dolunayda Dünya, Güneş ile Ay arasındadır. Ay’ın Güneş’i gören aydınlık yüzü tamamen Dünya’ya dönüktür; bu yüzden Ay’ın tüm yüzü parlak görünür.' },
    { ad: 'Son dördün', a: 270, tol: 12, gorev: 'Ay’ı <strong>Son dördün</strong> evresine getir ve onayla.', ad2: 'Son dördün',
      acik: 'Son dördünde yine Ay’ın yarısı aydınlık görünür, ancak bu kez sol yarısı. Ay küçülmektedir ve birkaç gün sonra tekrar Yeni Ay olacaktır.' },
    { ad: 'Güneş tutulması', a: 0, tol: 4, gorev: 'Ay’ı öyle yerleştir ki <strong>Güneş tutulması</strong> olsun. Onayla.', ad2: 'Güneş tutulması',
      acik: 'Güneş tutulması, Ay Güneş ile Dünya arasına girip üçü aynı doğrultuya geldiğinde olur. Ay’ın gölgesi Dünya’nın küçük bir bölgesine düşer; orada Güneş kısmen ya da tamamen örtülür. Güneş tutulması yalnızca Yeni Ay evresinde olabilir.' },
    { ad: 'Ay tutulması', a: 180, tol: 4, gorev: 'Ay’ı öyle yerleştir ki <strong>Ay tutulması</strong> olsun. Onayla.', ad2: 'Ay tutulması',
      acik: 'Ay tutulması, Dünya Güneş ile Ay arasına girip üçü aynı doğrultuya geldiğinde olur. Ay, Dünya’nın gölgesine girer ve kızıl bir renk alır. Ay tutulması yalnızca Dolunay evresinde olabilir.' },
    { ad: 'Neden her ay olmuyor?', soru: true,
      gorev: 'Her ay bir Yeni Ay ve bir Dolunay olur, ama her ay tutulma olmaz. Neden?',
      sec: ['Ay’ın yörüngesi, Dünya’nın Güneş çevresindeki yörüngesine göre yaklaşık 5° eğiktir; bu yüzden üçü çoğu ay tam aynı doğrultuya gelmez',
            'Ay her ay Dünya’dan çok uzaklaşıp görünmez olur',
            'Tutulmalar yalnızca belirli mevsimlerde olur',
            'Güneş her ay yön değiştirir'],
      acik: 'Ay’ın yörünge düzlemi, Dünya’nın Güneş çevresindeki yörünge düzlemine yaklaşık 5° eğiktir. Bu yüzden Yeni Ay’da Ay çoğu zaman Güneş’in biraz üstünden ya da altından geçer, gölgesi Dünya’yı ıskalar. Tutulma yalnızca üç gök cisminin aynı doğrultuya geldiği nadir anlarda olur.' }
  ];

  var kayit = {};
  try { kayit = JSON.parse(localStorage.getItem(KAYIT) || '{}'); } catch (e) { kayit = {}; }
  kayit.bitti = kayit.bitti || [];
  function kaydet() { try { localStorage.setItem(KAYIT, JSON.stringify(kayit)); } catch (e) {} }

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
  function norm(a) { a = a % 360; return a < 0 ? a + 360 : a; }
  function fark(a, b) { var d = Math.abs(norm(a) - norm(b)); return d > 180 ? 360 - d : d; }
  function evreAdi(a) {
    a = norm(a);
    if (a <= 12 || a >= 348) return 'Yeni Ay';
    if (a < 78) return 'Hilal (büyüyen)';
    if (a <= 102) return 'İlk dördün';
    if (a < 168) return 'Şişkin Ay (büyüyen)';
    if (a <= 192) return 'Dolunay';
    if (a < 258) return 'Şişkin Ay (küçülen)';
    if (a <= 282) return 'Son dördün';
    return 'Hilal (küçülen)';
  }

  var sev = 0, gorev = GOREVLER[0], a = 60, oto = false, el = {}, bitti = false, rafId = 0, sonZ = 0;

  function yukle(i) {
    sev = i; gorev = i === 'serbest' ? null : GOREVLER[i];
    a = i === 'serbest' ? 60 : (gorev && gorev.a === 90 ? 200 : 60);
    if (gorev && gorev.a === 0) a = 140;
    oto = false; bitti = false;
    cizUI();
  }

  /* ---------- Arayüz ---------- */
  function cizUI() {
    cancelAnimationFrame(rafId);
    kok.innerHTML = '';
    var chips = e('div', { class: 'oy-chips' });
    GOREVLER.forEach(function (g, i) {
      var tamam = kayit.bitti.indexOf(i) >= 0;
      var b = e('button', { type: 'button', class: 'oy-chip' + (sev === i ? ' aktif' : '') + (tamam ? ' bitti' : '') }, (tamam ? '✓ ' : '') + (i + 1));
      b.title = g.ad;
      b.addEventListener('click', function () { yukle(i); });
      chips.appendChild(b);
    });
    var bs = e('button', { type: 'button', class: 'oy-chip' + (sev === 'serbest' ? ' aktif' : '') }, '🧪 Serbest');
    bs.addEventListener('click', function () { yukle('serbest'); });
    chips.appendChild(bs);
    kok.appendChild(chips);

    var gv = e('div', { class: 'oy-gorev' });
    gv.appendChild(e('h2', {}, gorev ? 'Görev ' + (sev + 1) + ': ' + gorev.ad : '🧪 Serbest mod'));
    gv.appendChild(e('p', { class: 'oy-hedef', html: '🎯 ' + (gorev ? gorev.gorev : 'Ay’ı sürükle ya da kaydırıcıyı kullan; evrelerin ve tutulmaların nasıl oluştuğunu izle.') }));
    kok.appendChild(gv);

    if (gorev && gorev.soru) { soruGoster(); return; }

    var alan = e('div', { class: 'ay-alan' });
    var sol = e('div', { class: 'oy-sahne ay-sol' });
    el.svg = sv('svg', { viewBox: '0 0 600 420', class: 'ay-svg', role: 'img', 'aria-label': 'Güneş, Dünya ve Ay’ın üstten görünüşü' });
    sol.appendChild(el.svg);
    alan.appendChild(sol);
    var sag = e('div', { class: 'ay-sag' });
    sag.appendChild(e('div', { class: 'hal-gbaslik' }, '🔭 Dünya’dan bakınca Ay'));
    el.gor = sv('svg', { viewBox: '0 0 200 200', class: 'ay-gor', role: 'img', 'aria-label': 'Dünya’dan görünen Ay' });
    sag.appendChild(el.gor);
    el.ad = e('div', { class: 'ay-evre' });
    sag.appendChild(el.ad);
    alan.appendChild(sag);
    kok.appendChild(alan);

    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '🌙 Ay’ın konumu'));
    el.sl = e('input', { type: 'range', min: 0, max: 359, value: Math.round(a), class: 'hal-sl', 'aria-label': 'Ay’ın yörüngedeki konumu' });
    el.sl.addEventListener('input', function () { a = +el.sl.value; oto = false; el.otoBtn.textContent = '▶ Otomatik'; ciz(); });
    ctl.appendChild(el.sl);
    el.otoBtn = e('button', { type: 'button', class: 'oy-arac' }, '▶ Otomatik');
    el.otoBtn.addEventListener('click', function () { oto = !oto; el.otoBtn.textContent = oto ? '⏸ Durdur' : '▶ Otomatik'; });
    ctl.appendChild(el.otoBtn);
    if (gorev) {
      var on = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '✔ Onayla');
      on.addEventListener('click', onayla);
      ctl.appendChild(on);
    }
    kok.appendChild(ctl);
    el.sonuc = e('div', { class: 'oy-sonuc' });
    kok.appendChild(el.sonuc);

    kur();
    ciz();
    sonZ = performance.now();
    rafId = requestAnimationFrame(dongu);
  }

  function dongu(z) {
    var dt = Math.min(0.2, (z - sonZ) / 1000); sonZ = z;
    if (oto) { a = norm(a + 40 * dt); el.sl.value = Math.round(a); ciz(); }
    rafId = requestAnimationFrame(dongu);
  }

  /* ---------- Çizim ---------- */
  function kur() {
    var s = el.svg;
    var d = sv('defs', {}, s);
    var g = sv('linearGradient', { id: 'golge', x1: 0, x2: 1, y1: 0, y2: 0 }, d);
    sv('stop', { offset: 0, 'stop-color': '#0f172a', 'stop-opacity': 0.55 }, g);
    sv('stop', { offset: 1, 'stop-color': '#0f172a', 'stop-opacity': 0.05 }, g);
    sv('rect', { x: 0, y: 0, width: 600, height: 420, rx: 16, fill: '#0f172a' }, s);
    // ışınlar
    for (var y = 60; y <= 360; y += 50) sv('line', { x1: 112, y1: y, x2: 580, y2: y, stroke: '#fde68a', 'stroke-opacity': 0.18, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, s);
    sv('circle', { cx: 60, cy: EY, r: 44, fill: '#facc15' }, s);
    sv('circle', { cx: 60, cy: EY, r: 56, fill: '#facc15', 'fill-opacity': 0.2 }, s);
    sv('text', { x: 60, y: EY + 78, 'text-anchor': 'middle', fill: '#fde68a', 'font-size': 13, 'font-weight': 800 }, s).textContent = 'Güneş';
    sv('circle', { cx: EX, cy: EY, r: R, fill: 'none', stroke: '#475569', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, s);
    // Dünya'nın gölgesi (sağda)
    sv('rect', { x: EX, y: EY - 26, width: 250, height: 52, fill: 'url(#golge)' }, s);
    el.aygolge = sv('polygon', { fill: '#000', 'fill-opacity': 0.45 }, s);
    var dunya = sv('g', {}, s);
    sv('circle', { cx: EX, cy: EY, r: 26, fill: '#3b82f6' }, dunya);
    sv('path', { d: 'M' + (EX - 14) + ' ' + (EY - 8) + ' q8 -12 16 -4 q4 10 -6 14 q-10 4 -10 -10 z M' + (EX + 6) + ' ' + (EY + 6) + ' q10 -4 12 6 q-6 8 -12 -6 z', fill: '#22c55e' }, dunya);
    sv('text', { x: EX, y: EY + 46, 'text-anchor': 'middle', fill: '#bfdbfe', 'font-size': 13, 'font-weight': 800 }, s).textContent = 'Dünya';
    el.ay = sv('g', { class: 'ay-tut', tabindex: 0, role: 'slider', 'aria-label': 'Ay' }, s);
    sv('circle', { r: 26, fill: '#fff', 'fill-opacity': 0.001 }, el.ay);
    sv('circle', { r: 12, fill: '#1e293b', stroke: '#94a3b8', 'stroke-width': 1.5 }, el.ay);
    el.ayaydin = sv('path', { d: 'M0 -12 A12 12 0 0 0 0 12 Z', fill: '#fde68a' }, el.ay);
    var surukle = false;
    function konum(ev) {
      var pt = s.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var p = pt.matrixTransform(s.getScreenCTM().inverse());
      a = norm(Math.atan2(p.y - EY, -(p.x - EX)) * 180 / Math.PI);
      oto = false; if (el.otoBtn) el.otoBtn.textContent = '▶ Otomatik';
      el.sl.value = Math.round(a); ciz();
    }
    el.ay.addEventListener('pointerdown', function (ev) { surukle = true; el.ay.setPointerCapture(ev.pointerId); konum(ev); });
    el.ay.addEventListener('pointermove', function (ev) { if (surukle) konum(ev); });
    el.ay.addEventListener('pointerup', function () { surukle = false; });
    el.ay.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') { a = norm(a + 5); } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') { a = norm(a - 5); } else return;
      ev.preventDefault(); el.sl.value = Math.round(a); ciz();
    });
  }

  function ciz() {
    var r = a * Math.PI / 180, mx = EX - R * Math.cos(r), my = EY + R * Math.sin(r);
    el.ay.setAttribute('transform', 'translate(' + mx.toFixed(1) + ' ' + my.toFixed(1) + ')');
    // Ay'ın gölgesi (Güneş'in tersi yönde, sağa)
    el.aygolge.setAttribute('points', (mx) + ',' + (my - 12) + ' ' + (mx + 90) + ',' + (my - 3) + ' ' + (mx + 90) + ',' + (my + 3) + ' ' + mx + ',' + (my + 12));
    // Dünya'dan görünüm
    var g = el.gor;
    g.innerHTML = '';
    var cx = 100, cy = 100, rr = 70;
    var gunes = fark(a, 0) < 4, ayt = fark(a, 180) < 4;
    sv('rect', { x: 0, y: 0, width: 200, height: 200, rx: 14, fill: '#0b1220' }, g);
    if (gunes) {
      sv('circle', { cx: cx, cy: cy, r: rr + 14, fill: '#fde68a', 'fill-opacity': 0.35 }, g);
      sv('circle', { cx: cx, cy: cy, r: rr + 5, fill: 'none', stroke: '#fde68a', 'stroke-width': 4 }, g);
      sv('circle', { cx: cx, cy: cy, r: rr, fill: '#000' }, g);
    } else if (ayt) {
      sv('circle', { cx: cx, cy: cy, r: rr, fill: '#9a3412' }, g);
    } else {
      sv('circle', { cx: cx, cy: cy, r: rr, fill: '#1e293b', stroke: '#334155', 'stroke-width': 2 }, g);
      var c = Math.cos(r), sag = Math.sin(r) > 0;
      var rx = Math.abs(c) * rr;
      var yol = 'M' + cx + ' ' + (cy - rr) + ' A' + rr + ' ' + rr + ' 0 0 1 ' + cx + ' ' + (cy + rr) +
                ' A' + rx.toFixed(2) + ' ' + rr + ' 0 0 ' + (c > 0 ? 0 : 1) + ' ' + cx + ' ' + (cy - rr) + ' Z';
      var p = sv('path', { d: yol, fill: '#fde68a' }, g);
      if (!sag) p.setAttribute('transform', 'translate(200 0) scale(-1 1)');
    }
    var ad = evreAdi(a);
    var gizli = gorev && !gorev.soru && !bitti && sev < 4;
    var etiket = gunes ? 'Güneş tutulması' : ayt ? 'Ay tutulması' : ad;
    if (gorev && sev >= 4 && !bitti) etiket = '';
    el.ad.textContent = gizli ? 'Bu hangi evre? ❓' : etiket;
  }

  /* ---------- Görev ---------- */
  function onayla() {
    if (bitti) return;
    var hata = fark(a, gorev.a);
    var mesaj;
    if (hata <= gorev.tol) {
      bitti = true; ciz();
      if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
      var chip = kok.querySelectorAll('.oy-chip')[sev];
      if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
      var kutu = e('div', { class: 'oy-basari' });
      kutu.appendChild(e('h3', {}, '🎉 Doğru! ' + gorev.ad2));
      kutu.appendChild(e('p', { html: '<strong>Neden böyle?</strong> ' + gorev.acik }));
      var b = e('button', { type: 'button', class: 'btn btn-sari' }, 'Sonraki görev ▶');
      b.addEventListener('click', function () { yukle(sev + 1); });
      kutu.appendChild(b);
      el.sonuc.innerHTML = ''; el.sonuc.appendChild(kutu);
      return;
    }
    var simdi = fark(a, 0) <= 12 ? 'Yeni Ay konumu' : fark(a, 180) <= 12 ? 'Dolunay konumu' : evreAdi(a);
    mesaj = 'Henüz değil. Şu an Ay ' + (hata <= 25 ? 'hedefe yakın, biraz daha ince ayar yap.' : '“' + simdi + '” konumunda. Hedef konumu düşün: Güneş, Dünya ve Ay’ın sıralamasına bak.');
    el.sonuc.innerHTML = '';
    el.sonuc.appendChild(e('div', { class: 'oy-durum bilgi' }, mesaj));
  }

  function soruGoster() {
    var kutu = e('div', { class: 'oy-basari' });
    kutu.appendChild(e('p', {}, gorev.gorev));
    var secs = e('div', { class: 'hal-secenekler' });
    var mesaj = e('p', { class: 'hal-mesaj' });
    var liste = gorev.sec.map(function (m, i) { return { m: m, d: i === 0 }; });
    for (var i = liste.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = liste[i]; liste[i] = liste[j]; liste[j] = t; }
    liste.forEach(function (o) {
      var b = e('button', { type: 'button', class: 'hal-secenek' }, o.m);
      b.addEventListener('click', function () {
        if (o.d) {
          if (kayit.bitti.indexOf(sev) < 0) { kayit.bitti.push(sev); kaydet(); }
          var chip = kok.querySelectorAll('.oy-chip')[sev];
          if (chip) { chip.classList.add('bitti'); chip.textContent = '✓ ' + (sev + 1); }
          kutu.innerHTML = '';
          kutu.appendChild(e('h3', {}, '🎉 Doğru, tüm görevler tamam!'));
          kutu.appendChild(e('p', { html: '<strong>Neden böyle?</strong> ' + gorev.acik }));
          var nb = e('button', { type: 'button', class: 'btn btn-sari' }, '🧪 Serbest moda geç');
          nb.addEventListener('click', function () { yukle('serbest'); });
          kutu.appendChild(nb);
        } else { b.classList.add('yanlis'); b.disabled = true; mesaj.textContent = 'Henüz değil, tekrar düşün.'; }
      });
      secs.appendChild(b);
    });
    kutu.appendChild(secs); kutu.appendChild(mesaj);
    el.sonuc = e('div', { class: 'oy-sonuc' });
    el.sonuc.appendChild(kutu);
    kok.appendChild(el.sonuc);
  }

  yukle(0);
})();
