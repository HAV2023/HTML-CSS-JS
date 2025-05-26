// Inicializa resultados en cero
const results = {
  "JavaScript": 0,
  "Python": 0,
  "Java": 0,
  "C++": 0
};

const form = document.getElementById('pollForm');
const chartContainer = document.getElementById('chartContainer');
const canvas = document.getElementById('resultsChart');
const ctx = canvas.getContext('2d');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const selected = form.language.value;
  if (!selected) {
    alert('Por favor, selecciona una opción antes de enviar.');
    return;
  }
  results[selected]++;
  form.style.display = 'none';
  chartContainer.style.display = 'block';
  drawChart();
});

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = Object.keys(results);
  const values = Object.values(results);
  const totalVotes = values.reduce((a,b) => a + b, 0);

  const chartHeight = 250;
  const chartWidth = canvas.width - 80;
  const barWidth = 50;
  const maxVal = Math.max(...values, 1);

  ctx.font = '16px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';

  labels.forEach((label, i) => {
    const barHeight = (values[i] / maxVal) * chartHeight;
    const x = 40 + i * (barWidth + 40);
    const y = canvas.height - barHeight - 30;

    ctx.fillStyle = '#4285f4';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#000';
    ctx.fillText(values[i], x + barWidth / 2, y - 5);

    ctx.fillText(label, x + barWidth / 2, canvas.height - 10);
  });

  ctx.fillStyle = '#666';
  ctx.textAlign = 'left';
  ctx.fillText(`Total de votos: ${totalVotes}`, 10, 20);
}

