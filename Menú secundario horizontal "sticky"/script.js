// Se añade un listener al documento para el evento 'DOMContentLoaded'.
// Este evento se activa cuando el contenido HTML ha sido completamente cargado y parseado,
// sin necesidad de esperar a que se carguen recursos como imágenes o hojas de estilo.
document.addEventListener('DOMContentLoaded', function() {
  // Esta función se ejecuta una vez que el DOM está completamente listo.

  // Se muestra un mensaje en la consola para indicar que el proceso de carga
  // del contenido HTML ha finalizado correctamente.
  console.log("La página se ha cargado correctamente.");
  
  // Aquí puedes agregar cualquier funcionalidad adicional que dependa de que el DOM
  // ya esté totalmente cargado y listo para manipularse.
});
