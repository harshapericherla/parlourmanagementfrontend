import { Injectable, Inject } from "@angular/core";
import { Http,Headers, RequestOptions, RequestMethod} from "@angular/http";


@Injectable()
export class ServicesService{

    constructor(private http: Http,@Inject('API_URL') private url) { }
   
    headers = new Headers({
        'Content-Type': 'application/json'
      });

    getServices(){
        return this.http.get(this.url+"service/getServices")
        .map( (response) => response.json());
    }

    addService(service){
        return this.http.post(this.url+"service/addService",JSON.stringify(service),{headers : this.headers})
                      .map((response) => response.json());
    }

    editService(service){
        return this.http.post(this.url+"service/editService",JSON.stringify(service),{headers : this.headers})
                      .map((response) => response.json());
    }

    deleteService(service){
        return this.http.post(this.url+"service/deleteService",JSON.stringify(service),{headers : this.headers})
                      .map((response) => response.json());
    }
}