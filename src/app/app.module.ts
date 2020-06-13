import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppComponent } from './app.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

// };
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    HighchartsChartModule,
    AngularDateTimePickerModule
    // MqttModule,
    // MqttServiceConfig,
    // NgxMqttClientModule.withOptions({
    //   // manageConnectionManually: true, //this flag will prevent the service to connection automatically
    //   host: 'localhost',
    //   protocol: 'mqtt',
    //   port: 1234,
    //   // path: '/mqtt'
    // })
  ],
  providers: [
    //   { provide: MqttServiceConfig, useValue: {} },
    // // MqttService,
    // { provide: MqttClientService, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
