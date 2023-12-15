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
    private kitchenComponent: KitchenComponent) {}

  onRecipeClick(): void {
    this.kitchenComponent.openRecipeDetailsModal(this.recipe);
  }

}
