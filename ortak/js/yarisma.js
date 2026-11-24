// Takım Yarışması – akıllı tahtada 2-4 takımlı soru yarışması (ortaokul ünite soruları)
(function () {
  'use strict';
  var kok = document.getElementById('oyun');
  if (!kok) return;
  var KAYIT = 'fen-takim-yarismasi-v1';
  var RENKLER = [{ ad: 'Kırmızı Takım', sinif: 't0' }, { ad: 'Mavi Takım', sinif: 't1' }, { ad: 'Yeşil Takım', sinif: 't2' }, { ad: 'Sarı Takım', sinif: 't3' }];
  var HARF = ['A', 'B', 'C', 'D'];

  var ayar = { sinif: '5', uniteler: [], takim: 2, adlar: RENKLER.map(function (r) { return r.ad; }), adet: 5, sure: 30, calma: true, ses: true };
  try {
    var eski = JSON.parse(localStorage.getItem(KAYIT) || 'null');
    if (eski) Object.keys(ayar).forEach(function (k) { if (eski[k] !== undefined) ayar[k] = eski[k]; });
  } catch (x) {}
  // Bağlantıyla ön seçim: ?sinif=7&unite=2,3
  var adres = new URLSearchParams(window.location.search);
  if (['5', '6', '7', '8'].indexOf(adres.get('sinif')) >= 0) {
    ayar.sinif = adres.get('sinif');
    ayar.uniteler = (adres.get('unite') || '').split(',').map(Number).filter(Boolean);
  }
  function kaydet() { try { localStorage.setItem(KAYIT, JSON.stringify(ayar)); } catch (x) {} }

  var onbellek = {};
  function veriAl(sinif) {
    if (onbellek[sinif]) return Promise.resolve(onbellek[sinif]);
    return fetch('/ortak/veri/yarisma-' + sinif + '.json').then(function (r) {
      if (!r.ok) throw new Error('yok');
      return r.json();
    }).then(function (v) { onbellek[sinif] = v; return v; });
  }

  function e(tag, attrs, ic) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (a) { if (a === 'class') n.className = attrs[a]; else n.setAttribute(a, attrs[a]); });
    if (ic !== undefined) n.textContent = ic;
    return n;
  }
  function dugme(sinif, metin, is) {
    var b = e('button', { type: 'button', class: sinif }, metin);
    b.addEventListener('click', is);
    return b;
  }
  function karistir(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }

  /* ---------- Ses ---------- */
  var ses = null;
  function bip(notalar) {
    if (!ayar.ses) return;
    try {
      ses = ses || new (window.AudioContext || window.webkitAudioContext)();
      notalar.forEach(function (n, k) {
        var o = ses.createOscillator(), g = ses.createGain(), z = ses.currentTime + k * 0.13;
        o.frequency.value = n; o.type = 'triangle';
        g.gain.setValueAtTime(0.18, z); g.gain.exponentialRampToValueAtTime(0.001, z + 0.16);
        o.connect(g); g.connect(ses.destination); o.start(z); o.stop(z + 0.17);
      });
    } catch (x) {}
  }

  /* ---------- Durum ---------- */
  var oyun = null, saat = null, tusIsi = {};
  function saatDurdur() { if (saat) { clearInterval(saat); saat = null; } }

  document.addEventListener('keydown', function (ev) {
    if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var k = ev.key.toUpperCase();
    var i = HARF.indexOf(k); if (i < 0) i = ['1', '2', '3', '4'].indexOf(k);
    if (i >= 0 && tusIsi.sec) { ev.preventDefault(); tusIsi.sec(i); }
    else if ((ev.key === 'Enter' || ev.key === ' ') && tusIsi.ileri && !(ev.target && ev.target.tagName === 'BUTTON')) { ev.preventDefault(); tusIsi.ileri(); }
  });

  /* ---------- Ayar ekranı ---------- */
  function ayarEkrani() {
    saatDurdur(); oyun = null; tusIsi = {};
    kok.innerHTML = '';
    var kutu = e('div', { class: 'ys-ayar' });
    kok.appendChild(kutu);
    kutu.appendChild(e('h2', {}, '🏆 Yarışmayı kur'));

    function secimSatiri(baslik, secenekler, secili, is) {
      var s = e('div', { class: 'ys-satir' });
      s.appendChild(e('strong', {}, baslik));
      var g = e('div', { class: 'oy-araclar' });
      secenekler.forEach(function (o) {
        var b = dugme('oy-arac' + (o[0] === secili ? ' aktif' : ''), o[1], function () { is(o[0]); });
        b.setAttribute('aria-pressed', o[0] === secili ? 'true' : 'false');
        g.appendChild(b);
      });
      s.appendChild(g);
      return s;
    }
    function yenile() { kaydet(); ayarEkrani(); }

    kutu.appendChild(secimSatiri('1. Sınıf', [['5', '5. Sınıf'], ['6', '6. Sınıf'], ['7', '7. Sınıf'], ['8', '8. Sınıf']], ayar.sinif, function (v) { if (v !== ayar.sinif) { ayar.sinif = v; ayar.uniteler = []; } yenile(); }));

    var us = e('div', { class: 'ys-satir' });
    us.appendChild(e('strong', {}, '2. Üniteler (bir ya da daha fazla)'));
    var uList = e('div', { class: 'ys-uniteler' }, 'Üniteler yükleniyor…');
    us.appendChild(uList);
    kutu.appendChild(us);

    kutu.appendChild(secimSatiri('3. Takım sayısı', [[2, '2'], [3, '3'], [4, '4']], ayar.takim, function (v) { ayar.takim = v; yenile(); }));
    var adlar = e('div', { class: 'ys-adlar' });
    for (var i = 0; i < ayar.takim; i++) {
      (function (i) {
        var g = e('input', { type: 'text', maxlength: 20, class: 'ys-ad ' + RENKLER[i].sinif, 'aria-label': (i + 1) + '. takımın adı' });
        g.value = ayar.adlar[i];
        g.addEventListener('input', function () { ayar.adlar[i] = g.value; kaydet(); });
        adlar.appendChild(g);
      })(i);
    }
    kutu.appendChild(adlar);

    kutu.appendChild(secimSatiri('4. Her takıma soru', [[3, '3'], [5, '5'], [8, '8']], ayar.adet, function (v) { ayar.adet = v; yenile(); }));
    kutu.appendChild(secimSatiri('5. Soru süresi', [[20, '20 sn'], [30, '30 sn'], [45, '45 sn'], [0, 'Süresiz']], ayar.sure, function (v) { ayar.sure = v; yenile(); }));
    kutu.appendChild(secimSatiri('6. Yanlışta soru sıradaki takıma geçsin mi?', [[true, 'Evet (yarım puan)'], [false, 'Hayır']], ayar.calma, function (v) { ayar.calma = v; yenile(); }));
    kutu.appendChild(secimSatiri('Ses', [[true, '🔊 Açık'], [false, '🔇 Kapalı']], ayar.ses, function (v) { ayar.ses = v; yenile(); }));

    var not = e('p', { class: 'ys-not', 'aria-live': 'polite' });
    kutu.appendChild(not);
    var basla = dugme('btn btn-sari ys-basla', '▶ Yarışmayı başlat', function () { baslat(); });
    basla.disabled = true;
    kutu.appendChild(basla);

    var sinif = ayar.sinif;
    veriAl(sinif).then(function (v) {
      if (!uList.isConnected) return;
      uList.textContent = '';
      var mevcut = v.uniteler.map(function (u) { return u.no; });
      ayar.uniteler = ayar.uniteler.filter(function (n) { return mevcut.indexOf(n) >= 0; });
      function durumYaz() {
        var havuz = v.uniteler.filter(function (u) { return ayar.uniteler.indexOf(u.no) >= 0; }).reduce(function (t, u) { return t + u.sorular.length; }, 0);
        basla.disabled = !havuz;
        if (!havuz) not.textContent = 'Başlamak için en az bir ünite seç.';
        else {
          var n = Math.min(ayar.adet, Math.floor(havuz / ayar.takim));
          not.textContent = 'Seçilen ünitelerde ' + havuz + ' soru var. Toplam ' + (n * ayar.takim) + ' soru sorulacak (her takıma ' + n + ').' + (n < ayar.adet ? ' Daha fazla soru için ünite ekle.' : '');
        }
        [].forEach.call(uList.querySelectorAll('button[data-no]'), function (b) {
          var s = ayar.uniteler.indexOf(+b.getAttribute('data-no')) >= 0;
          b.classList.toggle('aktif', s); b.setAttribute('aria-pressed', s ? 'true' : 'false');
        });
      }
      v.uniteler.forEach(function (u) {
        var b = dugme('ys-unite', u.ikon + ' ' + u.no + '. ' + u.ad, function () {
          var k = ayar.uniteler.indexOf(u.no);
          if (k >= 0) ayar.uniteler.splice(k, 1); else ayar.uniteler.push(u.no);
          kaydet(); durumYaz();
        });
        b.setAttribute('data-no', u.no);
        uList.appendChild(b);
      });
      uList.appendChild(dugme('ys-unite ys-tumu', '✔ Tümünü seç / kaldır', function () {
        ayar.uniteler = ayar.uniteler.length === mevcut.length ? [] : mevcut.slice();
        kaydet(); durumYaz();
      }));
      durumYaz();
    }).catch(function () {
      if (!uList.isConnected) return;
      uList.textContent = 'Sorular yüklenemedi. ';
      uList.appendChild(dugme('oy-arac', '↺ Tekrar dene', ayarEkrani));
    });
  }

  /* ---------- Oyun ---------- */
  function soruHavuzu(v) {
    // Üniteleri dengeli dağıt: her üniteden sırayla birer soru
    var kuyruklar = karistir(v.uniteler.filter(function (u) { return ayar.uniteler.indexOf(u.no) >= 0; }).map(function (u) {
      return karistir(u.sorular).map(function (s) { return { soru: s[0], sec: s[1], dogru: s[2], acik: s[3], unite: u.ad }; });
    }));
    var sonuc = [], eklendi = true;
    while (eklendi) {
      eklendi = false;
      kuyruklar.forEach(function (k) { if (k.length) { sonuc.push(k.pop()); eklendi = true; } });
    }
    return sonuc;
  }

  function baslat() {
    veriAl(ayar.sinif).then(function (v) {
      var havuz = soruHavuzu(v);
      var n = Math.min(ayar.adet, Math.floor(havuz.length / ayar.takim));
      if (!n) return;
      var takimlar = [];
      for (var i = 0; i < ayar.takim; i++) takimlar.push({ ad: (ayar.adlar[i] || '').trim() || RENKLER[i].ad, renk: RENKLER[i].sinif, puan: 0, dogru: 0, yari: true, cift: true });
      var sorular = karistir(havuz.slice(0, n * ayar.takim)).map(function (s) {
        var sira = karistir([0, 1, 2, 3]);
        return { soru: s.soru, sec: sira.map(function (k) { return s.sec[k]; }), dogru: sira.indexOf(s.dogru), acik: s.acik, unite: s.unite };
      });
      oyun = { takimlar: takimlar, sorular: sorular, i: 0, yanlislar: [] };
      soruEkrani();
      kok.scrollIntoView({ block: 'start' });
    });
  }

  function puanTablosu(aktif) {
    var t = e('div', { class: 'ys-puanlar' });
    oyun.takimlar.forEach(function (tk, k) {
      var d = e('div', { class: 'ys-takim ' + tk.renk + (k === aktif ? ' aktif' : '') });
      d.appendChild(e('span', {}, tk.ad));
      d.appendChild(e('b', {}, String(tk.puan)));
      t.appendChild(d);
    });
    return t;
  }

  function soruEkrani() {
    saatDurdur();
    var q = oyun.sorular[oyun.i], asil = oyun.i % oyun.takimlar.length;
    var cevaplayan = asil, calmada = false, bitti = false, ciftAcik = false, kalan = ayar.sure, sonAn = 0, duraklat = false;
    var kapali = [false, false, false, false];
    kok.innerHTML = '';
    var tablo = puanTablosu(asil); kok.appendChild(tablo);
    var bilgi = e('div', { class: 'ys-bilgi' });
    bilgi.appendChild(e('span', {}, 'Soru ' + (oyun.i + 1) + ' / ' + oyun.sorular.length + ' · ' + q.unite));
    bilgi.appendChild(dugme('oy-arac', '✖ Yarışmayı bitir', function () {
      if (window.confirm('Yarışma bitirilsin mi? Şu anki puanlarla sonuç ekranı açılır.')) sonucEkrani();
    }));
    kok.appendChild(bilgi);
    var sira = e('div', { class: 'ys-sira ' + oyun.takimlar[asil].renk, 'aria-live': 'polite' }, 'Sıra: ' + oyun.takimlar[asil].ad);
    kok.appendChild(sira);

    var sureKutu = e('div', { class: 'ys-sure' }), cubuk = e('div', { class: 'ys-cubuk' }), cubukIc = e('i'), sayac = e('b');
    cubuk.appendChild(cubukIc); sureKutu.appendChild(cubuk); sureKutu.appendChild(sayac);
    var dur = dugme('oy-arac', '⏸', function () {
      duraklat = !duraklat; dur.textContent = duraklat ? '▶' : '⏸';
      secKutu.classList.toggle('gizli', duraklat); soruEl.classList.toggle('gizli', duraklat);
    });
    dur.setAttribute('aria-label', 'Süreyi duraklat veya sürdür');
    sureKutu.appendChild(dur);
    if (ayar.sure) kok.appendChild(sureKutu);

    var soruEl = e('p', { class: 'ys-soru' }, q.soru); kok.appendChild(soruEl);
    var secKutu = e('div', { class: 'ys-secenekler' });
    var butonlar = q.sec.map(function (m, k) {
      var b = dugme('ys-sec s' + k, '', function () { cevapla(k); });
      b.appendChild(e('i', {}, HARF[k])); b.appendChild(e('span', {}, m));
      secKutu.appendChild(b);
      return b;
    });
    kok.appendChild(secKutu);

    var jokerler = e('div', { class: 'oy-araclar ys-jokerler' });
    var tk = oyun.takimlar[asil];
    var j1 = dugme('oy-arac', '✂️ Yarı yarıya', function () {
      if (bitti || calmada || !tk.yari) return;
      tk.yari = false; j1.disabled = true;
      karistir([0, 1, 2, 3].filter(function (k) { return k !== q.dogru; })).slice(0, 2).forEach(function (k) { kapali[k] = true; butonlar[k].disabled = true; butonlar[k].classList.add('elendi'); });
    });
    var j2 = dugme('oy-arac', '✨ Çift puan', function () {
      if (bitti || calmada || !tk.cift) return;
      tk.cift = false; ciftAcik = true; j2.disabled = true; j2.classList.add('aktif');
    });
    j1.disabled = !tk.yari; j2.disabled = !tk.cift;
    jokerler.appendChild(e('span', { class: 'ys-joker-baslik' }, 'Jokerler (her takıma birer kez):'));
    jokerler.appendChild(j1); jokerler.appendChild(j2);
    kok.appendChild(jokerler);
    var alt = e('div', { class: 'ys-alt', 'aria-live': 'polite' }); kok.appendChild(alt);

    function sureCiz() {
      var toplam = calmada ? 15 : ayar.sure;
      sayac.textContent = Math.ceil(kalan) + ' sn';
      cubukIc.style.width = Math.max(0, kalan / toplam * 100) + '%';
      sureKutu.classList.toggle('az', kalan <= 5);
    }
    function saatBaslat() {
      saatDurdur();
      if (!ayar.sure) return;
      sonAn = Date.now(); sureCiz();
      var sonSn = Math.ceil(kalan);
      saat = setInterval(function () {
        if (!cubuk.isConnected) { saatDurdur(); return; }
        var simdi = Date.now();
        if (!duraklat) kalan -= (simdi - sonAn) / 1000;
        sonAn = simdi;
        var sn = Math.ceil(kalan);
        if (sn !== sonSn && sn <= 5 && sn > 0) bip([660]);
        sonSn = sn;
        if (kalan <= 0) { kalan = 0; sureCiz(); sureDoldu(); } else sureCiz();
      }, 100);
    }

    function calmayaGec(neden) {
      calmada = true; ciftAcik = false;
      cevaplayan = (asil + 1) % oyun.takimlar.length;
      var yeni = oyun.takimlar[cevaplayan];
      sira.className = 'ys-sira ' + yeni.renk;
      sira.textContent = neden + ' Cevap hakkı geçti: ' + yeni.ad + ' (yarım puan)';
      [].forEach.call(tablo.children, function (c, k) { c.classList.toggle('aktif', k === cevaplayan); });
      j1.disabled = true; j2.disabled = true; j2.classList.remove('aktif');
      kalan = 15; duraklat = false; dur.textContent = '⏸';
      secKutu.classList.remove('gizli'); soruEl.classList.remove('gizli');
      saatBaslat();
    }

    function cevapla(k) {
      if (bitti || duraklat || kapali[k]) return;
      if (k === q.dogru) {
        var puan = calmada ? 50 : 100 + (ayar.sure ? Math.round(kalan / ayar.sure * 50) : 0);
        if (ciftAcik) puan *= 2;
        var kazanan = oyun.takimlar[cevaplayan];
        kazanan.puan += puan; kazanan.dogru++;
        bip([523, 659, 784]);
        bitir('✅ Doğru! ' + kazanan.ad + ' +' + puan + ' puan', true);
      } else {
        kapali[k] = true; butonlar[k].disabled = true; butonlar[k].classList.add('yanlis');
        bip([220, 175]);
        if (ayar.calma && !calmada) calmayaGec('❌ Yanlış.');
        else bitir('❌ Yanlış cevap.', false);
      }
    }
    function sureDoldu() {
      if (bitti) return;
      bip([200, 150]);
      if (ayar.calma && !calmada) calmayaGec('⏰ Süre doldu.');
      else bitir('⏰ Süre doldu.', false);
    }
    function bitir(baslik, bilindi) {
      bitti = true; saatDurdur(); tusIsi.sec = null;
      if (!bilindi || calmada) oyun.yanlislar.push(q);
      butonlar.forEach(function (b, k) { b.disabled = true; if (k === q.dogru) { b.classList.add('dogru'); b.classList.remove('elendi'); } });
      j1.disabled = true; j2.disabled = true; dur.disabled = true;
      var yeni = puanTablosu(cevaplayan); tablo.replaceWith(yeni); tablo = yeni;
      var kutu = e('div', { class: 'oy-basari' });
      kutu.appendChild(e('h3', {}, baslik));
      kutu.appendChild(e('p', {}, 'Doğru cevap: ' + HARF[q.dogru] + ') ' + q.sec[q.dogru] + ' — ' + q.acik));
      var son = oyun.i === oyun.sorular.length - 1;
      var ileri = function () { tusIsi.ileri = null; if (son) sonucEkrani(); else { oyun.i++; soruEkrani(); } };
      var b = dugme('btn btn-sari', son ? '🏁 Sonuçları göster' : 'Sonraki soru ▶', ileri);
      kutu.appendChild(b); alt.appendChild(kutu);
      // Aynı tuş vuruşunun soruyu atlamaması için kısa gecikme
      setTimeout(function () { if (b.isConnected) tusIsi.ileri = ileri; }, 400);
    }

    tusIsi = { sec: cevapla, ileri: null };
    saatBaslat();
  }

  function sonucEkrani() {
    saatDurdur(); tusIsi = {};
    kok.innerHTML = '';
    var sirali = oyun.takimlar.slice().sort(function (a, b) { return b.puan - a.puan; });
    var enYuksek = sirali[0].puan;
    var birinciler = sirali.filter(function (t) { return t.puan === enYuksek; });
    var kutu = e('div', { class: 'ys-sonuc' });
    kutu.appendChild(e('div', { class: 'ys-kupa' }, '🎉🏆🎉'));
    kutu.appendChild(e('h2', {}, !enYuksek ? 'Henüz puan alan olmadı' : birinciler.length > 1 ? 'Berabere: ' + birinciler.map(function (t) { return t.ad; }).join(' ve ') : 'Kazanan: ' + birinciler[0].ad));
    var yer = 0, onceki = null;
    sirali.forEach(function (t, k) {
      if (t.puan !== onceki) { yer = k + 1; onceki = t.puan; }
      var d = e('div', { class: 'ys-derece ' + t.renk });
      d.appendChild(e('span', {}, ({ 1: '🥇', 2: '🥈', 3: '🥉' }[yer] || yer + '.') + ' ' + t.ad));
      d.appendChild(e('span', {}, t.dogru + ' doğru'));
      d.appendChild(e('b', {}, t.puan + ' puan'));
      kutu.appendChild(d);
    });
    if (oyun.yanlislar.length) {
      var det = e('details', { class: 'ys-tekrar' });
      det.appendChild(e('summary', {}, '📚 Üzerinden geçilecek sorular (' + oyun.yanlislar.length + ')'));
      var ol = e('ol');
      oyun.yanlislar.forEach(function (q) {
        var li = e('li');
        li.appendChild(e('strong', {}, q.soru));
        li.appendChild(e('div', {}, 'Cevap: ' + q.sec[q.dogru] + ' — ' + q.acik));
        ol.appendChild(li);
      });
      det.appendChild(ol); kutu.appendChild(det);
    }
    var g = e('div', { class: 'oy-araclar ys-son-dugmeler' });
    g.appendChild(dugme('btn btn-sari', '🔁 Aynı ayarlarla tekrar', baslat));
    g.appendChild(dugme('oy-arac', '⚙️ Yeni yarışma kur', ayarEkrani));
    kutu.appendChild(g);
    kok.appendChild(kutu);
    bip([523, 659, 784, 1047]);
  }

  ayarEkrani();
})();
