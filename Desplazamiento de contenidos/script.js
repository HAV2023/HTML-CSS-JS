// Seleccionamos todos los elementos <p> dentro del contenedor #content
const paragraphs = document.querySelectorAll('#content p');
// 'paragraphs' será un NodeList con todos los párrafos del contenido.

// Creamos un nuevo IntersectionObserver, que nos permite detectar
// si un elemento (en este caso cada párrafo) entra o sale del viewport (zona visible de la pantalla).
const observer = new IntersectionObserver(
  (entries) => {
    // 'entries' es un array de objetos, cada uno corresponde a un elemento observado
    entries.forEach(entry => {
      // entry.isIntersecting es true si el elemento es visible (aunque sea parcial)
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Si el párrafo está (al menos un poco) visible en el viewport,
        // se le añade la clase 'visible', que normalmente activa el fade-in en CSS.
      } else {
        entry.target.classList.remove('visible');
        // Si el párrafo deja de ser visible, se elimina la clase 'visible'
        // Esto activa el fade-out en CSS.
      }
    });
  }, 
  {
    threshold: 0.1 // Opcional: determina el porcentaje visible necesario para activar el efecto.
    // threshold: 0.1 significa que cuando al menos el 10% del párrafo es visible, se activa la detección.
    // Puedes ajustar este valor para hacer el efecto más o menos sensible.
  }
);

// Recorremos cada párrafo y lo registramos en el observer.
// Así, cada uno será monitoreado de forma independiente.
paragraphs.forEach(p => observer.observe(p));
// Cuando un párrafo entra o sale de la zona visible, IntersectionObserver ejecuta la función definida arriba.
