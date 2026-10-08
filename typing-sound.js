/* 입력칸에 글자를 칠 때 키보드 타자 소리(audio/typing-keyboard.mp3)가 같이 나고, 치기를 멈추면 소리도 멈춘다.
   - 키를 누르는 동안(또는 글자가 입력되는 동안)만 재생하고, 마지막 입력 뒤 IDLE_MS 동안 아무것도 안 치면 멈춘다.
   - 한글 입력(IME)은 keydown의 key가 'Process'로 오기 때문에 keydown과 input 두 이벤트를 모두 본다.
   - 브라우저는 사용자가 직접 누른 키 이벤트 안에서만 소리 재생을 허용하므로, 재생도 그 이벤트 안에서 시작한다. */
(function () {
  var SRC = 'audio/typing-keyboard.mp3';
  var IDLE_MS = 350; // 이 시간 동안 입력이 없으면 타이핑이 끝난 것으로 보고 소리를 멈춘다
  var VOLUME = 0.6;

  var fields = document.querySelectorAll(
    'input:not([type]), input[type="text"], input[type="tel"], input[type="email"], input[type="search"], input[type="password"], input[type="number"], textarea'
  );
  if (!fields.length) return;

  var audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = VOLUME;

  var idleTimer = null;

  // 소리를 내지 않는 키(이동/수정키/기능키)
  var SILENT = {
    Shift: 1, Control: 1, Alt: 1, Meta: 1, CapsLock: 1, Tab: 1, Escape: 1, Enter: 1,
    ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1,
    Home: 1, End: 1, PageUp: 1, PageDown: 1, Insert: 1, ContextMenu: 1,
  };

  function stop() {
    clearTimeout(idleTimer);
    idleTimer = null;
    audio.pause();
  }

  function typing() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(stop, IDLE_MS);
    if (audio.paused) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  fields.forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return; // 복사/붙여넣기 같은 단축키
      if (SILENT[e.key] || /^F\d+$/.test(e.key)) return;
      typing();
    });

    el.addEventListener('input', function (e) {
      if (e.inputType && e.inputType.indexOf('insertFromPaste') === 0) return; // 붙여넣기는 타자 소리 없음
      typing();
    });

    el.addEventListener('blur', stop);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
  });
  window.addEventListener('pagehide', stop);
})();
