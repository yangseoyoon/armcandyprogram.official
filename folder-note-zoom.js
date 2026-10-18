/* 카드 위의 메모지(포스트잇)를 누르면 화면 가운데에 크게 띄우고, 아무 곳이나 누르면 닫는다.
   - 누르는 영역: data-note-zoom="오버레이 id" 를 가진 요소
   - 오버레이: .note-overlay (어두운 배경 + 큰 메모지 이미지). 스테이지(1920x1080) 안에 있어서 화면 크기에 맞춰 같이 축소된다. */
(function () {
  var triggers = document.querySelectorAll('[data-note-zoom]');
  triggers.forEach(function (btn) {
    var overlay = document.getElementById(btn.getAttribute('data-note-zoom'));
    if (!overlay) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.classList.add('is-open');
    });
    overlay.addEventListener('click', function () {
      overlay.classList.remove('is-open');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.note-overlay.is-open').forEach(function (o) {
      o.classList.remove('is-open');
    });
  });
})();
