import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

// import { Observable } from 'rxjs/Observable';
// import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import * as io from 'socket.io-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mqttAngularSubs';

  highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartOptions = {
    chart: {
      zoomType: 'x'
    },

    title: {
      text: 'Vibration Analysis'
    },
    subtitle: {
      text: 'Amplitude vs Frequency chart'
    },

    series: [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],

    xAxis: {
      tickInterval: 0.5,
      gridLineWidth: 1,
      title: {
        enabled: true,
        text: 'Frequency',
        style: {
          fontWeight: 'normal'
        }
      }
    },

    yAxis: {
      title: {
        enabled: true,
        text: 'Amplitute',
        style: {
          fontWeight: 'normal'
        }
      }
    },

    annotations: [{
      labels: [{
        point: {
          x: 3,
          y: 129.2,
          xAxis: 0,
          yAxis: 0
        },
        text: 'x: {x}<br/>y: {y}'
      },
      {
        point: {
          x: 0,
          y: 0
        },
        text: 'x: {point.plotX} px<br/>y: {point.plotY} px'
      },
      {
        point: {
          x: 5,
          y: 100,
          xAxis: 0
        },
        text: 'x: {x}<br/>y: {point.plotY} px'
      }],
      labelOptions: {
        x: 40, y: -10
      }
    }]
  }; // required
  chartCallback = function (chart) { } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false; // optional boolean, defaults to false


  topic = 'LINTANGtest123'
  private url = 'http://localhost:2222';
  private socket;
  constructor() {
    this.socket = io(this.url);
  }


  ngOnInit() {
    // setInterval(() => {
    //   // this.highcharts
    //   console.log(this.updateFlag, this.chartOptions.series[0].data)
    //   this.chartOptions.series[0].data.push(100)
    //   this.updateFlag = true;
    //   console.log(this.updateFlag, this.chartOptions.series[0].data)
    // }, 3000);

    this.socket.on('sendData', (message) => {
      this.chartOptions.series[0].data.push(message)
      this.updateFlag = true;
      console.log(message);
    });
  }




}
