import { Component, Input } from '@angular/core';
import { Recipe } from "../../../model/recipe";
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

  constructor(private groceryService: GroceryService,
              private userService: UserService) {}

  async addItemToList(ingredientId: string) {
    if (!this.groceryList || !this.groceryService.getGroceryLists()) {
      await lastValueFrom(this.groceryService.addGroceryList("My list"));
      await lastValueFrom(this.groceryService.addToGroceryList(ingredientId));
    } else if (!this.groceryList.groceryListIngredients.includes(ingredientId)) {
      this.groceryService.addToGroceryList(ingredientId).subscribe()
    }
  }
}
