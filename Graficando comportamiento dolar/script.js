<script>
document.addEventListener('DOMContentLoaded', function () {

  // Configurar Highcharts para usar punto como separador decimal globalmente
  Highcharts.setOptions({
    lang: {
      decimalPoint: '.',
      thousandsSep: ''
    }
  });

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

  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);

  let chart;
  let intervalId;

  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'line',
        backgroundColor: '#000',
        animation: false
      },
      title: {
        text: 'Sismógrafo del Dólar - Marzo 2025',
        style: { color: '#00ff00', fontSize: '18px' }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#fff' } },
        lineColor: '#444',
        tickColor: '#444'
      },
      yAxis: {
        title: { text: 'Tipo de Cambio', style: { color: '#fff' } },
        labels: {
          style: { color: '#fff' },
          formatter: function () {
            return this.value.toFixed(3); // Asegura punto decimal
          }
        },
        gridLineColor: '#444'
      },
      tooltip: {
        backgroundColor: '#333',
        style: { color: '#fff' },
        headerFormat: '<b>{point.x:%e %b %Y}</b><br>',
        pointFormat: 'USD/MXN: {point.y:.3f}' // Usa punto decimal
      },
      plotOptions: {
        line: {
          lineWidth: 1,
          marker: { enabled: false },
          enableMouseTracking: true
        },
        series: {
          animation: { duration: 400, easing: 'easeOutBounce' }
        }
      },
      series: [{
        name: 'USD/MXN',
        data: [],
        color: '#00ff00'
      }],
      credits: { enabled: false }
    });
  }

  function startAnimation() {
    if (intervalId) clearInterval(intervalId);
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

  chart = createChart();

  document.getElementById('play-btn').addEventListener('click', startAnimation);
});
</script>
