import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  private apiKey = 'def8229a9b0c4d2a99e8d5e212d56d27';
  private apiUrl = 'https://api.spoonacular.com';

  constructor(private http: HttpClient) { }

  // Api calls limited to 15 recipes for now, maybe increase it after we've finished implementations

  getRecipesByIngredients(ingredients: string[]): Observable<any> {
    const ingredientsString = ingredients.join(',+');

    // The api response doesn't seem to be sorting by fewest missing ingredients, so lets do it ourselves
    return this.http.get(`${this.apiUrl}/recipes/findByIngredients?ingredients=${ingredientsString}&number=15&apiKey=${this.apiKey}&sort=min-missing-ingredients`).pipe(
      map((response: any) => {
        response.sort((a: any, b: any) => {
          let aMissing = a.missedIngredients.length;
          let bMissing = b.missedIngredients.length;
          return aMissing - bMissing;
        });
        return response;
      })
    );
  }

  getRecipeInformation(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/${id}/information?apiKey=${this.apiKey}`);
  }

}
