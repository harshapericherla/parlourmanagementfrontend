import { Component, Inject } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public stopCondition: boolean;

  constructor( @Inject(DOCUMENT) private document: any) {
    // This code is written to fix a bug which is adding style class properties to the body automatically
    this.stopCondition = false;
    Observable.interval()
      .takeWhile(() => !this.stopCondition)
      .subscribe(i => {
        if (this.document.body.style.overflow != '') {

          this.document.body.style.overflow = '';
          var allSelects = this.document.head.getElementsByTagName("style");
          this.document.head.getElementsByTagName("style")[allSelects.length - 1].innerHTML = '';
          this.stopCondition = true;
        }
      })
  }
}
