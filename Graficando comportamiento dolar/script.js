document.addEventListener('DOMContentLoaded', function () {
    const data = [
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

    const processedData = data.map(point => [new Date(point[0]).getTime(), point[1]]);

    Highcharts.chart('container', {
        chart: {
            type: 'line',
            animation: Highcharts.svg,
            zoomType: 'x'
        },
        title: {
            text: 'Comportamiento del USD/MXN - Marzo 2025'
        },
        subtitle: {
            text: 'Fuente: exchange-rates.org'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Fecha'
            }
        },
        yAxis: {
            title: {
                text: 'Tipo de Cambio (MXN por USD)'
            }
        },
        tooltip: {
            headerFormat: '<b>{point.x:%e %b %Y}</b><br>',
            pointFormat: 'Tipo de cambio: {point.y:.3f} MXN/USD'
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'USD a MXN',
            data: processedData
        }]
    });
});

