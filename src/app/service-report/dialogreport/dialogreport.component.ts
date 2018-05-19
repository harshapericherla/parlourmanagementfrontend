import { Component, OnInit, Inject, EventEmitter,ElementRef,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ClientService } from '../../services/client.service';
import { ServicesService } from '../../services/services.service';
import { StaffService } from '../../services/staff.service';
import { Service } from '../../models/service.model';
import { Client } from '../../models/client.model';
import { Staff } from '../../models/staff.model';
import { CamelCasePipe } from '../Pipes/camelCase';
import * as $ from 'jquery';
import { ServiceReport } from '../../models/servicereport.model';


@Component({
  selector: 'dialog-report',
  templateUrl: './dialogreport.component.html',
  styleUrls: ['./dialogreport.component.css']
})
export class DialogreportComponent{
  
  selectedServiceBean: ServiceReport;
  newPercent: number;
  newServiceCost: number;
  oldServiceCost: string;
  isSubmitEnabled: boolean = false;
  isChanged: boolean = false;
  addForm: FormGroup;
  type: string;
  services: any;
  servicesCost: any;
  servicesFiltered: any;
  clients: any;
  clientsFiltered: any;
  staffs: any;
  staffsFiltered: any;
  servicesJson: Service[];
  clientJson: Client[];
  staffJson: Staff[];
  formControlNames: any[] =[];
  serviceMap = {};
  serviceCostMap = {};
  serviceCostUpdatedMap = {};
  clientPhoneMap = {};
  clientMap = {};
  staffMap = {};

  serviceChangeId:number;
  clientChangeId:number;
  staffChangeId:number;

