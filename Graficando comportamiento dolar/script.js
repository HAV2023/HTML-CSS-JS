document.addEventListener('DOMContentLoaded', function () {
  // Datos para USD/MXN en marzo 2025 (10 puntos)
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

  // Datos para EUR/MXN en marzo 2025 (10 puntos)
  const rawDataEur = [
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

  // Crear la gráfica con apariencia elegante y curvas suaves
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'spline',
        backgroundColor: '#1e1e1e',
        animation: false
      },
      title: {
        text: 'Comportamiento de USD y EUR en MXN - Marzo 2025',
        style: { color: '#ffffff', fontSize: '20px' }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#cccccc', fontSize: '12px' } },
        lineColor: '#444',
        tickColor: '#444'
      },
      yAxis: {
        title: { text: 'Tipo de Cambio', style: { color: '#cccccc' } },
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
        itemStyle: { color: '#ffffff', fontSize: '12px' }
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          marker: { enabled: false },
          enableMouseTracking: true
        },
        series: {
          animation: { duration: 400, easing: 'linear' }
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
    // Reiniciar los datos de ambas series
    chart.series[0].setData([]);
    chart.series[1].setData([]);
    let i = 0;
    intervalId = setInterval(() => {
      if (i < processedDataUsd.length) {
        chart.series[0].addPoint(processedDataUsd[i], false, false, {
          duration: 400,
          easing: 'linear'
        });
        chart.series[1].addPoint(processedDataEur[i], true, false, {
          duration: 400,
          easing: 'linear'
        });
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 600); // Intervalo ligeramente superior a la duración de la animación
  }

  chart = createChart();
  const button = document.getElementById('play-btn');
  button.addEventListener('click', startAnimation);
});
