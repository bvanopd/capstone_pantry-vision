import { Ingredient } from "./ingredient";

export class GroceryList {

  groceryListId: number;
  groceryListTitle: string;
  groceryListIngredients: Ingredient[];

  constructor(id: number, title: string, ingredients: Ingredient[]) {
    this.groceryListId = id;
    this.groceryListTitle = title;
    this.groceryListIngredients = ingredients;
  }
}
