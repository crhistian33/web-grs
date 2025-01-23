import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalreassignComponent } from './modalreassign.component';

describe('ModalreassignComponent', () => {
  let component: ModalreassignComponent;
  let fixture: ComponentFixture<ModalreassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalreassignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalreassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
