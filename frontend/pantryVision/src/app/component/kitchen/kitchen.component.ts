import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Subscription } from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from "../../model/recipe";
import { SpoonacularService } from "../../service/spoonacular.service";

interface RecipeItem {
  id: number;
  image: string;
  title: string;
  ingredients: string[];
}

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent {

  public pantry: Pantry;
  pantrySub: Subscription;
  recipes: Recipe[];

  constructor(private pantryService: PantryService,
              private auth: AuthService,
              private spoonacularService: SpoonacularService) {}

  user$ = this.auth.user$;

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
  }

  ngOnDestroy() {
    this.pantrySub.unsubscribe();
  }

  getAvailableIngredientsArray(): Ingredient[] {
    return Array.from(this.pantry.ingredientAvailability.entries())
      .filter(([ingredient, isAvailable]) => isAvailable)
      .map(([ingredient]) => ingredient);
  }

  testRecipe() {
    let testRecipe = new Recipe({
      id: 1,
      image: '../../assets/anh-nguyen-kcA-c3f_3FE-unsplash.jpg',
      title: 'Test Recipe',
      usedIngredients: [{name:'Ingredient 1'}, {name:'Ingredient 2'}, {name:'Ingredient 3'}]
    });
    this.recipes = [testRecipe];
  }

  getRecipes() {
    let ingredientList = this.getAvailableIngredientsArray().map(ingredient => ingredient.ingredientName);
    this.spoonacularService.getRecipesByIngredients(ingredientList).subscribe((data: RecipeItem[]) => {
      this.recipes = data.map(item => new Recipe(item));
    });
    console.log(this.recipes[0].id);
  }

}
