document.addEventListener('DOMContentLoaded', function () {
  // Datos diarios de USD/MXN para marzo 2025 (31 puntos)
  const rawDataUsd = [
    ['2025-03-01', 20.700],
    ['2025-03-02', 20.705],
    ['2025-03-03', 20.710],
    ['2025-03-04', 20.708],
    ['2025-03-05', 20.712],
    ['2025-03-06', 20.715],
    ['2025-03-07', 20.717],
    ['2025-03-08', 20.720],
    ['2025-03-09', 20.722],
    ['2025-03-10', 20.725],
    ['2025-03-11', 20.728],
    ['2025-03-12', 20.730],
    ['2025-03-13', 20.732],
    ['2025-03-14', 20.735],
    ['2025-03-15', 20.737],
    ['2025-03-16', 20.740],
    ['2025-03-17', 20.742],
    ['2025-03-18', 20.745],
    ['2025-03-19', 20.747],
    ['2025-03-20', 20.750],
    ['2025-03-21', 20.752],
    ['2025-03-22', 20.755],
    ['2025-03-23', 20.757],
    ['2025-03-24', 20.760],
    ['2025-03-25', 20.762],
    ['2025-03-26', 20.765],
    ['2025-03-27', 20.767],
    ['2025-03-28', 20.770],
    ['2025-03-29', 20.772],
    ['2025-03-30', 20.775],
    ['2025-03-31', 20.780]
  ];

  // Convertir fechas a timestamp para Highcharts
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);

  let chart;
  let intervalId;

  // Crear el gráfico tipo "area" con degradado
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'area',
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
        area: {
          lineWidth: 2,
          marker: { enabled: true },
          // Definir color degradado en el área
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(0,122,204,0.5)'],
              [1, 'rgba(0,122,204,0)']
            ]
          },
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

  // Función para iniciar la animación agregando cada punto diario
  function startAnimation() {
    if (intervalId) clearInterval(intervalId);
    // Reiniciar la serie
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
    }, 500);
  }

  // Crear el gráfico y asignar el evento al botón
  chart = createChart();
  document.getElementById('play-btn').addEventListener('click', startAnimation);
});
