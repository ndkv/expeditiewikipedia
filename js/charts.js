// module.exports = function (measurements, map) {
    function loadChart(measurements, mao) {

         var values = measurements.getValues(),
             dates = measurements.getDates(),
             geometries = measurements.getGeometries(),
             data = [],
             year, time, date;

        var iconProperties = {
        //iconUrl: 'http://static.ndkv.nl/vm/images/measure_white.png',
        iconUrl: 'resources/images/icons/measurements.png',
        iconSize: [20, 20],
        opacity: 0.1
        };
        var tempMarker;



        $.each(values, function(index, value) {
            if (dates[index].length > 10) {
                year = dates[index].split(' ')[0].split('-');
                time = dates[index].split(' ')[1].split(':');

                // var date = dates[index].split('-');
                //Substract 1 from month as UTC months start at 0
                date = Date.UTC(year[0], year[1]-1, year[2], time[0], time[1]);

            } else {
                year = dates[index].split('-');
                date = Date.UTC(year[0], year[1]-1, year[2]);
            }

            data.push([date, value]);
        });


        $('#chart').highcharts({
        title: {
            text: 'Gravity and depth measurements',
            //x: -20 //center
        },
        // subtitle: {
        //     text: 'Source: WorldClimate.com',
        //     x: -20
        // },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Free air anomaly [mgal]'
            }
            // plotLines: [{
            //     value: 0,
            //     width: 1,
            //     color: '#808080'
            // }]
        },
        tooltip: {
            enabled: true,
            valueSuffix: ' mgal'
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'middle',
        //     borderWidth: 0
        //},
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        mouseOver: function () {
                            var index = this.index;
                            var marker = geometries[index];
                            var latLng = marker.getLatLng();

                            //for some strange reason updating the iconSize of the existing marker fails
                            //hence we create a new one and remove it afterwards
                            tempMarker = L.marker([latLng.lat, latLng.lng], {icon: L.icon(iconProperties)});
                            tempMarker.addTo(map);
                        },
                        mouseOut: function () {
                            map.removeLayer(tempMarker);
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Free air anomaly',
            data: data
        }]

        // should become a list of date / value pairs

        //  {
        //     name: 'New York',
        //     data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        // }, {
        //     name: 'Berlin',
        //     data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        // }, {
        //     name: 'London',
        //     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        // }]
    });
}