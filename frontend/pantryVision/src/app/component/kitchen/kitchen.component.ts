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
import { UserService } from 'src/app/service/user.service';
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
  pantrySub: Subscription;
  recipes: Recipe[];
  // This is the kind of thing we would want to store in the database
  recipesToShow: number = 5;

  public savedRecipes: SavedRecipe[];
  savedRecipeSub: Subscription;

  constructor(private pantryService: PantryService,
              private auth: AuthService,
              private spoonacularService: SpoonacularService,
              private dialog: MatDialog,
              private groceryService: GroceryService,
              private userService: UserService,
              private savedRecipeService: SavedRecipeService) {}

  isLoading: boolean = true;
  authenticated: boolean;
  subscriptions: Subscription[] = [];
  user$ = this.auth.user$;
  userId: number;

  availableIngredients: string[];
  groceryLists: GroceryList[];
  grocerySub: Subscription;


  async ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.subscriptions.push(this.pantrySub);
    this.savedRecipeSub = this.savedRecipeService.currentSavedRecipeList.subscribe(savedRecipes => this.savedRecipes = savedRecipes);
    this.subscriptions.push(this.savedRecipeSub);
    await this.setupGroceryLists();;
    this.authorizeAndLoad();
  }

  async setupGroceryLists() {
      this.groceryService.groceryLists$.subscribe(groceryLists => {
        this.groceryLists = groceryLists;
      });

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
              const item = recipeStr.split("%");
              savedRecipesFromDb.push(new SavedRecipe(Number(item[0]), item[1]));
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
  async createGroceryList(title: string) {
    if (title == "") title = "My list";
    try {
      // ToPromise deprecated but it still works
      await this.groceryService.addGroceryList(title).toPromise();
      await this.setupGroceryLists();
    } catch (error) {
      console.error('Error adding grocery list:', error);
    }
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
