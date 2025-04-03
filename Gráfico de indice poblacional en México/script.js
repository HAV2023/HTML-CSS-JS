// Datos de población de México desde 2000 hasta 2025
const years = [2000, 2005, 2010, 2015, 2020, 2025];
const population = [97483412, 106682500, 112336538, 119938473, 126014024, 128500000]; // Datos estimados para 2025

const ctx = document.getElementById('populationChart').getContext('2d');
const populationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: years,
        datasets: [{
            label: 'Población de México',
            data: population,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Crecimiento Poblacional de México (2000-2025)'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Año'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Población'
                },
                beginAtZero: false
            }
        }
    }
});

