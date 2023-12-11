import { Ingredient } from "./ingredient";

export class GroceryList {

  groceryListId: number;
  groceryListTitle: string;
  groceryListIngredients: string;
  groceryListUserId: number;

  constructor(title: string, ingredients: string, listId: number, userId: number) {
    // this order of assignments matches the DB table columns
    this.groceryListId = listId;
    this.groceryListTitle = title;
    this.groceryListIngredients = ingredients;
    this.groceryListUserId = userId
  }
  static fromDataObject(data: any) {
    console.log(data)
    return new GroceryList(data.groceryListTitle, data.groceryListItems, data.id, data.userId)
  }
}
