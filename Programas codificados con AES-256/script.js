// Clave secreta (debe mantenerse en secreto)
const claveSecreta = "clave-super-secreta";

// Contenido cifrado con AES (ejemplo cifrado previamente)
const contenidoCifrado = "U2FsdGVkX191V8x6xGH5MPyzwk/MG/rfc8e8YcQt62A7YTdKx7PdhHzGBy6jXrnOrdEBRSoBqaXYjmn2Zh/3M20MtP8+IITIOw2H9zBzPKc=";

// Función para descifrar con AES
function descifrarAES(textoCifrado, clave) {
    try {
        let bytes = CryptoJS.AES.decrypt(textoCifrado, clave);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return "Error al descifrar el contenido";
    }
}

// Mostrar contenido descifrado
document.getElementById("contenido").innerText = descifrarAES(contenidoCifrado, claveSecreta);
