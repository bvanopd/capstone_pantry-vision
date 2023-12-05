export class Recipe {
  id: number;
  image: string;
  title: string;
  usedIngredients: string[];

  constructor(recipeData: any) {
    this.id = recipeData.id;
    this.image = recipeData.image;
    this.title = recipeData.title;
    this.usedIngredients = recipeData.usedIngredients.map((ingredient: { name: any; }) => ingredient.name);
  }
}
