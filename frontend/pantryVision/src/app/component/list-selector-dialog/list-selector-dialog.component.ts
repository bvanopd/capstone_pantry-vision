import { Component, Inject } from '@angular/core';
import { GroceryList } from 'src/app/model/groceryList';
import { GroceryService } from 'src/app/service/grocery.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-list-selector-dialog',
  templateUrl: './list-selector-dialog.component.html',
  styleUrls: ['./list-selector-dialog.component.scss']
})
export class ListSelectorDialogComponent {

  groceryLists: GroceryList[];

  constructor(
    private groceryService: GroceryService,
    public dialog: MatDialogRef<ListSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  async ngOnInit() {
      this.groceryService.groceryLists$.subscribe(groceryLists => {
        this.groceryLists = groceryLists;
      });
  }

  async selectedList(list: GroceryList) {
    await firstValueFrom(this.groceryService.addToGroceryList(this.data, list.groceryListId));
    await this.groceryService.updateGroceryLists();
    this.dialog.close();
  }
}
