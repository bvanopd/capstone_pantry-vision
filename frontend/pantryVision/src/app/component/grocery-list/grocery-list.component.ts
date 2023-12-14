import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GroceryList } from 'src/app/model/groceryList';
import { GroceryService } from 'src/app/service/grocery.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  @Input() groceryList: GroceryList;

  constructor(private groceryService: GroceryService) {}

  deleteGroceryList(listId: number) {
    firstValueFrom(this.groceryService.deleteGroceryList(listId))
    this.groceryService.setupGroceryLists();
  }
  
  removeItemFromList(ingredientName: string, listId = this.groceryList.groceryListId) {
    firstValueFrom(this.groceryService.removeFromGroceryList(ingredientName, listId));
    this.groceryService.setupGroceryLists();
  }
}
