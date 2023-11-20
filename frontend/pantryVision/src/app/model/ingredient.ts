export class Ingredient {

  // TODO rework class properties
  // I had to rename them to align with the back end class because for some reason it wasn't mapping correctly
  ingredientName: string;
  ingredientSpoonacularId: number;
  ingredientGroupId: number;
  ingredientEssentialFlg: boolean;


  constructor(name: string, apiId: number, groupId: number, pantryEssential: boolean) {
    this.ingredientName = name;
    this.ingredientSpoonacularId = apiId;
    this.ingredientGroupId = groupId;
    this.ingredientEssentialFlg = pantryEssential;
  }
}
