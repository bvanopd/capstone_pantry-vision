import { Component } from '@angular/core';
import { Ingredient } from "../../model/ingredient";
import { Pantry } from "../../model/pantry";
import { IngredientService } from "../../service/ingredient.service";
import { firstValueFrom, lastValueFrom, Subscription } from "rxjs";
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/service/user.service';
import { IngredientGroup } from "../../model/ingredientGroup";
import { PantryService } from 'src/app/service/pantry.service';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent {

  public pantry: Pantry;
  pantrySub: Subscription;

  constructor(private ingredientService: IngredientService, 
              private userService: UserService, 
              private pantryService: PantryService, 
              private auth: AuthService) {}

  pantryUpdated: boolean = true;
  scheduleUpdate: boolean;

  isLoading: boolean = true;
  authenticated: boolean;

  readonly INGREDIENTS_TO_SHOW: number = 12;

  ngOnInit() {
    this.initializePantry();
    this.updatePantryService();
    this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => {
      this.pantry = pantry;
      this.setFlagsToUnsaved();
    });
  }

  ngOnDestroy() {
    this.pantrySub.unsubscribe();
  }

  private async authorizeAndLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      });
      let authSub = this.auth.isAuthenticated$.subscribe(async status => {
        this.authenticated = status;
        if (!this.isLoading && this.authenticated) {
          let pantryObj = await firstValueFrom(this.userService.getUserPantry());
          this.pantry.setAvailableIngredientsById(pantryObj.pantry);
          authSub.unsubscribe();
          resolve();
        }
        else if (!this.isLoading && !this.authenticated) {
          authSub.unsubscribe();
          resolve();
        }
      });
    });
  }

  private async initializePantry() {
    this.pantry = new Pantry();
    this.scheduleUpdate = false;
    await this.getIngredientGroups();
    await this.populateIngredientMasterList();
    this.pantry.allIngredients.forEach(ingredient => {
      this.pantry.ingredientAvailability.set(ingredient, false);
    });
    await this.authorizeAndLoad();

    setInterval(() => this.savePantry(), 4000);
  }

  async getIngredientGroups() {
    // TODO make sure we're handling data streams correctly
    const groups = await lastValueFrom(this.ingredientService.getIngredientGroupsFromDb());

    this.pantry.ingredientGroups = await Promise.all(groups.map(async group => {
      // TODO make a separate group for "Pantry Essentials" because they don't have a group Id
      const ingredients = await lastValueFrom(this.ingredientService.getIngredientsByGroupId(group.ingredientGroupId));
      const description = group.ingredientGroupDescription;
      const groupIngredients = ingredients.map(ingredient => {
        return new Ingredient(ingredient.ingredientName, ingredient.ingredientSpoonacularId, ingredient.ingredientGroupId, ingredient.ingredientEssentialFlg);
      })

      const ingredientGroup = new IngredientGroup(description, groupIngredients, this.INGREDIENTS_TO_SHOW);
      return ingredientGroup;
    }));
  }

  async populateIngredientMasterList() {
    // TODO get all ungrouped ingredients and also get them in the master list
    const pantryEssentialsGroup = this.pantry.ingredientGroups.find(group => group.description === 'Pantry Essentials');
    this.pantry.ingredientGroups.forEach(group => {
      const ingredientsInGroup = group.ingredients;
      this.pantry.allIngredients.push(...ingredientsInGroup);

      // Build the essentials group here since we're iterating through all of the groups
      ingredientsInGroup.forEach(ingredient => {
        if (ingredient.ingredientEssentialFlg) {
          pantryEssentialsGroup?.ingredients.push(ingredient);
        }
      })
    });
  }

  public toggleIngredient(ingredient: Ingredient) {
    this.pantry.toggleAvailability(ingredient);
    this.updatePantryService;
    this.setFlagsToUnsaved();
  }

  public setFlagsToUnsaved() {
    this.scheduleUpdate = true;
    this.pantryUpdated = false;
  }

  private updatePantryService() {
    this.pantryService.updatePantryService(this.pantry);
  }

  public savePantry() {
    if (this.scheduleUpdate && this.authenticated) {
      this.scheduleUpdate = false;
      this.userService.setUserPantry(this.pantry.getAvailableIngredientById()).subscribe(
        (response) => {
          if (response.message) {
            this.pantryUpdated = true;
          } else {
            this.scheduleUpdate = true;
          }
        }
      );
    }
  }

}
