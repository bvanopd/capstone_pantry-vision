import { Component } from '@angular/core';
import { ScreenService } from "./service/screen.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pantryVision';

  constructor(public screenService: ScreenService) {}
}
