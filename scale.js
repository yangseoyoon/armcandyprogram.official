(function () {
  const stage = document.querySelector('.stage');
  const crtFrame = document.querySelector('.crt-frame');
  const crtScaled = document.querySelector('.crt-scaled');
  function fit() {
    const stageHeight = stage.offsetHeight || 1079; // 매번 다시 읽는다(Q&A처럼 펼쳐져서 높이가 변하는 페이지용)
    const scale = document.documentElement.clientWidth / 1920;
    document.body.style.height = (stageHeight * scale) + 'px';
    if (crtFrame && crtScaled) {
      // crt-effect.js가 .stage를 .crt-frame > .crt-scaled 안으로 옮긴 경우:
      // .crt-scaled가 1920px 좌표계를 화면 크기로 스케일하고,
      // .crt-frame 자체는 그 결과와 같은 실제 렌더 크기를 가져야
      // 스캔라인/글로우/비네트/노이즈가 화면에 정확히 맞는다.
      crtFrame.style.width = (1920 * scale) + 'px';
      crtFrame.style.height = (stageHeight * scale) + 'px';
      crtScaled.style.transform = 'scale(' + scale + ')';
    } else {
      stage.style.transform = 'scale(' + scale + ')';
    }
  }
  fit();
  window.addEventListener('resize', fit);
})();
