import { Injectable, Inject } from '@angular/core';
import { Constants } from '../constants';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';
@Injectable()
export class ClientService {

  constructor(private http: Http,@Inject('API_URL') private url) { }
  
  headers = new Headers({
    'Content-Type': 'application/json'
  });

  getAllClients(){
    return this.http.get(this.url+"client/getAllClients")
    .map( (response) => response.json());
  }

  addClient(client){
     return this.http.post(this.url+"client/addClient",JSON.stringify(client),{headers : this.headers})
                      .map((response) => response.json());
  }

}

