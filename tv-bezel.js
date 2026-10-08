(function () {
  const frame = document.querySelector('.crt-frame');
  const scaled = document.querySelector('.crt-scaled');
  const stage = document.querySelector('.stage');
  if (!frame || !scaled || !stage) return;

  // 외곽 검정 틀 사용 여부. 지금은 감춰 두었다(false) -> 틀 두께 0, 콘텐츠가 화면 폭을 꽉 채운다.
  // 다시 켜려면 true로만 바꾸면 된다. (검정 틀 두께는 화면 크기와 무관하게 고정 30px)
  const SHOW_BEZEL = false;
  const BORDER = SHOW_BEZEL ? 30 : 0;

  // 스크롤 도중에도 틀이 화면에 계속 떠 있도록, body 여백(맨 위/아래 버퍼용)과는
  // 별개로 뷰포트에 고정된 "둥근 창" 하나를 항상 맨 위 레이어에 얹는다.
  // (요소 자체는 안쪽 창 크기만큼만 있고, box-shadow의 거대한 spread가
  // 그 바깥 전부를 검정으로 채워서 "둥근 구멍 뚫린 검정판"처럼 보이게 한다.
  // 페이지 콘텐츠 자체는 전혀 clip되지 않으므로 모서리도 그대로 각져 있다.)
  const windowEl = document.createElement('div');
  windowEl.className = 'tv-bezel-window';
  document.body.appendChild(windowEl);

  // scale.js가 이 이벤트에서 먼저 .crt-frame의 풀사이즈를 잡아준 다음에
  // 여기서 그 위에 사방 정확히 30px 여백으로 덮어쓴다.
  //
  // 검정 틀 두께가 상하좌우 전부 정확히 BORDER(30px)가 되도록, 가로/세로
  // 스케일을 각각 독립적으로 계산한다(비율을 지키려고 하나의 스케일만
  // 쓰면, 화면 비율에 따라 한쪽 여백만 남아 좌우/상하 두께가 달라진다 —
  // 이게 지난번 버그였다). 대신 화면 비율에 따라 콘텐츠가 가로/세로로
  // 약간 눌리거나 늘어날 수 있다.
  function applyBezel() {
    const stageHeight = stage.offsetHeight || 1079; // 매번 다시 읽는다(Q&A처럼 펼쳐져서 높이가 변하는 페이지용)
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const scale = vw / 1920;
    const fullH = scale * stageHeight;

    // shop처럼 원래 스크롤이 없는(한 화면 고정) 페이지는, 테두리 때문에
    // 새로 스크롤이 생기면 안 된다. 그런 페이지는 위아래도 정확히 BORDER로
    // 맞추기 위해 세로 스케일을 가로 스케일과 다르게 잡는다.
    // (main/review/faq처럼 원래도 길어서 스크롤되는 페이지는 세로가
    // 뷰포트에 갇힐 필요가 없어서, 위/아래 끝에만 BORDER만큼 여백을 둔다.)
    const wasScrollable = fullH > vh;

    const contentW = vw - BORDER * 2;
    const xScale = contentW / 1920;
    let yScale;
    let frameH;

    if (wasScrollable) {
      yScale = xScale;
      frameH = stageHeight * yScale;
    } else {
      frameH = vh - BORDER * 2;
      yScale = frameH / stageHeight;
    }

    // 한 화면 고정 페이지에서 창이 세로로 길면 콘텐츠가 늘어나지 않도록
    // 가로/세로 스케일을 같게 맞추고, 남는 공간은 위아래 검정 여백으로 둔다.
    if (!wasScrollable) {
      const uniform = Math.min(xScale, yScale);
      const fitW = 1920 * uniform;
      const fitH = stageHeight * uniform;
      const extraX = (contentW - fitW) / 2;
      const extraY = (frameH - fitH) / 2;

      frame.style.width = fitW + 'px';
      frame.style.height = fitH + 'px';
      frame.style.marginLeft = BORDER + extraX + 'px';
      frame.style.marginRight = BORDER + extraX + 'px';
      scaled.style.transform = 'scale(' + uniform + ')';
      document.body.style.paddingTop = BORDER + extraY + 'px';
      document.body.style.paddingBottom = BORDER + extraY + 'px';
      document.body.style.height = vh + 'px';
      return;
    }

    frame.style.width = contentW + 'px';
    frame.style.height = frameH + 'px';
    frame.style.marginLeft = BORDER + 'px';
    frame.style.marginRight = BORDER + 'px';
    scaled.style.transform = 'scale(' + xScale + ', ' + yScale + ')';

    // 세로 여백은 .crt-frame의 margin-top/bottom 대신 body의 padding으로 준다.
    // 블록 자식의 위/아래 margin은 부모(body)를 뚫고 나가 스크롤 영역에
    // 그대로 더해지는 마진 병합(margin collapsing) 문제가 있어서다.
    // (box-sizing: border-box라 padding은 body 자신의 height 안에서 소비된다)
    document.body.style.paddingTop = BORDER + 'px';
    document.body.style.paddingBottom = BORDER + 'px';
    document.body.style.height = frameH + BORDER * 2 + 'px';
  }

  applyBezel();
  window.addEventListener('resize', applyBezel);
})();
