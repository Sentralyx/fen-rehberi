// Oyun sayfaları: tam ekran (akıllı tahta) düğmesi
(function () {
  var b = document.querySelector('.tam-ekran-btn'), k = document.getElementById('oyun-kutu');
  if (!b || !k) return;
  if (!k.requestFullscreen) { b.style.display = 'none'; return; }
  b.addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else k.requestFullscreen();
  });
})();
