import { Injectable, Inject } from '@angular/core';
import { Constants } from '../constants';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { HandleError } from '../common/ErrorHandling/HandleError';

@Injectable()
export class ClientService {

  constructor(private http: Http, @Inject('API_URL') private url, private errorHandler: HandleError) { }

  headers = new Headers({
    'Content-Type': 'application/json'
  });

  // get all the clients from the db
  getAllClients() {
    return this.http.get(this.url + "client/getAllClients")
      .map((response) => response.json())
      .catch((error: Response) => {
        return this.errorHandler.handleError(error);
      });
  }

  // add the client to the db
  addClient(client) {
    return this.http.post(this.url + "client/addClient", JSON.stringify(client), { headers: this.headers })
      .map((response) => response.json()).catch((error: Response) => {
        return this.errorHandler.handleError(error);
      });
  }

}

