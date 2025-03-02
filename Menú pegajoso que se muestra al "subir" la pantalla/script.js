// Variable para almacenar la última posición de desplazamiento del usuario
let lastScrollTop = 0; 

// Obtiene la referencia al elemento del menú que tiene el ID 'stickyMenu'
const stickyMenu = document.getElementById('stickyMenu');

// Agrega un evento que escucha el desplazamiento (scroll) de la ventana
window.addEventListener('scroll', function() {

    // Obtiene la posición actual del desplazamiento vertical
    // `window.pageYOffset` es para navegadores más antiguos
    // `document.documentElement.scrollTop` es para navegadores modernos
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Compara la nueva posición del scroll con la anterior
    if (scrollTop < lastScrollTop) {
        // Si la nueva posición es menor que la anterior, el usuario está desplazándose hacia arriba
        // Se elimina la clase 'hidden' para mostrar el menú nuevamente
        stickyMenu.classList.remove('hidden');
    } else {
        // Si la nueva posición es mayor que la anterior, el usuario está desplazándose hacia abajo
        // Se agrega la clase 'hidden' para ocultar el menú
        stickyMenu.classList.add('hidden');
    }

    // Actualiza la última posición del scroll para la próxima comparación
    lastScrollTop = scrollTop;
});

