import { Ingredient } from "./ingredient";

export class GroceryList {

  groceryListId?: number;
  groceryListTitle: string;
  groceryListIngredients: string;
  groceryListUserId?: number;

  constructor(title: string, ingredients: string) {
    this.groceryListTitle = title;
    this.groceryListIngredients = ingredients;
  }
}
