import { ErrorHandler, Inject, Injectable } from "@angular/core";
import { ServiceReportComponent } from "../../service-report/service-report-component/service-report.component";
import { Injector } from "@angular/core";
import { LoggerService } from "./LoggerService";
import { AppError } from "../Errors/AppError";

//This class is used to handle the errors globally
@Injectable()
export class AppErrorHandler implements ErrorHandler{

    constructor(private injector: Injector){
        
    }

    handleError(error: AppError){
         const logger = this.injector.get(LoggerService);
         logger.LogError(error.originalError,null);
    }
}