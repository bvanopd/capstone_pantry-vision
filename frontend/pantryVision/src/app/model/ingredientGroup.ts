import { Ingredient } from "./ingredient";

export class IngredientGroup {
  description: string;
  ingredients: Ingredient[];
  ingredientsToShow: number;

  constructor(description: string, ingredients: Ingredient[], ingredientsToShow: number) {
    this.description = description;
    this.ingredients = ingredients;
    this.ingredientsToShow = ingredientsToShow
  }

  toggleIngredientsToShow() {
    this.ingredientsToShow = this.ingredientsToShow === 12 ? this.ingredients.length : 12;
  }
}
