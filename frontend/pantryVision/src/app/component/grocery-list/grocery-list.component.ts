import { Component, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GroceryList } from 'src/app/model/groceryList';
import { IngredientService } from 'src/app/service/ingredient.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  @Input() groceryList: GroceryList

  constructor(private ingredientService: IngredientService) {}

  async getIngredientNameById(id: number) {
    let ingredient = await lastValueFrom(this.ingredientService.getIngredientById(id));
    console.log(ingredient)
    console.log(ingredient.ingredientName)
    return ingredient.ingredientName;
      // return this.ingredientService.getIngredientById(id).subscribe();
  }
}
