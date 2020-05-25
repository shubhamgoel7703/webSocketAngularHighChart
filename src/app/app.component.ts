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
  temperatureChartOptions;
  xAxisChartOptions;
  yAxisChartOptions;
  zAxisChartOptions;
  xAxisFFTChartOptions;
  yAxisFFTChartOptions
  zAxisFFTChartOptions
  chartCallback = function (chart) { } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngularFlag = false; // optional boolean, defaults to false


  topic = 'vibrationDataTopic'
  private url = 'http://localhost:2222'//'http://13.234.202.176:2222';
  private socket;
  numberOfSamples = 500;
  constructor() {
    this.socket = io(this.url);
  }

  // {"d":{"myName":"Node6LoWPAN","MAX_Temperature_Node_0":29.30,"Button_Counter_Node_0":0,
  //   "Temperature_Node_0":29.40,"Humidity_Node_0":68.40,"Acceleration_Z_Node_0":0.98}}

  ngOnInit() {

    this.initializeChartOptions();

    this.socket.on('sendData', (message) => {
      // this.chartOptions.series[0].data.push(message)
      console.log("message ", message);

      try {
        var jsonMessage = JSON.parse(message);
        if (jsonMessage && jsonMessage.d) {
          this.chartSeriesAdded(jsonMessage.d)
        }
        console.log(jsonMessage);
      }
      catch (ex) {
        console.error("exception ", ex);
      }
    });


    this.socket.on('sendFFTData', (message) => {
      // this.chartOptions.series[0].data.push(message)
      console.log("sendFFTData ", message);

      try {
        //  var jsonMessage = JSON.parse(message);
        if (message) {
          this.fftChartSeriesAdded(message)
        }
      }
      catch (ex) {
        console.error("exception ", ex);
      }
    });

    // let obj = {
    //   "d": {
    //     "myName": "Node6LoWPAN", "MAX_Temperature_Node_0": 29.30, "Button_Counter_Node_0": 0,
    //     "Temperature_Node_0": 29.40, "Humidity_Node_0": 68.40, "Acceleration_Z_Node_0": 0.98
    //   }
    // }
    // for (let i = 0; i < 20; i++) {
    //   obj.d.Temperature_Node_0 = i;
    //   this.chartSeriesAdded(obj.d);
    // }
  }


  fftChartSeriesAdded(incomingObject) {
    this.xAxisFFTChartOptions.series[0].data = [...this.xAxisFFTChartOptions.series[0].data, ...incomingObject.fft_X];
    this.yAxisFFTChartOptions.series[0].data = [...this.yAxisFFTChartOptions.series[0].data, ...incomingObject.fft_Y];
    this.zAxisFFTChartOptions.series[0].data = [...this.zAxisFFTChartOptions.series[0].data, ...incomingObject.fft_Z];

    // if (this.temperatureChartOptions.series[0].data.length > this.numberOfSamples) {
    //   this.temperatureChartOptions.series[0].data.shift(); // removes the first element from an array 
    // }

    this.arrayShiftingLogic(this.xAxisFFTChartOptions.series[0].data);
    this.arrayShiftingLogic(this.yAxisFFTChartOptions.series[0].data);
    this.arrayShiftingLogic(this.zAxisFFTChartOptions.series[0].data);

    this.updateFlag = true;
  }


  chartSeriesAdded(incomingObject) {
    incomingObject.Temperature_Node_0 || incomingObject.Temperature_Node_0 == 0 ? this.temperatureChartOptions.series[0].data.push(incomingObject.Temperature_Node_0) : console.error("incomingObject is ", incomingObject);
    incomingObject.Acceleration_X_Node_0 || incomingObject.Acceleration_X_Node_0 == 0 ? this.xAxisChartOptions.series[0].data.push(incomingObject.Acceleration_X_Node_0) : '';
    incomingObject.Acceleration_Y_Node_0 || incomingObject.Acceleration_Y_Node_0 == 0 ? this.yAxisChartOptions.series[0].data.push(incomingObject.Acceleration_Y_Node_0) : '';
    incomingObject.Acceleration_Z_Node_0 || incomingObject.Acceleration_Z_Node_0 == 0 ? this.zAxisChartOptions.series[0].data.push(incomingObject.Acceleration_Z_Node_0) : '';

    // if (this.temperatureChartOptions.series[0].data.length > this.numberOfSamples) {
    //   this.temperatureChartOptions.series[0].data.shift(); // removes the first element from an array 
    // }

    this.arrayShiftingLogic(this.temperatureChartOptions.series[0].data);
    this.arrayShiftingLogic(this.xAxisChartOptions.series[0].data);
    this.arrayShiftingLogic(this.yAxisChartOptions.series[0].data);
    this.arrayShiftingLogic(this.zAxisChartOptions.series[0].data);

    this.updateFlag = true;
  }

  arrayShiftingLogic(array) {
    if (array.length > this.numberOfSamples) {
      array.shift(); // removes the first element from an array 
    }
  }

  initializeChartOptions() {
    this.temperatureChartOptions = this.initializeSingleChartOption('Temperature Analysis', "Temperature Vs Time", "Temperature", "Time", '#FF0000');
    this.xAxisChartOptions = this.initializeSingleChartOption('X Axis Analysis', "Movement Vs Time", "Movement", "Time", '#AA0000');
    this.yAxisChartOptions = this.initializeSingleChartOption('Y Axis Analysis', "Movement Vs Time", "Movement", "Time", '#0000FF');
    this.zAxisChartOptions = this.initializeSingleChartOption('Z Axis Analysis', "Movement Vs Time", "Movement", "Time", '#00FF00');
    this.xAxisFFTChartOptions = this.initializeSingleChartOption('X Axis Vibration Analysis', "Amplitude Vs Frequency", "Amplitude", "Frequency", '#0F00F0');
    this.yAxisFFTChartOptions = this.initializeSingleChartOption('Y Axis Vibration Analysis', "Amplitude Vs Frequency", "Amplitude", "Frequency", '#0F00F0');
    this.zAxisFFTChartOptions = this.initializeSingleChartOption('Z Axis Vibration Analysis', "Amplitude Vs Frequency", "Amplitude", "Frequency", '#0F00F0');

    this.updateFlag = true;
  }



  initializeSingleChartOption(title, subtitle, yAxisText, xAxisText, color): {} {
    return {
      chart: {
        zoomType: 'x'
      },

      title: {
        text: title//'Vibration Analysis'
      },
      subtitle: {
        text: subtitle//'Amplitude vs Frequency chart'
      },

      series: [{
        color: color,
        data: [0, 0]
      }],

      xAxis: {
        tickInterval: 0.5,
        gridLineWidth: 1,
        title: {
          enabled: true,
          text: xAxisText,//'Frequency',
          style: {
            fontWeight: 'normal'
          },
        }
      },

      yAxis: {
        title: {
          enabled: true,
          text: yAxisText,//'Amplitute',
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
  }


}
