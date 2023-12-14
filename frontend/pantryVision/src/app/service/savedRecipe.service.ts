import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, take} from "rxjs";
import { SavedRecipe } from '../model/savedRecipe';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipeService {
  constructor(private httpClient: HttpClient) {}

  private savedRecipeSource = new BehaviorSubject<SavedRecipe[]>([]);
  currentSavedRecipeList = this.savedRecipeSource.asObservable();

  saveRecipe(recipeToSave: SavedRecipe): Observable<any> {
    let savedRecipes = this.getCurrentSavedRecipes();
    savedRecipes.push(recipeToSave);
    this.savedRecipeSource.next(savedRecipes);
    return this.httpClient
      .put("/api/user/saveRecipe.do", this.getDbString())
      .pipe(catchError((error) => { return error; })
    );
  }
  unsaveRecipe(recipeToRemove: SavedRecipe): Observable<any> {
    let savedRecipes = this.getCurrentSavedRecipes();
    savedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeToRemove.id);
    this.savedRecipeSource.next(savedRecipes);
    return this.httpClient
      .put("/api/user/saveRecipe.do", savedRecipes.length > 0 ? this.getDbString() : [])
      .pipe(catchError((error) => { return error; })
    );
  }
  setSavedRecipes(savedRecipes: SavedRecipe[]) {
    this.savedRecipeSource.next(savedRecipes);
  }
  loadSavedRecipes(): Observable<any> {
    return this.httpClient.get<string>("/api/user/getSavedRecipes.do");
  }
  isSaved(id: number): boolean {
    return this.getCurrentSavedRecipes().filter(recipe => recipe.id === id).length == 1;
  }
  private getCurrentSavedRecipes(): SavedRecipe[] {
    let savedRecipes: SavedRecipe[] = [];
    this.currentSavedRecipeList.pipe(take(1)).subscribe(val => savedRecipes = val).unsubscribe();
    return savedRecipes;
  }
  private getDbString(): string {
    let dbString = "";
    this.getCurrentSavedRecipes().forEach((recipe) => {
      dbString += recipe.getDbString() + ",";
    })
    return dbString.substring(0, dbString.length-1);
  }
}