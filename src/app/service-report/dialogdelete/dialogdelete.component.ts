import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialogdelete',
  templateUrl: './dialogdelete.component.html',
  styleUrls: ['./dialogdelete.component.css']
})
export class DialogdeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogdeleteComponent>
  ) { }

  ngOnInit() {
  }

  onNoClick(): void{
     this.dialogRef.close();
  }
}
