import { Component, Input } from '@angular/core';
import { GroceryList } from 'src/app/model/groceryList';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  @Input() groceryList: GroceryList
}
