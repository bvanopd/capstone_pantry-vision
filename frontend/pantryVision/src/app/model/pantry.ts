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

  get listOfAvailableIngredients(): Ingredient[] {
    let available = new Array<Ingredient>;
    this.ingredientAvailability.forEach((isAvailable, ingredient) => {
      if (isAvailable) {
        available.push(ingredient);

      }
    });
    return available;
  }

  set listOfAvailableIngredients(ingredients: Ingredient[]) {
    ingredients.forEach( (ingredient) => {
      this.ingredientAvailability.set(ingredient, true);
    });
  }
}
