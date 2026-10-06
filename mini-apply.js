/* 메인 첫 화면의 미니 신청 카드.
   "신청하세요"를 누르면, 신청 페이지(apply.html)에서 "신청하기"를 눌렀을 때와 같은 규칙으로 검사한 뒤
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

    window.location.href = btn.getAttribute('href');
  });
})();
