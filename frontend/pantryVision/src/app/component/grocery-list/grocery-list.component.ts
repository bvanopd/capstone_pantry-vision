import { Component, Input } from '@angular/core';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { GroceryList } from 'src/app/model/groceryList';
import { IngredientService } from 'src/app/service/ingredient.service';
import { PantryService } from 'src/app/service/pantry.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  @Input() groceryList: GroceryList;
}
