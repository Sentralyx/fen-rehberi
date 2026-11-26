// İkinci menü satırında seçili bağlantı görünür olsun (dar ekranda satır yana kayar)
(function () {
  var satir = document.querySelector(".alt-menu-ic");
  if (!satir) return;
  var secili = satir.querySelectorAll("a.aktif");
  var hedef = secili[secili.length - 1];
  if (!hedef) return;
  var fark = hedef.getBoundingClientRect().right - satir.getBoundingClientRect().right;
  if (fark > 0) satir.scrollLeft += fark + 16;
})();

// «Kaldığın yerden devam et»: son açılan konu yalnızca bu tarayıcıda saklanır
(function () {
  var ANAHTAR = "site-son-konu";
  var yol = window.location.pathname;
  var baslik = document.querySelector(".sayfa-bas h1");
  try {
    if (baslik && document.getElementById("test")) {
      window.localStorage.setItem(ANAHTAR, JSON.stringify({ yol: yol, ad: baslik.textContent.trim() }));
    }
    var bag = document.getElementById("devam");
    if (!bag) return;
    var son = JSON.parse(window.localStorage.getItem(ANAHTAR) || "null");
    // Yalnızca site içi adres kabul edilir
    if (!son || typeof son.ad !== "string" || !/^\/(ortaokul|lise|kpss)\/[a-z0-9\-\/]*$/.test(son.yol)) return;
    var bolum = son.yol.split("/");
    var yer = bolum[1] === "kpss" ? "KPSS" : (bolum[3] ? bolum[3].replace("-sinif", ". Sınıf") + " " + (bolum[2] === "fen" ? "Fen" : "Matematik") : "");
    bag.href = son.yol;
    bag.textContent = "↩ Kaldığın yerden devam et: " + (yer ? yer + " · " : "") + son.ad;
    bag.hidden = false;
  } catch (e) { /* tarayıcı saklamaya izin vermiyorsa bağlantı gösterilmez */ }
})();
