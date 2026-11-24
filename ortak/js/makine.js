// Basit Makine Atölyesi – kaldıraç, makara ve eğik düzlem (8. sınıf, basit makineler)
(function () {
  'use strict';

  var GOREVLER = [
    { ad: 'Kaldıracı dengele', tur: 'kaldirac', sol: { w: 60, d: 2 }, env: [20, 20, 30, 40], tek: false,
      gorev: 'Sol kolda 2. çentikte 60 N’luk yük var. Sağ kola ağırlıklar koyarak kaldıracı dengele (çentiğe tıkla; ağırlığı geri almak için yerleştirdiğine tekrar tıkla).',
      acik: 'Kaldıraç dengede iken kuvvet × kuvvet kolu iki tarafta eşittir: F₁·d₁ = F₂·d₂. Burada 60·2 = 120 olduğundan sağ taraftaki toplam moment de 120 olmalıdır (örneğin 40 N · 3 çentik).' },
    { ad: 'Kuvvet kazancı', tur: 'kaldirac', sol: { w: 150, d: 1 }, env: [50], tek: true,
      gorev: '150 N’luk yükü yalnızca bir tane 50 N’luk ağırlıkla dengele. Ağırlığı hangi çentiğe koymalısın?',
      acik: '150 · 1 = 50 · d olduğundan d = 3 çentiktir. Kuvvet kolunu yük kolundan uzun yaparak küçük bir kuvvetle büyük bir yükü dengeleyebiliriz.' },
    { ad: 'Yol ve kuvvet', tur: 'soru', gorev: 'Kaldıraçta kuvvetten kazancı yorumla.',
      soru: { q: 'Bir kaldıraçta küçük bir kuvvetle büyük yükü kaldırabiliyorsak (kuvvetten kazanç) yolda ne olur?', sec: ['Yoldan kayıp olur; kuvvet daha uzun bir yol alır ve iş kazancı sağlanmaz', 'Yoldan da kazanç olur; hem kuvvet hem yol azalır', 'Yol değişmez; hem kuvvetten hem işten kazanç sağlanır', 'Yük daha kısa yol alır ve iş artar'],
        acik: 'Basit makineler kuvvetten kazanç sağlayabilir ama bu, yoldan kayıp pahasınadır: kuvvet kolunun ucu yük kolunun ucundan daha uzun yol alır. Kuvvet × yol (iş) değişmediği için iş kazancı sağlanamaz.' } },
    { ad: 'Makaralar', tur: 'makara', gorev: '200 N’luk yükü yalnızca 50 N’luk kuvvetle kaldırmak için doğru makara sistemini seç.',
      acik: 'İdeal makara sistemlerinde yükü taşıyan ip sayısı n ise gerekli kuvvet F = Yük / n’dir. Sabit makarada n = 1 (yalnızca yön değişir), hareketli makarada n = 2, dört ipli palangada n = 4 olur. 200 / 4 = 50 N.',
      soru: { q: 'Dört ipli palanga ile yük 1 m yükseltilirken kuvvet uygulayan kişi ipin ucunu kaç metre çekmelidir?', sec: ['4 m', '1 m', '2 m', '0,25 m'],
        acik: 'Kuvvetten 4 kat kazanç yoldan 4 kat kayıp getirir: yük 1 m yükselirken ip 4 m çekilir. İş (kuvvet × yol) değişmez.' } },
    { ad: 'Eğik düzlem', tur: 'egik', gorev: '300 N’luk yükü 1 m yüksekliğe çıkaracaksın. Eğik düzlemin uzunluğunu ayarlayarak gereken kuvveti 75 N yap. (Sürtünme yok)',
      acik: 'Sürtünmesiz eğik düzlemde F · ℓ = Yük · h olduğundan F = 300 · 1 / ℓ. F = 75 N için ℓ = 4 m olmalıdır. Düzlem uzadıkça gerekli kuvvet azalır ama alınan yol artar; iş aynı kalır.' }
  ];

  OY.oyun({
    anahtar: 'fen-basit-makine-v1', gorevler: GOREVLER, serbest: null,
    kur: function (g, i, api) {
      if (g.tur === 'soru') { api.soru(g.soru); return; }
      if (g.tur === 'kaldirac') kaldirac(g, api);
      else if (g.tur === 'makara') makara(g, api);
      else egik(g, api);
    }
  });

  function kaldirac(g, api) {
    var e = api.e, sv = api.sv, sag = {}, secili = g.env[0], kullan = g.env.map(function () { return false; });
    var s = sv('svg', { viewBox: '0 0 600 300', class: 'isik-svg', role: 'img', 'aria-label': 'Kaldıraç' });
    var sh = e('div', { class: 'oy-sahne' }); sh.appendChild(s); api.alan.appendChild(sh);
    var env = e('div', { class: 'oy-araclar' }); env.appendChild(e('span', { class: 'hal-soguk' }, 'Ağırlık seç:'));
    var butonlar = [];
    g.env.forEach(function (w, k) {
      var b = e('button', { type: 'button', class: 'oy-arac' }, w + ' N');
      b.addEventListener('click', function () { if (!kullan[k]) { secim = k; ciz(); } });
      env.appendChild(b); butonlar.push(b);
    });
    api.alan.appendChild(env);
    var secim = 0, yerler = {}; // çentik -> envanter indeksi
    var PX = 45, CX = 300, CY = 160;
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 300, rx: 16, fill: '#f1f5f9' }, s);
      var solT = g.sol.w * g.sol.d, sagT = 0;
      Object.keys(yerler).forEach(function (d) { sagT += g.env[yerler[d]] * +d; });
      var aci = Math.max(-14, Math.min(14, (solT - sagT) / 12));
      sv('polygon', { points: CX + ',' + CY + ' ' + (CX - 30) + ',270 ' + (CX + 30) + ',270', fill: '#64748b' }, s);
      var gr = sv('g', { transform: 'rotate(' + (-aci) + ' ' + CX + ' ' + CY + ')' }, s);
      sv('rect', { x: CX - 5.5 * PX, y: CY - 7, width: 11 * PX, height: 14, rx: 6, fill: '#b45309' }, gr);
      for (var d = 1; d <= 5; d++) {
        [-1, 1].forEach(function (yon) {
          sv('circle', { cx: CX + yon * d * PX, cy: CY, r: 4, fill: '#fde68a' }, gr);
          var t = sv('text', { x: CX + yon * d * PX, y: CY - 14, 'text-anchor': 'middle', 'font-size': 11, fill: '#475569' }, gr); t.textContent = d;
        });
      }
      function agirlik(x, w, renk) {
        var bw = 22 + w * 0.5, bh = 22 + w * 0.3;
        sv('line', { x1: x, y1: CY, x2: x, y2: CY + 30, stroke: '#475569', 'stroke-width': 2 }, gr);
        sv('rect', { x: x - bw / 2, y: CY + 30, width: bw, height: bh, rx: 4, fill: renk, stroke: '#0f172a', 'stroke-width': 2 }, gr);
        var t = sv('text', { x: x, y: CY + 30 + bh / 2 + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#fff' }, gr); t.textContent = w + ' N';
        return bw;
      }
      agirlik(CX - g.sol.d * PX, g.sol.w, '#dc2626');
      for (var k = 1; k <= 5; k++) {
        (function (k) {
          var x = CX + k * PX;
          if (yerler[k] !== undefined) {
            agirlik(x, g.env[yerler[k]], '#2563eb');
          }
          var tik = sv('g', { class: 'slot', tabindex: 0, role: 'button', 'aria-label': 'Çentik ' + k }, gr);
          sv('rect', { x: x - 20, y: CY - 25, width: 40, height: 120, fill: '#fff', 'fill-opacity': 0.001 }, tik);
          tik.addEventListener('click', function () { yerle(k); });
        })(k);
      }
      var tt = sv('text', { x: 300, y: 36, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#0f172a' }, s);
      tt.textContent = 'Sol moment: ' + solT + ' · Sağ moment: ' + sagT + (solT === sagT && sagT > 0 ? ' → DENGE' : '');
      butonlar.forEach(function (b, k) { b.classList.toggle('aktif', secim === k && !kullan[k]); b.classList.toggle('tukendi', kullan[k]); });
      if (solT === sagT && sagT > 0 && !ciz.bitti) { ciz.bitti = true; api.mesaj('✅ Kaldıraç dengede!', 'iyi'); api.bitir('🎉 Kaldıraç dengede!', g.acik); }
    }
    function yerle(k) {
      if (ciz.bitti) return;
      if (yerler[k] !== undefined) { kullan[yerler[k]] = false; delete yerler[k]; }
      else if (!kullan[secim]) { yerler[k] = secim; kullan[secim] = true; var bos = kullan.indexOf(false); if (bos >= 0) secim = bos; }
      ciz();
    }
    ciz();
  }

  function makara(g, api) {
    var e = api.e, sv = api.sv, n = 1;
    var s = sv('svg', { viewBox: '0 0 600 320', class: 'isik-svg', role: 'img', 'aria-label': 'Makara sistemi' });
    var sh = e('div', { class: 'oy-sahne' }); sh.appendChild(s); api.alan.appendChild(sh);
    var ctl = e('div', { class: 'oy-araclar' });
    [[1, 'Sabit makara (1 ip)'], [2, 'Hareketli makara (2 ip)'], [4, 'Palanga (4 ip)']].forEach(function (x) {
      var b = e('button', { type: 'button', class: 'oy-arac' + (x[0] === n ? ' aktif' : '') }, x[1]);
      b.addEventListener('click', function () { n = x[0]; [].forEach.call(ctl.querySelectorAll('.oy-arac'), function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); ciz(); });
      ctl.appendChild(b);
    });
    var ol = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '✔ Bu sistemi seç');
    ctl.appendChild(ol); api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 320, rx: 16, fill: '#f1f5f9' }, s);
      sv('rect', { x: 120, y: 20, width: 360, height: 14, fill: '#64748b', rx: 4 }, s);
      for (var k = 0; k < n; k++) { var x = 300 - (n - 1) * 20 + k * 40; sv('line', { x1: x, y1: 34, x2: x, y2: 210, stroke: '#a16207', 'stroke-width': 4 }, s); }
      sv('rect', { x: 300 - (n - 1) * 20 - 30, y: 200, width: (n - 1) * 40 + 60, height: 18, rx: 6, fill: '#475569' }, s);
      sv('rect', { x: 250, y: 218, width: 100, height: 70, rx: 8, fill: '#dc2626' }, s);
      var t = sv('text', { x: 300, y: 260, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#fff' }, s); t.textContent = 'Yük 200 N';
      var t2 = sv('text', { x: 300, y: 308, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#0f172a' }, s);
      t2.textContent = 'Yükü taşıyan ip sayısı: ' + n + ' → gerekli kuvvet F = 200 / ' + n + ' = ' + (200 / n) + ' N';
    }
    ol.addEventListener('click', function () {
      if (n === 4) api.soru(g.soru, '🎯 Doğru sistem! Şimdi yanıtla');
      else api.mesaj('Bu sistemde gerekli kuvvet ' + (200 / n) + ' N. 50 N elde etmek için yükü taşıyan ip sayısı kaç olmalı?', 'tehlike');
    });
    ciz();
  }

  function egik(g, api) {
    var e = api.e, sv = api.sv, L = 1.5;
    var s = sv('svg', { viewBox: '0 0 600 300', class: 'isik-svg', role: 'img', 'aria-label': 'Eğik düzlem' });
    var sh = e('div', { class: 'oy-sahne' }); sh.appendChild(s); api.alan.appendChild(sh);
    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '📐 Düzlem uzunluğu'));
    var sl = e('input', { type: 'range', min: 1.5, max: 6, step: 0.5, value: L, class: 'hal-sl', 'aria-label': 'Düzlem uzunluğu' });
    var ol = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '✔ Uzunluğu onayla');
    ctl.appendChild(sl); ctl.appendChild(ol); api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 300, rx: 16, fill: '#f1f5f9' }, s);
      var h = 1, yy = 250, hp = 90, taban = Math.sqrt(L * L - h * h) * 80, x0 = 520 - taban;
      sv('polygon', { points: x0 + ',' + yy + ' 520,' + yy + ' 520,' + (yy - hp), fill: '#fde68a', stroke: '#b45309', 'stroke-width': 3 }, s);
      var ang = Math.atan2(hp, taban), bx = x0 + taban * 0.35, by = yy - hp * 0.35;
      var kg = sv('g', { transform: 'translate(' + bx + ' ' + by + ') rotate(' + (-ang * 180 / Math.PI) + ')' }, s);
      sv('rect', { x: -22, y: -34, width: 44, height: 34, rx: 4, fill: '#dc2626' }, kg);
      var tl = sv('text', { x: 0, y: -12, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#fff' }, kg); tl.textContent = '300 N';
      sv('line', { x1: 520, y1: yy, x2: 520, y2: yy - hp, stroke: '#0f172a', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, s);
      var th = sv('text', { x: 534, y: yy - hp / 2, 'font-size': 13, fill: '#0f172a', 'font-weight': 800 }, s); th.textContent = 'h = 1 m';
      var t = sv('text', { x: 300, y: 36, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: '#0f172a' }, s);
      t.textContent = 'Düzlem uzunluğu ℓ = ' + String(L).replace('.', ',') + ' m → F = 300 · 1 / ' + String(L).replace('.', ',') + ' = ' + Math.round(300 / L) + ' N';
    }
    sl.addEventListener('input', function () { L = +sl.value; ciz(); });
    ol.addEventListener('click', function () {
      if (Math.abs(300 / L - 75) < 0.5) api.bitir('🎉 Doğru: ℓ = 4 m!', g.acik);
      else api.mesaj('Gereken kuvvet ' + Math.round(300 / L) + ' N. ' + (300 / L > 75 ? 'Düzlemi uzat.' : 'Düzlemi kısalt.'), 'bilgi');
    });
    ciz();
  }
})();
