import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../model/user";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  // This method makes an HTTP GET request to the API endpoint and returns an Observable
  getUserList(): Observable<User[]>{
    return this.httpClient.get<User[]>("/users/listAll.do");
    // As an observable, subscribing to this method will trigger the HTTP request, the observable
    // will emit its data, and then the subscribe() callback will do something with the data
  }

}
