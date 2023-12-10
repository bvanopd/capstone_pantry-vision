import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError} from "rxjs";
import { User } from "../model/user";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  getUserListFromDb(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/users/listAll.do");
  }
  getPrivate(): Observable<string> {
    return this.httpClient.get<string>("/api/private");
  }
  getUserPantry(): Observable<any> {
    return this.httpClient.get<string>("/api/user/getPantry.do");
  }
  getUserPantry2(): Observable<any> {
    return this.httpClient.get<string>("/api/user/getPantry2.do");
  }
  setUserPantry(pantry: string): Observable<any> {
    return this.httpClient
      .put("/api/user/setPantry.do", pantry === '' ? [] : pantry)
      .pipe(catchError((error) => { return error; })
    );
  }
  getUserId(): Observable<any> {
    return this.httpClient.get<string>("/api/user/getUserId.do");
  }
}
