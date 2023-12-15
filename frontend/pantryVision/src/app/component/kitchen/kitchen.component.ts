import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Subscription, Observable, firstValueFrom } from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from "../../model/recipe";
import { SpoonacularService } from "../../service/spoonacular.service";
import { GroceryService } from 'src/app/service/grocery.service';
import { GroceryList } from 'src/app/model/groceryList';
import { MatDialog } from "@angular/material/dialog";
import { RecipeDetailsComponent } from "../recipe-details-component/recipe-details.component";
import { SavedRecipeService } from 'src/app/service/savedRecipe.service';
import { SavedRecipe } from 'src/app/model/savedRecipe';


interface RecipeItem {
  id: number;
  image: string;
  title: string;
  missedIngredientCount: number;
  missedIngredients: string[];
  usedIngredients: any[];
}

// This interface is lazy... any type for details is not necessary but it gives us flexibility for now
export interface RecipeDetails {
  recipe: Recipe;
  details: any;
  isSaved: boolean;
}

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent {

  public pantry: Pantry;
  public savedRecipes: SavedRecipe[];
  pantrySub: Subscription;
  recipes: Recipe[];
  recipesToShow: number = 5;
  savedRecipeSub: Subscription;
  isLoading: boolean = true;
  authenticated: boolean;
  user$ = this.auth.user$;
  userId: number;
  subscriptions: Subscription[] = [];
  MAX_LISTS = this.groceryService.MAX_LISTS;
  groceryLists: GroceryList[];

  constructor(private pantryService: PantryService,
              private auth: AuthService,
              private spoonacularService: SpoonacularService,
              private dialog: MatDialog,
              private groceryService: GroceryService,
              private savedRecipeService: SavedRecipeService) {}

  async ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.subscriptions.push(this.pantrySub);
    this.savedRecipeSub = this.savedRecipeService.currentSavedRecipeList.subscribe(savedRecipes => this.savedRecipes = savedRecipes);
    this.subscriptions.push(this.savedRecipeSub);
    await this.setupGroceryLists();
  }

  async setupGroceryLists() {
    this.subscriptions.push(
      this.groceryService.groceryLists$.subscribe(groceryLists => {
        this.groceryLists = groceryLists;
      })
    );
      await this.authorizeAndLoad();
      this.groceryService.updateGroceryLists();
  }

  async updateGroceryLists() {
    this.groceryService.updateGroceryLists();
  }

  private async authorizeAndLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      });
      let authSub = this.auth.isAuthenticated$.subscribe(async status => {
        this.authenticated = status;
        if (!this.isLoading && this.authenticated) {
          let savedRecipesFromDb: SavedRecipe[] = [];
          let savedRecipeObj = await firstValueFrom(this.savedRecipeService.loadSavedRecipes());
          if(savedRecipeObj.recipes !== "[]") {
            savedRecipeObj.recipes.split(",").forEach((recipeStr: string) => {
              if(recipeStr !== "null") {
                const item = recipeStr.split("%");
                savedRecipesFromDb.push(new SavedRecipe(Number(item[0]), item[1]));
              }
            });
          }
          this.savedRecipeService.setSavedRecipes(savedRecipesFromDb);
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getAvailableIngredientsArray(): Ingredient[] {
    return Array.from(this.pantry.ingredientAvailability.entries())
      .filter(([ingredient, isAvailable]) => isAvailable)
      .map(([ingredient]) => ingredient);
  }

  getRecipes() {
    let ingredientList = this.getAvailableIngredientsArray().map(ingredient => ingredient.ingredientName);
    this.subscriptions.push(
      this.spoonacularService.getRecipesByIngredients(ingredientList).subscribe((data: RecipeItem[]) => {
        this.recipes = data.map(item => new Recipe(item));
      }));
  }

  async createGroceryList(title: string) {
    if (title == "") title = "My list";

    await firstValueFrom(this.groceryService.addGroceryList(title))

    this.updateGroceryLists();
  }

  getRecipeDetails(recipeId: number): Observable<any> {
    return this.spoonacularService.getRecipeInformation(recipeId);
  }

  openRecipeDetailsModal(recipe: Recipe): void {
    this.getRecipeDetails(recipe.id).subscribe((details: any) => {
      const data: RecipeDetails = {
        recipe: recipe,
        details: details,
        isSaved: this.savedRecipeService.isSaved(recipe.id)
      };
      this.dialog.open(RecipeDetailsComponent, {
        data: data
      });
    });
  }

  toggleRecipesToShow() {
    this.recipesToShow = this.recipesToShow === 5 ? this.recipes.length : 5;
  }

  openSavedRecipe(savedRecipe: SavedRecipe): void {
    this.spoonacularService.getRecipeInformation(savedRecipe.id).subscribe((data: RecipeItem) => {
      // You thought your interface was lazy? Watch me call the same API endpoint again via your function :)
      data.missedIngredientCount = 0;
      data.missedIngredients = [];
      data.usedIngredients = [];
      let recipe = new Recipe(data);
      this.openRecipeDetailsModal(recipe);
    });
  }

  unsaveRecipe(recipe: SavedRecipe) {
    if(confirm("Are you sure you want to unsave this recipe?\n" + recipe.title)) {
      this.savedRecipeService.unsaveRecipe(recipe).subscribe();
    }
  }

}
