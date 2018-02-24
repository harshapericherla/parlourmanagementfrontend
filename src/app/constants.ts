import { Injectable } from "@angular/core";

@Injectable()
export class Constants{
    private path: String
    constructor( ){
      
        this.path = "http://localhost:8001/parlourmanagementbackend/";
    }
    get url(){
      
        return this.path;
    }
}