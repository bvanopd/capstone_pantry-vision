import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import { User } from "../model/user";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }
  getUserListFromDb(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/users/listAll.do");
  }
  addUserToDb(user: User): Observable<User> {
    return this.httpClient.post<User>("/api/users/add", user);
  }
  getPrivate(): Observable<String> { 
    return this.httpClient.get<String>("/api/private"); // Will return a nice message if authenticated
  }
}
