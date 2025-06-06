import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSheetComponent } from './filter-sheet.component';

describe('FilterSheetComponent', () => {
  let component: FilterSheetComponent;
  let fixture: ComponentFixture<FilterSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
