// script.js
window.addEventListener('load', function () {
  var marker = document.querySelector('a-marker');

  marker.addEventListener('markerFound', function() {
    console.log('¡Marker detectado!');
    // Aquí puedes agregar lógica adicional al detectar el marcador.
  });

  marker.addEventListener('markerLost', function() {
    console.log('Marker perdido');
    // Aquí puedes agregar lógica adicional al perder la detección del marcador.
  });
});

