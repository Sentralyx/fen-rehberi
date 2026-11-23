// Deney Köşesi: tahmin, açıklamayı gösterme, yazdırma, "deneyi yaptım" ve sınıf filtresi.
(function () {
  function oku(anahtar) {
    try { return window.localStorage.getItem(anahtar); } catch (e) { return null; }
  }
  function yaz(anahtar, deger) {
    try {
      if (deger === null) window.localStorage.removeItem(anahtar);
      else window.localStorage.setItem(anahtar, deger);
    } catch (e) { /* depolama kapalıysa sessizce geç */ }
  }

  // ---- Deney sayfası ----
  var tahmin = document.querySelector(".tahmin");
  var secilen = null;
  if (tahmin) {
    var butonlar = tahmin.querySelectorAll(".secenek");
    var not = tahmin.querySelector(".tahmin-not");
    butonlar.forEach(function (b) {
      b.addEventListener("click", function () {
        butonlar.forEach(function (x) { x.classList.remove("secili"); });
        b.classList.add("secili");
        secilen = b;
        not.style.display = "block";
      });
    });
  }

  var aciklamaBtn = document.querySelector(".aciklama-btn");
  var aciklama = document.querySelector(".gizli-aciklama");
  if (aciklamaBtn && aciklama) {
    aciklamaBtn.addEventListener("click", function () {
      aciklama.classList.add("acik");
      aciklamaBtn.style.display = "none";
      var sonuc = aciklama.querySelector(".tahmin-sonuc");
      if (sonuc && tahmin) {
        var dogru = tahmin.querySelector('.secenek[data-dogru="1"]');
        var dogruMetin = dogru ? dogru.querySelector("span:last-child").textContent : "";
        if (!secilen) {
          sonuc.textContent = "Doğru cevap: " + dogruMetin + ". Bir dahaki deneyde önce tahminini yapmayı unutma!";
        } else if (secilen === dogru) {
          sonuc.textContent = "🎉 Tahminin doğruydu: " + dogruMetin;
        } else {
          sonuc.textContent = "Senin tahminin: " + secilen.querySelector("span:last-child").textContent +
            " · Doğru cevap: " + dogruMetin + ". Yanlış tahmin etmek de bilimin bir parçası!";
        }
      }
    });
  }

  var yazdir = document.querySelector(".yazdir-btn");
  if (yazdir) yazdir.addEventListener("click", function () { window.print(); });

  var yaptim = document.querySelector(".yaptim-btn");
  if (yaptim) {
    var anahtar = "deney-yapildi-" + yaptim.getAttribute("data-deney");
    var guncelle = function () {
      var yapildi = oku(anahtar) === "1";
      yaptim.classList.toggle("tamam", yapildi);
      yaptim.textContent = yapildi ? "✓ Bu deneyi yaptın!" : "Deneyi yaptım ✓";
    };
    yaptim.addEventListener("click", function () {
      yaz(anahtar, oku(anahtar) === "1" ? null : "1");
      guncelle();
    });
    guncelle();
  }

  // ---- Deney listesi ----
  document.querySelectorAll(".deney-kart[data-deney]").forEach(function (k) {
    if (oku("deney-yapildi-" + k.getAttribute("data-deney")) === "1") k.classList.add("yapildi");
  });

  var filtre = document.querySelector(".filtre");
  if (filtre) {
    filtre.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      filtre.querySelectorAll("button").forEach(function (x) { x.classList.remove("aktif"); });
      b.classList.add("aktif");
      var s = b.getAttribute("data-sinif");
      document.querySelectorAll(".deney-kart").forEach(function (k) {
        k.style.display = (s === "hepsi" || k.getAttribute("data-sinif") === s) ? "" : "none";
      });
    });
  }
})();
