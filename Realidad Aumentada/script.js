// script.js

// Se espera a que todos los recursos de la página se hayan cargado completamente
window.addEventListener('load', function () {
  
  // Se selecciona el elemento <a-marker> de la escena, que representa el marcador AR
  var marker = document.querySelector('a-marker');

  // Se añade un "listener" para el evento 'markerFound'
  // Este evento se dispara cuando AR.js detecta el marcador en la cámara
  marker.addEventListener('markerFound', function() {
    console.log('¡Marcador detectado!');
    // Aquí puedes agregar lógica adicional que se ejecute cuando se detecte el marcador,
    // como mostrar información, activar animaciones, cargar contenido adicional, etc.
  });

  // Se añade un "listener" para el evento 'markerLost'
  // Este evento se dispara cuando AR.js deja de detectar el marcador en la cámara
  marker.addEventListener('markerLost', function() {
    console.log('Marcador perdido');
    // Aquí puedes agregar lógica adicional que se ejecute cuando se pierda el marcador,
    // como ocultar elementos, detener animaciones o reiniciar estados.
  });
});
