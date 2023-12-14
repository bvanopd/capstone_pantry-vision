import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectorDialogComponent } from './list-selector-dialog.component';

describe('ListSelectorDialogComponent', () => {
  let component: ListSelectorDialogComponent;
  let fixture: ComponentFixture<ListSelectorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSelectorDialogComponent]
    });
    fixture = TestBed.createComponent(ListSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