  constructor(
    public dialogRef: MatDialogRef<DialogreportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    public clientService: ClientService,
    public servicesService: ServicesService,
    public staffService: StaffService,
    public camelCase: CamelCasePipe
    ) { 
         
         this.addForm = fb.group({
             'service':[data.serviceBean.serviceName,Validators.required],
             'client':[data.clientBean.fullName,Validators.required],
             'phoneNumber':[data.clientBean.phoneNumber],
              'staff':[data.staffBean.staffName,Validators.required],
              'serviceCost':[data.serviceBean.serviceCost,Validators.required],
              'serviceId':[data.serviceBean.serviceId],
              'clientId':[data.clientBean.clientId],
              'staffId':[data.staffBean.staffId],
              'serviceDiscount':[data.serviceDiscount],
              'serviceReportDate':[data.serviceReportDate,Validators.required]
         });
        this.selectedServiceBean = data;

        let serviceReportDate = data.serviceReportDate;
        if(serviceReportDate){
          this.addForm.controls['serviceReportDate'].reset(new Date(data.serviceReportDate));
        }

        this.oldServiceCost = data.serviceBean.serviceCost;
        if(!data.serviceDiscount){
            this.addForm.controls['serviceDiscount'].reset('0');
        }else{
            let serviceDiscount = data.serviceDiscount;
            let oldServiceCost = Number(this.oldServiceCost);
            let serviceCost = oldServiceCost - ((oldServiceCost * serviceDiscount)/100);
            this.addForm.controls['serviceCost'].reset(serviceCost);
        }

         if(data.type == 'add'){
             this.type = 'ADD'
         }else{
             this.type = 'EDIT'
         }

         this.servicesService.getServices().subscribe((json:Service[])=> {
               
               let services = [];
               for(let i=0;i<json.length;i++){
                    
                   let serviceName = json[i].serviceName
                   this.serviceMap[serviceName] = json[i].serviceId;
                   this.serviceCostMap[serviceName] = json[i].serviceCost;  
                   services.push(serviceName);
               }
               this.services = services;

               this.servicesFiltered = this.addForm.controls['service'].valueChanges.
               pipe(startWith(''),map(val => {
                                        this.resetServiceIdChange(val);
                                        return this.filterService(val);
                                    }));

         });
        
         this.clientService.getAllClients().subscribe((json:Client[]) => {
               
               let clients = [];
               for(let i=0;i<json.length;i++){
                    
                   let clientName = json[i].fullName;
                   this.clientMap[clientName] = json[i].clientId;
                   this.clientPhoneMap[clientName] = json[i].phoneNumber;
                   clients.push(clientName);
               }
               this.clients = clients;
               this.clientsFiltered = this.addForm.controls['client'].valueChanges.
               pipe(startWith(''),map(val => {
                                  
                                        this.resetClientIdChange(val);
                                        return this.filterClient(val)
                                    }));
         });

         this.staffService.getStaff().subscribe((json:Staff[]) => {
              
              let staffs = [];
              for(let i=0;i<json.length;i++){
                    
                let staffName = json[i].staffName;
                this.staffMap[staffName] = json[i].staffId;
                staffs.push(staffName);
              }
              this.staffs = staffs;
              this.staffsFiltered = this.addForm.controls['staff'].valueChanges.
              pipe(startWith(''),map(val => {
                                    this.resetStaffIdChange(val);
                                    return this.filterStaff(val) 
                                  }));
         });

         this.addForm.valueChanges.subscribe( () => {
            let serviceReportDate = this.addForm.controls['serviceReportDate'].value;
            let phoneNumber = this.addForm.controls['phoneNumber'].value;
            let serviceCost = Number(this.addForm.controls['serviceCost'].value);
          
            if(this.type == 'ADD' && this.addForm.valid &&  serviceReportDate != null && phoneNumber)
                  this.isSubmitEnabled = true;
            else if(this.type == 'EDIT' && this.isDetailsChanged())
                  this.isSubmitEnabled = true;
            else
                  this.isSubmitEnabled = false;
         });
      

         this.addForm.controls['service'].valueChanges.subscribe(() => {

               let serviceNames = this.addForm.controls['service'].value;
               let serviceCosts = [];
               let serviceCost = 0;
               let serviceName:string;
               // emptying the update map
               this.serviceCostUpdatedMap = {};
               for(let i=0;i<serviceNames.length;i++){
                    
                    serviceName = serviceNames[i];
                    serviceCost =  this.serviceCostMap[serviceName];
                    serviceCosts.push(serviceCost);
                    this.serviceCostUpdatedMap[serviceName] = serviceCost;
               }
               this.servicesCost = serviceCosts;
               this.updateServiceJson();
         });
       

        this.addForm.controls['client'].valueChanges.subscribe(() => {
               let clientName = this.addForm.controls['client'].value;
               let clientNumber = this.clientPhoneMap[clientName];
               if(clientNumber){
                   this.addForm.controls['phoneNumber'].reset(clientNumber);
               }
        });

    // logic when servicecost is changed in the edit section
    this.addForm.controls['serviceCost'].valueChanges.subscribe( () => {
          let oldServiceCost: number = Number(this.oldServiceCost);
          let serviceCost: number = Number(this.addForm.controls['serviceCost'].value);

          if(!isNaN(oldServiceCost) && this.newServiceCost != serviceCost){
             let percent: number = (oldServiceCost-serviceCost)*100/oldServiceCost;
             this.newPercent = percent;
             this.addForm.controls['serviceDiscount'].reset(percent);
             this.newServiceCost = serviceCost;
          }

    });
    // logic when serviceDiscount is changed in the edit section
    this.addForm.controls['serviceDiscount'].valueChanges.subscribe( () => {
          
         let oldServiceCost: number = Number(this.oldServiceCost);
         let discount: number = Number(this.addForm.controls['serviceDiscount'].value);
         let serviceCost = this.addForm.controls['serviceCost'].value;
         if(this.newPercent != discount){  
           serviceCost = oldServiceCost - ((oldServiceCost * discount)/100);
           this.newServiceCost = serviceCost;
           this.addForm.controls['serviceCost'].reset(serviceCost);
           this.newPercent = discount;
         }  
    })
        
    }
  
  // upates the servicejson with the costs
  updateServiceJson(){
      this.servicesJson = [];
      for (var serviceName in this.serviceCostUpdatedMap) {
        if (this.serviceCostUpdatedMap.hasOwnProperty(serviceName)) {
          this.updateFormControl(serviceName);
          this.servicesJson.push(new Service(this.serviceMap[serviceName],serviceName, this.serviceCostUpdatedMap[serviceName]));
        }
      }
  }
  
  updateFormControl(serviceName){
    
    this.updateServiceCost(serviceName);
    this.updateDiscountControl(serviceName);
  }

 // updating the service form
 updateServiceCost(serviceName){
    let formControlName = serviceName;
    let cost = this.serviceCostUpdatedMap[formControlName];
    if(this.updateFormControlName(formControlName)){
    
      this.addForm.addControl(formControlName,new FormControl(cost));
      this.addForm.controls[formControlName].valueChanges.subscribe( () => {
         if(!this.isChanged){
            let serviceName = formControlName;
            let serviceCost = this.addForm.controls[formControlName].value;
            let oldServiceCost = this.serviceCostUpdatedMap[formControlName];
            let discount  = (oldServiceCost-serviceCost)*100/oldServiceCost;
            this.isChanged = true;
            this.addForm.controls['discount'+serviceName].reset(discount);
            this.isChanged = false;
            
         }
      });
    } 
 }

