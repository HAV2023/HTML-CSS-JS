// Objeto que almacena las traducciones en español e inglés
const translations = {
    "es": { // Traducciones en español
        "titulo": "Bienvenido a Mi Sitio Web",
        "contenido1": "Este es el contenido de la página en español.",
        "contenido2": "Aquí hay más contenido en español."
        // Se pueden agregar más traducciones aquí
    },
    "en": { // Traducciones en inglés
        "titulo": "Welcome to My Website",
        "contenido1": "This is the content of the page in English.",
        "contenido2": "Here is more content in English."
        // Se pueden agregar más traducciones aquí
    }
};

// Función para traducir el contenido de la página
function translatePage(language) {
    // Itera sobre cada clave y valor dentro del objeto de traducciones seleccionado
    for (const [key, value] of Object.entries(translations[language])) {
        // Busca el elemento en la página usando su ID y cambia su contenido de texto
        document.getElementById(key).textContent = value;
    }
}
