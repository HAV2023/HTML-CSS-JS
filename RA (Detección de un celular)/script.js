// // script.js

// Se espera a que la ventana se cargue completamente antes de ejecutar cualquier código.
// Esto garantiza que todos los elementos del DOM, incluido el <video> de AR.js, estén disponibles.
window.addEventListener('load', () => {
  // Variable para almacenar el modelo COCO-SSD que se cargará de manera asíncrona.
  let model;
  
  // Umbral mínimo de confianza (50%) para considerar una detección válida.
  const CONFIDENCE_THRESHOLD = 0.5;

  // Se crea dinámicamente un elemento <div> que mostrará en pantalla el estado de la detección.
  const detectionResultDiv = document.createElement('div');
  // Se asigna un ID al <div> para facilitar su referencia o aplicación de estilos adicionales.
  detectionResultDiv.id = 'detectionResult';
  
  // Aplicación de estilos CSS directamente al <div> para posicionarlo y darle una apariencia adecuada:
  // - Posición absoluta para ubicarlo en un lugar fijo sobre la pantalla.
  // - Se coloca en la parte superior, centrado horizontalmente.
  detectionResultDiv.style.position = 'absolute';
  detectionResultDiv.style.top = '10px';
  detectionResultDiv.style.left = '50%';
  detectionResultDiv.style.transform = 'translateX(-50%)';
  // - Se agrega un padding para que el texto no toque los bordes.
  detectionResultDiv.style.padding = '10px 20px';
  // - Fondo semitransparente para que el mensaje se lea sobre cualquier fondo.
  detectionResultDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  // - Color del texto blanco y tamaño de fuente legible.
  detectionResultDiv.style.color = 'white';
  detectionResultDiv.style.fontSize = '18px';
  // - Un z-index alto para asegurarse de que el <div> se superponga sobre otros elementos.
  detectionResultDiv.style.zIndex = '9999';
  // Texto inicial que se muestra mientras no se haya detectado nada.
  detectionResultDiv.innerText = 'Esperando detección...';
  
  // Se añade el <div> al cuerpo del documento para que sea visible.
  document.body.appendChild(detectionResultDiv);

  /**
   * Función asíncrona para cargar el modelo COCO-SSD usando TensorFlow.js.
   * Una vez cargado el modelo, se inicia el ciclo de detección llamando a detectFrame().
   */
  async function loadModel() {
    try {
      // Se carga el modelo y se asigna a la variable "model".
      model = await cocoSsd.load();
      console.log("Modelo COCO-SSD cargado correctamente.");
      // Inicia el ciclo de detección de frames.
      detectFrame();
    } catch (error) {
      // Si ocurre un error durante la carga, se muestra en la consola y se actualiza el <div>.
      console.error("Error al cargar el modelo:", error);
      detectionResultDiv.innerText = "Error al cargar el modelo.";
    }
  }

  /**
   * Función asíncrona que procesa cada frame del video para detectar objetos.
   * Se utiliza requestAnimationFrame para crear un bucle que permite la detección en tiempo real.
   */
  async function detectFrame() {
    // Se selecciona el elemento <video> que AR.js utiliza para mostrar el feed de la cámara.
    const video = document.querySelector('video');

    // Se verifica que el video exista y que el modelo ya se haya cargado.
    if (video && model) {
      try {
        // Se realiza la detección de objetos en el frame actual del video.
        // model.detect(video) devuelve una promesa con un array de predicciones.
        const predictions = await model.detect(video);

        // Se imprime en la consola el array de predicciones para ayudar en la depuración.
        console.log("Predicciones:", predictions);

        // Se establece un mensaje por defecto en caso de que no se detecte un celular.
        let message = 'Celular no detectado. Ajusta posición, tamaño o ángulo.';
        
        // Se busca en las predicciones un objeto clasificado como "cell phone"
        // y que tenga una puntuación igual o superior al umbral definido.
        const cellPhonePrediction = predictions.find(pred => 
          pred.class === 'cell phone' && pred.score >= CONFIDENCE_THRESHOLD
        );

        // Si se encuentra la predicción del celular, se actualiza el mensaje.
        if (cellPhonePrediction) {
          console.log("Celular detectado:", cellPhonePrediction);
          message = '¡Celular detectado!';
        } else {
          console.log("Celular no detectado. Intenta cambiar la posición, tamaño o ángulo.");
        }

        // Se actualiza el contenido del <div> con el mensaje de detección.
        detectionResultDiv.innerText = message;
      } catch (error) {
        // Si ocurre un error durante la detección, se captura, se imprime en la consola
        // y se actualiza el <div> con un mensaje de error.
        console.error("Error durante la detección:", error);
        detectionResultDiv.innerText = "Error durante la detección.";
      }
    }
    
    // Se solicita la ejecución de detectFrame en el siguiente frame, creando un bucle continuo.
    requestAnimationFrame(detectFrame);
  }

  // Se inicia la carga del modelo al completar la carga de la ventana.
  loadModel();
});
