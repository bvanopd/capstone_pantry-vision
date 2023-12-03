import { Component, HostListener } from '@angular/core';
import { Ingredient } from "../../model/ingredient";
import { Pantry } from "../../model/pantry";
import { IngredientService } from "../../service/ingredient.service";
import { firstValueFrom, lastValueFrom, take } from "rxjs";
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/service/user.service';
import { IngredientGroup } from "../../model/ingredientGroup";


@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent {

  public pantry: Pantry;
  plainTextToggle: Boolean = false;

  constructor(private ingredientService: IngredientService, private userService: UserService, private auth: AuthService) { }

  scheduleUpdate: boolean;
  isLoading: boolean;
  authenticated: boolean;

  ngOnInit() {
    this.initializePantry();
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

    setInterval(() => this.savePantry(), 5000);
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

      const ingredientGroup = new IngredientGroup(description, groupIngredients, 12);
      return ingredientGroup;
    }));
  }

  getAvailableIngredientsArray(): Ingredient[] {
    return Array.from(this.pantry.ingredientAvailability.entries())
      .filter(([ingredient, isAvailable]) => isAvailable)
      .map(([ingredient]) => ingredient);
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
    this.scheduleUpdate = true;
  }

  public savePantry() {
    if (this.scheduleUpdate && this.authenticated) {
      this.scheduleUpdate = false;
      this.userService.setUserPantry(this.pantry.getAvailableIngredientById());
    }
  }

}
