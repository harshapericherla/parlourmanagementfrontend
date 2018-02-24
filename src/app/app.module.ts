
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceReportModule } from './service-report/service-report.module';
import { HttpModule } from '@angular/http';
import { Constants } from './constants';
import {SuiModule} from 'ng2-semantic-ui';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ServiceReportModule,
    SuiModule
  ],
  providers: [Constants],
  exports:[HttpModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
