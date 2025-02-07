import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavfloatComponent } from './navfloat.component';

describe('NavfloatComponent', () => {
  let component: NavfloatComponent;
  let fixture: ComponentFixture<NavfloatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavfloatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavfloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
