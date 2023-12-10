import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { PantryService } from '../../service/pantry.service';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';
import { Recipe } from "../../model/recipe";
import { SpoonacularService } from "../../service/spoonacular.service";
import { GroceryService } from 'src/app/service/grocery.service';
import { GroceryList } from 'src/app/model/groceryList';
import { UserService } from 'src/app/service/user.service';

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
              private userService: UserService) {}

  user$ = this.auth.user$;
  userId: number;
  groceryLists: GroceryList[];

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
    this.initializeGroceryLists();
    // console.log(await firstValueFrom(this.userService.getUserPantry()));
  }

  private async initializeGroceryLists() {
    this.getGroceryLists();
  }
  
  private async getGroceryLists() {

    console.log(await firstValueFrom(this.groceryService.getGroceryLists()));
    // this.userId = await firstValueFrom(this.userService.getUserId());
      
    // const lists = await lastValueFrom(this.groceryService.getGroceryListsByUserId(await firstValueFrom(this.userService.getUserId())));
  }

  // WIP //
  // async getGroceryLists(userId: number) {
  //
  //   const lists = await lastValueFrom(this.groceryService.getGroceryListsByUserId(userId));
  //
  //   this.groceryLists = await Promise.all(lists.map(async list => {
  //     const ingredients = await lastValueFrom(this.groceryService.getGroceryListById(list.groceryListId));
  //     const title = list.groceryListTitle;
  //     const id = list.groceryListId;
  //     const listIngredients = ingredients.map(ingredient => {
  //       return new Ingredient(ingredient.ingredientName, ingredient.ingredientSpoonacularId, ingredient.groceryListId, ingredient.ingredientEssentialFlg);
  //     })
  //
  //     const groceryList = new GroceryList(id, title, listIngredients);
  //     return groceryList;
  //   }));
  // }

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
  // testGroceryList() {
  //   this.groceryService.
  //   let testGroceryList = new GroceryList({
  //     title: 'My Test List',
  //     ingredients: 'My Test List',
  //     usedIngredients: [{name:'Ingredient 1'}, {name:'Ingredient 2'}, {name:'Ingredient 3'}]
  //   });
  //   this.recipes = [testGroceryList];
  // }

  getRecipes() {
    let ingredientList = this.getAvailableIngredientsArray().map(ingredient => ingredient.ingredientName);
    this.spoonacularService.getRecipesByIngredients(ingredientList).subscribe((data: RecipeItem[]) => {
      this.recipes = data.map(item => new Recipe(item));
    });
  }

}
