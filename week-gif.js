/* 4주 프로세스 카드: 마우스를 올리면 정지 이미지 대신 움직이는 GIF(weekN-v3-g.gif)가 재생된다.
   - 올릴 때마다 <img>를 새로 만들어서 GIF가 항상 첫 프레임부터 시작하게 한다
     (같은 <img>를 숨겼다 보여 주면 멈춰 있던 프레임에서 이어서 재생된다).
   - 정지 이미지를 숨기는 건 CSS(.week-box--N:hover ~ ...)가 맡고, 여기서는 GIF 띄우기/치우기만 한다.
   - 처음 올렸을 때 끊기지 않게 페이지가 뜨면 GIF를 미리 받아 둔다.
   - 슬롯에 data-sound가 있으면(지금은 아무 카드에도 지정돼 있지 않음) GIF가 시작될 때 그 소리도 처음부터 재생하고,
     마우스를 치우면 소리도 멈춘다. (브라우저 정책상 페이지에서 한 번이라도 클릭/키 입력이 있어야 소리가 난다) */
(function () {
  var boxes = document.querySelectorAll('.week-box');
  if (!boxes.length) return;

  function slotFor(box) {
    // week-box--N 과 같은 번호의 week-gif-slot--N
    var m = /week-box--(\d)/.exec(box.className);
    return m ? document.querySelector('.week-gif-slot--' + m[1]) : null;
  }

  boxes.forEach(function (box) {
    var slot = slotFor(box);
    if (!slot) return;
    var src = slot.getAttribute('data-src');

    new Image().src = src; // 미리 받아 두기

    var soundSrc = slot.getAttribute('data-sound');
    var sound = null;
    if (soundSrc) {
      sound = new Audio(soundSrc);
      sound.preload = 'auto';
    }

    box.addEventListener('mouseenter', function () {
      slot.textContent = '';
      var img = new Image();
      img.alt = '';
      img.draggable = false;
      img.src = src;
      slot.appendChild(img);

      if (sound) {
        sound.currentTime = 0;
        var p = sound.play();
        if (p && p.catch) p.catch(function () {});
      }
    });

    box.addEventListener('mouseleave', function () {
      slot.textContent = '';
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  });
})();
