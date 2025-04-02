document.addEventListener('DOMContentLoaded', function () {
  // Datos para USD/MXN (10 puntos por mes)
  const rawDataUsd = [
    // Enero 2025
    ['2025-01-02', 20.500],
    ['2025-01-06', 20.520],
    ['2025-01-08', 20.510],
    ['2025-01-10', 20.530],
    ['2025-01-15', 20.540],
    ['2025-01-20', 20.550],
    ['2025-01-23', 20.540],
    ['2025-01-28', 20.560],
    ['2025-01-30', 20.570],
    ['2025-01-31', 20.580],
    // Febrero 2025
    ['2025-02-03', 20.600],
    ['2025-02-05', 20.610],
    ['2025-02-07', 20.620],
    ['2025-02-10', 20.630],
    ['2025-02-14', 20.640],
    ['2025-02-17', 20.650],
    ['2025-02-20', 20.660],
    ['2025-02-24', 20.670],
    ['2025-02-26', 20.680],
    ['2025-02-28', 20.690],
    // Marzo 2025
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

  // Datos para EUR/MXN (10 puntos por mes)
  const rawDataEur = [
    // Enero 2025
    ['2025-01-02', 21.900],
    ['2025-01-06', 21.910],
    ['2025-01-08', 21.905],
    ['2025-01-10', 21.915],
    ['2025-01-15', 21.920],
    ['2025-01-20', 21.930],
    ['2025-01-23', 21.925],
    ['2025-01-28', 21.935],
    ['2025-01-30', 21.940],
    ['2025-01-31', 21.945],
    // Febrero 2025
    ['2025-02-03', 21.950],
    ['2025-02-05', 21.955],
    ['2025-02-07', 21.960],
    ['2025-02-10', 21.965],
    ['2025-02-14', 21.970],
    ['2025-02-17', 21.975],
    ['2025-02-20', 21.980],
    ['2025-02-24', 21.985],
    ['2025-02-26', 21.990],
    ['2025-02-28', 21.995],
    // Marzo 2025
    ['2025-03-03', 22.000],
    ['2025-03-06', 22.005],
    ['2025-03-10', 22.010],
    ['2025-03-13', 22.015],
    ['2025-03-17', 22.020],
    ['2025-03-20', 22.025],
    ['2025-03-23', 22.030],
    ['2025-03-26', 22.035],
    ['2025-03-28', 22.040],
    ['2025-03-31', 22.045]
  ];

  // Convertir las fechas a timestamp
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);
  const processedDataEur = rawDataEur.map(([date, value]) => [new Date(date).getTime(), value]);

  let chart;
  let intervalId;

  // Crear el gráfico con apariencia de sismógrafo
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'line', // Efecto sismógrafo
        backgroundColor: '#1e1e1e',
        animation: false
      },
      title: {
        text: 'Comportamiento de USD y EUR en MXN (Ene - Mar 2025)',
        style: { color: '#ffffff' }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#cccccc' } },
        lineColor: '#444',
        tickColor: '#444'
      },
      yAxis: {
        title: { text: 'Tipo de Cambio' },
        labels: { style: { color: '#cccccc' } },
        gridLineColor: '#333'
      },
      tooltip: {
        shared: true,
        backgroundColor: '#333',
        style: { color: '#fff' },
        headerFormat: '<b>{point.x:%e %b %Y}</b><br>',
        pointFormat: '{series.name}: {point.y:.3f}'
      },
      legend: {
        enabled: true,
        itemStyle: { color: '#ffffff' }
      },
      plotOptions: {
        line: {
          lineWidth: 1, // Línea delgada para efecto sismógrafo
          marker: { enabled: false },
          enableMouseTracking: true
        },
        series: {
          animation: { duration: 300, easing: 'linear' }
        }
      },
      series: [
        {
          name: 'USD/MXN',
          data: [],
          color: '#00e6e6'
        },
        {
          name: 'EUR/MXN',
          data: [],
          color: '#ffcc00'
        }
      ],
      credits: { enabled: false }
    });
  }

  // Función para iniciar la animación agregando puntos progresivamente
  function startAnimation() {
    if (intervalId) clearInterval(intervalId);
    // Reiniciamos los datos de ambas series
    chart.series[0].setData([]);
    chart.series[1].setData([]);
    let i = 0;
    intervalId = setInterval(() => {
      if (i < processedDataUsd.length) {
        chart.series[0].addPoint(processedDataUsd[i], false, false, {
          duration: 300,
          easing: 'linear'
        });
        chart.series[1].addPoint(processedDataEur[i], true, false, {
          duration: 300,
          easing: 'linear'
        });
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 300); // Intervalo de 300 ms para efecto dinámico
  }

  // Crear el gráfico al cargar el DOM
  chart = createChart();

  // Asignar el evento al botón de reproducción
  const button = document.getElementById('play-btn');
  button.addEventListener('click', startAnimation);
});
