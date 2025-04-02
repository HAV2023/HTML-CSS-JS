document.addEventListener('DOMContentLoaded', function () {
    // Datos de tipo de cambio por día
    const rawData = [
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

    const processedData = rawData.map(([date, value]) => [new Date(date).getTime(), value]);

    // Crear gráfico vacío
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'spline',
            backgroundColor: '#1e1e1e',
            animation: false // desactivar animación general
        },
        title: {
            text: 'USD/MXN - Marzo 2025 (Animación por Día)',
            style: { color: '#ffffff' }
        },
        xAxis: {
            type: 'datetime',
            labels: { style: { color: '#cccccc' } },
            lineColor: '#444',
            tickColor: '#444'
        },
        yAxis: {
            title: { text: null },
            labels: { style: { color: '#cccccc' } },
            gridLineColor: '#333'
        },
        tooltip: {
            backgroundColor: '#333',
            style: { color: '#fff' },
            headerFormat: '<b>{point.x:%e %b}</b><br>',
            pointFormat: '{point.y:.3f} MXN/USD'
        },
        legend: { enabled: false },
        plotOptions: {
            spline: {
                lineWidth: 2,
                marker: { enabled: false },
                enableMouseTracking: true
            },
            series: {
                animation: {
                    duration: 300
                }
            }
        },
        series: [{
            name: 'USD/MXN',
            data: [],
            color: '#00e6e6'
        }],
        credits: { enabled: false }
    });

    // Agregar puntos uno a uno
    let index = 0;
    const interval = setInterval(() => {
        if (index < processedData.length) {
            chart.series[0].addPoint(processedData[index], true, false);
            index++;
        } else {
            clearInterval(interval); // Termina cuando ya no hay más puntos
        }
    }, 500); // tiempo entre cada punto (en ms)
});
