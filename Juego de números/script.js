// Variables globales
let currentNumber = 0;
let gameActive = false;
let scoreCorrect = 0;
let scoreIncorrect = 0;

// Función para actualizar el marcador en tiempo real
function updateScoreboard() {
  document.getElementById("correct-count").textContent = "Aciertos: " + scoreCorrect;
  document.getElementById("incorrect-count").textContent = "Errores: " + scoreIncorrect;
}

// Función para generar un número aleatorio entre 1 y 9
function generateRandomNumber() {
  return Math.floor(Math.random() * 9) + 1;
}

// Función para mostrar un nuevo número en el panel derecho
function generateAndDisplayNumber() {
  if (gameActive) {
    currentNumber = generateRandomNumber();
    document.getElementById('display-number').textContent = currentNumber;
  }
}

// Función para iniciar el juego
function startGame() {
  gameActive = true;
  scoreCorrect = 0;
  scoreIncorrect = 0;
  updateScoreboard();
  generateAndDisplayNumber();
}

// Función para finalizar el juego y mostrar un resumen
function stopGame() {
  gameActive = false;
  document.getElementById('display-number').textContent = "-";
  const totalPlays = scoreCorrect + scoreIncorrect;
  const summaryMessage = `Resumen del juego:
Total de jugadas: ${totalPlays}
Aciertos: ${scoreCorrect}
Errores: ${scoreIncorrect}`;
  alert(summaryMessage);
}

// Agregar evento a cada botón numérico
document.querySelectorAll('.number-button').forEach(button => {
  button.addEventListener('click', function() {
    if (!gameActive) return; // Si el juego no está activo, no hace nada
    const chosenNumber = parseInt(this.getAttribute('data-number'));
    if (chosenNumber === currentNumber) {
      // Acertó: reproducir sonido, actualizar marcador y mostrar un nuevo número
      scoreCorrect++;
      updateScoreboard();
      document.getElementById("audio-correct").play();
      generateAndDisplayNumber();
    } else {
      // Error: reproducir sonido y actualizar marcador
      scoreIncorrect++;
      updateScoreboard();
      document.getElementById("audio-incorrect").play();
    }
  });
});

// Eventos para los botones de control
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('stop-btn').addEventListener('click', stopGame);
