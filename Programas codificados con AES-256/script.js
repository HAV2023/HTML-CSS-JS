// Clave secreta (debe mantenerse oculta si es posible)
const claveSecreta = "clave-super-secreta";

// Contenido cifrado (asegúrate de que este sea el que generaste)
const contenidoCifrado = "U2FsdGVkX1/cb0WqN8xcDo3mvwRYnB4r7QB7FNwOIMHgSbKmLyBzj+Jq3Wj6Mvs9RO2eLnMj2uJU4Ef1u4pDNpUbJGoZUsyRULIfObca37k=";

// Función para descifrar el contenido con AES
function descifrarAES(textoCifrado, clave) {
    try {
        let bytes = CryptoJS.AES.decrypt(textoCifrado, clave);
        let contenido = bytes.toString(CryptoJS.enc.Utf8);
        
        // Si el contenido es válido, retornarlo
        if (contenido) {
            return contenido;
        } else {
            throw new Error("No se pudo descifrar el contenido. Clave incorrecta o contenido alterado.");
        }
    } catch (error) {
        return "⚠️ Error: " + error.message;
    }
}

// Mostrar el contenido descifrado en la página
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contenido").innerText = descifrarAES(contenidoCifrado, claveSecreta);
});
