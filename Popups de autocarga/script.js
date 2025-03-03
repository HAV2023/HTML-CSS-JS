// Espera a que el contenido del DOM se cargue completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {

    // Selección de elementos del DOM
    var modal = document.getElementById('miModal'); // Obtiene el modal por su ID
    var cerrar = document.getElementById('cerrar'); // Obtiene el botón de cerrar (X)

    // ====== Evento para cerrar el modal al hacer clic en la 'X' ======
    cerrar.onclick = function() {
        modal.style.display = 'none'; // Oculta el modal cambiando su propiedad display
    }

    // ====== Evento para cerrar el modal si el usuario hace clic fuera del contenido ======
    window.onclick = function(event) {
        if (event.target == modal) { // Si el clic es en el área oscura fuera del modal
            modal.style.display = 'none'; // Oculta el modal
        }
    }
});

