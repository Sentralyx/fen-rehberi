// Işık Yolu – ayna ve mercekle ışığı hedefe ulaştır (5-7. sınıf, ışık üniteleri)
(function () {
  'use strict';
  var RAD = Math.PI / 180;
  var W = 600, H = 400;

  var GOREVLER = [
    { ad: 'Tek ayna', tur: 'ayna', gorev: 'Aynayı döndürerek el fenerinin ışığını yıldıza ulaştır.',
      fener: { x: 60, y: 200, a: 0 }, hedef: { x: 300, y: 70 }, aynalar: [{ x: 300, y: 200, a: 0 }], duvarlar: [],
      acik: 'Işık düzgün bir yüzeyden yansırken gelme açısı yansıma açısına eşittir. Ayna döndükçe yansıyan ışının yönü, aynanın dönme miktarının iki katı kadar değişir.' },
    { ad: 'İki ayna', tur: 'ayna', gorev: 'İki aynayı ayarlayarak ışığı yıldıza ulaştır.',
      fener: { x: 60, y: 340, a: 0 }, hedef: { x: 520, y: 100 }, aynalar: [{ x: 250, y: 340, a: 0 }, { x: 250, y: 100, a: 0 }], duvarlar: [],
      acik: 'Işık birden çok aynadan art arda yansıyabilir. Her aynada gelme açısı yansıma açısına eşittir; periskop bu ilkeyle çalışır.' },
    { ad: 'Engelli yol', tur: 'ayna', gorev: 'Üç aynayı ayarla; ışık duvarlara çarpmadan yıldıza ulaşsın.',
      fener: { x: 60, y: 350, a: -90 }, hedef: { x: 540, y: 300 }, aynalar: [{ x: 60, y: 100, a: 0 }, { x: 300, y: 100, a: 0 }, { x: 300, y: 300, a: 0 }],
      duvarlar: [[180, 150, 180, 400], [420, 0, 420, 260]],
      acik: 'Işık saydam olmayan engellerden geçemez; yönünü ayna ile değiştirerek engelleri aşabiliriz. Işık, aynı ortamda doğrusal yayılır.' },
    { ad: 'Yansıma açısı', tur: 'soru', gorev: 'Yansıma kanununu uygula.',
      soru: { q: 'Işık düz aynaya, aynanın yüzeyine çizilen dik doğru (normal) ile 40° açı yaparak geliyor. Yansıma açısı kaç derecedir ve yansıyan ışın ayna yüzeyiyle kaç derece yapar?',
              sec: ['40°; yansıyan ışın ayna yüzeyiyle 50° yapar', '40°; yansıyan ışın ayna yüzeyiyle 40° yapar', '50°; yansıyan ışın ayna yüzeyiyle 40° yapar', '80°; yansıyan ışın ayna yüzeyiyle 10° yapar'],
              acik: 'Gelme ve yansıma açıları normalden ölçülür ve birbirine eşittir (40°). Normal yüzeye diktir; bu yüzden ışın yüzeyle 90° − 40° = 50° yapar.' } },
    { ad: 'Odağı bul', tur: 'mercek', gorev: 'Paralel ışınları bir noktada toplayan odak noktasını bul: perdeyi kaydır ve ışık lekesi en küçükken “Perdeyi sabitle” düğmesine bas.' },
    { ad: 'Düz ayna', tur: 'soru', gorev: 'Düz aynadaki görüntüyü incele.',
      soru: { q: 'Düz aynada oluşan görüntü için hangisi doğrudur?',
              sec: ['Görüntü sanaldır, cisimle aynı boydadır ve aynanın arkasında, cisim kadar uzaklıktadır', 'Görüntü gerçektir, cisimden küçüktür ve aynanın önünde oluşur', 'Görüntü sanaldır, cisimden büyüktür ve aynanın yüzeyinde oluşur', 'Görüntü gerçektir, cisimle aynı boydadır ve perdede yakalanabilir'],
              acik: 'Düz aynada görüntü ışınların uzantılarının kesişmesiyle oluşur (sanal), cisimle aynı boydadır ve aynanın arkasında, cismin aynaya olan uzaklığı kadar uzaklıktadır. Sanal görüntü perdede yakalanamaz.' } },
    { ad: 'Kırılma', tur: 'soru', gorev: 'Işığın bir ortamdan diğerine geçişini düşün.',
      soru: { q: 'Işık havadan suya (daha yoğun ortama) eğik olarak girerken nasıl kırılır?',
              sec: ['Normale yaklaşır, çünkü suda ışığın hızı azalır', 'Normalden uzaklaşır, çünkü suda ışığın hızı artar', 'Doğrultusunu hiç değiştirmez', 'Tamamen yansır ve suya girmez'],
              acik: 'Işık seyrek ortamdan yoğun ortama geçerken hızı azalır ve normale yaklaşacak biçimde kırılır. Bu yüzden suya batırılan çubuk bükülmüş görünür.' } }
  ];

  function kes(px, py, dx, dy, ax, ay, bx, by) { // ışın–doğru parçası kesişimi: t döner (ya da null)
    var ex = bx - ax, ey = by - ay, den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) return null;
    var t = ((ax - px) * ey - (ay - py) * ex) / den, u = ((ax - px) * dy - (ay - py) * dx) / den;
    if (t > 1e-6 && u >= 0 && u <= 1) return t;
    return null;
  }
  function izle(g, aynalar) {
    var x = g.fener.x, y = g.fener.y, dx = Math.cos(g.fener.a * RAD), dy = Math.sin(g.fener.a * RAD);
    var pts = [[x, y]], vurdu = false;
    var duv = g.duvarlar.concat([[0, 0, W, 0], [W, 0, W, H], [W, H, 0, H], [0, H, 0, 0]]);
    for (var k = 0; k < 12; k++) {
      var best = null, tip = null, idx = -1;
      aynalar.forEach(function (m, i) {
        var mx = Math.cos(m.a * RAD), my = Math.sin(m.a * RAD);
        var t = kes(x, y, dx, dy, m.x - mx * 40, m.y - my * 40, m.x + mx * 40, m.y + my * 40);
        if (t !== null && (best === null || t < best)) { best = t; tip = 'm'; idx = i; }
      });
      duv.forEach(function (d) {
        var t = kes(x, y, dx, dy, d[0], d[1], d[2], d[3]);
        if (t !== null && (best === null || t < best)) { best = t; tip = 'd'; }
      });
      if (best === null) break;
      // hedef kontrolü
      var tx = g.hedef.x - x, ty = g.hedef.y - y, pr = tx * dx + ty * dy;
      if (pr > 0 && pr < best) { var dist = Math.abs(tx * dy - ty * dx); if (dist < 16) { vurdu = true; pts.push([x + dx * pr, y + dy * pr]); break; } }
      x += dx * best; y += dy * best; pts.push([x, y]);
      if (tip === 'd') break;
      var m = aynalar[idx], mx = Math.cos(m.a * RAD), my = Math.sin(m.a * RAD), dot = dx * mx + dy * my;
      dx = 2 * dot * mx - dx; dy = 2 * dot * my - dy;
    }
    return { pts: pts, vurdu: vurdu };
  }

  OY.oyun({
    anahtar: 'fen-isik-yolu-v1', gorevler: GOREVLER, serbest: null,
    kur: function (g, i, api) {
      if (g.tur === 'soru') { api.soru(g.soru); return; }
      if (g.tur === 'mercek') { mercek(g, api); return; }
      var e = api.e, sv = api.sv;
      var aynalar = g.aynalar.map(function (m) { return { x: m.x, y: m.y, a: m.a }; }), secili = 0, bitti = false;
      var sahne = e('div', { class: 'oy-sahne' });
      var s = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'isik-svg', role: 'img', 'aria-label': 'Ayna ve ışık bulmacası' });
      sahne.appendChild(s); api.alan.appendChild(sahne);
      var ctl = e('div', { class: 'oy-araclar' });
      var sol = e('button', { type: 'button', class: 'oy-arac' }, '↺ Sola çevir'), sag = e('button', { type: 'button', class: 'oy-arac' }, '↻ Sağa çevir');
      var etiket = e('span', { class: 'isik-aci' });
      var sf = e('button', { type: 'button', class: 'oy-arac oy-sifir' }, '↺ Sıfırla');
      [sol, sag, etiket, sf].forEach(function (x) { ctl.appendChild(x); });
      api.alan.appendChild(ctl);
      function dondur(d) { if (bitti) return; aynalar[secili].a += d; ciz(); }
      sol.addEventListener('click', function () { dondur(-5); });
      sag.addEventListener('click', function () { dondur(5); });
      sf.addEventListener('click', function () { aynalar = g.aynalar.map(function (m) { return { x: m.x, y: m.y, a: m.a }; }); bitti = false; api.sonuc.innerHTML = ''; ciz(); });
      function ciz() {
        s.innerHTML = '';
        sv('rect', { x: 0, y: 0, width: W, height: H, rx: 16, fill: '#0f172a' }, s);
        g.duvarlar.forEach(function (d) { sv('line', { x1: d[0], y1: d[1], x2: d[2], y2: d[3], stroke: '#64748b', 'stroke-width': 10, 'stroke-linecap': 'round' }, s); });
        var r = izle(g, aynalar);
        var yol = r.pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
        sv('polyline', { points: yol, fill: 'none', stroke: '#fde047', 'stroke-opacity': 0.3, 'stroke-width': 10, 'stroke-linejoin': 'round' }, s);
        sv('polyline', { points: yol, fill: 'none', stroke: '#fde047', 'stroke-width': 3, 'stroke-linejoin': 'round' }, s);
        aynalar.forEach(function (m, k) {
          var mx = Math.cos(m.a * RAD) * 40, my = Math.sin(m.a * RAD) * 40;
          var gr = sv('g', { class: 'slot', tabindex: 0, role: 'button', 'aria-label': 'Ayna ' + (k + 1) }, s);
          sv('line', { x1: m.x - mx, y1: m.y - my, x2: m.x + mx, y2: m.y + my, stroke: k === secili ? '#22d3ee' : '#cbd5e1', 'stroke-width': 8, 'stroke-linecap': 'round' }, gr);
          sv('circle', { cx: m.x, cy: m.y, r: 26, fill: '#fff', 'fill-opacity': 0.001 }, gr);
          gr.addEventListener('click', function () { if (!bitti) { secili = k; ciz(); } });
        });
        var f = g.fener;
        sv('circle', { cx: f.x, cy: f.y, r: 16, fill: '#facc15' }, s);
        var fa = f.a * RAD; sv('line', { x1: f.x, y1: f.y, x2: f.x + Math.cos(fa) * 26, y2: f.y + Math.sin(fa) * 26, stroke: '#facc15', 'stroke-width': 10, 'stroke-linecap': 'round' }, s);
        var t = sv('text', { x: g.hedef.x, y: g.hedef.y + 10, 'text-anchor': 'middle', 'font-size': 34, fill: r.vurdu ? '#4ade80' : '#94a3b8' }, s); t.textContent = r.vurdu ? '★' : '☆';
        var a = ((aynalar[secili].a % 180) + 180) % 180;
        etiket.textContent = 'Seçili ayna ' + (secili + 1) + ' / ' + aynalar.length + ' · açı: ' + a + '°';
        if (r.vurdu && !bitti) { bitti = true; api.mesaj('✅ Işık yıldıza ulaştı!', 'iyi'); api.bitir('🎉 Harika, ışığı hedefe ulaştırdın!', g.acik); }
        else if (!r.vurdu) api.mesaj('Aynayı seç, çevir ve ışığın yolunu izle.', 'bilgi');
      }
      ciz();
    }
  });

  function mercek(g, api) {
    var e = api.e, sv = api.sv, f = [130, 170, 210][Math.floor(Math.random() * 3)], px = 330;
    var sahne = e('div', { class: 'oy-sahne' });
    var s = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'isik-svg', role: 'img', 'aria-label': 'Mercek ve perde' });
    sahne.appendChild(s); api.alan.appendChild(sahne);
    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '🖼️ Perdenin konumu'));
    var sl = e('input', { type: 'range', min: 250, max: 560, value: px, class: 'hal-sl', 'aria-label': 'Perde konumu' });
    var bt = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, 'Perdeyi sabitle');
    ctl.appendChild(sl); ctl.appendChild(bt); api.alan.appendChild(ctl);
    var LX = 200, CY = 200, ofs = [-70, -35, 0, 35, 70];
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: W, height: H, rx: 16, fill: '#0f172a' }, s);
      sv('ellipse', { cx: LX, cy: CY, rx: 14, ry: 100, fill: '#7dd3fc', 'fill-opacity': 0.55, stroke: '#bae6fd', 'stroke-width': 2 }, s);
      var lt = sv('text', { x: LX, y: CY + 125, 'text-anchor': 'middle', 'font-size': 13, fill: '#bae6fd', 'font-weight': 800 }, s); lt.textContent = 'Dışbükey (yakınsak) mercek';
      sv('line', { x1: 0, y1: CY, x2: W, y2: CY, stroke: '#334155', 'stroke-dasharray': '4 6' }, s);
      ofs.forEach(function (o) {
        var y1 = CY + o, yEnd = CY + o * (1 - (px - LX) / f);
        sv('line', { x1: 20, y1: y1, x2: LX, y2: y1, stroke: '#fde047', 'stroke-width': 3 }, s);
        sv('line', { x1: LX, y1: y1, x2: px, y2: yEnd, stroke: '#fde047', 'stroke-width': 3 }, s);
      });
      var spot = Math.abs(70 * (1 - (px - LX) / f));
      sv('rect', { x: px - 3, y: 40, width: 6, height: 320, fill: '#e2e8f0', rx: 3 }, s);
      sv('ellipse', { cx: px + 3, cy: CY, rx: 3, ry: Math.max(spot, 2), fill: '#fde047' }, s);
      var t = sv('text', { x: px, y: 385, 'text-anchor': 'middle', 'font-size': 13, fill: '#94a3b8', 'font-weight': 800 }, s); t.textContent = 'Işık lekesi boyu: ' + Math.round(spot * 2) + ' birim';
    }
    sl.addEventListener('input', function () { px = +sl.value; ciz(); });
    bt.addEventListener('click', function () {
      if (Math.abs(px - (LX + f)) <= 10) {
        api.bitir('🎉 Odak noktasını buldun!', 'Dışbükey mercek, eksene paralel gelen ışınları odak noktasında toplar. Mercek ile odak noktası arasındaki uzaklığa odak uzaklığı denir; mercek ne kadar kalın (kıvrımlı) ise odak uzaklığı o kadar kısadır.');
      } else {
        api.mesaj('Henüz değil: ışık lekesi en küçük olduğunda perde odak noktasındadır. Kaydırıcıyı yavaşça oynat.', 'bilgi');
      }
    });
    ciz();
  }
})();
