import { Component, Input } from '@angular/core';
import { Recipe } from "../../../model/recipe";
import { KitchenComponent } from "../../kitchen/kitchen.component";
import { GroceryService } from 'src/app/service/grocery.service';
import { GroceryList } from 'src/app/model/groceryList';
import { lastValueFrom, switchMap } from 'rxjs';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipe;
  @Input() availableIngredients: String[];
  @Input() groceryList: GroceryList;

  constructor(private kitchenComponent: KitchenComponent,
              private groceryService: GroceryService) {}

  onRecipeClick(): void {
    this.kitchenComponent.openRecipeDetailsModal(this.recipe);
  }

  async addItemToList(ingredientName: string, listId: number) {
    if (!this.groceryList || !this.groceryService.getGroceryLists()) {
      await lastValueFrom(this.groceryService.addGroceryList("My list"));
      await lastValueFrom(this.groceryService.addToGroceryList(ingredientName, listId));
    } else if (!this.groceryList.groceryListIngredients.includes(ingredientName)) {
      await lastValueFrom(this.groceryService.addToGroceryList(ingredientName, listId));
    }
  }
}
