import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailsComponent } from './recipe-details.component';

describe('RecipeDetailsComponentComponent', () => {
  let component: RecipeDetailsComponent;
  let fixture: ComponentFixture<RecipeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeDetailsComponent]
    });
    fixture = TestBed.createComponent(RecipeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
