import {Component, ViewChild,EventEmitter, Input,Inject} from '@angular/core';
import { ServiceReportService } from '../../services/service-report.service';
import { ClientService } from '../../services/client.service';
import { ServiceReport } from '../../models/servicereport.model';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DialogreportComponent } from '../dialogreport/dialogreport.component';
import { Service } from '../../models/service.model';
import { Client } from '../../models/client.model';
import { Staff } from '../../models/staff.model';
import { OnInit } from '@angular/core';
import {  ServiceReportDataSource } from './serviceReportDataSource';
import { ServiceReportDatabase } from './serviceReportDataBase';
import { DialogdeleteComponent } from '../dialogdelete/dialogdelete.component';


@Component({
  selector: 'service-report',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.css']
})
export class ServiceReportComponent implements OnInit{
  
  
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    selectedServiceReport: ServiceReport
    selectedRowIndex: number = -1;
    resultsLength: number;
    dataSource: ServiceReportDataSource | null;
    displayedColumns: string[];
    serviceBean: Service;
    clientBean: Client;
    staffBean: Staff;
    serviceReportBean: ServiceReport;
    emitObject: EventEmitter<Object>;
    isLoadingResults: boolean;

ngOnInit() {
    // Intilalizing the dataSource by passing serviceReportDatabase provider
    this.dataSource = new ServiceReportDataSource(this.servieReportDatabase); 
    // Creating eventEmitter object
    this.emitObject = new EventEmitter();
}
ngAfterViewInit(){
    this.servieReportDatabase.getData(this.sort,this.paginator,this.emitObject,
      this.pageSize);
    this.emitObject.subscribe((obj: Object) => {
          
          let serviceReportBean;
         
          if(obj['selectedRecord']){
            serviceReportBean = obj['selectedRecord'];
          }else{
            serviceReportBean = obj['firstRecord'];
          }
        
          if(serviceReportBean){
            let totalRecords = serviceReportBean.totalRecords;
            let recordId = serviceReportBean.serviceReportId;

            if(totalRecords){
                 this.resultsLength = totalRecords;
            }
            this.selectedRowIndex = recordId;
            this.selectedServiceReport = serviceReportBean;
         
          }
          let isLoadingResults = obj['isLoadingResults'];
          this.isLoadingResults = isLoadingResults;
    });
    
}
  constructor(public dialog: MatDialog,public service: ServiceReportService,
              @Inject('paginatorSize')public pageSize: number,
              public servieReportDatabase: ServiceReportDatabase){

      this.displayedColumns = ["Client","Service","Staff","Cost"];
      this.isLoadingResults = true;
  }
 
  openDialog(type: string): void{
      
     let ob: Object;
     if(type == 'add'){
         ob = this.getEmptyServiceBean();
     }else{
         ob = this.selectedServiceReport
     }
     ob['type'] = type;
     this.isLoadingResults = true;
      let dialogRef = this.dialog.open(DialogreportComponent,{
        width: '350px',
        data: ob
      });

      dialogRef.afterClosed().subscribe( (value) => {

          if(value){

             let serviceReportBean: ServiceReport = this.populateFormDetails(value);
             if(type == 'add'){
                this.submitData(serviceReportBean);
             }else{
                serviceReportBean.serviceReportId = this.selectedServiceReport.serviceReportId;
                serviceReportBean.clientBean.clientId = value.clientId;
                serviceReportBean.serviceBean.serviceId = value.serviceId;
                serviceReportBean.staffBean.staffId = value.staffId;
                serviceReportBean.serviceBean.serviceCost = value.serviceCost;
                serviceReportBean.serviceReportDate = value.serviceReportDate;
                this.editData(serviceReportBean);
             }
          }
          else{
            this.isLoadingResults = false;
          }
      });
  }

  openDeleteDialog(): void{
       
    this.isLoadingResults = true;
    let dialogRef = this.dialog.open(DialogdeleteComponent,{
        width: '350px'
    });
    dialogRef.afterClosed().subscribe( (value) => {

        if(value){
           this.servieReportDatabase.deleteBean(this.selectedServiceReport);
        }
        else{
          this.isLoadingResults = false;
        }
    });
  }
  
  getEmptyServiceBean(): ServiceReport{
    let clientBean = new Client(0,'','','','');
    let serviceBean = new Service(0,'','');
    let staffBean = new Staff(0,'','');
    let serviceReportBean = new ServiceReport(
      0,clientBean,serviceBean,staffBean,'0',null
    );
    return serviceReportBean;
  }
  populateFormDetails(value: any): ServiceReport{
   
       let clientBean = new Client(0,'','',value.client,value.phoneNumber);
       let serviceBean = new Service(0,value.service,value.serviceCost);
       let staffBean = new Staff(0,value.staff,'');
       let serviceReportBean = new ServiceReport(
         0,clientBean,serviceBean,staffBean,value.serviceDiscount,value.serviceReportDate
       );
       return serviceReportBean;
  }
  submitData(bean: ServiceReport){
    this.servieReportDatabase.addData(bean);
  }

  editData(bean: ServiceReport){
    this.servieReportDatabase.editData(bean);
  }
  
  // Whenever a row gets clicked this is called
  rowSelected(row: ServiceReport){
       
       // setting the row index
       this.selectedRowIndex = row.serviceReportId;
       // setting the selectedServiceReportBean
       this.selectedServiceReport = row;
       // setting the selectedServiceReportBean for the serviceDatabase component
       this.servieReportDatabase.setSelectedServiceReport(row);
  }
}