// Espera a que todo el contenido del DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {

  // Configura Highcharts para usar punto como separador decimal y sin separación de miles
  Highcharts.setOptions({
    lang: {
      decimalPoint: '.',
      thousandsSep: ''
    }
  });

  // Datos en crudo: cada sub-arreglo contiene una fecha y el valor del tipo de cambio USD/MXN
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

  // Procesa los datos para que las fechas se conviertan a formato timestamp (milisegundos)
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);

  // Declaración de variables globales para el gráfico y el identificador del intervalo de animación
  let chart;
  let intervalId;

  // Función que crea y configura el gráfico de Highcharts
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'line',            // Tipo de gráfico: línea
        backgroundColor: '#000', // Fondo negro para efecto sismógrafo
        animation: false         // Desactiva la animación global del gráfico
      },
      title: {
        text: 'Dólar Norteamericano vs Peso mexicano - Marzo 2025', // Título del gráfico
        style: { color: '#00ff00', fontSize: '18px' }               // Estilo del título: neón verde y tamaño 18px
      },
      xAxis: {
        type: 'datetime',        // Eje X basado en fechas (tipo datetime)
        labels: { style: { color: '#fff' } }, // Etiquetas en blanco para visibilidad
        lineColor: '#444',       // Color de la línea del eje X (gris oscuro)
        tickColor: '#444'        // Color de las marcas (ticks) del eje X
      },
      yAxis: {
        title: { text: 'Tipo de Cambio', style: { color: '#fff' } }, // Título del eje Y y su estilo
        labels: {
          style: { color: '#fff' },  // Etiquetas en blanco
          // Formatea el valor para que muestre 3 decimales con punto decimal
          formatter: function () {
            return this.value.toFixed(3);
          }
        },
        gridLineColor: '#444'      // Color de las líneas de la cuadrícula en el eje Y
      },
      tooltip: {
        backgroundColor: '#333',   // Fondo oscuro para el tooltip
        style: { color: '#fff' },    // Texto en blanco para el tooltip
        // Formato de la cabecera del tooltip, muestra la fecha
        headerFormat: '<b>{point.x:%e %b %Y}</b><br>',
        // Formato del punto en el tooltip, con 3 decimales
        pointFormat: 'USD/MXN: {point.y:.3f}'
      },
      plotOptions: {
        line: {
          lineWidth: 1,           // Grosor de la línea
          marker: { enabled: false }, // Desactiva los marcadores en cada punto
          enableMouseTracking: true   // Permite la interacción del mouse
        },
        series: {
          // Configuración de la animación al agregar cada punto a la serie
          animation: { duration: 400, easing: 'easeOutBounce' }
        }
      },
      series: [{
        name: 'USD/MXN',   // Nombre de la serie
        data: [],          // La serie se inicia vacía, se irán agregando los puntos gradualmente
        color: '#00ff00'   // Color de la línea: neón verde
      }],
      credits: { enabled: false } // Deshabilita los créditos de Highcharts en la esquina inferior
    });
  }

  // Función que inicia la animación del gráfico agregando los puntos uno a uno
  function startAnimation() {
    // Si ya existe un intervalo activo, se limpia para evitar duplicados
    if (intervalId) clearInterval(intervalId);
    // Reinicia los datos de la serie del gráfico para empezar de cero
    chart.series[0].setData([]);
    let i = 0;
    // Configura un intervalo que agrega un punto cada 500 ms
    intervalId = setInterval(() => {
      if (i < processedDataUsd.length) {
        // Agrega el siguiente punto a la serie y lo anima
        chart.series[0].addPoint(processedDataUsd[i], true, false, {
          duration: 400,
          easing: 'easeOutBounce'
        });
        i++; // Incrementa el índice para el siguiente punto
      } else {
        // Una vez agregados todos los puntos, se limpia el intervalo para detener la animación
        clearInterval(intervalId);
      }
    }, 500);
  }

  // Crea el gráfico y lo asigna a la variable global "chart"
  chart = createChart();
  // Asocia el evento de clic del botón "play-btn" a la función startAnimation
  document.getElementById('play-btn').addEventListener('click', startAnimation);
});
