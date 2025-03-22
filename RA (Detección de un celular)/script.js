// script.js

// Espera a que la ventana se cargue completamente antes de iniciar el proceso.
window.addEventListener('load', () => {
  let model; // Variable para almacenar el modelo COCO-SSD

  /**
   * Carga el modelo COCO-SSD de TensorFlow.js de forma asíncrona.
   */
  async function loadModel() {
    try {
      model = await cocoSsd.load();
      console.log("Modelo COCO-SSD cargado correctamente.");
      // Una vez cargado el modelo, se inicia el ciclo de detección.
      detectFrame();
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
    }
  }

  /**
   * Función que procesa cada frame del video para detectar objetos.
   * Utiliza requestAnimationFrame para crear un bucle de detección en tiempo real.
   */
  async function detectFrame() {
    // Selecciona el elemento <video> que utiliza AR.js (normalmente es el primero en el documento).
    const video = document.querySelector('video');

    // Comprueba que el elemento de video existe y que el modelo ya está cargado.
    if (video && model) {
      // Ejecuta la detección de objetos en el frame actual del video.
      model.detect(video).then(predictions => {
        // Muestra en consola todas las predicciones obtenidas para fines de depuración.
        console.log("Predicciones:", predictions);

        // Busca en las predicciones un objeto clasificado como "cell phone".
        const cellPhonePrediction = predictions.find(pred => pred.class === 'cell phone');

        if (cellPhonePrediction) {
          console.log("Celular detectado:", cellPhonePrediction);
          // Aquí puedes agregar la lógica adicional para mostrar información en la escena AR.
          // Por ejemplo, actualizar un panel informativo o activar una animación.
        } else {
          console.log("Celular no detectado");
        }

        // Solicita el siguiente frame para continuar la detección.
        requestAnimationFrame(detectFrame);
      }).catch(error => {
        // En caso de error durante la detección, se muestra en consola y se continúa con el siguiente frame.
        console.error("Error durante la detección:", error);
        requestAnimationFrame(detectFrame);
      });
    } else {
      // Si el video aún no está listo o el modelo no se ha cargado, se espera el siguiente frame.
      requestAnimationFrame(detectFrame);
    }
  }

  // Inicia la carga del modelo al cargar la ventana.
  loadModel();
});
