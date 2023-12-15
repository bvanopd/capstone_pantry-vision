import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Observable} from 'rxjs';
import { GroceryList } from '../model/groceryList';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GroceryService {

  private groceryListsSubject = new BehaviorSubject<GroceryList[]>([]);
  groceryLists$ = this.groceryListsSubject.asObservable();
  MAX_LISTS = 20;

  constructor(private httpClient: HttpClient) {
  }
  async updateGroceryLists() {
    this.getGroceryLists().pipe(first()).subscribe((groceryLists: GroceryList[]) => {
      this.groceryListsSubject.next(groceryLists);
    });
  }
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

  deleteGroceryList(groceryListId: number): Observable<any> {
    return this.httpClient.put("/api/groceryList/delete.do", groceryListId);
  }

  addToGroceryList(ingredientName: string, listId: number): Observable<any> {
    const data = JSON.stringify({"ingredientName": ingredientName, "listId": listId});
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put("/api/groceryList/addItem.do", data, { headers });
  }

  removeFromGroceryList(ingredientName: string, listId: number): Observable<any> {
    const data = JSON.stringify({"ingredientName": ingredientName, "listId": listId});
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put("/api/groceryList/removeItem.do", data, { headers });
  }
}
