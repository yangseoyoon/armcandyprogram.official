/* 메인 첫 화면의 미니 신청 카드.
   "신청하세요"를 누르면, 예전 신청 페이지(apply.html, 삭제됨)에서 "신청하기"를 눌렀을 때와 같은 규칙으로 검사한 뒤
   같은 접수 완료 페이지(complete.html)로 이동한다.
   - 프로그램 유형을 하나 골라야 한다(신청 페이지와 같은 안내 문구)
   - 이름 / 전화번호 입력, 동의 체크는 필수 */
(function () {
  var btn = document.getElementById('miniApplyBtn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    if (!document.querySelector('input[name="miniType"]:checked')) {
      alert('프로그램 유형을 선택해주세요.');
      return;
    }

    var fields = [
      document.getElementById('miniName'),
      document.getElementById('miniPhone'),
      document.getElementById('miniAgree'),
    ];
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        fields[i].reportValidity();
        return;
      }
    }

    // 접수 완료 페이지에서 닫기(X)를 눌렀을 때 신청 페이지가 아니라 이 메인 페이지로 돌아오도록 표시해 둔다
    // (개발 서버가 .html 주소를 줄이면서 ?from=main 같은 주소 꼬리표를 지워서, 주소 대신 세션에 남긴다)
    try {
      sessionStorage.setItem('completeReturn', 'main.html');
    } catch (err) {}
    window.location.href = btn.getAttribute('href');
  });
})();
