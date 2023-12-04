import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pantry } from '../model/pantry';

@Injectable({
  providedIn: 'root'
})
export class PantryService {

  private pantrySource = new BehaviorSubject(new Pantry);
  currentPantry = this.pantrySource.asObservable();
  
  constructor() { }

  updatePantryService(pantry: Pantry) {
    this.pantrySource.next(pantry);
  }
  
}
