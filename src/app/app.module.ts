
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceReportModule } from './service-report/service-report.module';
import { HttpModule } from '@angular/http';
import { Constants } from './constants';
import {SuiModule} from 'ng2-semantic-ui';
import {Routes,RouterModule} from '@angular/router';
import { ServiceReportComponent } from './service-report/service-report-component/service-report.component';
import {MatMenuModule,MatToolbarModule, 
        MatButtonModule,MatTabsModule,
        MatFormFieldModule,MatInputModule,
        MatRadioModule,
        MatAutocompleteModule} from '@angular/material';
import { ServicesComponent } from './services-component/services-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { HandleError } from './common/ErrorHandling/HandleError';
import { ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './common/ErrorHandling/AppErrorHandler';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoggerService } from './common/ErrorHandling/LoggerService';

const routes: Routes =[
  { path: 'servicereport', component: ServiceReportComponent },
  { path: 'services', component: ServicesComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent
  ],
  imports: [
    ServiceReportModule,
    SuiModule,
    RouterModule.forRoot(routes),
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  providers: [Constants,HandleError,{provide:ErrorHandler,useClass:AppErrorHandler},LoggerService],
  exports:[HttpModule],
  bootstrap: [AppComponent]
})

export class AppModule {

}
