/* 메인 페이지 Q&A: 질문 막대를 누르면 그 아래로 답변이 펼쳐지고, 다시 누르면 접힌다.
   - 질문은 여러 개를 동시에 펼칠 수 있다.
   - 펼쳐진 높이만큼 아래 질문들과 그 아래 섹션(PERFECTION, 푸터), 페이지 전체 높이가 같이 내려간다.
     (:root의 --qna-extra 값 하나로 main.css/main-components.css가 계산한다)
   - CRT 효과의 R/G/B 레이어는 .stage를 통째로 복제한 것이라, 같은 클래스를 가진 요소 전부(복제본 포함)에 똑같이 적용해
     색수차 레이어가 어긋나지 않게 한다. */
(function () {
  var COUNT = 7;
  var ROW_TOP = [276.94, 415.44, 553.94, 692.44, 830.94, 969.44, 1107.94]; // 질문 줄 top(Q 탭 기준)
  var BAR_BOTTOM = 113.5; // 줄 top에서 막대 아래쪽까지
  var OVERLAP = 2; // 답변 상자가 막대 아래 테두리와 겹치는 두께

  var rows = document.querySelectorAll('.stage .qna-row');
  if (!rows.length) return;

  var open = [];
  for (var i = 0; i < COUNT; i++) open.push(false);

  function all(sel) {
    return document.querySelectorAll(sel); // 복제 레이어(.crt-layer) 안의 것까지 모두
  }

  function layout() {
    var shift = 0;
    for (var i = 0; i < COUNT; i++) {
      var n = i + 1;
      var top = ROW_TOP[i] + shift;
      var rowsAll = all('.qna-row--' + n);
      var ansAll = all('.qna-answer--' + n);

      rowsAll.forEach(function (el) {
        el.style.top = top + 'px';
        el.setAttribute('aria-expanded', open[i] ? 'true' : 'false');
      });
      ansAll.forEach(function (el) {
        el.style.top = top + BAR_BOTTOM - OVERLAP + 'px';
        el.classList.toggle('is-open', open[i]);
      });

      if (open[i]) {
        // 원본 답변 상자의 실제 높이(펼쳐진 뒤에 잰다)
        var h = document.querySelector('.stage .qna-answer--' + n).offsetHeight;
        shift += h - OVERLAP;
      }
    }

    document.documentElement.style.setProperty('--qna-extra', shift + 'px');
    // 페이지 전체 높이가 바뀌었으니 scale.js / tv-bezel.js가 다시 계산하게 한다
    window.dispatchEvent(new Event('resize'));
  }

  rows.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      open[idx] = !open[idx];
      layout();
    });
  });
})();
