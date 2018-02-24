import { Pipe } from "@angular/core";

@Pipe({
    name:"discount"
})
export class DiscountPipe{
   
    transform(value: string, fallback: string): string {
        
         let serviceCost = Number(value);
         if(fallback){
            let serviceDiscount = Number(fallback);
            serviceCost = serviceCost - ((serviceCost*serviceDiscount)/100);
         }
         return String(serviceCost);
      }
}