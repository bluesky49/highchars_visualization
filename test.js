Highcharts.setOptions({
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(240, 240, 255)']
        ]
      },
      borderWidth: 2,
      plotBackgroundColor: 'rgba(255, 255, 255, .9)',
      plotShadow: true,
      plotBorderWidth: 1
    }
  });


  function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        reader.onload = function (e) {
          data = e.target.result.split('\n')
          var province = []
          var country = []
          var update = []
          var update_date = []
          var confirmed = []
          var confirmed_date = []
          var suspected = []
          var suspected_date = []
          var recoverd = []
          var recoverd_date = []
          var death = []
          var death_date = []
          for (i in data) {
            if (data[i].includes('"')){
                data[i] = data[i].split('"')
                data[i].shift()
                lt = data[i].pop().split(',')
                lt.shift()
                for (index in lt){
                    data[i].push(lt[index])
                }
            }
            else data[i] = data[i].split(',')
            if (i == 0) continue
            province.push(data[i].shift())
            country.push(data[i].shift())
            update.push(new Date(data[i].shift()))
            confirmed.push(Number(data[i].shift()))
            suspected.push(Number(data[i].shift()))
            recoverd.push(Number(data[i].shift()))
            death.push(Number(data[i].shift()))
            if (i==70)debugger
            if ( i == 1) {
              confirmed_date['c'+String(update[i-1].getDate())] = confirmed[i-1]
              recoverd_date['r'+String(update[i-1].getDate())] = recoverd[i-1]
              suspected_date['s'+String(update[i-1].getDate())] = suspected[i-1]
              death_date['d'+String(update[i-1].getDate())] = death[i-1]
              update_date.push(update[i-1])
              continue
            }
            if (update[i-1].getDate() == update[i-2].getDate()){
              confirmed_date['c'+String(update[i-1].getDate())] += confirmed[i-1]
              recoverd_date['r'+String(update[i-1].getDate())] += recoverd[i-1]
              suspected_date['s'+String(update[i-1].getDate())] += suspected[i-1]
              death_date['d'+String(update[i-1].getDate())] += death[i-1]
            }
            else {
                confirmed_date['c'+String(update[i-1].getDate())] = confirmed[i-1]
                recoverd_date['r'+String(update[i-1].getDate())] = recoverd[i-1]
                suspected_date['s'+String(update[i-1].getDate())] = suspected[i-1]
                death_date['d'+String(update[i-1].getDate())] = death[i-1]
                if (update[i-1].getDate()){
                    update_date.push(update[i-1])
                }
                
            }
          }

          console.log(confirmed_date)
          console.log(recoverd_date)
          console.log(death_date)
          console.log(suspected_date)
          var chart = Highcharts.stockChart('container', {
            chart: {
              events: {
                load: function () {

                  // set up the updating of the chart each second
                  var series = this.series[0];
                  var timer = 0;
                  var interval = setInterval(chart, 500);

                  function chart() {
                    if (timer == update_date.length) {
                      clearInterval(interval);
                    } else {
                      var x = update_date[timer].getTime();
                      // var x = (new Date()).getTime(), // current time
                      var  y = confirmed_date[timer];
                      series.addPoint([x, y], true, true);
                      timer++;
                    }
                  }
                }
              }
            },

            time: {
              useUTC: false
            },

            rangeSelector: {
              buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
              }, {
                count: 5,
                type: 'minute',
                text: '5M'
              }, {
                type: 'all',
                text: 'All'
              }],
              inputEnabled: false,
              selected: 0
            },

            title: {
              text: 'Global Confirmed'
            },

            exporting: {
              enabled: false
            },
            xAxis: {
                title: {
                    text: 'Date'
                },
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    formatter:function(){
                        return this.axis.defaultLabelFormatter.call(this);
                    }
                },
                tickPixelInterval: 300,
                categories: confirmed,
                gridLineWidth:1,
            },
            yAxis: {
                title: {
                    text: 'Amount'
                },
                tickInterval: 10,
                
            },
            series: [{
              name: 'Random data',
              data: (function () {
                // generate an array of random data
                var data = [],
                  time = (new Date()).getTime(),
                  i = 0;

                for (i = -10; i <= 0; i += 1) {
                    var pday = new Date(update_date[0]);
                    //console.log(update_date[0].getDate());
                    pday.setDate(pday.getDate() + i - 1);
                    pday.setHours(0,0,0);
                  data.push([
                    // time + i * 1000,
                    pday.getTime(),
                    Math.round(Math.random() * 100)
                  ]);
                }
                return data;
              }())
            }]
          });
        }

        reader.readAsText(fileUpload.files[0]);
      } else {
        alert("This browser does not support HTML5.");
      }
    } else {
      alert("Please upload a valid CSV file.");
    }
  }
  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container'
    },
    xAxis: {
      type: 'date'
    },
    series: [{
      data: [],
    }]
  });
