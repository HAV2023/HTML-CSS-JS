(() => {
  const paragraphs = document.querySelectorAll('#content p');
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Guardamos opacidad individual para cada párrafo (inicial 1)
  const opacities = Array(paragraphs.length).fill(1);

  window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    const delta = st - lastScrollTop;

    // Ajuste fijo para la opacidad por scroll (ajustable)
    const opacityStep = 0.03;

    paragraphs.forEach((p, i) => {
      if(delta > 0) {
        // Scroll hacia abajo: reduce opacidad escalonadamente
        opacities[i] -= opacityStep * (i + 1);
        if(opacities[i] < 0) opacities[i] = 0;
      } else if(delta < 0) {
        // Scroll hacia arriba: aumenta opacidad escalonadamente
        opacities[i] += opacityStep * (i + 1);
        if(opacities[i] > 1) opacities[i] = 1;
      }
      p.style.opacity = opacities[i].toFixed(2);
    });

    lastScrollTop = st <= 0 ? 0 : st; // evitar negativos
  });
})();
