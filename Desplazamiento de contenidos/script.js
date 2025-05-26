(() => {
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const content = document.getElementById('content');
  let opacity = 1;

  window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    const delta = st - lastScrollTop;

    if (delta > 0) {
      // Scroll hacia abajo -> disminuye opacidad
      opacity -= 0.05;
      if (opacity < 0) opacity = 0;
    } else if (delta < 0) {
      // Scroll hacia arriba -> aumenta opacidad
      opacity += 0.05;
      if (opacity > 1) opacity = 1;
    }
    content.style.opacity = opacity.toFixed(2);

    lastScrollTop = st <= 0 ? 0 : st; // Evita valores negativos
  });
})();

