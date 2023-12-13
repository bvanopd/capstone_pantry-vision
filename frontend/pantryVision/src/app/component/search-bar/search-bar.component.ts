import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/model/ingredient';
import { Pantry } from 'src/app/model/pantry';
import { PantryService } from 'src/app/service/pantry.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  pantryFormControl = new FormControl();
  pantry: Pantry;
  autoCompleteList: Ingredient[]
  pantrySub: Subscription;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  constructor(private pantryService: PantryService) { }

  ngOnInit() {
      this.pantrySub = this.pantryService.currentPantry.subscribe(pantry => this.pantry = pantry);

      // when user types something in input, the value changes will come through this
      this.pantryFormControl.valueChanges.subscribe(userInput => {
          this.autoCompleteFilterList(userInput);
      })
  }

  ngOnDestry() {
    this.pantrySub.unsubscribe();
  }

  private autoCompleteFilterList(input: string) {
      let ingredientList = this.filterIngredientList(input)
      this.autoCompleteList = ingredientList;
  }

  // this is where filtering the data happens according to you typed value
  filterIngredientList(val: string) {
      if (val === '' || val === null) {
          return [];
      }
      return this.pantry.allIngredients.filter(s => s.ingredientName.toLowerCase().indexOf(val.toLowerCase()) != -1);
  }

  displayFunc(ingredient: Ingredient) {
      let k = ingredient ? ingredient.ingredientName : ingredient;
      return k;
  }

  toggleIngredient(event: { source: { value: Ingredient; }; }) {
    var ingredient = event.source.value;
    if (ingredient) {
        this.pantry.toggleAvailability(ingredient);
        this.pantryService.updatePantryService(this.pantry);
    }
    this.focusInput();
  }

  focusInput() {
      this.autocompleteInput.nativeElement.focus();
      this.autocompleteInput.nativeElement.value = '';
  }
}
