export class Recipe {
  id: number;
  image: string;
  title: string;
  missedIngredientCount: number;
  missedIngredients: string[];

  constructor(recipeData: any) {
    this.id = recipeData.id;
    this.image = recipeData.image;
    this.title = recipeData.title;
    this.missedIngredientCount = recipeData.missedIngredientCount;
    this.missedIngredients = recipeData.missedIngredients.map((ingredient: { name: any; }) => ingredient.name);
  }
}
