import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from "../../model/recipe";
import { SpoonacularService } from "../../service/spoonacular.service";
import { GroceryService } from 'src/app/service/grocery.service';
import { GroceryList } from 'src/app/model/groceryList';

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
              private spoonacularService: SpoonacularService,
              private groceryService: GroceryService,
              ) {}

  user$ = this.auth.user$;
  userId: number;
  availableIngredients: string[];
  groceryLists: GroceryList[];

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.initializeAvailableIngredients();
    this.initializeGroceryLists();
  }

  private async initializeGroceryLists() {
    this.groceryLists = await firstValueFrom(this.groceryService.getGroceryLists());
  }
  private async initializeAvailableIngredients() {
    this.availableIngredients = (await this.getAvailableIngredientsArray()).map(ingredient => ingredient.ingredientName);
  }

  ngOnDestroy() {
    this.pantrySub.unsubscribe();
  }

  getAvailableIngredientsArray(): Promise<Ingredient[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const availableIngredients = Array.from(this.pantry.ingredientAvailability.entries())
          .filter(([ingredient, isAvailable]) => isAvailable)
          .map(([ingredient]) => ingredient);
        resolve(availableIngredients);
      }, 2000);
    });
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
    this.spoonacularService.getRecipesByIngredients(this.availableIngredients).subscribe((data: RecipeItem[]) => {
      this.recipes = data.map(item => new Recipe(item));
    });
  }

  createGroceryList(title: string, ingredients: string) {
    if (title == "") title = "My List";
    this.groceryService.addGroceryList(title, ingredients);
  }

}
