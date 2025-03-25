import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnitShift } from '@models/unitshift.model';
import { Worker } from '@models/worker.model';
import { WorkerAssignment } from '@models/workerassignment.model';
import { NgIconsModule } from '@ng-icons/core';
import { Store } from '@ngxs/store';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { AssignmentState } from '@state/assignment/assignment.state';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { WorkerAssignmentActions } from '@state/workerassignment/workerassignment.actions';
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
  @Input() workerReassign!: WorkerAssignment;

  unitshifts: any;
  reassignForm: FormGroup = this.fb.group({
    'worker_id': ['', Validators.required],
    'assignment_id': ['', Validators.required],
  });

  unitshiftsActive$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getAssigneds);

  ngOnInit(): void {
    this.store.dispatch(new AssignmentActions.GetAll);
    this.store.dispatch(new UnitShiftActions.GetAll);
  }

  onReassign(item: any) {
    this.reassignForm.get('worker_id')?.patchValue(item.worker.id);
    if(this.reassignForm.valid) {
      const id = item.id;
      const current_id = parseInt(item.assignment.id);
      const assignment_id = parseInt(this.reassignForm.get('assignment_id')?.value);
      const validated = current_id === assignment_id ? false : true;

      if(!validated) {
        this.notificationService.show(['Está intentando reasignar a la misma unidad turno.'], 'error');
      } else {
        this.store.dispatch(new WorkerAssignmentActions.Update(id, this.reassignForm.getRawValue()))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            const result = response.workerassignment.result;
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
          complete: () => {
            this.resetForm();
          }
        });
      }
    } else {
      this.reassignForm.markAllAsTouched();
    }

  }

  private resetForm() {
    this.reassignForm.reset();
    this.reassignForm.get('assignment_id')?.setValue('');
  }

  closeModal() {
    this.closeEvent.emit();
  }
}
