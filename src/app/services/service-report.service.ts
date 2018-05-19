import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from '../constants';
import { Observable } from 'rxjs/Observable';
import { ServiceReport } from '../models/servicereport.model';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HandleError } from '../common/ErrorHandling/HandleError';
import { RequestOptions } from '@angular/http';
import { Options } from 'selenium-webdriver';
@Injectable()
export class ServiceReportService {
  
  headers;
  options;
  constructor(private http: Http, @Inject('API_URL') private url: string, private httpClient: HttpClient,private errorHandler: HandleError) {

    this.headers = new Headers({
      'Content-Type': 'application/json'
    });

    this.options = new RequestOptions({ 'headers': this.headers });
   }
  
   //This method is used to request the server for serviceReports
  getServiceReports(sortField, sortDirection, startLength, endLength): Observable<any> {

    let paramStr = "?sortField=" + sortField +
      "&sortDirection=" + sortDirection +
      "&startLength=" + startLength +
      "&endLength=" + endLength;

    return this.http
      .get(this.url + "servicereports/getAll" + paramStr,this.options)
      .map((response) => response.json())
      .catch((error: Response) => {
          return this.errorHandler.handleError(error);
      });
  }

  //This method is used to add the serviceReport
  addServiceReport(serviceReport) {
    return this.http.post(this.url + "servicereports/addServiceReport", JSON.stringify(serviceReport), { headers: this.headers })
      .map((response) => response.json())
      .catch((error: Response) => {
        return this.errorHandler.handleError(error);
      });
  }
  
  //This method is used to edit the serviceReport
  editServiceReport(serviceReport) {
    return this.http.post(this.url + "servicereports/editServiceReport", JSON.stringify(serviceReport), { headers: this.headers })
      .map((response) => response.json())
      .catch((error: Response) => {
        return this.errorHandler.handleError(error);
      });
  }

  //This method is used to delete the serviceReport
  deleteServiceReport(serviceReport) {
    return this.http.post(this.url + "servicereports/deleteServiceReport", JSON.stringify(serviceReport), { headers: this.headers })
      .map((response) => response.json())
      .catch((error: Response) => {
        return this.errorHandler.handleError(error);
      });
  }
}
