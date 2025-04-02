document.addEventListener('DOMContentLoaded', function () {
  // Datos para USD/MXN (valores reales de ejemplo)
  const rawDataUsd = [
    ['2025-03-03', 20.708],
    ['2025-03-04', 20.543],
    ['2025-03-05', 20.408],
    ['2025-03-06', 20.282],
    ['2025-03-07', 20.261],
    ['2025-03-10', 20.356],
    ['2025-03-11', 20.273],
    ['2025-03-12', 20.180],
    ['2025-03-13', 20.087],
    ['2025-03-14', 19.929],
    ['2025-03-17', 19.957],
    ['2025-03-18', 19.910],
    ['2025-03-19', 20.045],
    ['2025-03-20', 20.139],
    ['2025-03-21', 20.239],
    ['2025-03-24', 20.040],
    ['2025-03-25', 20.049],
    ['2025-03-26', 20.237],
    ['2025-03-27', 20.289],
    ['2025-03-28', 20.364],
    ['2025-03-31', 20.480]
  ];

  // Datos ficticios para EUR/MXN
  const rawDataEur = [
    ['2025-03-03', 22.100],
    ['2025-03-04', 22.050],
    ['2025-03-05', 21.980],
    ['2025-03-06', 21.950],
    ['2025-03-07', 21.930],
    ['2025-03-10', 21.970],
    ['2025-03-11', 21.960],
    ['2025-03-12', 21.940],
    ['2025-03-13', 21.920],
    ['2025-03-14', 21.880],
    ['2025-03-17', 21.900],
    ['2025-03-18', 21.890],
    ['2025-03-19', 21.910],
    ['2025-03-20', 21.930],
    ['2025-03-21', 21.950],
    ['2025-03-24', 21.880],
    ['2025-03-25', 21.870],
    ['2025-03-26', 21.890],
    ['2025-03-27', 21.910],
    ['2025-03-28', 21.940],
    ['2025-03-31', 21.980]
  ];

  // Datos ficticios para GBP/MXN
  const rawDataGbp = [
    ['2025-03-03', 25.300],
    ['2025-03-04', 25.250],
    ['2025-03-05', 25.200],
    ['2025-03-06', 25.170],
    ['2025-03-07', 25.160],
    ['2025-03-10', 25.190],
    ['2025-03-11', 25.180],
    ['2025-03-12', 25.150],
    ['2025-03-13', 25.130],
    ['2025-03-14', 25.100],
    ['2025-03-17', 25.120],
    ['2025-03-18', 25.110],
    ['2025-03-19', 25.130],
    ['2025-03-20', 25.150],
    ['2025-03-21', 25.170],
    ['2025-03-24', 25.120],
    ['2025-03-25', 25.110],
    ['2025-03-26', 25.130],
    ['2025-03-27', 25.140],
    ['2025-03-28', 25.160],
    ['2025-03-31', 25.200]
  ];

  // Convertir fechas a timestamp para cada conjunto
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);
  const processedDataEur = rawDataEur.map(([date, value]) => [new Date(date).getTime(), value]);
  const processedDataGbp = rawDataGbp.map(([date, value]) => [new Date(date).getTime(), value]);

  let chart;
  let intervalId;

  // Función para crear el gráfico con las tres series
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'spline',
        backgroundColor: '#1e1e1e',
        animation: false
      },
      title: {
        text: 'Comportamiento de USD, EUR y GBP en MXN - Marzo 2025 (Animación por Día)',
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
        headerFormat: '<b>{point.x:%e %b}</b><br>',
        pointFormat: '{series.name}: {point.y:.3f}'
      },
      legend: { enabled: true, itemStyle: { color: '#ffffff' } },
      plotOptions: {
        spline: {
          lineWidth: 2,
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
        },
        {
          name: 'GBP/MXN',
          data: [],
          color: '#ff6600'
        }
      ],
      credits: { enabled: false }
    });
  }

  // Función para iniciar la animación agregando puntos uno a uno en cada serie
  function startAnimation() {
    if (intervalId) clearInterval(intervalId);
    // Reiniciar datos de las series
    chart.series[0].setData([]);
    chart.series[1].setData([]);
    chart.series[2].setData([]);
    let i = 0;
    intervalId = setInterval(() => {
      if (i < processedDataUsd.length) {
        chart.series[0].addPoint(processedDataUsd[i], false, false, {
          duration: 400,
          easing: 'linear'
        });
        chart.series[1].addPoint(processedDataEur[i], false, false, {
          duration: 400,
          easing: 'linear'
        });
        chart.series[2].addPoint(processedDataGbp[i], true, false, {
          duration: 400,
          easing: 'linear'
        });
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 500);
  }

  // Crear el gráfico al cargar el DOM
  chart = createChart();

  // Asignar el evento al botón para iniciar la animación
  const button = document.getElementById('play-btn');
  button.addEventListener('click', startAnimation);
});
