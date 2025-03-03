// script.js

// Agrega un evento "input" al campo de búsqueda para detectar cambios en tiempo real
document.getElementById('search').addEventListener('input', function() {
    // Obtiene el texto ingresado en el campo de búsqueda y lo convierte a minúsculas
    const searchTerm = this.value.toLowerCase();

    // Obtiene el contenedor donde se buscará el texto
    const content = document.getElementById('content');

    // Obtiene todos los párrafos dentro del contenedor
    const paragraphs = content.getElementsByTagName('p');

    // ====== Paso 1: Limpiar resaltado previo ======
    for (let paragraph of paragraphs) {
        // Restaura el contenido original del párrafo eliminando cualquier resaltado anterior
        paragraph.innerHTML = paragraph.textContent;
    }

    // ====== Paso 2: Resaltar coincidencias si hay un término de búsqueda ======
    if (searchTerm) {
        for (let paragraph of paragraphs) {
            // Obtiene el texto original del párrafo
            const text = paragraph.textContent;

            // Crea una expresión regular para encontrar el término de búsqueda (sin distinción entre mayúsculas y minúsculas)
            const regex = new RegExp(`(${searchTerm})`, 'gi');

            // Reemplaza el texto encontrado con una versión resaltada (envuelta en una etiqueta <span>)
            const newText = text.replace(regex, '<span class="highlight">$1</span>');

            // Actualiza el contenido del párrafo con la nueva versión resaltada
            paragraph.innerHTML = newText;
        }
    }
});

