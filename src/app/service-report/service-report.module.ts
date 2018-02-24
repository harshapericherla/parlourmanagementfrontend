import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceReportComponent } from './service-report-component/service-report.component';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceReportService } from '../services/service-report.service';
import { ClientService } from '../services/client.service';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule,MatFormFieldModule,
        MatInputModule,MatButtonModule,
        MatPaginatorModule,MatSortModule, 
        MatProgressSpinnerModule,MatCardModule,
        MatChipsModule,MatAutocompleteModule,
        MatDatepickerModule,MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DialogreportComponent } from './dialogreport/dialogreport.component';
import {MatTableModule} from '@angular/material/table';
import {HttpClientModule} from '@angular/common/http';
import { DialogdeleteComponent } from './dialogdelete/dialogdelete.component';
import { CamelCasePipe } from './Pipes/camelCase';
import { ServicesService } from '../services/services.service';
import { StaffService } from '../services/staff.service';
import { DiscountPipe } from './Pipes/discount';
import { ServiceReportDatabase } from './service-report-component/serviceReportDataBase';

const components: any[] =  [
  ServiceReportComponent,
  DialogreportComponent,
  DialogdeleteComponent,
  CamelCasePipe,
  DiscountPipe
]
const exportArr: any[] = [
  ServiceReportComponent,
  DialogreportComponent,
  DialogdeleteComponent,
  CamelCasePipe,
  DiscountPipe
]
@NgModule({

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: components,
  providers : [
    ServiceReportService,
    ClientService,
    {provide: 'API_URL',useValue:'http://192.168.0.11:8001/parlourmanagementbackend/'},
    {provide:'paginatorSize',useValue:'7'},
    ServicesService,
    StaffService,
    CamelCasePipe,
    DiscountPipe,
    ServiceReportDatabase
  ],
  entryComponents:[DialogreportComponent,DialogdeleteComponent],
  exports: exportArr
  
})
export class ServiceReportModule { }
