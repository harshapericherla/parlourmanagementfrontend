import { Pipe } from "@angular/core";

@Pipe({
    name:"camelcase"
})
export class CamelCasePipe{
   
    transform(value: string, fallback: string): string {
        let localValue: string = "";
        let localArr: string[];
        if (value) {
          localArr = value.split(" ");
          for(let i=0;i<localArr.length;i++){
                let val1 = localArr[i].substr(0,1);
                let val2 = localArr[i].substr(1);
                let val3 = val1.toUpperCase()+val2.toLowerCase();
                if(i+1 == localArr.length)
                   localValue = localValue + val3;
                else
                   localValue = localValue + val3 + " ";
              }
          
        } else {
            localValue = fallback;
        }
         return localValue;
      }
}