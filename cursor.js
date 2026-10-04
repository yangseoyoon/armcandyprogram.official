/* 클릭하면 사탕 커서 위치에서 분홍색 파티클이 터진다.
   모든 페이지에 cursor.css와 함께 연결. 클릭 동작 자체는 건드리지 않는다
   (파티클은 pointer-events:none, 캡처 단계에서 구경만 함). */
(function () {
  var COLORS = ['#ff15a7', '#ff4fb8', '#ff7ac8', '#ffa6dc', '#ffd0ee', '#ffffff'];
  var COUNT = 16;

  if (!document.documentElement.animate) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;overflow:visible;';

  function mount() {
    if (!layer.parentNode) document.documentElement.appendChild(layer);
  }

  function burst(x, y) {
    mount();
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      var size = 4 + Math.random() * 7;
      var heart = Math.random() < 0.3;
      p.style.cssText =
        'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;' +
        'margin:' + -size / 2 + 'px 0 0 ' + -size / 2 + 'px;pointer-events:none;will-change:transform,opacity;' +
        'background:' + COLORS[(Math.random() * COLORS.length) | 0] + ';' +
        'border-radius:' + (heart ? '30% 70% 50% 50%' : '50%') + ';';
      layer.appendChild(p);

      var angle = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.6;
      var dist = 28 + Math.random() * 44;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist + 10 + Math.random() * 14; // 살짝 아래로 떨어지는 느낌
      var rot = (Math.random() - 0.5) * 360;

      var anim = p.animate(
        [
          { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx * 0.7 + 'px,' + dy * 0.6 + 'px) scale(1) rotate(' + rot * 0.6 + 'deg)', opacity: 1, offset: 0.55 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.2) rotate(' + rot + 'deg)', opacity: 0 }
        ],
        { duration: 520 + Math.random() * 260, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'forwards' }
      );
      // 탭이 숨겨져 애니메이션이 멈춰도 파티클이 쌓이지 않게 타이머로도 정리한다
      anim.onfinish = (function (el) {
        return function () { el.remove(); };
      })(p);
      setTimeout(
        (function (el) {
          return function () { el.remove(); };
        })(p),
        1200
      );
    }
  }

  document.addEventListener(
    'pointerdown',
    function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      burst(e.clientX, e.clientY);
    },
    true
  );
})();
