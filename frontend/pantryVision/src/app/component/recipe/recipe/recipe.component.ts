import { Component, Input } from '@angular/core';
import { Recipe } from "../../../model/recipe";
import { KitchenComponent } from "../../kitchen/kitchen.component";
import { GroceryService } from 'src/app/service/grocery.service';
import { GroceryList } from 'src/app/model/groceryList';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipe;
  @Input() availableIngredients: String[];
  @Input() groceryList: GroceryList;

  constructor(
    private kitchenComponent: KitchenComponent,
    private groceryService: GroceryService) {}

  onRecipeClick(): void {
    this.kitchenComponent.openRecipeDetailsModal(this.recipe);
  }

  async addItemToList(ingredientName: string) {
    if (!this.groceryList || !this.groceryService.getGroceryLists()) {
      await lastValueFrom(this.groceryService.addGroceryList("My list"));
      await lastValueFrom(this.groceryService.addToGroceryList(ingredientName));
    } else if (!this.groceryList.groceryListIngredients.includes(ingredientName)) {
      await lastValueFrom(this.groceryService.addToGroceryList(ingredientName));
    }
  }

  
}
