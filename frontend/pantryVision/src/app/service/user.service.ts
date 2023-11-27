import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";
import { Ingredient } from '../model/ingredient';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  getUserListFromDb(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/users/listAll.do");
  }
  getUserPantry(): Observable<string> {
    return this.httpClient.get<string>("/api/user/getPantry.do");
  }
  setUserPantry(pantry: Ingredient[]): void {
    this.httpClient.put("/api/user/setPantry.do", pantry).subscribe(() => console.log("pantry saved"));
  }
  getPrivate(): Observable<string> {
    return this.httpClient.get<string>("/api/private");
  }
}
