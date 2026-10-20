/* SHOP 상품 호버 확대: CRT 효과의 R/G/B 레이어는 .stage를 복제한 것이라 :hover가 걸리지 않는다.
   그래서 원본 상품에 마우스를 올리면 같은 순서의 복제본에도 .is-hover를 걸어서 색수차 레이어가 같이 커지게 한다. */
(function () {
  var originals = document.querySelectorAll('.stage .product');
  if (!originals.length) return;

  originals.forEach(function (el, i) {
    function set(on) {
      document.querySelectorAll('.crt-layer').forEach(function (layer) {
        var copy = layer.querySelectorAll('.product')[i];
        if (copy) copy.classList.toggle('is-hover', on);
      });
    }
    // 바비 보톡스는 .product가 pointer-events: none 이라 안쪽 이미지에서 이벤트가 온다
    var target = el.classList.contains('product--botox') ? el.querySelector('img') : el;
    target.addEventListener('mouseenter', function () { set(true); });
    target.addEventListener('mouseleave', function () { set(false); });
  });
})();
