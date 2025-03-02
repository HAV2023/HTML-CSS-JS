// Función que cambia el fondo según la hora del día
function setBackground() {
    // Obtiene la fecha y hora actual del sistema
    var currentTime = new Date();
    
    // Extrae la hora actual (valor entre 0 y 23)
    var hours = currentTime.getHours();

    // Selecciona el div que cambiará de fondo
    var backgroundDiv = document.getElementById('backgroundDiv');

    // Condiciones para cambiar la clase del div según la hora
    if (hours >= 6 && hours < 12) {
        // Si la hora está entre 6 AM y 11:59 AM, se aplica la clase "morning"
        backgroundDiv.className = 'background morning';
    } else if (hours >= 12 && hours < 19) {
        // Si la hora está entre 12 PM y 6:59 PM, se aplica la clase "afternoon"
        backgroundDiv.className = 'background afternoon';
    } else {
        // Si la hora está entre 7 PM y 5:59 AM, se aplica la clase "evening"
        backgroundDiv.className = 'background evening';
    }
}

// Ejecuta la función setBackground() cuando la ventana termine de cargar
window.onload = setBackground;

