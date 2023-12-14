import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroceryList } from '../model/groceryList';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private groceryListsSubject = new BehaviorSubject<GroceryList[]>([]);
  groceryLists$ = this.groceryListsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  updateGroceryLists() {
    this.getGroceryLists().subscribe((groceryLists: GroceryList[]) => {
      this.groceryListsSubject.next(groceryLists);
    });
  }

  // We need to map the response objects so we can get the property names correct
  getGroceryLists(): Observable<GroceryList[]> {
    return this.httpClient.get<any[]>("/api/groceryList/getAll.do").pipe(
      map(lists => lists.map(list => {
        return {
          groceryListId: list.id,
          groceryListTitle: list.groceryListTitle,
          groceryListIngredients: list.groceryListItems,
          groceryListUserId: list.userId
        };
      }))
    );
  }

  addGroceryList(groceryListTitle: string): Observable<any> {
    return this.httpClient.put("/api/groceryList/add.do", groceryListTitle);
  }

  removeGroceryList(groceryListTitle: string): Observable<any> {
    return this.httpClient.put("/api/groceryList/remove.do", groceryListTitle);
  }

  addIngredient(ingredientName: string, groceryListId: number): Observable<any> {

    const body = {
      ingredientName: ingredientName,
      groceryListId: groceryListId
    };
    return this.httpClient.put("/api/groceryList/addItem.do", body);
  }

  removeIngredient(ingredientName: string, groceryListId: number): Observable<any> {

    const body = {
      ingredientName: ingredientName,
      groceryListId: groceryListId
    };
    return this.httpClient.put("/api/groceryList/removeItem.do", body);
  }
}
