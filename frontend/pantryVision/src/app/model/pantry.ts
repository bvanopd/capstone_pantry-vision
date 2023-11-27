import { Ingredient } from "./ingredient";
import { IngredientGroup } from "./ingredientGroup";

export class Pantry {
  allIngredients: Ingredient[] = [];
  ingredientAvailability: Map<Ingredient, boolean> = new Map();
  ingredientGroups: IngredientGroup[] = [];

  constructor() {}

  isIngredientAvailable(ingredient: Ingredient): boolean {
    return this.ingredientAvailability.get(ingredient) || false;
  }

  toggleAvailability(ingredient: Ingredient) {
    if (this.allIngredients.includes(ingredient)) {
      const currentAvailability = this.ingredientAvailability.get(ingredient);
      this.ingredientAvailability.set(ingredient, !currentAvailability);
    }

    // probably update backend from here: if (authenticated) {}
  }

  get numberOfAvailableIngredients(): number {
    let count = 0;
    this.ingredientAvailability.forEach((isAvailable, ingredient) => {
      if (isAvailable) {
        count++;
      }
    });
    return count;
  }

  // Not used by backend, could be useful for frontend
  get listOfAvailableIngredients(): Ingredient[] {
    let available: Ingredient[] = [];
    this.ingredientAvailability.forEach((isAvailable, ingredient) => {
      if (isAvailable) {
        available.push(ingredient);
      }
    });
    return available;
  }

  // Using spoonacularId, generates csv
  getAvailableIngredientById(): string {
    let available: number[] = [];
    this.ingredientAvailability.forEach((isAvailable, ingredient) => {
      if (isAvailable) {
        available.push(ingredient.ingredientSpoonacularId);
      }
    });
    return available.toString();
  }

  // Using csv string of spoonacularId
  setAvailableIngredientsById(data :string) {
    let idArray: number[] = [];
    data.split(",").forEach((id) => {
      idArray.push(parseInt(id));
    });
    this.allIngredients.forEach( (ingredient) => {
      if (idArray.includes(ingredient.ingredientSpoonacularId)) {
        this.ingredientAvailability.set(ingredient, true);
      }
    });
  }
  getCountOfAvailableIngredientsInGroup(group: IngredientGroup): number {
    let count = 0;
    group.ingredients.forEach(ingredient => {
      if (this.ingredientAvailability.get(ingredient)) {
        count++;
      }
    });
    return count;
  }


}
