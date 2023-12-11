import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipeDetails } from "../kitchen/kitchen.component";

@Component({
  selector: 'app-recipe-details-modal',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<RecipeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDetails
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
