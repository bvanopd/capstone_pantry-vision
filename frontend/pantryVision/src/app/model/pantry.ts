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

}
