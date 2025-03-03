document.addEventListener('DOMContentLoaded', function() {
    // ====== Selección de elementos del DOM ======
    const contentDiv = document.getElementById('content'); // Contenedor del contenido
    const paragraphs = Array.from(contentDiv.getElementsByTagName('p')); // Lista de todos los párrafos dentro del contenedor
    const loadMoreButton = document.getElementById('loadMore'); // Botón para cargar más contenido
    const toTopButton = document.getElementById('toTop'); // Botón para regresar al inicio

    const paragraphsPerLoad = 5; // Cantidad de párrafos a mostrar por cada carga
    let currentIndex = paragraphsPerLoad; // Índice del último párrafo visible

    // ====== Mostrar solo los primeros 5 párrafos ======
    paragraphs.forEach((p, index) => {
        if (index >= paragraphsPerLoad) {
            p.style.display = 'none'; // Ocultar párrafos después del primero
        }
    });

    // ====== Mostrar botón "Más..." si hay más párrafos por cargar ======
    if (paragraphs.length > paragraphsPerLoad) {
        loadMoreButton.style.display = 'block'; // Mostrar el botón si hay más contenido
    }

    // ====== Evento para cargar más párrafos ======
    loadMoreButton.addEventListener('click', function() {
        const nextIndex = currentIndex + paragraphsPerLoad; // Calcular el nuevo índice
        for (let i = currentIndex; i < nextIndex && i < paragraphs.length; i++) {
            paragraphs[i].style.display = 'block'; // Mostrar los siguientes párrafos
        }
        currentIndex += paragraphsPerLoad; // Actualizar el índice

        // Ocultar el botón si ya se mostraron todos los párrafos
        if (currentIndex >= paragraphs.length) {
            loadMoreButton.style.display = 'none';
        }
    });

    // ====== Evento para mostrar el botón "Ir arriba" al hacer scroll ======
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > window.innerHeight) { // Si el usuario ha bajado más de una pantalla
            toTopButton.style.display = 'block'; // Mostrar el botón
        } else {
            toTopButton.style.display = 'none'; // Ocultar el botón
        }
    });

    // ====== Evento para volver al inicio de la página con animación ======
    toTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazamiento suave al inicio
    });
});

