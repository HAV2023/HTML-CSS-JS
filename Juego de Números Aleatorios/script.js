/* =============================
   Lógica del juego "Adivina el Número" en JavaScript
   ============================= */

/* Genera un número aleatorio entre 1 y 100 */
const randomNumber = Math.floor(Math.random() * 100) + 1;

/* Inicializa el contador de intentos a 0 */
let attemptCount = 0;

/* Obtiene referencias a los elementos del DOM */
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const feedback = document.getElementById('feedback');
const attempts = document.getElementById('attempts');

/* Función que se ejecuta al hacer clic en el botón "Adivinar" */
guessButton.addEventListener('click', function() {
  /* Convierte el valor ingresado en el input a número */
  const userGuess = Number(guessInput.value);
  attemptCount++; // Incrementa el contador de intentos

  /* Valida que el usuario haya ingresado un número entre 1 y 100 */
  if (!userGuess || userGuess < 1 || userGuess > 100) {
    feedback.textContent = 'Por favor, ingresa un número entre 1 y 100.';
    return;
  }

  /* Compara el número ingresado con el número aleatorio generado */
  if (userGuess === randomNumber) {
    feedback.textContent = `¡Felicidades! Adivinaste el número en ${attemptCount} intento(s).`;
    guessButton.disabled = true; // Deshabilita el botón si el usuario adivina correctamente
  } else if (userGuess < randomNumber) {
    feedback.textContent = 'El número es mayor. Intenta de nuevo.';
  } else {
    feedback.textContent = 'El número es menor. Intenta de nuevo.';
  }

  /* Actualiza el contador de intentos en la interfaz */
  attempts.textContent = `Número de intentos: ${attemptCount}`;

  /* Limpia el campo de entrada y establece el foco para el siguiente intento */
  guessInput.value = '';
  guessInput.focus();
});

