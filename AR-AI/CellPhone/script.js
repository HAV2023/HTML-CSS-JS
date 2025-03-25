// script.js

// Se espera a que la ventana se haya cargado completamente para iniciar el proceso.
window.addEventListener('load', () => {
  let model; // Variable que almacenará el modelo COCO-SSD.
  
  // Umbral mínimo de confianza para considerar una detección válida.
  const CONFIDENCE_THRESHOLD = 0.5;

  // Se crea un elemento <div> para mostrar el resultado de la detección en pantalla.
  const detectionResultDiv = document.createElement('div');
  detectionResultDiv.id = 'detectionResult';
  
  // Estilos CSS para posicionar y dar formato al <div>.
  detectionResultDiv.style.position = 'absolute';
  detectionResultDiv.style.top = '10px';
  detectionResultDiv.style.left = '50%';
  detectionResultDiv.style.transform = 'translateX(-50%)';
  detectionResultDiv.style.padding = '10px 20px';
  detectionResultDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  detectionResultDiv.style.color = 'white';
  detectionResultDiv.style.fontSize = '18px';
  detectionResultDiv.style.zIndex = '9999';
  detectionResultDiv.innerText = 'Esperando detección...';
  
  // Se añade el <div> al cuerpo del documento para que sea visible.
  document.body.appendChild(detectionResultDiv);

  /**
   * Función asíncrona que carga el modelo COCO-SSD de TensorFlow.js.
   * Una vez cargado, inicia el ciclo de detección de frames.
   */
  async function loadModel() {
    try {
      // Carga del modelo de detección.
      model = await cocoSsd.load();
      console.log("Modelo COCO-SSD cargado correctamente.");
      // Inicia el ciclo de detección.
      detectFrame();
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
      detectionResultDiv.innerText = "Error al cargar el modelo.";
    }
  }

  /**
   * Función asíncrona que procesa cada frame del video para detectar objetos.
   * Utiliza requestAnimationFrame para mantener un bucle de detección en tiempo real.
   */
  async function detectFrame() {
    // Se obtiene el elemento <video> utilizado por AR.js para la transmisión de la cámara.
    const video = document.querySelector('video');

    // Verifica que el video esté disponible y que el modelo se haya cargado.
    if (video && model) {
      try {
        // Realiza la detección de objetos en el frame actual.
        const predictions = await model.detect(video);

        // Se registra en consola cada predicción (para fines de depuración).
        console.log("Predicciones:", predictions);

        // Se define un mensaje predeterminado en caso de que no se detecte un celular.
        let message = 'Celular no detectado. Ajusta posición, tamaño o ángulo.';
        
        // Busca en las predicciones un objeto clasificado como "cell phone" con suficiente confianza.
        const cellPhonePrediction = predictions.find(pred => 
          pred.class === 'cell phone' && pred.score >= CONFIDENCE_THRESHOLD
        );

        // Si se encuentra el celular, se actualiza el mensaje.
        if (cellPhonePrediction) {
          console.log("Celular detectado:", cellPhonePrediction);
          message = '¡Celular detectado!';
        }

        // Se actualiza el contenido del <div> con el mensaje actual.
        detectionResultDiv.innerText = message;
      } catch (error) {
        console.error("Error durante la detección:", error);
        detectionResultDiv.innerText = "Error durante la detección.";
      }
    }
    
    // Solicita el siguiente frame para continuar la detección en tiempo real.
    requestAnimationFrame(detectFrame);
  }

  // Se inicia la carga del modelo al cargar la ventana.
  loadModel();
});
