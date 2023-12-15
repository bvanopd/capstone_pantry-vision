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

  async deleteGroceryList(listId: number) {
    await firstValueFrom(this.groceryService.deleteGroceryList(listId));
    await this.groceryService.updateGroceryLists();
  }

  async removeItemFromList(ingredientName: string, listId = this.groceryList.groceryListId) {
    await firstValueFrom(this.groceryService.removeFromGroceryList(ingredientName, listId));
    await this.groceryService.updateGroceryLists();

  }
}
