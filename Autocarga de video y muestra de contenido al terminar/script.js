// Espera a que el contenido del DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // Selecciona los elementos del DOM
    const videoPopup = document.getElementById('video-popup'); // Ventana emergente
    const introVideo = document.getElementById('intro-video'); // Video de introducción
    const mainContent = document.getElementById('main-content'); // Contenido principal

    // Al cargar la página, asegura que el popup con el video sea visible
    videoPopup.style.display = 'flex';

    // Evento que detecta cuando el video ha finalizado
    introVideo.addEventListener('ended', () => {
        // Oculta la ventana emergente cuando el video termina
        videoPopup.style.display = 'none';

        // Muestra el contenido principal eliminando la clase 'hidden'
        mainContent.classList.remove('hidden');
    });
});

