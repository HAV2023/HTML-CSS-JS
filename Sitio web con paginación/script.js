// Espera a que el documento HTML se haya cargado completamente antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona todas las páginas con la clase "page"
    const pages = document.querySelectorAll('.page');

    // Selecciona todos los enlaces dentro del contenedor de paginación
    const paginationLinks = document.querySelectorAll('#pagination a');

    // ====== Función para mostrar una página específica ======
    function showPage(pageId) {
        // Recorre todas las páginas y muestra solo la que coincide con el "pageId"
        pages.forEach(page => {
            page.style.display = (page.id === pageId) ? 'block' : 'none';
        });

        // Resalta el enlace de paginación correspondiente a la página activa
        paginationLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
        });
    }

    // ====== Agrega eventos a los enlaces de paginación ======
    paginationLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace

            // Obtiene el "id" de la página a la que se debe mostrar
            const pageId = this.getAttribute('href').substring(1); // Elimina el "#" del href

            // Llama a la función para mostrar la página correspondiente
            showPage(pageId);
        });
    });

    // ====== Mostrar la primera página al cargar la página ======
    showPage('page1');
});

