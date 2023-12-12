import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Observable, Subscription} from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from "../../model/recipe";
import { SpoonacularService } from "../../service/spoonacular.service";
import { MatDialog } from "@angular/material/dialog";
import { RecipeDetailsComponent } from "../recipe-details-component/recipe-details.component";
import { UserService } from 'src/app/service/user.service';

interface RecipeItem {
  id: number;
  image: string;
  title: string;
  missedIngredientCount: number;
  missedIngredients: string[];
}

interface SavedRecipe {
  id: string;
  title: string;
}

// This interface is lazy... any type for details is not necessary but it gives us flexibility for now
export interface RecipeDetails {
  recipe: Recipe;
  details: any;
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
  // This is the kind of thing we would want to store in the database
  recipesToShow: number = 5;

  constructor(private pantryService: PantryService,
              private auth: AuthService,
              private spoonacularService: SpoonacularService,
              private userService: UserService,
              private dialog: MatDialog) {}

  user$ = this.auth.user$;
  isLoading: boolean;
  authenticated: boolean;
  savedRecipes: SavedRecipe[] = [];

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.authorizeAndLoad();
  }

  ngOnDestroy() {
    this.pantrySub.unsubscribe();
  }

  private async authorizeAndLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      });
      let authSub = this.auth.isAuthenticated$.subscribe(async status => {
        this.authenticated = status;
        if (!this.isLoading && this.authenticated) {
          this.parseSavedRecipes();
          authSub.unsubscribe();
          resolve();
        }
        else if (!this.isLoading && !this.authenticated) {
          authSub.unsubscribe();
          resolve();
        }
      });
    });
  }

  getAvailableIngredientsArray(): Ingredient[] {
    return Array.from(this.pantry.ingredientAvailability.entries())
      .filter(([ingredient, isAvailable]) => isAvailable)
      .map(([ingredient]) => ingredient);
  }

  getRecipes() {
    let ingredientList = this.getAvailableIngredientsArray().map(ingredient => ingredient.ingredientName);
    this.spoonacularService.getRecipesByIngredients(ingredientList).subscribe((data: RecipeItem[]) => {
      this.recipes = data.map(item => new Recipe(item));
    });
    console.log(this.recipes[0].id);
  }

  getRecipeDetails(recipeId: number): Observable<any> {
    return this.spoonacularService.getRecipeInformation(recipeId);
  }

  openRecipeDetailsModal(recipe: Recipe): void {
    this.getRecipeDetails(recipe.id).subscribe((details: any) => {
      const data: RecipeDetails = {
        recipe: recipe,
        details: details
      };
      this.dialog.open(RecipeDetailsComponent, {
        data: data
      });
    });
  }

  toggleRecipesToShow() {
    this.recipesToShow = this.recipesToShow === 5 ? this.recipes.length : 5;
  }

  parseSavedRecipes() {
    this.userService.getSavedRecipes().subscribe((data) => {
      data.split(",").forEach((string) => {
        const item = string.split("%");
        this.savedRecipes.push({
          id: item[0],
          title: item[1]
        });
      });
    });
  }

}
