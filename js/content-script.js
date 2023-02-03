!(function () {
  function exec() {
    const list = [3, 2.75, 2.5, 2.25, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

    let str = "";
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      const _str = `<li class="bpx-player-ctrl-playbackrate-menu-item " data-value="${v}">${v}x</li>`;
      str += _str;
    }

    const menuDom = document.querySelector(
      ".bpx-player-ctrl-playbackrate-menu"
    );

    if (menuDom) {
      menuDom.innerHTML = str;
    }
  }

  let timer = setInterval(() => {
    const menuDom = document.querySelector(
      ".bpx-player-ctrl-playbackrate-menu"
    );

    if (!menuDom) return;

    exec();
    clearInterval(timer);
  }, 500);
})();
