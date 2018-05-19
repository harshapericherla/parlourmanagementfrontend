import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

//This class is used to log the info's or error's in a toast
@Injectable()
export class LoggerService{
 
  constructor(public snackBar: MatSnackBar) {
  }

  LogError(message: string, action: string) {
    
    let extraClasses = ['error-snackbar'];
    if(message == undefined){
         message = 'Server rejected the request, Contact the admin'
    }
    message = message.toUpperCase();
    let snackBarRef = this.snackBar.open(message, "close",{
        extraClasses: extraClasses
    });

    snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss();
    });
  }

  
}