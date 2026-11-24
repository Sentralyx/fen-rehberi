// Basınç Laboratuvarı – katı, sıvı, kaldırma ve açık hava basıncı (8. sınıf, basınç ünitesi)
(function () {
  'use strict';
  var G = 10;

  var GOREVLER = [
    { ad: 'Kar üzerinde tuğla', tur: 'kati', gorev: '40 N ağırlığındaki tuğlayı karın üzerine koy. Tuğla karın içine en az batsın: uygun yüzünü seç.',
      soru: { q: '40 N ağırlığındaki tuğla, 0,005 m² (en küçük) yüzü üzerinde dururken yüzeye uyguladığı basınç kaç Pa’dır?', sec: ['8000 Pa', '2000 Pa', '4000 Pa', '200 Pa'],
        acik: 'Katı basıncı P = F / A bağıntısıyla bulunur: P = 40 N / 0,005 m² = 8000 Pa. Kuvvet aynı kalsa da yüzey alanı küçüldükçe basınç artar; bu yüzden kar ayakkabıları geniş, çivi ucu ise sivridir.' } },
    { ad: 'Derinlik ve basınç', tur: 'sivi', gorev: 'Dalgıcı su içinde aşağı indir. Dalgıç üzerindeki sıvı basıncı 30 kPa olduğunda “Ölç” düğmesine bas. (g = 10 m/s², su yoğunluğu 1000 kg/m³)',
      acik: 'Sıvı basıncı P = ρ · g · h bağıntısıyla bulunur. P = 1000 · 10 · 3 = 30 000 Pa = 30 kPa için derinlik 3 m’dir. Basınç derinlikle doğru orantılıdır.' },
    { ad: 'Kabın şekli', tur: 'soru', gorev: 'Sıvı basıncının neye bağlı olduğunu düşün.',
      soru: { q: 'Aynı yükseklikte aynı sıvıyla doldurulmuş, tabanları eşit alanlı ama farklı şekilli (dar, geniş, eğimli) kapların tabanındaki sıvı basıncı nasıldır?', sec: ['Hepsinde eşittir; çünkü sıvı basıncı yalnızca derinliğe ve sıvının cinsine bağlıdır', 'Geniş kapta daha büyüktür; çünkü sıvı miktarı fazladır', 'Dar kapta daha büyüktür; çünkü sıvı sıkışmıştır', 'Eğimli kapta daha büyüktür; çünkü yan duvarlar baskı yapar'],
        acik: 'Sıvı basıncı P = ρ · g · h olduğundan yalnızca sıvının yoğunluğuna ve derinliğe bağlıdır. Kabın şekline ya da sıvı miktarına bağlı değildir.' } },
    { ad: 'Yüzer mi, batar mı?', tur: 'kaldirma', gorev: 'Beş cismi de suya bırak ve hangilerinin yüzdüğünü, hangilerinin battığını gözle.',
      soru: { q: 'Gemi demirden yapıldığı hâlde neden yüzer?', sec: ['İçi hava dolu olduğu için ortalama yoğunluğu suyun yoğunluğundan küçüktür', 'Demir suda hafifler ve ağırlığı kaybolur', 'Suyun yoğunluğu gemi hareket edince artar', 'Gemiye etki eden yerçekimi kuvveti suda sıfırdır'],
        acik: 'Bir cisim, ortalama yoğunluğu sıvının yoğunluğundan küçükse yüzer; büyükse batar. Geminin gövdesi içi boş olduğundan ortalama yoğunluğu suyunkinden küçüktür ve suya batan hacmin ağırlığı gemi ağırlığına eşit olur (kaldırma kuvveti = ağırlık).' } },
    { ad: 'Dağa çık', tur: 'hava', gorev: 'Açık hava basıncını ölç: yüksekliği 3000 metrenin üzerine çıkar ve barometreyi izle.',
      soru: { q: 'Yükseğe çıkıldıkça açık hava basıncı nasıl değişir ve neden?', sec: ['Azalır; çünkü üzerimizdeki hava sütunu kısalır ve hava seyrekleşir', 'Artar; çünkü hava daha soğuk ve ağırdır', 'Değişmez; çünkü atmosfer her yerde aynıdır', 'Önce artar sonra sabit kalır'],
        acik: 'Açık hava basıncı, üzerimizdeki hava sütununun ağırlığından kaynaklanır. Yükseldikçe hava sütunu kısalır ve hava seyrekleştiği için basınç azalır. Deniz seviyesinde yaklaşık 76 cmHg (1013 hPa) olan basınç, 3000 m’de yaklaşık 700 hPa’a düşer.' } }
  ];

  OY.oyun({
    anahtar: 'fen-basinc-lab-v1', gorevler: GOREVLER, serbest: null,
    kur: function (g, i, api) {
      if (g.tur === 'soru') { api.soru(g.soru); return; }
      if (g.tur === 'kati') kati(g, api);
      else if (g.tur === 'sivi') sivi(g, api);
      else if (g.tur === 'kaldirma') kaldirma(g, api);
      else hava(g, api);
    }
  });

  function sahneEkle(api, svNesne) { var s = api.e('div', { class: 'oy-sahne' }); s.appendChild(svNesne); api.alan.appendChild(s); }

  function kati(g, api) {
    var e = api.e, sv = api.sv, yuz = null;
    var YUZ = [{ ad: 'Küçük yüz (10×5 cm)', A: 0.005, w: 100, h: 200 }, { ad: 'Orta yüz (20×5 cm)', A: 0.01, w: 200, h: 100 }, { ad: 'Büyük yüz (20×10 cm)', A: 0.02, w: 200, h: 50 }];
    var s = sv('svg', { viewBox: '0 0 600 320', class: 'isik-svg', role: 'img', 'aria-label': 'Karın üzerindeki tuğla' });
    sahneEkle(api, s);
    var ctl = e('div', { class: 'oy-araclar' });
    YUZ.forEach(function (y, k) {
      var b = e('button', { type: 'button', class: 'oy-arac' }, y.ad);
      b.addEventListener('click', function () { yuz = k; [].forEach.call(ctl.children, function (c) { c.classList.remove('aktif'); }); b.classList.add('aktif'); ciz(); });
      ctl.appendChild(b);
    });
    api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 320, rx: 16, fill: '#e0f2fe' }, s);
      var y = yuz === null ? YUZ[2] : YUZ[yuz], P = 40 / y.A, bat = Math.min(60, P / 8000 * 45);
      sv('rect', { x: 0, y: 240, width: 600, height: 80, fill: '#f8fafc' }, s);
      sv('rect', { x: 150, y: 240 + bat, width: 300, height: 4, fill: '#e2e8f0' }, s);
      sv('rect', { x: 300 - y.w / 2, y: 240 + bat - y.h, width: y.w, height: y.h, rx: 4, fill: '#b45309', stroke: '#7c2d12', 'stroke-width': 3 }, s);
      var t = sv('text', { x: 300, y: 40, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: '#0f172a' }, s);
      t.textContent = yuz === null ? 'Bir yüz seç' : 'P = F / A = 40 N / ' + String(y.A).replace('.', ',') + ' m² = ' + P + ' Pa';
      var t2 = sv('text', { x: 300, y: 66, 'text-anchor': 'middle', 'font-size': 14, fill: '#475569' }, s);
      t2.textContent = 'Kar içine batma: ' + (yuz === null ? '–' : (bat < 15 ? 'az' : bat < 35 ? 'orta' : 'çok'));
      if (yuz === 2) { api.mesaj('✅ En büyük yüzey alanı, en küçük basınç: tuğla en az batıyor.', 'iyi'); if (!ciz.bitti) { ciz.bitti = true; api.soru(g.soru, '🎯 Doğru yüzü seçtin! Şimdi yanıtla'); } }
      else if (yuz !== null) api.mesaj('Bu yüzde basınç daha büyük, tuğla daha çok batıyor. Başka bir yüzü dene.', 'bilgi');
    }
    ciz();
  }

  function sivi(g, api) {
    var e = api.e, sv = api.sv, h = 0, RO = 1000;
    var s = sv('svg', { viewBox: '0 0 600 340', class: 'isik-svg', role: 'img', 'aria-label': 'Su içinde dalgıç' });
    sahneEkle(api, s);
    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '🤿 Derinlik'));
    var sl = e('input', { type: 'range', min: 0, max: 60, value: 0, class: 'hal-sl', 'aria-label': 'Derinlik' });
    var ol = e('button', { type: 'button', class: 'btn btn-sari ay-onay' }, '📏 Ölç');
    ctl.appendChild(sl); ctl.appendChild(ol); api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 340, rx: 16, fill: '#e0f2fe' }, s);
      sv('rect', { x: 150, y: 40, width: 300, height: 290, fill: '#38bdf8', 'fill-opacity': 0.55, stroke: '#0369a1', 'stroke-width': 3 }, s);
      for (var m = 0; m <= 6; m++) { var y = 40 + m * 45; sv('line', { x1: 150, y1: y, x2: 160, y2: y, stroke: '#0c4a6e', 'stroke-width': 2 }, s); var t = sv('text', { x: 140, y: y + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#0c4a6e' }, s); t.textContent = m + ' m'; }
      var dy = 40 + h / 10 * 45;
      var dg = sv('text', { x: 300, y: dy + 12, 'text-anchor': 'middle', 'font-size': 34 }, s); dg.textContent = '🤿';
      var P = RO * G * (h / 10);
      var t2 = sv('text', { x: 300, y: 330 - 4, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#0c4a6e' }, s);
      t2.textContent = 'h = ' + (h / 10).toFixed(1).replace('.', ',') + ' m → P = ρ·g·h = ' + (P / 1000).toFixed(1).replace('.', ',') + ' kPa';
      sv('line', { x1: 460, y1: 40, x2: 460 + P / 1000 * 3, y2: 40, stroke: '#dc2626', 'stroke-width': 0 }, s);
      var bar = sv('rect', { x: 470, y: dy - 6, width: Math.max(4, P / 1000 * 2), height: 12, fill: '#ef4444', rx: 4 }, s);
    }
    sl.addEventListener('input', function () { h = +sl.value; ciz(); });
    ol.addEventListener('click', function () {
      var P = RO * G * (h / 10);
      if (Math.abs(P - 30000) <= 1000) api.bitir('🎉 Doğru derinlik: 3 m!', g.acik);
      else api.mesaj('Şu an basınç ' + (P / 1000).toFixed(1).replace('.', ',') + ' kPa. ' + (P < 30000 ? 'Daha derine in.' : 'Biraz yukarı çık.') + ' (P = ρ·g·h)', 'bilgi');
    });
    ciz();
  }

  function kaldirma(g, api) {
    var e = api.e, sv = api.sv;
    var CIS = [{ ad: 'Tahta', ro: 600, em: '🪵' }, { ad: 'Buz', ro: 920, em: '🧊' }, { ad: 'Alüminyum', ro: 2700, em: '🔩' }, { ad: 'Demir', ro: 7800, em: '⚓' }, { ad: 'Demir gemi (içi boş)', ro: 700, em: '🚢' }];
    var denendi = {}, secili = null;
    var s = sv('svg', { viewBox: '0 0 600 340', class: 'isik-svg', role: 'img', 'aria-label': 'Suya bırakılan cisimler' });
    sahneEkle(api, s);
    var ctl = e('div', { class: 'oy-araclar' });
    CIS.forEach(function (c, k) {
      var b = e('button', { type: 'button', class: 'oy-arac' }, c.em + ' ' + c.ad);
      b.addEventListener('click', function () { secili = k; denendi[k] = true; ciz(); kontrol(); });
      ctl.appendChild(b);
    });
    api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 340, rx: 16, fill: '#e0f2fe' }, s);
      sv('rect', { x: 150, y: 120, width: 300, height: 200, fill: '#38bdf8', 'fill-opacity': 0.55, stroke: '#0369a1', 'stroke-width': 3 }, s);
      if (secili === null) { var t0 = sv('text', { x: 300, y: 60, 'text-anchor': 'middle', 'font-size': 18, fill: '#475569', 'font-weight': 800 }, s); t0.textContent = 'Bir cisim seç ve suya bırak'; return; }
      var c = CIS[secili], yuzer = c.ro < 1000, oran = Math.min(1, c.ro / 1000);
      var cy = yuzer ? 120 + (oran - 0.5) * 60 : 290;
      var el = sv('text', { x: 300, y: cy + 14, 'text-anchor': 'middle', 'font-size': 56 }, s); el.textContent = c.em;
      var W_ = c.ro * 0.001 * G, Fk = yuzer ? W_ : 1000 * 0.001 * G;
      var t = sv('text', { x: 300, y: 40, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: '#0f172a' }, s);
      t.textContent = c.ad + ': yoğunluk ' + c.ro + ' kg/m³ (su: 1000)';
      var t2 = sv('text', { x: 300, y: 66, 'text-anchor': 'middle', 'font-size': 15, fill: yuzer ? '#15803d' : '#b91c1c', 'font-weight': 800 }, s);
      t2.textContent = (yuzer ? 'YÜZER' : 'BATAR') + ' · Ağırlık ' + W_.toFixed(1).replace('.', ',') + ' N, kaldırma kuvveti ' + Fk.toFixed(1).replace('.', ',') + ' N' + (yuzer ? ' (dengelenmiş)' : ' (ağırlıktan küçük)');
    }
    function kontrol() {
      var sayi = Object.keys(denendi).length;
      if (sayi < CIS.length) { api.mesaj('Denenen cisim: ' + sayi + ' / ' + CIS.length, 'bilgi'); return; }
      if (!kontrol.acildi) { kontrol.acildi = true; api.mesaj('✅ Hepsini denedin.', 'iyi'); api.soru(g.soru, '🔎 Gözlemini yanıtla'); }
    }
    ciz();
  }

  function hava(g, api) {
    var e = api.e, sv = api.sv, yuk = 0;
    var s = sv('svg', { viewBox: '0 0 600 340', class: 'isik-svg', role: 'img', 'aria-label': 'Dağ ve barometre' });
    sahneEkle(api, s);
    var ctl = e('div', { class: 'hal-ctl' });
    ctl.appendChild(e('span', { class: 'hal-soguk' }, '⛰️ Yükseklik'));
    var sl = e('input', { type: 'range', min: 0, max: 8000, step: 100, value: 0, class: 'hal-sl', 'aria-label': 'Yükseklik' });
    ctl.appendChild(sl); api.alan.appendChild(ctl);
    function ciz() {
      s.innerHTML = '';
      sv('rect', { x: 0, y: 0, width: 600, height: 340, rx: 16, fill: '#e0f2fe' }, s);
      sv('polygon', { points: '20,330 300,60 580,330', fill: '#94a3b8' }, s);
      sv('polygon', { points: '230,130 300,60 370,130 330,140 300,120 270,140', fill: '#f8fafc' }, s);
      var y = 330 - yuk / 8000 * 270, x = 20 + (330 - y) / 270 * 280 + 12;
      var t = sv('text', { x: x, y: y, 'font-size': 28 }, s); t.textContent = '🧗';
      var P = 1013 * Math.exp(-yuk / 8400);
      var kutu = sv('rect', { x: 400, y: 20, width: 180, height: 80, rx: 12, fill: '#fff', stroke: '#0369a1', 'stroke-width': 3 }, s);
      var t1 = sv('text', { x: 490, y: 52, 'text-anchor': 'middle', 'font-size': 14, fill: '#475569', 'font-weight': 800 }, s); t1.textContent = 'Yükseklik: ' + yuk + ' m';
      var t2 = sv('text', { x: 490, y: 82, 'text-anchor': 'middle', 'font-size': 22, fill: '#0369a1', 'font-weight': 900 }, s); t2.textContent = Math.round(P) + ' hPa';
      if (yuk >= 3000 && !ciz.bitti) { ciz.bitti = true; api.mesaj('✅ ' + yuk + ' m yükseklikte basınç yaklaşık ' + Math.round(P) + ' hPa.', 'iyi'); api.soru(g.soru, '🎯 Zirveye çıktın! Şimdi yanıtla'); }
    }
    sl.addEventListener('input', function () { yuk = +sl.value; ciz(); });
    ciz();
  }
})();
