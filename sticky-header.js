/* 스크롤해도 맨 위의 파란 멘트바(.ticker)와 네비게이션 바(.nav-wrap)가 화면 맨 위에 position: fixed로 고정된다.

   .stage는 scale.js가 transform으로 축소해 둔 요소 안에 있어서, 그 안에서는 position: fixed가 화면 기준으로
   동작하지 않는다(transform이 걸린 조상 안의 fixed는 그 조상 기준이 된다). 그래서
   1) 멘트바와 네비게이션 바 요소를 .stage 밖(.crt-frame 바로 아래, transform 없는 곳)의 고정 래퍼로 옮기고,
   2) 래퍼 안에서 .stage와 같은 비율(frame 폭 / 1920)로 직접 축소해서 같은 크기로 보이게 한다.
   3) CRT 효과의 R/G/B 레이어는 .stage를 통째로 복제한 것이라 옛 멘트바/네비게이션이 같이 복제돼 있다.
      그대로 두면 스크롤 때 제자리에 유령처럼 남으므로 복제본의 헤더는 지운다. */
(function () {
  var stage = document.querySelector('.stage');
  var ticker = document.querySelector('.stage > .ticker');
  var nav = document.querySelector('.stage > .nav-wrap');
  if (!stage || !ticker || !nav) return;

  var frame = document.querySelector('.crt-frame') || stage.parentNode;

  // R/G/B 복제 레이어 안의 헤더 복제본 제거
  document.querySelectorAll('.crt-layer .ticker, .crt-layer .nav-wrap').forEach(function (el) {
    el.remove();
  });

  // 고정 래퍼 (.stage 밖, transform 없는 곳)
  var fixed = document.createElement('div');
  fixed.className = 'fixed-header';
  fixed.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:0;z-index:900;transform-origin:top left;';
  var inner = document.createElement('div');
  inner.style.cssText = 'position:relative;width:1920px;height:136px;transform-origin:top left;';
  inner.appendChild(ticker);
  inner.appendChild(nav);
  fixed.appendChild(inner);
  frame.appendChild(fixed);

  function update() {
    var rect = frame.getBoundingClientRect();
    var scale = rect.width / 1920 || 1; // .stage와 같은 가로 축소 비율
    fixed.style.left = rect.left + 'px';
    // 페이지 맨 위에서는 원래 자리(프레임 위쪽), 스크롤하면 화면 맨 위(0)에 붙는다
    fixed.style.top = Math.max(0, rect.top) + 'px';
    inner.style.transform = 'scale(' + scale + ')';
  }

  // 계산이 가벼워서 스크롤 이벤트마다 바로 갱신한다(requestAnimationFrame은 창이 숨겨지면 멈춘다)
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
