import { Component, Input } from '@angular/core';
import { GroceryList } from 'src/app/model/groceryList';
import {GroceryService} from "../../service/grocery.service";

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  @Input() groceryList: GroceryList;

  constructor(private groceryService: GroceryService) {}
  // Injecting a reference to another component is a little sketchy but they are in the same module, so
  // we should be fine.
  async deleteGroceryList(title: string) {
    try {
      // ToPromise deprecated but it still works
      await this.groceryService.removeGroceryList(title).toPromise();
      // Update grocery Lists
      await this.groceryService.updateGroceryLists();
    } catch (error) {
      console.error('Error removing grocery list:', error);
    }
  }


  async removeIngredientFromGroceryList(ingredient: string, groceryListID: number) {
    try {
      await this.groceryService.removeIngredient(ingredient, groceryListID).toPromise();
      // Update grocery Lists
      await this.groceryService.updateGroceryLists();
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  }

}
