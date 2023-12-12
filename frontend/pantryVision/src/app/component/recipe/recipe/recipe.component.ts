import { Component, Input } from '@angular/core';
import { Recipe } from "../../../model/recipe";
import { KitchenComponent } from "../../kitchen/kitchen.component";
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipe;

  constructor(
    private kitchenComponent: KitchenComponent,
    private auth: AuthService,
    private userService: UserService) {}
  user$ = this.auth.user$;

  onRecipeClick(): void {
    this.kitchenComponent.openRecipeDetailsModal(this.recipe);
  }

  saveRecipe(recipe: Recipe): void {
    const recipeString = recipe.id + "%" + recipe.title;
    this.userService.saveRecipe(recipeString).subscribe();
  }
}
