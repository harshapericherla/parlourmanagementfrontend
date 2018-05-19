import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { NotFoundError } from "../Errors/NotFoundError";
import { AppError } from "../Errors/AppError";

//This class is used to handle the errors
@Injectable()
export class HandleError {

    //This method gets called in the service layer whenever there is an error
    handleError(error: any) {
        
        if (error.status === 404 || error.status == 0) {
            let errorJson = JSON.parse(error._body);
            return Observable.throw(new NotFoundError(errorJson.message));
        }
        return Observable.throw(new AppError(error));
    }
}