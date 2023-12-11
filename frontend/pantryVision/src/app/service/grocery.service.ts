import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { GroceryList } from '../model/groceryList';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  constructor(private httpClient: HttpClient) {
  }

  getGroceryListById(groceryListId: number): Observable<GroceryList[]> {
    return this.httpClient.get<GroceryList[]>(`/api/groceryList/groceryListById.do?groceryListId=${groceryListId}`);
  }

  getGroceryLists(): Observable<any> {
    return this.httpClient.get<string>("/api/groceryList/getAll.do");
  }

  addGroceryList(groceryListTitle: string, groceryListIngredients: string): Observable<any> {
    let thing = this.httpClient.put("/api/groceryList/add.do", groceryListTitle).pipe(catchError((error) => { return error; }));
    return thing;
  }
  
}
