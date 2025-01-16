import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceHomeComponent } from './maintenance-home.component';

describe('MaintenanceHomeComponent', () => {
  let component: MaintenanceHomeComponent;
  let fixture: ComponentFixture<MaintenanceHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
