import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovesComponent } from './removes.component';

describe('RemovesComponent', () => {
  let component: RemovesComponent;
  let fixture: ComponentFixture<RemovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
