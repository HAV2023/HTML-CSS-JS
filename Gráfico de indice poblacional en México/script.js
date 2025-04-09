// =======================
// Datos de población de México desde 2000 hasta 2025
// =======================

// Años de referencia (etiquetas del eje X)
const years = [2000, 2005, 2010, 2015, 2020, 2025];

// Población correspondiente a cada año (en número de habitantes)
// Nota: el valor de 2025 es una estimación
const population = [97483412, 106682500, 112336538, 119938473, 126014024, 128500000];

// =======================
// Inicialización del gráfico con Chart.js
// =======================

// Se obtiene el contexto del canvas donde se dibujará el gráfico
const ctx = document.getElementById('populationChart').getContext('2d');

// Creación de un nuevo gráfico de línea usando Chart.js
const populationChart = new Chart(ctx, {
    type: 'line', // Tipo de gráfico: línea
    data: {
        labels: years, // Etiquetas del eje X
        datasets: [{
            label: 'Población de México', // Título de la serie de datos
            data: population, // Valores del eje Y
            borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
            borderWidth: 2, // Grosor de la línea
            fill: false // No se rellena el área bajo la línea
        }]
    },
    options: {
        responsive: true, // Hace que el gráfico se adapte al tamaño de la pantalla
        plugins: {
            title: {
                display: true, // Muestra el título del gráfico
                text: 'Crecimiento Poblacional de México (2000-2025)' // Texto del título
            }
        },
        scales: {
            x: {
                title: {
                    display: true, // Muestra el título del eje X
                    text: 'Año' // Texto del título del eje X
                }
            },
            y: {
                title: {
                    display: true, // Muestra el título del eje Y
                    text: 'Población' // Texto del título del eje Y
                },
                beginAtZero: false // El eje Y no comienza en cero (para mejor visualización de tendencias)
            }
        }
    }
});
