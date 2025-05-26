// Seleccionamos todos los <p> dentro de #content
const paragraphs = document.querySelectorAll('#content p');

// Usamos IntersectionObserver para detectar si cada párrafo entra o sale del viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible'); // Aplica fade-in
      } else {
        entry.target.classList.remove('visible'); // Aplica fade-out
      }
    });
  }, 
  {
    threshold: 0.1 // Cuando el 10% del párrafo es visible, activa el efecto
  }
);

// Observa cada párrafo individualmente
paragraphs.forEach(p => observer.observe(p));
