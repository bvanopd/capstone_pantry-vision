import { Component } from '@angular/core';
import { PantryService } from '../../service/pantry.service';
import { Subscription } from 'rxjs';
import { Pantry } from '../../model/pantry';
import { Ingredient } from '../../model/ingredient';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent {
  
  public pantry: Pantry;
  pantrySub: Subscription;

  constructor(private pantryService: PantryService, private auth: AuthService) {}

  user$ = this.auth.user$;

  ngOnInit() {
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);
  }

  ngOnDestroy() {
    this.pantrySub.unsubscribe();
  }

  getAvailableIngredientsArray(): Ingredient[] {
    return Array.from(this.pantry.ingredientAvailability.entries())
      .filter(([ingredient, isAvailable]) => isAvailable)
      .map(([ingredient]) => ingredient);
  }
  
}
