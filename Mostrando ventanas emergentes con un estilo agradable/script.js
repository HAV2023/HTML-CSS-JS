// Obtener elementos del DOM
const modal = document.getElementById("myModal"); // Selecciona el contenedor de la ventana emergente
const btn = document.getElementById("openModal"); // Selecciona el enlace que abre la ventana emergente
const span = document.getElementsByClassName("close")[0]; // Selecciona el botón "X" para cerrar la ventana

// ====== Mostrar la ventana emergente ======
// Cuando el usuario hace clic en el enlace, se muestra la ventana emergente
btn.onclick = function() {
    modal.style.display = "block"; // Cambia el estilo de la ventana emergente a visible
}

// ====== Cerrar la ventana emergente con el botón "X" ======
// Cuando el usuario hace clic en el botón de cerrar, se oculta la ventana emergente
span.onclick = function() {
    modal.style.display = "none"; // Cambia el estilo de la ventana emergente a oculto
}

// ====== Cerrar la ventana emergente al hacer clic fuera del contenido ======
// Si el usuario hace clic fuera del contenido de la ventana emergente, se oculta
window.onclick = function(event) {
    if (event.target == modal) { // Si el clic ocurre en el fondo oscuro (modal)
        modal.style.display = "none"; // Se oculta la ventana emergente
    }
}

