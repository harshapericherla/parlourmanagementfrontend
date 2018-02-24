import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ServiceReport } from "../../models/servicereport.model";
import { ServiceReportService } from "../../services/service-report.service";
import { ViewChild, Injectable } from "@angular/core";
import { MatSort, MatPaginator } from "@angular/material";
import {merge} from 'rxjs/observable/merge';
import {startWith} from 'rxjs/operators/startWith';
import {switchMap} from 'rxjs/operators/switchMap';
import {catchError} from 'rxjs/operators/catchError';
import {map} from 'rxjs/operators/map';
import { EventEmitter } from '@angular/core';;

@Injectable()
export class ServiceReportDatabase{
 
    public matSort: MatSort;
    selectedServiceReport: ServiceReport;
    public matPaginator: MatPaginator;
    dataChange : BehaviorSubject<ServiceReport[]> = new BehaviorSubject<ServiceReport[]>([]);
    
    setSelectedServiceReport(selected: ServiceReport){
        this.selectedServiceReport = selected;
    }

    get data() :ServiceReport[]{
        return this.dataChange.value;
    }

    constructor(public service: ServiceReportService){
    }


    getData(matSort: MatSort,matPaginator: MatPaginator,
        emitObject: EventEmitter<Object>,pageSize: number){
    
    this.matSort = matSort;
    this.matPaginator = matPaginator;

    this.matSort.sortChange.subscribe(() => this.matPaginator.pageIndex = 0);
    let obj = new Object();

    merge(this.matSort.sortChange, this.matPaginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
          
          if(this.selectedServiceReport){
            obj['selectedRecord'] = this.selectedServiceReport;
            obj['firstRecord'] = null;
          }
          obj['isLoadingResults'] = true;
          emitObject.emit(obj);
          let page = matPaginator.pageIndex;
          let size = Number(pageSize);
          let endLength = page * size + size;
          let startLength = endLength - size + 1;
          let sortField = matSort.active;
          let sortDirection = matSort.direction;
          return this.service.getServiceReports(sortField,sortDirection,startLength,endLength);
      }),
      map(data => {
          return data;
      })).subscribe(data => {
          obj['isLoadingResults'] = false;
          if(this.selectedServiceReport){
              let json =  data;
              let selectedId = this.selectedServiceReport.serviceReportId;
              
              for(let element of json){
                if(element.serviceReportId == selectedId){
                       this.selectedServiceReport = element;
                       break;
                }
              }
              obj['selectedRecord'] = this.selectedServiceReport;
              obj['firstRecord'] = null;
          }else{
            obj['firstRecord'] = data[0];
            obj['selectedRecord'] = null;
            this.selectedServiceReport = data[0];
          }
          this.dataChange.next(data);
          emitObject.emit(obj);
      }); 
   }
    addData(bean: ServiceReport): void{
        this.service.addServiceReport(bean).
            subscribe((json: any) => {
                this.matSort.sortChange.emit();
            });
    }
    
    editData(bean: ServiceReport): void{
        this.service.editServiceReport(bean).
             subscribe((json: any) => {
                this.matSort.sortChange.emit();
             });
    }

    deleteBean(bean: ServiceReport): void{
        this.service.deleteServiceReport(bean).
            subscribe( (json: any) => {
                this.selectedServiceReport = null;
                this.matSort.sortChange.emit();
            })
    }
}