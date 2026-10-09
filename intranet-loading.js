// 로딩 화면에 머무는 시간(ms) 이후 접속 완료 페이지로 이동.
const LOADING_DURATION_MS = 2000;
const REDIRECT_TARGET = 'intranet-connected.html';

// 진행바가 채워지는 시간을 로딩 시간과 똑같이 맞춘다.
document.documentElement.style.setProperty('--loading-duration', LOADING_DURATION_MS + 'ms');

setTimeout(() => {
  if (REDIRECT_TARGET) {
    // 로딩을 거쳐 들어온 것만 "접속하셨습니다" 팝업/사운드를 띄우도록 표시해 둔다(intranet-connected.html이 한 번 쓰고 지움)
    try {
      sessionStorage.setItem('intranetJustConnected', '1');
    } catch (e) {}
    window.location.href = REDIRECT_TARGET;
  }
}, LOADING_DURATION_MS);
