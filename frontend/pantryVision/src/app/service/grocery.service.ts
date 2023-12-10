import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

}
