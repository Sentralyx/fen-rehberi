// Ortak oyun kütüphanesi: görev sekmeleri, ilerleme kaydı, soru ve başarı panelleri
(function (w) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
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
  function karistir(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }

  // o: { anahtar, gorevler:[{ad, gorev, ...}], serbest:{ad, gorev, ...} | null, kur:function(g, i, api) }
  function oyun(o) {
    var kok = document.getElementById('oyun');
    if (!kok) return;
    var kayit = {};
    try { kayit = JSON.parse(localStorage.getItem(o.anahtar) || '{}'); } catch (x) { kayit = {}; }
    kayit.bitti = kayit.bitti || [];
    function kaydet() { try { localStorage.setItem(o.anahtar, JSON.stringify(kayit)); } catch (x) {} }
    var sev = 0, temiz = [], raflar = [];

    function yukle(i) {
      temiz.forEach(function (f) { f(); }); temiz = [];
      raflar.forEach(function (r) { cancelAnimationFrame(r.id); r.iptal = true; }); raflar = [];
      sev = i;
      var g = i === 'serbest' ? o.serbest : o.gorevler[i];
      kok.innerHTML = '';
      var chips = e('div', { class: 'oy-chips' });
      o.gorevler.forEach(function (gg, k) {
        var tm = kayit.bitti.indexOf(k) >= 0;
        var b = e('button', { type: 'button', class: 'oy-chip' + (sev === k ? ' aktif' : '') + (tm ? ' bitti' : '') }, (tm ? '✓ ' : '') + (k + 1));
        b.title = gg.ad;
        b.addEventListener('click', function () { yukle(k); });
        chips.appendChild(b);
      });
      if (o.serbest) {
        var bs = e('button', { type: 'button', class: 'oy-chip' + (sev === 'serbest' ? ' aktif' : '') }, '🧪 Serbest');
        bs.addEventListener('click', function () { yukle('serbest'); });
        chips.appendChild(bs);
      }
      kok.appendChild(chips);
      var gv = e('div', { class: 'oy-gorev' });
      gv.appendChild(e('h2', {}, i === 'serbest' ? '🧪 ' + g.ad : 'Görev ' + (i + 1) + ': ' + g.ad));
      gv.appendChild(e('p', { class: 'oy-hedef', html: '🎯 ' + g.gorev }));
      kok.appendChild(gv);
      var alan = e('div', { class: 'ol-alan' });
      var durum = e('div', { class: 'oy-durum bilgi', 'aria-live': 'polite', style: 'display:none' });
      var sonuc = e('div', { class: 'oy-sonuc' });
      kok.appendChild(alan); kok.appendChild(durum); kok.appendChild(sonuc);

      var api = {
        alan: alan, sonuc: sonuc, i: i, e: e, sv: sv, karistir: karistir, NS: NS,
        temizle: function (f) { temiz.push(f); },
        raf: function (fn) {
          var r = { id: 0, iptal: false, son: performance.now() };
          function dongu(z) {
            if (r.iptal) return;
            var dt = Math.min(0.2, (z - r.son) / 1000); r.son = z;
            fn(dt);
            if (!r.iptal) r.id = requestAnimationFrame(dongu);
          }
          r.id = requestAnimationFrame(dongu);
          raflar.push(r);
        },
        mesaj: function (metin, tur) {
          if (!metin) { durum.style.display = 'none'; return; }
          durum.style.display = ''; durum.className = 'oy-durum ' + (tur || 'bilgi'); durum.textContent = metin;
        },
        bitir: function (baslik, acik) {
          if (i !== 'serbest' && kayit.bitti.indexOf(i) < 0) { kayit.bitti.push(i); kaydet(); }
          var chip = kok.querySelectorAll('.oy-chip')[i];
          if (chip && i !== 'serbest') { chip.classList.add('bitti'); chip.textContent = '✓ ' + (i + 1); }
          var kutu = e('div', { class: 'oy-basari' });
          kutu.appendChild(e('h3', {}, baslik));
          if (acik) kutu.appendChild(e('p', { html: '<strong>Neden böyle?</strong> ' + acik }));
          var son = i === o.gorevler.length - 1;
          var b;
          if (i === 'serbest') b = null;
          else if (son && o.serbest) b = e('button', { type: 'button', class: 'btn btn-sari' }, '🧪 Serbest moda geç');
          else if (!son) b = e('button', { type: 'button', class: 'btn btn-sari' }, 'Sonraki görev ▶');
          if (b) { b.addEventListener('click', function () { yukle(son ? 'serbest' : i + 1); }); kutu.appendChild(b); }
          var t = e('button', { type: 'button', class: 'oy-arac' }, '↺ Tekrar oyna');
          t.addEventListener('click', function () { yukle(i); });
          kutu.appendChild(document.createTextNode(' ')); kutu.appendChild(t);
          sonuc.innerHTML = ''; sonuc.appendChild(kutu);
        },
        // q: {q, sec:[doğru, yanlış...], acik}
        soru: function (q, baslik) {
          var kutu = e('div', { class: 'oy-basari' });
          kutu.appendChild(e('h3', {}, baslik || '🔎 Şimdi yanıtla'));
          kutu.appendChild(e('p', { class: 'el-soru-metin', html: q.q }));
          var secs = e('div', { class: 'hal-secenekler' }), mesaj = e('p', { class: 'hal-mesaj' });
          karistir(q.sec.map(function (m, k) { return { m: m, d: k === 0 }; })).forEach(function (op) {
            var b = e('button', { type: 'button', class: 'hal-secenek' }, op.m);
            b.addEventListener('click', function () {
              if (op.d) { b.classList.add('dogru'); api.bitir('🎉 Doğru, görev tamamlandı!', q.acik); }
              else { b.classList.add('yanlis'); b.disabled = true; mesaj.textContent = 'Henüz değil, tekrar düşün.'; }
            });
            secs.appendChild(b);
          });
          kutu.appendChild(secs); kutu.appendChild(mesaj);
          sonuc.innerHTML = ''; sonuc.appendChild(kutu);
        }
      };
      o.kur(g, i, api);
    }
    yukle(0);
  }

  w.OY = { oyun: oyun, e: e, sv: sv, karistir: karistir, NS: NS };
})(window);
