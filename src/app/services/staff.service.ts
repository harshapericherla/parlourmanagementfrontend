import { Injectable, Inject } from "@angular/core";
import { Http } from "@angular/http";


@Injectable()
export class StaffService{

    constructor(private http: Http,@Inject('API_URL') private url) { }

    getStaff(){
        return this.http.get(this.url+"staff/getAll")
        .map( (response) => response.json());
    }
}