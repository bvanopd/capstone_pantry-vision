import { Component, Input } from '@angular/core';
import { Recipe } from "../../../model/recipe";
import { KitchenComponent } from "../../kitchen/kitchen.component";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipe;

  constructor(private kitchenComponent: KitchenComponent) {}

  onRecipeClick(): void {
    this.kitchenComponent.openRecipeDetailsModal(this.recipe);
  }
}
