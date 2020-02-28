function Upload2(){
    var baseMapPath = "https://code.highcharts.com/mapdata/",
    showDataLabels = false, 
    mapCount = 0,
    searchText,
    mapOptions = '';

    $.each(Highcharts.mapDataIndex, function (mapGroup, maps) {
        if (mapGroup !== "version") {
            mapOptions += '<option class="option-header">' + mapGroup + '</option>';
            $.each(maps, function (desc, path) {
                mapOptions += '<option value="' + path + '">' + desc + '</option>';
                mapCount += 1;
            });
        }
    });
    searchText = 'Search ' + mapCount + ' maps';
    mapOptions = '<option value="custom/world.js">' + searchText + '</option>' + mapOptions;
    $("#mapDropdown").append(mapOptions).combobox();
    $("#mapDropdown").change(function () {
        var $selectedItem = $("option:selected", this),
            mapDesc = $selectedItem.text(),
            mapKey = this.value.slice(0, -3),
            svgPath = baseMapPath + mapKey + '.svg',
            geojsonPath = baseMapPath + mapKey + '.geo.json',
            javascriptPath = baseMapPath + this.value,
            isHeader = $selectedItem.hasClass('option-header');
        if (mapDesc === searchText || isHeader) {
            $('.custom-combobox-input').removeClass('valid');
            location.hash = '';
        } else {
            $('.custom-combobox-input').addClass('valid');
            location.hash = mapKey;
        }

        if (isHeader) {
            return false;
        }
        if (Highcharts.charts[0]) {
            Highcharts.charts[0].showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
        }

        function mapReady() {

            var mapGeoJSON = Highcharts.maps[mapKey],
                data = [],
                parent,
                match;

            $("#download").html(
                '<a class="button" target="_blank" href="https://jsfiddle.net/gh/get/jquery/1.11.0/' +
                    'highcharts/highcharts/tree/master/samples/mapdata/' + mapKey + '">' +
                    'View clean demo</a>' +
                    '<div class="or-view-as">... or view as ' +
                    '<a target="_blank" href="' + svgPath + '">SVG</a>, ' +
                    '<a target="_blank" href="' + geojsonPath + '">GeoJSON</a>, ' +
                    '<a target="_blank" href="' + javascriptPath + '">JavaScript</a>.</div>'
            );
            $.each(mapGeoJSON.features, function (index, feature) {
                data.push({
                    key: feature.properties['hc-key'],
                    value: index
                });
            });

            if (mapDesc !== searchText) {
                $('.selector .prev-next').show();
                $('#sideBox').show();
            }

            match = mapKey.match(/^(countries\/[a-z]{2}\/[a-z]{2})-[a-z0-9]+-all$/);
            if (/^countries\/[a-z]{2}\/[a-z]{2}-all$/.test(mapKey)) { 
                parent = {
                    desc: 'World',
                    key: 'custom/world'
                };
            } else if (match) { 
                parent = {
                    desc: $('option[value="' + match[1] + '-all.js"]').text(),
                    key: match[1] + '-all'
                };
            }
            $('#up').html('');
            if (parent) {
                $('#up').append(
                    $('<a><i class="fa fa-angle-up"></i> ' + parent.desc + '</a>')
                        .attr({
                            title: parent.key
                        })
                        .click(function () {
                            $('#mapDropdown').val(parent.key + '.js').change();
                        })
                );
            }

            $("#container").highcharts('Map', {

                title: {
                    text: null
                },

                mapNavigation: {
                    enabled: true
                },

                colorAxis: {
                    min: 0,
                    stops: [
                        [0, '#EFEFFF'],
                        [0.5, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
                    ]
                },

                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'bottom'
                },

                series: [{
                    data: data,
                    mapData: mapGeoJSON,
                    joinBy: ['hc-key', 'key'],
                    name: 'Random data',
                    states: {
                        hover: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    dataLabels: {
                        enabled: showDataLabels,
                        formatter: function () {
                            return mapKey === 'custom/world' || mapKey === 'countries/us/us-all' ?
                                (this.point.properties && this.point.properties['hc-a2']) :
                                this.point.name;
                        }
                    },
                    point: {
                        events: {
                            click: function () {
                                var key = this.key;
                                $('#mapDropdown option').each(function () {
                                    if (this.value === 'countries/' + key.substr(0, 2) + '/' + key + '-all.js') {
                                        $('#mapDropdown').val(this.value).change();
                                    }
                                });
                            }
                        }
                    }
                }, {
                    type: 'mapline',
                    name: "Separators",
                    data: Highcharts.geojson(mapGeoJSON, 'mapline'),
                    nullColor: 'gray',
                    showInLegend: false,
                    enableMouseTracking: false
                }]
            });

            showDataLabels = $("#chkDataLabels").prop('checked');

        }

        if (Highcharts.maps[mapKey]) {
            mapReady();
        } else {
            $.getScript(javascriptPath, mapReady);
        }
    });

    $("#chkDataLabels").change(function () {
        showDataLabels = $("#chkDataLabels").prop('checked');
        $("#mapDropdown").change();
    });

    $("#btn-prev-map").click(function () {
        $("#mapDropdown option:selected").prev("option").prop("selected", true).change();
    });

    $("#btn-next-map").click(function () {
        $("#mapDropdown option:selected").next("option").prop("selected", true).change();
    });

    if (location.hash) {
        $('#mapDropdown').val(location.hash.substr(1) + '.js');
    } else { 
        $($('#mapDropdown option')[0]).attr('selected', 'selected');
    }
    $('#mapDropdown').change();
}