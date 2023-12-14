import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipeDetails } from "../kitchen/kitchen.component";
import { SavedRecipeService } from 'src/app/service/savedRecipe.service';

@Component({
  selector: 'app-recipe-details-modal',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent {

  constructor(
    private savedRecipeService: SavedRecipeService,
    public dialogRef: MatDialogRef<RecipeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetails
  ) { }

  onClose(): void {
    this.dialogRef.close();
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
}
