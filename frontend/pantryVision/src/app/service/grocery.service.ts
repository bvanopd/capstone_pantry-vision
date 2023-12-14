import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { GroceryList } from '../model/groceryList';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  constructor(private httpClient: HttpClient) {
  }

  groceryLists: GroceryList[];
  MAX_LISTS = 20;

  getGroceryListById(groceryListId: number): Observable<GroceryList[]> {
    return this.httpClient.get<GroceryList[]>(`/api/groceryList/groceryListById.do?groceryListId=${groceryListId}`);
  }

  getGroceryLists(): Observable<any> {
    return this.httpClient.get<string>("/api/groceryList/getAll.do");
  }

  addGroceryList(groceryListTitle: string): Observable<any> {
    return this.httpClient.put("/api/groceryList/add.do", groceryListTitle);
  }

  deleteGroceryList(groceryListId: number): Observable<any> {    
    return this.httpClient.delete(`/api/groceryList/delete.do?groceryListId=${groceryListId}`);
  }

  addToGroceryList(ingredientName: string): Observable<any> {
    return this.httpClient.put("/api/groceryList/addItem.do", ingredientName);
  }
  
  async setupGroceryLists() {
    this.getGroceryLists().subscribe((data: GroceryList[]) => {
      this.groceryLists = data.map(list => GroceryList.fromDataObject(list))
    })
  }

}
