import { Component } from '@angular/core';
import { Ingredient } from "../../model/ingredient";
import { Pantry } from "../../model/pantry";
import { IngredientService } from "../../service/ingredient.service";
import { lastValueFrom } from "rxjs";


@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss']
})
export class PantryComponent {

  public pantry: Pantry;

  constructor(private ingredientService: IngredientService) {
  }

  ngOnInit() {
    this.initializePantry();
  }

  private initializePantry() {
    this.pantry = new Pantry();
    this.getIngredientGroups()
      .then(complete =>
        // Add ingredients from each list to the master list of ingredients
        this.populateIngredientMasterList())
      .then(complete => {
        // Initialize the availability of each ingredient to false
        this.pantry.allIngredients.forEach(ingredient => {
          this.pantry.ingredientAvailability.set(ingredient, false);
        });
      });
  }

  async getIngredientGroups() {
    // TODO make sure we're handling data streams correctly
    const groups = await lastValueFrom(this.ingredientService.getIngredientGroupsFromDb());

    this.pantry.ingredientGroups = await Promise.all(groups.map(async group => {
      // TODO make a separate group for "Pantry Essentials" because they don't have a group Id
      const ingredients = await lastValueFrom(this.ingredientService.getIngredientsByGroupId(group.ingredientGroupId));

      return {
        description: group.ingredientGroupDescription,
        ingredients: ingredients.map(ingredient => {
          return new Ingredient(ingredient.ingredientName, ingredient.ingredientSpoonacularId, ingredient.ingredientGroupId, ingredient.ingredientEssentialFlg);
        })
      };
    }));
  }

  async populateIngredientMasterList() {
    // TODO get all ungrouped ingredients and also get them in the master list
    this.pantry.ingredientGroups.forEach(group => {
      const ingredientsInGroup = group.ingredients;
      this.pantry.allIngredients.push(...ingredientsInGroup);
    });
  }

  public toggleIngredient(ingredient: Ingredient) {
    this.pantry.toggleAvailability(ingredient);
  }
}
