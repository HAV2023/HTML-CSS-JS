// Espera a que el contenido del DOM se cargue completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    
    // Selecciona todos los elementos con la clase 'masonry-item'
    const masonryItems = document.querySelectorAll('.masonry-item');

    // Itera sobre cada elemento de la cuadrícula Masonry
    masonryItems.forEach(item => {

        // Agrega un evento de clic a cada 'masonry-item'
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el evento se propague al documento

            // Si el elemento ya está expandido, lo colapsa
            if (this.classList.contains('expanded')) {
                this.classList.remove('expanded');
            } else {
                // Si hay otro elemento expandido, lo cierra antes de expandir este
                masonryItems.forEach(el => el.classList.remove('expanded'));
                this.classList.add('expanded'); // Expande el elemento actual
            }
        });
    });

    // Evento global para cerrar cualquier elemento expandido al hacer clic fuera
    document.addEventListener('click', () => {
        masonryItems.forEach(item => item.classList.remove('expanded')); // Colapsa todos los elementos
    });

});

