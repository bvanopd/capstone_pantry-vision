import { Ingredient } from "./ingredient";

export class IngredientGroup {
  description: string;
  ingredients: Ingredient[];

  constructor(description: string, ingredients: Ingredient[]) {
    this.description = description;
    this.ingredients = ingredients;
  }
}
