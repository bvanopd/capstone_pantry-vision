import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ingredient } from "../model/ingredient";

// Interface to define the shape of an ingredient group
// I don't think we need a whole class for this, just a definition for the description
interface IngredientGroup {
  ingredientGroupId: number;
  ingredients: Ingredient[];
  ingredientGroupDescription: string;
}
@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  constructor(private httpClient: HttpClient) {
  }

  getIngredientListFromDb(): Observable<Ingredient[]> {
    return this.httpClient.get<Ingredient[]>("/api/ingredients/groupedIngredients.do");
  }

  getIngredientGroupsFromDb(): Observable<IngredientGroup[]> {
    return this.httpClient.get<[]>("/api/ingredients/listIngredientGroups.do");
  }

  getIngredientsByGroupId(groupId: number): Observable<Ingredient[]> {
    return this.httpClient.get<Ingredient[]>(`/api/ingredients/ingredientsByGroupId.do?groupId=${groupId}`);
  }

  getIngredientById(ingredientId: number): Observable<Ingredient> {
    return this.httpClient.get<Ingredient>(`/api/ingredients/ingredientById.do?ingredientId=${ingredientId}`);
  }
}
