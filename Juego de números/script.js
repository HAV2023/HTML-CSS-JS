// Variables globales
let currentNumber = 0; // Almacena el número actual que se muestra en el panel derecho.
let gameActive = false; // Bandera que indica si el juego está activo o no.
let scoreCorrect = 0; // Contador de aciertos.
let scoreIncorrect = 0; // Contador de errores.

// Función para actualizar el marcador en tiempo real
function updateScoreboard() {
  // Actualiza el texto del elemento con id "correct-count" mostrando los aciertos actuales.
  document.getElementById("correct-count").textContent = "Aciertos: " + scoreCorrect;
  // Actualiza el texto del elemento con id "incorrect-count" mostrando los errores actuales.
  document.getElementById("incorrect-count").textContent = "Errores: " + scoreIncorrect;
}

// Función para generar un número aleatorio entre 1 y 9
function generateRandomNumber() {
  // Math.random() genera un número entre 0 (incluido) y 1 (excluido);
  // Se multiplica por 9 para obtener un rango entre 0 y 9, se usa Math.floor para redondear hacia abajo y se le suma 1.
  return Math.floor(Math.random() * 9) + 1;
}

// Función para mostrar un nuevo número en el panel derecho
function generateAndDisplayNumber() {
  if (gameActive) { // Solo se genera un número si el juego está activo.
    currentNumber = generateRandomNumber(); // Asigna a currentNumber un nuevo número aleatorio.
    // Muestra el número generado en el elemento con id "display-number".
    document.getElementById('display-number').textContent = currentNumber;
  }
}

// Función para iniciar el juego
function startGame() {
  gameActive = true; // Marca el juego como activo.
  scoreCorrect = 0;  // Reinicia el contador de aciertos.
  scoreIncorrect = 0; // Reinicia el contador de errores.
  updateScoreboard(); // Actualiza el marcador en la interfaz.
  generateAndDisplayNumber(); // Muestra el primer número aleatorio.
}

// Función para finalizar el juego y mostrar un resumen
function stopGame() {
  gameActive = false; // Marca el juego como detenido.
  // Cambia la visualización del número en el panel derecho a un guion, indicando que el juego ha terminado.
  document.getElementById('display-number').textContent = "-";
  // Calcula el total de jugadas sumando aciertos y errores.
  const totalPlays = scoreCorrect + scoreIncorrect;
  // Crea un mensaje resumen usando template literals que muestra el total de jugadas, aciertos y errores.
  const summaryMessage = `Resumen del juego:
Total de jugadas: ${totalPlays}
Aciertos: ${scoreCorrect}
Errores: ${scoreIncorrect}`;
  // Muestra el resumen en una ventana de alerta.
  alert(summaryMessage);
}

// Agregar evento a cada botón numérico
document.querySelectorAll('.number-button').forEach(button => {
  // Asigna un listener de clic a cada botón con la clase "number-button".
  button.addEventListener('click', function() {
    if (!gameActive) return; // Si el juego no está activo, no realiza ninguna acción.
    // Obtiene el número asociado al botón a partir del atributo "data-number" y lo convierte a entero.
    const chosenNumber = parseInt(this.getAttribute('data-number'));
    if (chosenNumber === currentNumber) { // Compara el número elegido con el número actual.
      // Si el número es correcto:
      scoreCorrect++; // Incrementa el contador de aciertos.
      updateScoreboard(); // Actualiza el marcador en pantalla.
      document.getElementById("audio-correct").play(); // Reproduce el sonido de acierto.
      generateAndDisplayNumber(); // Genera y muestra un nuevo número.
    } else {
      // Si el número es incorrecto:
      scoreIncorrect++; // Incrementa el contador de errores.
      updateScoreboard(); // Actualiza el marcador en pantalla.
      document.getElementById("audio-incorrect").play(); // Reproduce el sonido de error.
    }
  });
});

// Eventos para los botones de control
// Asocia la función startGame al botón con id "start-btn".
document.getElementById('start-btn').addEventListener('click', startGame);
// Asocia la función stopGame al botón con id "stop-btn".
document.getElementById('stop-btn').addEventListener('click', stopGame);
