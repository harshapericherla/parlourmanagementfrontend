import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { Service } from '../models/service.model';
import { ServicesService } from '../services/services.service';
import { CamelCasePipe } from '../service-report/Pipes/camelCase';
import { AbstractControl } from '@angular/forms/src/model';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { DialogdeleteComponent } from '../service-report/dialogdelete/dialogdelete.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-services-component',
  templateUrl: './services-component.component.html',
  styleUrls: ['./services-component.component.css']
})
export class ServicesComponent implements OnInit {

  showForm: string;
  serviceForm: FormGroup;
  editForm: FormGroup;
  type: string;
  message: string;
  color: string;
  service: Service;
  servicesList: Service[];
  servicesFiltered: any;
  isSubmitDisabled: boolean=true;
  services: string[];
  selectedServiceName: string;
  selectedServiceObj: Service;
  constructor(public dialog: MatDialog,public fb: FormBuilder,
              public serviceDao: ServicesService,
              public camelCase: CamelCasePipe) { 

    this.serviceForm = fb.group({
         'serviceName':['',Validators.required],
         'serviceCost':['',Validators.required]
    }); 

    this.editForm = fb.group({
      'serviceName':['',Validators.required],
      'serviceCost':['',Validators.required]
    }); 

    this.type = 'add';

    this.serviceForm.valueChanges.subscribe( () => {
       
        if(this.serviceForm.valid){
            this.isSubmitDisabled = false;
        }else{
          this.isSubmitDisabled = true;
        }
    });
    this.loadServices();
}

  loadServices(){
    this.serviceDao.getServices().subscribe((json:Service[])=> {
      
      this.servicesList = json;
      let services = [];
      for(let i=0;i<json.length;i++){
           
          let serviceName = json[i].serviceName
          services.push(serviceName);
      }
      this.services = services;
      this.servicesFiltered = this.serviceForm.controls['serviceName'].valueChanges.
      pipe(startWith(''),map(val => {
                               if(val != null){
                                 if(this.selectedServiceName != val && val){
                                  this.message = '';
                                  this.showForm = 'false';
                                 }

                                 this.selectedServiceName = val;
                                 return this.filterService(val);
                               }                      
                           }));
      });
  }

  filterService(val: string): string[] {
    return this.services.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  onChange(type: string){
      this.type = type;
      this.reset();
      this.loadServices();
  }

  applyCamelCase(){
    let serviceName =  this.serviceForm.controls['serviceName'].value;
    if(serviceName)
    this.serviceForm.controls['serviceName'].reset(this.camelCase.transform(serviceName,""));
  }
  selectService(){
      let selectedServiceName = this.selectedServiceName;
      for (var key in this.servicesList) {
        if (this.servicesList.hasOwnProperty(key)) {
          let service:Service = this.servicesList[key];
          if(service.serviceName == selectedServiceName){
            this.selectedServiceObj = service;
            if(this.type != 'delete'){
                this.loadFormDetails(service);
            }else{
                this.openDeleteDialog();
            }
          }
        }
      }

   }

   openDeleteDialog(): void{
    let dialogRef = this.dialog.open(DialogdeleteComponent,{
        width: '350px'
    });
    dialogRef.afterClosed().subscribe( (value) => {
        if(value){
              this.serviceDao.deleteService(this.selectedServiceObj).subscribe((json) => {
                    this.loadServices();
                    this.reset();
              });         
        }
    });
  }


   loadFormDetails(service:Service){
      this.editForm.controls['serviceName'].reset(service.serviceName);
      this.editForm.controls['serviceCost'].reset(service.serviceCost);
      this.showForm = 'true';
   }
  
   onEditFormSubmit(){
    let serviceName = this.editForm.value.serviceName;;
    let serviceCost = this.editForm.value.serviceCost; 
    let serviceId = this.selectedServiceObj.serviceId;
    this.service = new Service(serviceId,serviceName,serviceCost);
    this.serviceDao.editService(this.service).subscribe( (json) => {
           this.message = 'Service has been edited successfully';
           this.color = 'green';
           this.selectedServiceName = json.serviceName;
           this.loadServices();
           this.serviceForm.controls['serviceName'].reset(json.serviceName);
           this.loadFormDetails(json);
    });
   }

  onAddFormSubmit(){
     let serviceName = this.serviceForm.value.serviceName;
     let serviceCost = this.serviceForm.value.serviceCost; 
     this.service = new Service(0,serviceName,serviceCost);
     this.serviceDao.addService(this.service).subscribe( (json) => {
           //resetting the form after data submission
           this.message = 'Service has been Added SuccessFully';     
           this.color = 'green';
           this.reset();
     });
  }
  reset(){
      let control: AbstractControl = null;
      this.message = '';
      this.showForm = '';
      this.editForm.reset();
      this.serviceForm.reset();
      this.serviceForm.markAsUntouched();
      Object.keys(this.serviceForm.controls).forEach((name) => {
            control = this.serviceForm.controls[name];
            control.setErrors(null);
      });
  }

  ngOnInit() {
  }

}
