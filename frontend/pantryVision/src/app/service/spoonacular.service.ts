import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiKey = 'def8229a9b0c4d2a99e8d5e212d56d27';
  private apiUrl = 'https://api.spoonacular.com';

  constructor(private http: HttpClient) { }

  // Api calls limited to 2 recipes for now until we get an idea of how many points we can play with

  getRecipesByIngredients(ingredients: string[]): Observable<any> {
    const ingredientsString = ingredients.join(',+');
    return this.http.get(`${this.apiUrl}/recipes/findByIngredients?ingredients=${ingredientsString}&number=2&apiKey=${this.apiKey}`);
  }

}
