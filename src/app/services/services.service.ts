import { Injectable, Inject } from "@angular/core";
import { Http } from "@angular/http";


@Injectable()
export class ServicesService{

    constructor(private http: Http,@Inject('API_URL') private url) { }

    getServices(){
        return this.http.get(this.url+"service/getServices")
        .map( (response) => response.json());
    }
}