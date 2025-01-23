import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Worker } from '@models/worker.model';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { AssignmentState } from '@state/assignment/assignment.state';
import { UnitActions } from '@state/unit/unit.actions';
import { Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modalreassign',
  imports: [CommonModule, NgIconsModule, ReactiveFormsModule],
  templateUrl: './modalreassign.component.html',
  styleUrl: './modalreassign.component.scss'
})
export class ModalreassignComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly sweetAlertService = inject(SweetalertService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  @Output() closeEvent = new EventEmitter<void>();
  @Output() updateEvent = new EventEmitter<void>();
  @Input() isOpen: boolean = false;
  @Input() workerReassign!: Worker;

  unitshifts: any;
  reassignForm: FormGroup = this.fb.group({
    unit_shift_id: ['', Validators.required],
    user_id: [1],
  });

  unitshiftsActive$: Observable<any> = this.store.select(AssignmentState.getUnitShiftsActive);

  ngOnInit(): void {
    this.store.dispatch(new AssignmentActions.GetAll);
    //this.store.dispatch(new UnitActions.GetAllToShift)
    // .pipe(take(1))
    // .subscribe((data: any)=> {
    //   this.unitshifts = data.unit.entities;
    // })
  }

  onReassign(item: any) {
    console.log('ITEM', item)
    if(this.reassignForm.valid) {
      const assignment = item.assignments[0];
      const old_unitshift = parseInt(assignment.unitshift.id);
      const unitshift = parseInt(this.reassignForm.get('unit_shift_id')?.value);
      const validated = old_unitshift === unitshift ? false : true;

      if(!validated) {
        this.notificationService.show(['Está intentando reasignar a la misma unidad turno.'], 'error');
      } else {
        this.store.dispatch(new AssignmentActions.Update(assignment.id, this.reassignForm.getRawValue()))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            const result = response.assignment.result;
            this.sweetAlertService.confirmSuccess(
              result.title,
              result.message,
              () => {
                this.closeEvent.emit();
                this.updateEvent.emit();
              }
            );
          },
          error: (error) => {
            this.notificationService.show(
              error.error?.message || 'Error occurred',
              'error',
              5000
            );
          },
        });
      }
    } else {
      this.reassignForm.markAllAsTouched();
    }

  }

  closeModal() {
    this.closeEvent.emit();
  }
}
