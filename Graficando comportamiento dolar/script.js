document.addEventListener('DOMContentLoaded', function () {
  // Datos de USD/MXN en marzo 2025 (10 puntos de ejemplo)
  const rawDataUsd = [
    ['2025-03-03', 20.700],
    ['2025-03-06', 20.710],
    ['2025-03-10', 20.720],
    ['2025-03-13', 20.730],
    ['2025-03-17', 20.740],
    ['2025-03-20', 20.750],
    ['2025-03-23', 20.760],
    ['2025-03-26', 20.770],
    ['2025-03-28', 20.780],
    ['2025-03-31', 20.790]
  ];

  // Convertir las fechas a timestamp para Highcharts
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);

  let chart;
  let intervalId;

  // Crear el gráfico vacío
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'line',
        animation: false,
        backgroundColor: '#fff'
      },
      title: {
        text: 'Comportamiento del Dólar (USD/MXN) - Marzo 2025',
        style: { color: '#333', fontSize: '18px' }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#333' } },
        lineColor: '#ccc',
        tickColor: '#ccc'
      },
      yAxis: {
        title: { text: 'Tipo de Cambio', style: { color: '#333' } },
        labels: { style: { color: '#333' } },
        gridLineColor: '#eee'
      },
      tooltip: {
        headerFormat: '<b>{point.x:%e %b %Y}</b><br>',
        pointFormat: 'USD/MXN: {point.y:.3f}'
      },
      plotOptions: {
        line: {
          lineWidth: 2,
          marker: { enabled: true },
          enableMouseTracking: true
        },
        series: {
          animation: { duration: 400, easing: 'easeOutBounce' }
        }
      },
      series: [{
        name: 'USD/MXN',
        data: [],
        color: '#007acc'
      }],
      credits: { enabled: false }
    });
  }

  // Función para la animación de entrada personalizada: agrega puntos uno a uno
  function startAnimation() {
    if (intervalId) clearInterval(intervalId);
    // Reiniciar la serie a vacío
    chart.series[0].setData([]);
    let i = 0;
    intervalId = setInterval(() => {
      if (i < processedDataUsd.length) {
        chart.series[0].addPoint(processedDataUsd[i], true, false, {
          duration: 400,
          easing: 'easeOutBounce'
        });
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 500); // Intervalo entre cada punto
  }

  // Crear el gráfico y asignar el evento al botón
  chart = createChart();
  document.getElementById('play-btn').addEventListener('click', startAnimation);
});
