import { Injectable,Inject } from '@angular/core';
import { Http ,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from '../constants';
import { Observable } from 'rxjs/Observable';
import { ServiceReport } from '../models/servicereport.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ServiceReportService {

  constructor(private http: Http,@Inject('API_URL') private url: string,private httpClient: HttpClient) { }

    
  headers = new Headers({
    'Content-Type': 'application/json'
  });

  getServiceReports(sortField,sortDirection,startLength,endLength): Observable<any>{

     let paramStr = "?sortField="+sortField+
                    "&sortDirection="+sortDirection+
                    "&startLength="+startLength+
                    "&endLength="+endLength;

     return this.http.get(this.url+"servicereports/getAll"+paramStr)
     .map( (response) => response.json());
  }

  addServiceReport(serviceReport){
     return this.http.post(this.url+"servicereports/addServiceReport",JSON.stringify(serviceReport),{headers : this.headers})
                      .map((response) => response.json());
  }

  editServiceReport(serviceReport){
    return this.http.post(this.url+"servicereports/editServiceReport",JSON.stringify(serviceReport),{headers : this.headers})
    .map((response) => response.json());
  }

  deleteServiceReport(serviceReport){
     return this.http.post(this.url+"servicereports/deleteServiceReport",JSON.stringify(serviceReport),{headers : this.headers})
                     .map( (response) => response.json());
  }
}
