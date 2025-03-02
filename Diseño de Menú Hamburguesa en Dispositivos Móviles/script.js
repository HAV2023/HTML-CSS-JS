// Obtiene el botón con el ID 'hamburger-btn' y agrega un evento de escucha para detectar clics
document.getElementById('hamburger-btn').addEventListener('click', function() {

    // Obtiene el elemento del menú lateral con el ID 'side-menu'
    var sideMenu = document.getElementById('side-menu');

    // Alterna la clase 'active' en el menú lateral
    // Si la clase 'active' está presente, se elimina; si no está, se agrega
    sideMenu.classList.toggle('active');
});

// Comprueba si el ancho de la ventana es menor o igual a 768 píxeles (dispositivo móvil o tablet)
if (window.innerWidth <= 768) {
    // Si es un dispositivo móvil, el menú lateral se muestra automáticamente al cargar la página
    document.getElementById('side-menu').classList.add('active');
}

