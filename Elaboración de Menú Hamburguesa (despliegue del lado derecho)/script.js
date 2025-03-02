// Obtiene el botón con el ID 'hamburger-btn' y agrega un evento de escucha al hacer clic
document.getElementById('hamburger-btn').addEventListener('click', function() {

    // Obtiene el elemento del menú lateral con el ID 'side-menu'
    var sideMenu = document.getElementById('side-menu');

    // Alterna la clase 'active' en el menú lateral
    // Si la clase 'active' está presente, se elimina; si no está, se agrega
    sideMenu.classList.toggle('active');
});
