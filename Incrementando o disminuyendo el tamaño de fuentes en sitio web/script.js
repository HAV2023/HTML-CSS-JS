// Función para cambiar el tamaño de la fuente
function changeFontSize(delta) {
    // Selecciona el elemento que contiene el texto
    const textElement = document.getElementById("text-content");

    // Obtiene el tamaño de fuente actual del elemento
    const style = window.getComputedStyle(textElement, null).getPropertyValue('font-size');
    
    // Convierte el tamaño de fuente obtenido a número (elimina 'px')
    const currentSize = parseFloat(style);

    // Aplica el nuevo tamaño de fuente sumando el incremento (delta)
    textElement.style.fontSize = (currentSize + delta) + 'px';
}

