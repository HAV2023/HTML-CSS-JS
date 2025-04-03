// Esperar a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
  
  // Definir los datos diarios de USD/MXN para marzo 2025.
  // Cada sub-arreglo contiene: [fecha (en formato 'YYYY-MM-DD'), valor del tipo de cambio]
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

  // Convertir las fechas de los datos a formato timestamp (número de milisegundos)
  // Esto es requerido por Highcharts para manejar correctamente las fechas en el eje X
  const processedDataUsd = rawDataUsd.map(([date, value]) => [new Date(date).getTime(), value]);

  // Variables globales para almacenar el objeto del gráfico y el identificador del intervalo de animación
  let chart;
  let intervalId;

  // Función para crear y configurar el gráfico estilo "sismógrafo"
  function createChart() {
    return Highcharts.chart('container', {
      chart: {
        type: 'line',                // Tipo de gráfico: línea
        backgroundColor: '#000',       // Fondo negro para simular un sismógrafo
        animation: false               // Se desactiva la animación global, controlaremos la animación al agregar puntos
      },
      title: {
        text: 'Sismógrafo del Dólar - Marzo 2025', // Título del gráfico
        style: { color: '#00ff00', fontSize: '18px' } // Estilo: color neón verde y tamaño de fuente
      },
      xAxis: {
        type: 'datetime',            // Eje X basado en fechas
        labels: { style: { color: '#fff' } }, // Etiquetas en blanco para buena visibilidad en fondo negro
        lineColor: '#444',           // Color de la línea del eje X
        tickColor: '#444'            // Color de los ticks del eje X
      },
      yAxis: {
        title: { text: 'Tipo de Cambio', style: { color: '#fff' } }, // Título del eje Y
        labels: { style: { color: '#fff' } }, // Etiquetas en blanco
        gridLineColor: '#444'        // Color de las líneas de la cuadrícula
      },
      tooltip: {
        backgroundColor: '#333',     // Fondo del tooltip (caja de información)
        style: { color: '#fff' },      // Texto en blanco en el tooltip
        headerFormat: '<b>{point.x:%e %b %Y}</b><br>', // Formato de la fecha en el tooltip
        pointFormat: 'USD/MXN: {point.y:.3f}' // Formato del valor mostrado en el tooltip
      },
      plotOptions: {
        line: {
          lineWidth: 1,              // Grosor de la línea (efecto sismógrafo: línea fina)
          marker: { enabled: false }, // Se deshabilitan los marcadores para una apariencia continua
          enableMouseTracking: true   // Permite la interacción con el mouse
        },
        series: {
          animation: { duration: 400, easing: 'easeOutBounce' } // Configuración de animación para la serie
        }
      },
      series: [{
        name: 'USD/MXN',             // Nombre de la serie
        data: [],                    // La serie se inicializa vacía; los puntos se agregarán progresivamente
        color: '#00ff00'             // Color de la línea en neón verde
      }],
      credits: { enabled: false }    // Se deshabilitan los créditos de Highcharts
    });
  }

  // Función para iniciar la animación: agrega cada punto de los datos de forma progresiva
  function startAnimation() {
    // Si ya existe un intervalo de animación, se limpia para evitar duplicados
    if (intervalId) clearInterval(intervalId);
    
    // Reinicia la serie del gráfico para que comience vacía
    chart.series[0].setData([]);
    
    let i = 0; // Índice para recorrer los puntos de datos
    intervalId = setInterval(() => {
      // Si aún quedan puntos por agregar...
      if (i < processedDataUsd.length) {
        // Agrega el siguiente punto a la serie; se actualiza el gráfico automáticamente (true)
        // No se elimina el primer punto (false) y se especifica la configuración de animación personalizada
        chart.series[0].addPoint(processedDataUsd[i], true, false, {
          duration: 400,             // Duración de la animación de este punto en milisegundos
          easing: 'easeOutBounce'    // Efecto de animación: rebote al finalizar
        });
        i++; // Incrementar el índice para el siguiente punto
      } else {
        // Cuando se han agregado todos los puntos, se limpia el intervalo para detener la animación
        clearInterval(intervalId);
      }
    }, 500); // Intervalo de 500 ms entre la adición de cada punto
  }

  // Crear el gráfico y almacenarlo en la variable global "chart"
  chart = createChart();

  // Asignar el evento 'click' del botón con id 'play-btn' para iniciar la animación
  document.getElementById('play-btn').addEventListener('click', startAnimation);
});
