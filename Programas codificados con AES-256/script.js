const clave = "clave-super-secreta";
const contenidoOriginal = "Este es el contenido secreto que nadie debe ver.";

const contenidoCifrado = CryptoJS.AES.encrypt(contenidoOriginal, clave).toString();
console.log("Contenido Cifrado:", contenidoCifrado);

