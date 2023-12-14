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
  
  async removeItemFromList(ingredientName: string, listId = this.groceryList.groceryListId) {
    await firstValueFrom(this.groceryService.removeFromGroceryList(ingredientName, listId));
    this.groceryService.setupGroceryLists();

    // update list in this template specifically
    const serviceList = this.groceryService.groceryLists.find(
      list => list.groceryListId == this.groceryList.groceryListId
    )
    if (serviceList) this.groceryList.groceryListIngredients = serviceList.groceryListIngredients;
  }
}
