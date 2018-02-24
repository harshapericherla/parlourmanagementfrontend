import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogreportComponent } from './dialogreport.component';

describe('DialogreportComponent', () => {
  let component: DialogreportComponent;
  let fixture: ComponentFixture<DialogreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
