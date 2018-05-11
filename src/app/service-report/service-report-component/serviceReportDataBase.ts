import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ServiceReport } from "../../models/servicereport.model";
import { ServiceReportService } from "../../services/service-report.service";
import { ViewChild, Injectable } from "@angular/core";
import { MatSort, MatPaginator } from "@angular/material";
import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { EventEmitter } from '@angular/core';;

@Injectable()
export class ServiceReportDatabase {

    public matSort: MatSort;
    selectedServiceReport: ServiceReport;
    public matPaginator: MatPaginator;
    dataChange: BehaviorSubject<ServiceReport[]> = new BehaviorSubject<ServiceReport[]>([]);

    // Used to set the selected serviceReportBean from the 'service-report.component.ts'
    setSelectedServiceReport(selected: ServiceReport) {
        this.selectedServiceReport = selected;
    }

    get data(): ServiceReport[] {
        return this.dataChange.value;
    }

    constructor(public service: ServiceReportService) {
    }

    // Getting the data according to the 'sort' and 'pagination' functionality
    getData(matSort: MatSort, matPaginator: MatPaginator,
        emitObject: EventEmitter<Object>, pageSize: number) {

        this.matSort = matSort;
        this.matPaginator = matPaginator;
        //Resetting the pageIndex to 0 if sort is being clicked
        this.matSort.sortChange.subscribe(() => this.matPaginator.pageIndex = 0);
        //Creating a new object which will be emitted by the EventEmitter
        let obj = new Object();
        
        merge(this.matSort.sortChange, this.matPaginator.page)
            .pipe(
            startWith({}),
            switchMap(() => {
                
                if (this.selectedServiceReport) {
                    obj['selectedRecord'] = this.selectedServiceReport;
                    obj['firstRecord'] = null;
                }
                //setting this to true so that loader icon shows up
                obj['isLoadingResults'] = true;
                //emitting the object 
                emitObject.emit(obj);
                //getting the pageIndex,pageSize and calculating the endLength and startLength
                let page = matPaginator.pageIndex;
                let size = Number(pageSize);
                let endLength = page * size + size;
                let startLength = endLength - size + 1;
                //getting the sortDiretion and sortField
                let sortField = matSort.active;
                let sortDirection = matSort.direction;
                //calling the service to fetch the records from server side
                return this.service.getServiceReports(sortField, sortDirection, startLength, endLength);
            }),
            map(data => {
                return data;
            })).subscribe(data => {
                //setting the loadingResults to false after getting the data.
                obj['isLoadingResults'] = false;
                if (this.selectedServiceReport) {
                    let json = data;
                    let selectedId = this.selectedServiceReport.serviceReportId;

                    for (let element of json) {
                        if (element.serviceReportId == selectedId) {
                            this.selectedServiceReport = element;
                            break;
                        }
                    }
                    obj['selectedRecord'] = this.selectedServiceReport;
                    obj['firstRecord'] = null;
                } else {
                    obj['firstRecord'] = data[0];
                    obj['selectedRecord'] = null;
                    this.selectedServiceReport = data[0];
                }
                //Calls next on behaviour subject object which will add the data asynchronously
                this.dataChange.next(data);
                emitObject.emit(obj);
            });
    }
    //Used to add the servicereport object 
    addData(bean: ServiceReport): void {
        this.service.addServiceReport(bean).
            subscribe((json: any) => {
                //after adding used to emit an event thereby trigging the merge above
                this.matSort.sortChange.emit();
            });
    }
    //Used to edit the serviceReport Bean
    editData(bean: ServiceReport): void {
        this.service.editServiceReport(bean).
            subscribe((json: any) => {
                this.matSort.sortChange.emit();
            });
    }
    //Used to delete the serviceReport Bean
    deleteBean(bean: ServiceReport): void {
        this.service.deleteServiceReport(bean).
            subscribe((json: any) => {
                this.selectedServiceReport = null;
                this.matSort.sortChange.emit();
            })
    }
}