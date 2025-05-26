// Objeto para almacenar la cantidad de votos por cada opción, inicializado en cero
const results = {
  "JavaScript": 0,
  "Python": 0,
  "Java": 0,
  "C++": 0
};

// Obtener referencia al formulario por su id 'pollForm'
const form = document.getElementById('pollForm');

// Obtener referencia al contenedor de la gráfica (div oculto inicialmente)
const chartContainer = document.getElementById('chartContainer');

// Obtener referencia al canvas donde se dibujará la gráfica
const canvas = document.getElementById('resultsChart');

// Obtener contexto 2D para dibujar en el canvas
const ctx = canvas.getContext('2d');

// Agregar un "listener" para cuando el formulario se envíe (submit)
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Evita que el formulario recargue la página al enviarse

  // Obtener el valor de la opción seleccionada del grupo radio con name 'language'
  const selected = form.language.value;

  // Si no se seleccionó ninguna opción, mostrar alerta y detener la función
  if (!selected) {
    alert('Por favor, selecciona una opción antes de enviar.');
    return;
  }

  // Incrementar en 1 el contador de votos para la opción seleccionada
  results[selected]++;

  // Ocultar el formulario para no permitir más votos
  form.style.display = 'none';

  // Mostrar el contenedor de la gráfica con los resultados
  chartContainer.style.display = 'block';

  // Llamar a la función para dibujar la gráfica actualizada
  drawChart();
});

// Función que dibuja la gráfica de barras en el canvas
function drawChart() {
  // Limpia el área del canvas para dibujar desde cero
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Obtener arreglo con las etiquetas (nombres de opciones)
  const labels = Object.keys(results);

  // Obtener arreglo con los valores (cantidad de votos)
  const values = Object.values(results);

  // Calcular el total de votos sumando todos los valores
  const totalVotes = values.reduce((a, b) => a + b, 0);

  // Definir altura máxima para las barras de la gráfica
  const chartHeight = 250;

  // Ancho disponible para el gráfico (se reserva margen lateral)
  const chartWidth = canvas.width - 80;

  // Ancho fijo para cada barra
  const barWidth = 50;

  // Valor máximo entre los votos para escalar las barras proporcionalmente
  // Si todos los valores son cero, maxVal se ajusta a 1 para evitar división por cero
  const maxVal = Math.max(...values, 1);

  // Configuración del estilo de texto para el canvas
  ctx.font = '16px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';

  // Recorrer cada etiqueta para dibujar su barra y etiquetas correspondientes
  labels.forEach((label, i) => {
    // Calcular la altura proporcional de la barra según el máximo valor
    const barHeight = (values[i] / maxVal) * chartHeight;

    // Calcular posición horizontal (x) de la barra, con separación entre barras
    const x = 40 + i * (barWidth + 40);

    // Calcular posición vertical (y) de la barra (desde abajo hacia arriba)
    const y = canvas.height - barHeight - 30;

    // Dibujar barra en color azul
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Dibujar número de votos encima de cada barra en color negro
    ctx.fillStyle = '#000';
    ctx.fillText(values[i], x + barWidth / 2, y - 5);

    // Dibujar etiqueta (nombre opción) debajo de cada barra
    ctx.fillText(label, x + barWidth / 2, canvas.height - 10);
  });

  // Dibujar texto del total de votos en la esquina superior izquierda
  ctx.fillStyle = '#666';
  ctx.textAlign = 'left';
  ctx.fillText(`Total de votos: ${totalVotes}`, 10, 20);
}
