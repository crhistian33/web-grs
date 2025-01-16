import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleHomeComponent } from './module-home.component';

describe('HomeComponent', () => {
  let component: ModuleHomeComponent;
  let fixture: ComponentFixture<ModuleHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
