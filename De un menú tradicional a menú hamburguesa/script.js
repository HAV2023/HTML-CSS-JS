// Seleccionamos el elemento con el ID 'hamburger-btn' y le agregamos un evento de clic
document.getElementById('hamburger-btn').addEventListener('click', function() {

    // Buscamos el primer elemento en el documento que tenga la clase 'nav-links'
    var navLinks = document.querySelector('.nav-links');

    // Alternamos (agregamos o quitamos) la clase 'active' al elemento encontrado
    navLinks.classList.toggle('active');

    // Esto hace que cada vez que se haga clic en el botón de hamburguesa, 
    // la clase 'active' se agregue o se elimine, lo que se usa comúnmente
    // para mostrar u ocultar un menú de navegación en diseños responsivos.
});

