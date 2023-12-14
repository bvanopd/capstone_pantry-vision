import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Subject, Subscription, firstValueFrom, lastValueFrom, takeUntil, Observable } from 'rxjs';
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


interface RecipeItem {
  id: number;
  image: string;
  title: string;
  missedIngredientCount: number;
  missedIngredients: string[];
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
              private dialog: MatDialog,
              private groceryService: GroceryService,
              private userService: UserService) {}

  subscriptions: Subscription[] = [];
  user$ = this.auth.user$;
  userId: number;
  availableIngredients: string[];
  groceryLists = this.groceryService.groceryLists;
  MAX_LISTS = this.groceryService.MAX_LISTS;

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.initializeAvailableIngredients();

    setInterval(async () => {
      if (this.groceryService.groceryLists == undefined || this.groceryLists == undefined || this.groceryLists.length != this.groceryService.groceryLists.length) {
        await this.setupGroceryLists();
      }
    }, 3000);
  }

  async setupGroceryLists() {
    await this.groceryService.setupGroceryLists();
    this.groceryLists = this.groceryService.groceryLists;
  }

  private async initializeAvailableIngredients() {
    this.availableIngredients = (await this.getAvailableIngredientsArray()).map(ingredient => ingredient.ingredientName);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  getRecipes() {
    this.subscriptions.push(
      this.spoonacularService.getRecipesByIngredients(this.availableIngredients).subscribe((data: RecipeItem[]) => {
        this.recipes = data.map(item => new Recipe(item));
      })
    )
  }

  async createGroceryList(title: string) {
    if (title == "") title = "My list";

    await firstValueFrom(this.groceryService.addGroceryList(title))

    this.setupGroceryLists();
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

}
