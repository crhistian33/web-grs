import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssistComponent } from './update-assist.component';

describe('UpdateAssistComponent', () => {
  let component: UpdateAssistComponent;
  let fixture: ComponentFixture<UpdateAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAssistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
