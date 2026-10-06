/* 메인 배너 슬라이더: 마우스(또는 터치)로 좌우로 끌어서 넘길 수 있다.
   - 끄는 동안은 자동 넘김(CSS 애니메이션)을 멈추고 손을 따라간다.
   - 놓으면 가장 가까운 배너가 가운데 오도록 붙고, 잠시 뒤 그 배너부터 자동 넘김이 다시 이어진다.
   - 끌지 않고 "클릭"만 했을 때, 가운데 배너 양옆으로 살짝 보이는 이웃 배너를 누르면 그쪽으로 한 칸 넘어간다.
   - 배너 2장이 번갈아 반복되는 구조(2칸 = LOOP)라서, 끌다가 범위를 넘으면 같은 모양의 반대쪽 위치로 이어 붙인다. */
(function () {
  var slider = document.querySelector('.banner-slider');
  var track = document.querySelector('.banner-track');
  if (!slider || !track) return;

  var PITCH = 1677; // 배너 폭 1590 + 간격 87
  var LOOP = PITCH * 2; // 분홍 -> 초록 -> 분홍 (한 주기)
  var PERIOD_MS = 14000; // main.css의 banner-slide 주기와 같아야 한다
  var GREEN_AT = 0.5; // 주기 중 초록 배너가 가운데에 멈춰 있기 시작하는 지점(keyframes 50%)
  var RESUME_AFTER_MS = 2500;
  var CENTER_LEFT = 165; // 가운데 배너가 차지하는 구간(1920 좌표계) 165 ~ 1755
  var CENTER_RIGHT = 1755;
  var CLICK_SLOP = 6; // 이만큼(1920 좌표계 px) 넘게 움직이면 클릭이 아니라 드래그로 본다

  var dragging = false;
  var startX = 0;
  var startOffset = 0;
  var downStageX = 0; // 누른 위치(슬라이더 안, 1920 좌표계)
  var lastX = 0;
  var resumeTimer = null;

  // 화면 크기에 따라 .stage가 축소돼 있으므로 포인터 이동량을 1920 좌표계로 환산
  function stageScale() {
    return slider.getBoundingClientRect().width / slider.offsetWidth || 1;
  }

  function currentX() {
    return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
  }

  // [-LOOP, 0] 범위로 접어 넣는다 (같은 모양이 2칸마다 반복되므로 눈에 띄지 않는다)
  function wrap(x) {
    while (x > 0) x -= LOOP;
    while (x < -LOOP) x += LOOP;
    return x;
  }

  function resumeAuto() {
    var idx = Math.round(-currentX() / PITCH);
    var isGreen = ((idx % 2) + 2) % 2 === 1;
    track.style.transition = 'none';
    track.style.transform = '';
    track.style.animation = 'none';
    void track.offsetWidth; // 애니메이션을 처음부터 다시 시작하려고 강제로 리플로우
    track.style.animation = 'banner-slide ' + PERIOD_MS + 'ms infinite';
    track.style.animationDelay = isGreen ? -PERIOD_MS * GREEN_AT + 'ms' : '0ms';
  }

  slider.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    clearTimeout(resumeTimer);
    startOffset = currentX();
    track.style.animation = 'none';
    track.style.transition = 'none';
    track.style.transform = 'translateX(' + startOffset + 'px)';
    dragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    downStageX = (e.clientX - slider.getBoundingClientRect().left) / stageScale();
    slider.setPointerCapture(e.pointerId);
    slider.classList.add('is-dragging');
  });

  slider.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    lastX = e.clientX;
    var dx = (e.clientX - startX) / stageScale();
    track.style.transform = 'translateX(' + wrap(startOffset + dx) + 'px)';
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    slider.classList.remove('is-dragging');
    var idx = Math.round(-currentX() / PITCH); // 0, 1, 2 (분홍/초록/분홍 중 가운데에 오는 칸)
    var moved = Math.abs(lastX - startX) / stageScale();

    // 끌지 않고 이웃 배너를 눌렀다면 그쪽으로 한 칸
    if (moved < CLICK_SLOP && (downStageX < CENTER_LEFT || downStageX > CENTER_RIGHT)) {
      var dir = downStageX < CENTER_LEFT ? -1 : 1;
      // 트랙 양 끝에서는 이웃 배너가 없으므로, 같은 모양인 반대쪽 칸으로 먼저 옮겨 놓고 한 칸 간다
      if (dir < 0 && idx === 0) {
        jumpTo(2);
        idx = 2;
      } else if (dir > 0 && idx === 2) {
        jumpTo(0);
        idx = 0;
      }
      idx += dir;
    }

    slideTo(idx);
    resumeTimer = setTimeout(resumeAuto, RESUME_AFTER_MS);
  }

  function jumpTo(idx) {
    track.style.transition = 'none';
    track.style.transform = 'translateX(' + -idx * PITCH + 'px)';
    void track.offsetWidth; // 이동을 바로 확정한 뒤에 다음 이동을 애니메이션으로
  }

  function slideTo(idx) {
    track.style.transition = 'transform 0.35s cubic-bezier(0.65, 0, 0.35, 1)';
    track.style.transform = 'translateX(' + -idx * PITCH + 'px)';
  }

  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
  // 이미지/글자가 따로 끌려가지 않게
  slider.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });
})();
