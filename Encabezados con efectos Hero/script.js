document.addEventListener("DOMContentLoaded", function () {
    // ====== Selección de elementos ======
    const slides = document.querySelectorAll(".slide"); // Selecciona todas las diapositivas
    let currentSlide = 0; // Índice de la diapositiva actual
    const intervalTime = 5000; // Tiempo entre cada cambio de diapositiva (5 segundos)
    let slideInterval; // Variable para almacenar el intervalo de cambio automático

    // ====== Función para mostrar una diapositiva específica ======
    function showSlide(n) {
        slides.forEach((slide, index) => {
            slide.classList.remove('active'); // Elimina la clase 'active' de todas las diapositivas
            if (index === n) {
                slide.classList.add('active'); // Agrega la clase 'active' a la diapositiva actual
            }
        });
    }

    // ====== Función para avanzar a la siguiente diapositiva ======
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Calcula el índice de la siguiente diapositiva
        showSlide(currentSlide); // Muestra la nueva diapositiva
    }

    // ====== Iniciar el carrusel automáticamente ======
    slideInterval = setInterval(nextSlide, intervalTime); // Cambia de diapositiva cada 5 segundos
});

