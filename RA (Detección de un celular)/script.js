// script.js

// Espera a que la ventana cargue por completo antes de ejecutar el código.
window.addEventListener('load', () => {
  let model; // Variable para almacenar el modelo COCO-SSD.
  
  // Umbral mínimo de confianza para considerar una detección válida.
  const CONFIDENCE_THRESHOLD = 0.5;

  /**
   * Carga el modelo COCO-SSD de TensorFlow.js de manera asíncrona.
   */
  async function loadModel() {
    try {
      model = await cocoSsd.load();
      console.log("Modelo COCO-SSD cargado correctamente.");
      // Inicia el bucle de detección una vez que el modelo esté listo.
      detectFrame();
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
    }
  }

  /**
   * Función que procesa cada frame del video para detectar objetos.
   * Utiliza requestAnimationFrame para crear un ciclo de detección en tiempo real.
   */
  async function detectFrame() {
    // Selecciona el elemento <video> que AR.js utiliza para mostrar la cámara.
    const video = document.querySelector('video');

    // Verifica que el elemento de video exista y que el modelo esté cargado.
    if (video && model) {
      try {
        // Realiza la detección en el frame actual del video.
        const predictions = await model.detect(video);

        // Muestra todas las predicciones en la consola para depuración.
        console.log("Predicciones:", predictions);

        // Busca una predicción que corresponda a 'cell phone' con suficiente confianza.
        const cellPhonePrediction = predictions.find(pred => 
          pred.class === 'cell phone' && pred.score >= CONFIDENCE_THRESHOLD
        );

        if (cellPhonePrediction) {
          console.log("Celular detectado:", cellPhonePrediction);
          // Aquí puedes agregar lógica adicional (por ejemplo, actualizar un panel en la escena AR).
        } else {
          console.log("Celular no detectado. Ajusta posición, tamaño o ángulo del objeto.");
        }
      } catch (error) {
        console.error("Error durante la detección:", error);
      }
    }
    // Solicita el siguiente frame para continuar el ciclo de detección.
    requestAnimationFrame(detectFrame);
  }

  // Inicia la carga del modelo al cargar la ventana.
  loadModel();
});
