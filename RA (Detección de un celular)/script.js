// script.js

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
      detectFrame();
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
    }
  }

  /**
   * Función que procesa cada frame del video para detectar objetos.
   */
  async function detectFrame() {
    const video = document.querySelector('video');

    if (video && model) {
      try {
        const predictions = await model.detect(video);

        // Registro detallado de todas las predicciones
        if (predictions.length === 0) {
          console.log("No se detectaron objetos en este frame.");
        } else {
          predictions.forEach(pred => {
            console.log(`Objeto: ${pred.class}, Confianza: ${pred.score.toFixed(2)}`);
          });
        }

        // Búsqueda de la predicción de "cell phone"
        const cellPhonePrediction = predictions.find(pred => 
          pred.class === 'cell phone' && pred.score >= CONFIDENCE_THRESHOLD
        );

        if (cellPhonePrediction) {
          console.log("Celular detectado:", cellPhonePrediction);
          // Aquí podrías, por ejemplo, actualizar un panel informativo en la escena AR.
        } else {
          console.log("Celular no detectado. Intenta cambiar la posición, tamaño o ángulo.");
        }
      } catch (error) {
        console.error("Error durante la detección:", error);
      }
    }
    requestAnimationFrame(detectFrame);
  }

  loadModel();
});
