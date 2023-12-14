import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipeDetails } from "../kitchen/kitchen.component";
import { SavedRecipeService } from 'src/app/service/savedRecipe.service';
import { GroceryService } from "../../service/grocery.service";
import { GroceryList } from "../../model/groceryList";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-recipe-details-modal',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent {
  groceryLists: GroceryList[];
  selectedGroceryListId = new FormControl(27);
  constructor(
    private savedRecipeService: SavedRecipeService,
    private groceryService: GroceryService,
    public dialogRef: MatDialogRef<RecipeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetails
  ) { }


  async ngOnInit() {
    this.groceryService.groceryLists$.subscribe((data: any[]) => {
      this.groceryLists = data;
    });
  }

  save() {
    this.savedRecipeService.saveRecipe(this.data.recipe.getSavedRecipe()).subscribe();
    this.data.isSaved = true;
  }

  unsave() {
    if(confirm("Are you sure you want to unsave this recipe?")) {
      this.savedRecipeService.unsaveRecipe(this.data.recipe.getSavedRecipe()).subscribe();
      this.data.isSaved = false;
    }
  }

  async addIngredientToGroceryList(ingredient: string) {
    let groceryList = this.groceryLists.find(list => list.groceryListId === this.selectedGroceryListId.value);
    if (groceryList?.groceryListId) {
      await this.groceryService.addIngredient(ingredient, groceryList.groceryListId).toPromise();
      await this.groceryService.updateGroceryLists();
      this.selectedGroceryListId.setValue(groceryList.groceryListId);
    }
  }

  changeSelectedGroceryList(value: number) {
    this.selectedGroceryListId.setValue(+value);
  }

  isIngredientInList(ingredient: string): boolean {
    let selectedList = this.groceryLists.find(list => list.groceryListId === this.selectedGroceryListId.value);
    if (selectedList) {
      return selectedList.groceryListIngredients.includes(ingredient);
    }
    return false;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
