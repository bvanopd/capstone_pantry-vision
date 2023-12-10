import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  screenSize: 'sm' | 'md' | 'lg' = 'lg';

  constructor() {
    fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => window.innerWidth)
    ).subscribe(width => {
      if (width < 800) {
        this.screenSize = 'sm';
      } else if (width < 1100) {
        this.screenSize = 'md';
      } else {
        this.screenSize = 'lg';
      }
    });
  }
}
