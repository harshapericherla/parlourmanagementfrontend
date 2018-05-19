import { Injectable, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { HandleError } from "../common/ErrorHandling/HandleError";

@Injectable()
export class StaffService{

    constructor(private http: Http,@Inject('API_URL') private url,private errorHandler:HandleError) { }

    // get the staff from db
    getStaff(){
        return this.http.get(this.url+"staff/getAll")
        .map( (response) => response.json())
        .catch((error: Response) => {
            return this.errorHandler.handleError(error);
        });
    }
}