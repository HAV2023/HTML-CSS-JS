// Obtiene el botón con el ID 'hamburger-btn' y le agrega un evento de escucha para detectar clics
document.getElementById('hamburger-btn').addEventListener('click', function() {

    // Obtiene el elemento del menú de pantalla completa con el ID 'full-screen-menu'
    var fullScreenMenu = document.getElementById('full-screen-menu');

    // Alterna la clase 'active' en el menú de pantalla completa
    // Si la clase 'active' está presente, se elimina; si no está, se agrega
    fullScreenMenu.classList.toggle('active');
});

