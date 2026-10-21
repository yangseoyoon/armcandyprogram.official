// 로딩 화면에 머무는 시간(ms) 이후 다음 페이지로 이동.
//  - 인트라넷에 접속할 때: 접속 완료 페이지(intranet-connected.html)로 이동 ("접속중입니다...")
//  - 인트라넷에서 나갈 때: 나가기를 누른 페이지가 sessionStorage('intranetLoadingExit')에 돌아갈 주소를 남겨 두면
//    그 주소(ARM CANDY PROGRAM 메인 등)로 이동 ("돌아가는 중입니다...")
const LOADING_DURATION_MS = 2000;

let exitTarget = null;
try {
  exitTarget = sessionStorage.getItem('intranetLoadingExit');
  sessionStorage.removeItem('intranetLoadingExit'); // 한 번 쓰고 지운다
} catch (e) {}

const REDIRECT_TARGET = exitTarget || 'intranet-connected.html';

if (exitTarget) {
  // glitch-effect.js가 이미 화면을 복제해 둔 상태라, 복제본(색수차 레이어) 문구까지 같이 바꿔야 글자가 겹치지 않는다
  document.querySelectorAll('.loading-text').forEach((el) => {
    el.textContent = '돌아가는 중입니다...';
  });
}

// 진행바가 채워지는 시간을 로딩 시간과 똑같이 맞춘다.
document.documentElement.style.setProperty('--loading-duration', LOADING_DURATION_MS + 'ms');

setTimeout(() => {
  if (REDIRECT_TARGET) {
    if (!exitTarget) {
      // 로딩을 거쳐 들어온 것만 "접속하셨습니다" 팝업/사운드를 띄우도록 표시해 둔다(intranet-connected.html이 한 번 쓰고 지움)
      try {
        sessionStorage.setItem('intranetJustConnected', '1');
      } catch (e) {}
    }
    window.location.href = REDIRECT_TARGET;
  }
}, LOADING_DURATION_MS);
