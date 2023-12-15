import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecipeDetails } from "../kitchen/kitchen.component";
import { SavedRecipeService } from 'src/app/service/savedRecipe.service';
import { GroceryService } from 'src/app/service/grocery.service';
import { ListSelectorDialogComponent } from '../list-selector-dialog/list-selector-dialog.component';
import { GroceryList } from 'src/app/model/groceryList';

@Component({
  selector: 'app-recipe-details-modal',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent {

  groceryLists: GroceryList[];
  chooseGroceryList = false;

  constructor(
    private savedRecipeService: SavedRecipeService,
    private groceryService: GroceryService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RecipeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetails,
    @Inject(MAT_DIALOG_DATA) public list: GroceryList
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.groceryService.groceryLists$.subscribe((data: any[]) => {
      this.groceryLists = data;
    });
  }



  selectList(ingredientName: string): void {
    this.dialog.open(ListSelectorDialogComponent, {
      width: '350px',
      data: ingredientName
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
}
