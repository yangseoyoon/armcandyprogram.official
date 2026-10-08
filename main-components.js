/* 메인 페이지 '프로그램 구성품' 책상 장면의 팝업 동작 (예전 components.html과 같은 기능)
   - 분홍색 책 -> 가이드 북 팝업 / 파스텔 노트 -> 매뉴얼 북 팝업
   - 모니터 -> 영상 팝업(소리와 함께 재생, 닫으면 정지)
   - 전화기 -> 안내음성 팝업 + 음성 재생(닫으면 정지)
   팝업은 .stage 바깥의 #compModals 안에 있고, 안쪽 1920x1080 판을 화면에 맞게 축소해서 보여 준다. */
(function () {
  var root = document.getElementById('compModals');
  if (!root) return;
  var canvas = root.querySelector('.comp-modals-canvas');
  var monitorVideo = document.getElementById('monitorVideo');
  var callAudio = document.getElementById('callVoiceAudio');
  var openOverlay = null;

  // 1920x1080 판을 화면 안에 들어오도록 축소(가로/세로 중 더 빡빡한 쪽 기준)
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    canvas.style.transform = 'scale(' + s + ')';
  }
  fit();
  window.addEventListener('resize', fit);

  function stopMedia() {
    if (monitorVideo) {
      monitorVideo.pause();
      monitorVideo.currentTime = 0;
    }
    if (callAudio) {
      callAudio.pause();
      callAudio.currentTime = 0;
    }
  }

  function open(overlay) {
    fit();
    openOverlay = overlay;
    overlay.classList.add('is-open');
    root.classList.add('is-open');
    root.classList.toggle('is-dark', overlay.getAttribute('data-dark') === 'true');

    if (overlay.id === 'monitorVideoModalOverlay' && monitorVideo) {
      monitorVideo.muted = false;
      monitorVideo.volume = 1;
      monitorVideo.currentTime = 0;
      monitorVideo.play().catch(function () {});
    } else if (overlay.id === 'callVoiceModalOverlay' && callAudio) {
      callAudio.currentTime = 0;
      callAudio.play().catch(function () {});
    }
  }

  function close() {
    if (!openOverlay) return;
    openOverlay.classList.remove('is-open');
    root.classList.remove('is-open', 'is-dark');
    openOverlay = null;
    stopMedia();
  }

  // 책상 위 물건 4개 (원본 .stage 안의 버튼만; CRT 복제 레이어는 pointer-events 없음)
  document.querySelectorAll('.stage .component-object').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlay = document.getElementById(btn.getAttribute('data-modal'));
      if (overlay) open(overlay);
    });
  });

  // 닫기(X) 버튼
  root.querySelectorAll('.manual-modal-close, .call-modal-close').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      close();
    });
  });
})();
