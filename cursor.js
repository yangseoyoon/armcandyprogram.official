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

/* 마우스 커서: 애니메이션 GIF(images/cursor/cursor_ms2.gif)
   CSS의 cursor: url(...)은 GIF의 "첫 프레임만" 보여 주기 때문에 움직이지 않는다.
   그래서 진짜 커서는 숨기고, 마우스를 따라다니는 <img>를 하나 띄워서 GIF가 움직이게 한다.
   - 마우스가 한 번이라도 움직여야 기본 커서를 숨긴다(스크립트가 안 돌면 기존 사탕 커서가 그대로 남는다).
   - 이 이미지는 클릭을 가로채지 않는다(pointer-events: none). */
(function () {
  var SRC = 'images/cursor/cursor_ms2.gif?v=1';
  var SIZE = 56; // 화면에 보이는 크기(원본 300px, 캐릭터는 그 안의 약 87%)
  var HOT_X = 0.53; // 클릭 기준점(이미지 안 비율): 몸통(하트) 중앙
  var HOT_Y = 0.4;

  var img = document.createElement('img');
  img.src = SRC;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.draggable = false;
  img.style.cssText =
    'position:fixed;left:0;top:0;width:' + SIZE + 'px;height:' + SIZE + 'px;' +
    'pointer-events:none;z-index:2147483646;opacity:0;will-change:transform;' +
    'user-select:none;-webkit-user-drag:none;';
  document.documentElement.appendChild(img);

  var shown = false;

  function move(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return; // 터치/펜은 따로 보여 줄 필요 없음
    if (!shown) {
      shown = true;
      document.documentElement.classList.add('has-gif-cursor');
    }
    img.style.opacity = '1';
    img.style.transform =
      'translate3d(' + (e.clientX - SIZE * HOT_X) + 'px,' + (e.clientY - SIZE * HOT_Y) + 'px,0)';
  }

  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerdown', move, { passive: true });
  // 창 밖으로 나가면 숨긴다
  document.documentElement.addEventListener('mouseleave', function () {
    img.style.opacity = '0';
  });
  document.documentElement.addEventListener('mouseenter', function () {
    if (shown) img.style.opacity = '1';
  });
})();
