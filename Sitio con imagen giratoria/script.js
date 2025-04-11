// Configuración para la vista 360 del tenis deportivo

// Número total de imágenes que conforman la rotación completa
const totalImages = 2;

// Variable para llevar el índice de la imagen actual (se inicia en 1)
let currentImage = 1;

// Seleccionamos el elemento de la imagen mediante su ID
const shoeImage = document.getElementById('shoe');

// Función que actualiza la imagen para simular la rotación
function updateImage() {
  // Incrementamos el contador de imagen
  currentImage++;
  // Si hemos superado el total, volvemos a la primera imagen
  if (currentImage > totalImages) {
    currentImage = 1;
  }
  
  // Construimos la ruta de la imagen asumiendo la nomenclatura 'tN.png'
  const imagePath = `images/t${currentImage}.png`;
  
  // Actualizamos el atributo 'src' del elemento de imagen para mostrar la nueva imagen
  shoeImage.src = imagePath;
}

// Establecemos un intervalo para actualizar la imagen cada 100 milisegundos
setInterval(updateImage, 100);
