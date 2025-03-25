import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBreakComponent } from './list-break.component';

describe('ListBreakComponent', () => {
  let component: ListBreakComponent;
  let fixture: ComponentFixture<ListBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBreakComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
