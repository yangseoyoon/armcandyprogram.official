/* 메인 페이지 안에서 스크롤로 이동하는 링크들
   - 네비게이션의 PROGRAM (모든 페이지에서 main.html#program) -> DON'T BE IN PAIN ANYMORE 섹션으로 스크롤
   - 네비게이션의 FAQs (main.html#faq) -> FREQUENTLY ASKED QUESTIONS(Q&A) 섹션으로 스크롤
   - 네비게이션의 APPLY(main.html#top), "OUR 4 WEEK PROCESS"의 신청하기 -> 맨 위(미니 신청 카드가 있는 곳)로 스크롤
   .stage는 transform으로 축소돼 있어서 브라우저의 #앵커 이동은 위치가 맞지 않는다. 그래서 1920px 좌표에 축소 비율을 곱해 직접 계산한다. */
(function () {
  var PAIN_TOP = 2158; // DON'T BE IN PAIN ANYMORE 섹션 시작(.pain-bg top)
  var FAQ_TOP = 6554; // FREQUENTLY ASKED QUESTIONS 섹션 시작(.qna-section top)
  var HEADER_H = 136; // 고정된 멘트바(48) + 네비게이션(88)

  function scale() {
    return document.documentElement.clientWidth / 1920;
  }

  function scrollToY(y) {
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  function toProgram() {
    scrollToY((PAIN_TOP - HEADER_H) * scale());
  }

  function toFaq() {
    scrollToY((FAQ_TOP - HEADER_H) * scale());
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/(^|\/)main\.html#program$|^#program$/.test(href)) {
      e.preventDefault();
      history.replaceState(null, '', '#program');
      toProgram();
    } else if (/(^|\/)main\.html#faq$|^#faq$/.test(href)) {
      e.preventDefault();
      history.replaceState(null, '', '#faq');
      toFaq();
    } else if (a.classList.contains('process-apply') || /(^|\/)main\.html#top$|^#top$/.test(href)) {
      e.preventDefault();
      scrollToY(0);
    }
  });

  // 다른 페이지의 PROGRAM / FAQs로 들어온 경우(main.html#program, main.html#faq)
  var onLoad = location.hash === '#program' ? toProgram : location.hash === '#faq' ? toFaq : null;
  if (onLoad) {
    window.addEventListener('load', function () {
      setTimeout(onLoad, 100);
    });
  }
})();
