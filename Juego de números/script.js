// Variables globales
let currentNumber = 0;
let gameActive = false;

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
  generateAndDisplayNumber();
}

// Función para finalizar el juego
function stopGame() {
  gameActive = false;
  document.getElementById('display-number').textContent = "-";
}

// Agregar evento a cada botón numérico
document.querySelectorAll('.number-button').forEach(button => {
  button.addEventListener('click', function() {
    if (!gameActive) return; // Si el juego no está activo, no hace nada
    const chosenNumber = parseInt(this.getAttribute('data-number'));
    if (chosenNumber === currentNumber) {
      // Si el número es correcto, se muestra uno nuevo
      generateAndDisplayNumber();
    } else {
      // Si es incorrecto, se muestra una alerta (se puede personalizar o quitar)
      alert("Incorrecto. ¡Inténtalo de nuevo!");
    }
  });
});

// Eventos para los botones de control
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('stop-btn').addEventListener('click', stopGame);