 // updating the discount form
  updateDiscountControl(serviceName){
    let formControlName = 'discount'+serviceName;
    if(this.updateFormControlName(formControlName)){

      this.addForm.addControl(formControlName,new FormControl('0'));
      this.addForm.controls[formControlName].valueChanges.subscribe( () => {
        if(!this.isChanged){
              let discount = this.addForm.controls[formControlName].value;
              discount = Number(discount);
              let localServiceCost = this.serviceCostMap[serviceName];
              localServiceCost = localServiceCost - ((localServiceCost * discount)/100);
              this.isChanged = true;
              this.addForm.controls[serviceName].reset(localServiceCost);
              this.isChanged = false;
        }   
      });
    }
  }

//push form Control name
updateFormControlName(serviceName) : boolean{
  
  for(let i=0;i<this.formControlNames.length;i++){
      if(serviceName == this.formControlNames[i]){
           return false;
      }
  }
  this.formControlNames.push(serviceName);
  return true;
}

  // if the discount is 0 and got clicked it will empty
  clearDiscount(discount: HTMLInputElement){

     if(discount.value == '0'){
         discount.value = '';
     }
  }
  
  // if the mouse is out of foucs from the discount it restores the value as zero
  applyDiscount(discount: HTMLInputElement,serviceName: string){
     if(discount.value == ''){
         discount.value = '0';
     }
  }

  isDetailsChanged(){
       
     let formClientFullName = this.addForm.controls['client'].value;
     let originalClientFullName = this.selectedServiceBean.clientBean.fullName;
     if(formClientFullName != originalClientFullName && formClientFullName){
         return true;
     }

     let formPhone = this.addForm.controls['phoneNumber'].value;
     let originalPhone = this.selectedServiceBean.clientBean.phoneNumber;
     if(formPhone != originalPhone && formPhone){
        return true;
     }

     let formStaff = this.addForm.controls['staff'].value;
     let originalStaff = this.selectedServiceBean.staffBean.staffName;
     if(formStaff != originalStaff && formStaff){
        return true;
     }

     let formDate: Date =  new Date(this.addForm.controls['serviceReportDate'].value);
     let originalDate: Date = new Date(this.selectedServiceBean.serviceReportDate);
     if(formDate.getTime() != originalDate.getTime() && formDate){
       return true;
     }

     let formService = this.addForm.controls['service'].value;
     let originalService = this.selectedServiceBean.serviceBean.serviceName;
     if(formService != originalService && formService){
        return true;
     }

     let formDiscount = this.addForm.controls['serviceDiscount'].value;
     let originalDiscount = this.selectedServiceBean.serviceDiscount;
     if(formDiscount != originalDiscount && formDiscount){
       return true;
     }

     let formCost = this.addForm.controls['serviceCost'].value;
     let originalCost = this.selectedServiceBean.serviceBean.serviceCost;
     if(formCost != originalCost && formCost){
       return true;
     }

  }

  oldServiceCostIsNaN(){
     return isNaN(Number(this.oldServiceCost));
  }

  // below methods is used to get the properties which are used in the view page
  get service(){
     return this.addForm.get('service');
  }
  get client(){
     return this.addForm.get('client');
  }
  get staff(){
     return this.addForm.get('staff');
  }

  filterService(val: string): string[] {
    return this.services.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  filterStaff(val: string): string[] {
    return this.staffs.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  filterClient(val: string): string[] {
    return this.clients.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  
  applyCamelCase(type: string){
   
   let initialValue = ""; 
   switch(type){
      case "service":
            initialValue = this.data.serviceBean.serviceName;
            break;
      case "client":
            initialValue = this.data.clientBean.fullName;
            break;
      case "staff":
            initialValue = this.data.staffBean.staffName;
            break;
   }
    let value =  this.addForm.controls[type].value;
    if(initialValue != value){
      value = this.camelCase.transform(value,"");
      switch(type){
          case "service":
               this.resetServiceIdChange(value);
               break;
          case "client":
               this.resetClientIdChange(value);
               break;
          case "staff":
               this.resetStaffIdChange(value);
               break;
      }
      this.addForm.controls[type].reset(value);
    } 
   
  }
  

  resetServiceIdChange(val: string){
    if(val){
       let serviceChangeId = this.serviceMap[val];
       if(!serviceChangeId)
           serviceChangeId = 0;
       this.addForm.controls['serviceId'].reset(serviceChangeId);
    }
 }

  resetClientIdChange(val: string){
    if(val){
       let clientChangeId = this.clientMap[val];
       if(!clientChangeId)
           clientChangeId = 0;
       this.addForm.controls['clientId'].reset(clientChangeId);
    }
 }

  resetStaffIdChange(val: string){
     if(val){
        let staffChangeId = this.staffMap[val];
        if(!staffChangeId)
           staffChangeId = 0;
        this.addForm.controls['staffId'].reset(staffChangeId);
     }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
