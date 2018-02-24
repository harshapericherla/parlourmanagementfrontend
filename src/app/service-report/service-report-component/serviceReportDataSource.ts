import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { ServiceReportDatabase } from "./serviceReportDataBase";

export class ServiceReportDataSource extends DataSource<any>{

    constructor(private _serviceReportDatabase: ServiceReportDatabase){
        super();
    }

    connect(): Observable<any[]> {
        return this._serviceReportDatabase.dataChange;
    }
    disconnect(): void {
        
    }

}