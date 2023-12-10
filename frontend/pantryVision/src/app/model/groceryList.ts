import { Ingredient } from "./ingredient";

export class GroceryList {

  groceryListId: number;
  groceryListTitle: string;
  groceryListIngredients: string;
  groceryListUserId: number;

  constructor(id: number, title: string, ingredients: string, userId: number) {
    this.groceryListId = id;
    this.groceryListTitle = title;
    this.groceryListIngredients = ingredients;
    this.groceryListUserId = userId;
  }
}
