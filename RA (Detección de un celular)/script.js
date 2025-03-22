// script.js

let model;

// Carga el modelo de detección (COCO-SSD)
async function loadModel() {
  model = await cocoSsd.load();
  console.log("Modelo de detección cargado.");
  detectFrame();
}

// Función para detectar objetos en el frame de video
async function detectFrame() {
  const video = document.querySelector('video');
  if (video && model) {
    model.detect(video).then(predictions => {
      // Buscamos la detección de un "cell phone"
      const found = predictions.find(pred => pred.class === 'cell phone');
      const infoPanel = document.getElementById('infoPanel');
      
      if (found) {
        console.log("Celular detectado:", found);
        infoPanel.setAttribute('visible', 'true');
        // Actualizamos el panel con información sobre el celular
        infoPanel.children[1].setAttribute('value', 'Celular detectado:\nModelo desconocido\nEspecificaciones: ...');
      } else {
        infoPanel.setAttribute('visible', 'false');
      }
      requestAnimationFrame(detectFrame);
    });
  } else {
    requestAnimationFrame(detectFrame);
  }
}

// Inicia la carga del modelo al cargar la ventana
window.addEventListener('load', loadModel);

