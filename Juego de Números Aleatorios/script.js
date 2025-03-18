/* =============================
   Lógica del juego "Adivina el Número" en JavaScript
   ============================= */

/* Genera un número aleatorio entre 1 y 100.
   - Math.random() devuelve un número decimal entre 0 (inclusive) y 1 (exclusivo).
   - Se multiplica por 100 para obtener un rango entre 0 y 100 (exclusivo).
   - Math.floor() redondea hacia abajo, obteniendo un entero entre 0 y 99.
   - Se suma 1 para ajustar el rango a 1-100.
*/
const randomNumber = Math.floor(Math.random() * 100) + 1;

/* Inicializa una variable para contar los intentos del usuario.
   Comienza en 0 porque aún no se ha realizado ningún intento.
*/
let attemptCount = 0;

/* Obtiene referencias a los elementos del documento (DOM) usando sus IDs */
// Campo de entrada donde el usuario ingresa su número
const guessInput = document.getElementById('guessInput');
// Botón que el usuario presiona para enviar su intento
const guessButton = document.getElementById('guessButton');
// Elemento donde se mostrará la retroalimentación (si el número es mayor, menor o correcto)
const feedback = document.getElementById('feedback');
// Elemento donde se mostrará el número de intentos realizados
const attempts = document.getElementById('attempts');

/* Se agrega un "event listener" al botón para detectar el clic.
   Cuando se haga clic, se ejecutará la función definida a continuación.
*/
guessButton.addEventListener('click', function() {
  /* Convierte el valor ingresado en el input de texto a un número.
     Number() se usa para asegurarse de que se trate de un dato numérico.
  */
  const userGuess = Number(guessInput.value);
  
  /* Incrementa el contador de intentos en 1, ya que el usuario realizó un intento. */
  attemptCount++;

  /* Valida que el número ingresado sea válido:
     - Si no se ingresa un número (o se ingresa 0, que es falsy)
     - Si el número es menor que 1 o mayor que 100.
     Si la validación falla, se muestra un mensaje de error y se detiene la función.
  */
  if (!userGuess || userGuess < 1 || userGuess > 100) {
    feedback.textContent = 'Por favor, ingresa un número entre 1 y 100.';
    return; // Sale de la función sin continuar la ejecución.
  }

  /* Compara el número ingresado (userGuess) con el número aleatorio generado (randomNumber) */
  if (userGuess === randomNumber) {
    // Si el usuario adivina correctamente, se muestra un mensaje de felicitación.
    feedback.textContent = `¡Felicidades! Adivinaste el número en ${attemptCount} intento(s).`;
    // Se deshabilita el botón para evitar más intentos, ya que el juego ha terminado.
    guessButton.disabled = true;
  } else if (userGuess < randomNumber) {
    // Si el número ingresado es menor que el número aleatorio, se indica que el número es mayor.
    feedback.textContent = 'El número es mayor. Intenta de nuevo.';
  } else {
    // Si el número ingresado es mayor que el número aleatorio, se indica que el número es menor.
    feedback.textContent = 'El número es menor. Intenta de nuevo.';
  }

  /* Actualiza el contenido del elemento que muestra el número de intentos realizados */
  attempts.textContent = `Número de intentos: ${attemptCount}`;

  /* Limpia el campo de entrada para preparar el próximo intento
     y establece el foco en el campo para mejorar la experiencia del usuario.
  */
  guessInput.value = '';
  guessInput.focus();
});
