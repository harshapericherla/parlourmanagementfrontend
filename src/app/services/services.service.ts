import { Injectable, Inject } from "@angular/core";
import { Http, Headers, RequestOptions, RequestMethod } from "@angular/http";
import { HandleError } from "../common/ErrorHandling/HandleError";


@Injectable()
export class ServicesService {

    constructor(private http: Http, @Inject('API_URL') private url, private errorHandler: HandleError) { }

    headers = new Headers({
        'Content-Type': 'application/json'
    });

    // get all the services
    getServices() {
        return this.http.get(this.url + "service/getServices")
            .map((response) => response.json())
            .catch((error: Response) => {
                return this.errorHandler.handleError(error);
            });
    }
   // add the service
    addService(service) {
        return this.http.post(this.url + "service/addService", JSON.stringify(service), { headers: this.headers })
            .map((response) => response.json())
            .catch((error: Response) => {
                return this.errorHandler.handleError(error);
            });
    }
   // edit the service
    editService(service) {
        return this.http.post(this.url + "service/editService", JSON.stringify(service), { headers: this.headers })
            .map((response) => response.json())
            .catch((error: Response) => {
                return this.errorHandler.handleError(error);
            });
    }
   // delete the service
    deleteService(service) {
        return this.http.post(this.url + "service/deleteService", JSON.stringify(service), { headers: this.headers })
            .map((response) => response.json())
            .catch((error: Response) => {
                return this.errorHandler.handleError(error);
            });
    }
}