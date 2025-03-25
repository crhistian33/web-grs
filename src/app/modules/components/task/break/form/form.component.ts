import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UnitShift } from '@models/unitshift.model';
import { Worker } from '@models/worker.model';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { CalendarAction } from '@shared/state/calendar/calendar.actions';
import { CalendarState } from '@shared/state/calendar/calendar.state';
import { MONTHS, ROUTES, WEEKDAYS } from '@shared/utils/constants';
import { InassistAction } from '@state/inassist/inassist.actions';
import { InassistState } from '@state/inassist/inassist.state';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { UserState } from '@state/user/user.state';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, NgIconsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly sweetAlertService = inject(SweetalertService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  @Input() id!: number;
  @Input() month!: number;
  myFormBreak = this.fb.group({
    unit_shift_id: [null as number | null, Validators.required],
    month_id: [null as number | null, Validators.required],
    items: this.fb.array([])
  });

  get items() {
    return this.myFormBreak.get('items') as FormArray;
  }

  months = MONTHS.map((name, index) => ({ name, index }));
  weekdays = WEEKDAYS;
  route_list = ROUTES.BREAK_LIST;
  calendarDays: (Date | null)[] = [];
  selectedItemId: number | null = null;
  selectedDays: { [key: string]: number } = {};
  isChange: boolean = false;
  prevUnitShift!: number;
  prevMonth!: number;
  currentYear: number = new Date().getFullYear();

  selectedItemId$: Observable<number | null> = this.store.select(CalendarState.selectedItemId);
  selectedDays$: Observable<{ [key: string]: number }> = this.store.select(CalendarState.selectedDays);
  unitshifts$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getAssigneds);
  workers$: Observable<Worker[]> = this.store.select(WorkerState.getAssigns);
  inassistDays$: Observable<any[]> = this.store.select(InassistState.getDays);

  constructor() {
    this.selectedItemId$.pipe(takeUntil(this.destroy$)).subscribe(id => (this.selectedItemId = id));
    this.selectedDays$.pipe(takeUntil(this.destroy$)).subscribe(days => (this.selectedDays = days));
  }

  ngOnInit() {
    this.initializeCompanies();
    this.setupFormValueChanges();
    this.setupInassistDaysSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(new CalendarAction.ClearCalendar());
  }

  private initializeCompanies(): void {
    if(this.id && this.month) {
      this.store.dispatch(new WorkerActions.GetUnitShiftID(this.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.store.select(state => state.worker)
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe(worker => {
              if (worker) {
                this.selectedUnitUpdate(worker.unitshiftId);
              }
            });
        },
        error: (error) => {
          this.notificationService.show(error.error?.message || 'Error occurred', 'error', 5000);
        }
      });
      this.selectedMonthUpdate(this.month);
    }
    const companies = this.store.selectSnapshot(UserState.getCurrentUserCompanies);
    if (companies) {
      if (companies.length > 1) {
        this.store.dispatch(new UnitShiftActions.GetAll());
      } else {
        this.store.dispatch(new UnitShiftActions.GetAll(companies[0].id));
      }
    }
  }

  private setupFormValueChanges(): void {
    this.items.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isChange = true;
    });

    this.myFormBreak.get('unit_shift_id')?.valueChanges.pipe(
      filter(value => value !== null && value !== undefined),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(initialValue => {
      this.prevUnitShift = initialValue;
    });

    // Track initial month value
    this.myFormBreak.get('month_id')?.valueChanges.pipe(
      filter(value => value !== null && value !== undefined),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(initialValue => {
      this.prevMonth = initialValue;
    });
  }

  private setupInassistDaysSubscription(): void {
    this.inassistDays$.pipe(
      takeUntil(this.destroy$),
      filter(days => days && days.length > 0)
    ).subscribe(days => {
      this.items.clear();

      days.forEach(day => {
        this.store.dispatch(new CalendarAction.SelectItem(day.worker_id));
        const formattedDate = new Date(day.start_date).toISOString().split('T')[0];

        const newItem = this.fb.group({
          worker_id: day.worker_id,
          start_date: formattedDate,
          month: day.month,
          unitshift_id: this.myFormBreak.get('unit_shift_id')?.value || this.prevUnitShift
        });
        this.items.push(newItem);

        this.store.dispatch(new CalendarAction.ToggleDaySelection(formattedDate));
      });

      if(this.id && this.month)
        this.store.dispatch(new CalendarAction.SelectItem(+this.id));
      else
        this.store.dispatch(new CalendarAction.SelectItem(0));

      this.isChange = false;
    });
  }

  onSubmit(redirect: boolean) {
    console.log(this.items.value);
    if (this.myFormBreak.valid) {
      if (this.items.length > 0) {
        this.store.dispatch(new InassistAction.CreateMany(this.items.value))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: any) => {
              this.handleSuccess(response, redirect);
            },
            error: (error) => {
              this.notificationService.show(error.error?.message || 'Error occurred', 'error', 5000);
            }
          });
      } else {
        this.notificationService.show(['Seleccione dias de descanso'], 'error');
      }
    } else {
      this.notificationService.show(['Seleccione la unidad de trabajo y el mes'], 'error');
    }
  }

  private handleSuccess(response: any, redirect: boolean): void {
    const result = response.inassist.result;
    this.sweetAlertService.confirmSuccess(
      result.title,
      result.message,
      () => {
        if (redirect) {
          this.router.navigate([this.route_list]);
        } else {
          this.resetCalendarState();
        }
      }
    );
  }

  selectedUnits(id: number) {
    console.log('selectedUnits', id);
    const unitShiftID = id;

    if (!this.isChange) {
      this.store.dispatch(new WorkerActions.GetByUnitshift(unitShiftID));
      this.prevUnitShift = unitShiftID;

      // If month is already selected, fetch inassist days for the new unit and selected month
      const currentMonth = this.myFormBreak.get('month_id')?.value;
      if (currentMonth !== null && currentMonth !== undefined) {
        this.store.dispatch(new InassistAction.GetDaysUnit(unitShiftID, currentMonth));
      }

      return;
    }

    this.sweetAlertService.confirmAction(
      'Datos por guardar',
      'Hay datos por guardar. Si no lo guarda se perderán. ¿Desea continuar?',
      'Aceptar',
      () => {
        this.resetCalendarState(() => {
          this.prevUnitShift = unitShiftID;
          this.store.dispatch(new WorkerActions.GetByUnitshift(unitShiftID));

          // If month is already selected, fetch inassist days for the new unit and selected month
          const currentMonth = this.myFormBreak.get('month_id')?.value;
          if (currentMonth !== null && currentMonth !== undefined) {
            this.store.dispatch(new InassistAction.GetDaysUnit(unitShiftID, currentMonth));
            this.generateCalendar(currentMonth);
          }
        });
      },
      () => {
        this.myFormBreak.get('unit_shift_id')?.setValue(this.prevUnitShift, { emitEvent: false });
      }
    );
  }

  selectedUnitUpdate(id: number) {
    this.store.dispatch(new CalendarAction.ClearCalendar());
    this.store.dispatch(new WorkerActions.GetByUnitshift(id));
    this.prevUnitShift = id;

    const currentMonth = this.myFormBreak.get('month_id')?.value;
    if (currentMonth !== null && currentMonth !== undefined) {
      this.store.dispatch(new InassistAction.GetDaysUnit(id, currentMonth));
    }
    this.myFormBreak.get('unit_shift_id')?.setValue(+id, { emitEvent: false });
  }

  selectedMonth(index: number) {
    console.log('selectedMonth', index);
    const monthID = index;
    if (!this.isChange) {
      this.store.dispatch(new CalendarAction.ClearCalendar());
      this.items.clear();
      this.generateCalendar(monthID);
      this.prevMonth = monthID;

      // Get unit shift ID
      const unitShiftID = this.myFormBreak.get('unit_shift_id')?.value;
      if (unitShiftID !== null && unitShiftID !== undefined) {
        this.store.dispatch(new InassistAction.GetDaysUnit(unitShiftID, monthID));
      }

      return;
    }

    this.sweetAlertService.confirmAction(
      'Datos por guardar',
      'Hay datos por guardar. Si no lo guarda se perderán. ¿Desea continuar?',
      'Aceptar',
      () => {
        this.resetCalendarState(() => {
          this.generateCalendar(monthID);
          this.prevMonth = monthID;

          // Get unit shift ID and fetch data if available
          const unitShiftID = this.myFormBreak.get('unit_shift_id')?.value;
          if (unitShiftID !== null && unitShiftID !== undefined) {
            this.store.dispatch(new InassistAction.GetDaysUnit(unitShiftID, monthID));
          }
        });
      },
      () => {
        this.myFormBreak.get('month_id')?.setValue(this.prevMonth, { emitEvent: false });
      }
    );
  }

  selectedMonthUpdate(index: number) {
    this.store.dispatch(new CalendarAction.ClearCalendar());
    this.generateCalendar(index);
    this.prevMonth = index;
    this.myFormBreak.get('month_id')?.setValue(+index, { emitEvent: false });

    const unitShiftID = this.myFormBreak.get('unit_shift_id')?.value;
    if (unitShiftID !== null && unitShiftID !== undefined) {
      this.store.dispatch(new InassistAction.GetDaysUnit(unitShiftID, index));
    }
  }

  private resetCalendarState(action?: () => void): void {
    this.store.dispatch(new CalendarAction.ClearCalendar());
    this.items.clear();
    //this.myFormBreak.reset();
    this.isChange = false;
    if (action) {
      action();
    }
  }

  selectItem(id: number) {
    this.store.dispatch(new CalendarAction.SelectItem(id));
  }

  isDaySelected(day: Date): number {
    if (!day) return 0;

    const formattedDate = day.toISOString().split('T')[0];
    const selectDayId = this.selectedDays[formattedDate];

    if (!selectDayId) {
      return 0;
    }

    if (selectDayId === this.selectedItemId) {
      return 1;
    }

    return 2;
  }

  generateCalendar(month: number) {
    const firstDay = new Date(this.currentYear, month, 1);
    const lastDay = new Date(this.currentYear, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const totalDays = daysInMonth + startingDay;
    const numArray = totalDays <= 35 ? 35 : 42;

    this.calendarDays = Array(numArray).fill(null).map((_, index) => {
      const dayOfMonth = index - startingDay + 1;
      return dayOfMonth > 0 && dayOfMonth <= daysInMonth
        ? new Date(this.currentYear, month, dayOfMonth)
        : null;
    });
  }

  onDateSelect(day: Date) {
    if (!day) return;

    if (!this.selectedItemId) {
      this.notificationService.show(['Seleccione un trabajador'], 'error');
      return;
    }

    const formattedDate = day.toISOString().split('T')[0];
    const selectDayId = this.selectedDays[formattedDate];

    this.store.dispatch(new CalendarAction.ToggleDaySelection(formattedDate));

    if (!selectDayId) {
      const newItem = this.fb.group({
        worker_id: this.selectedItemId,
        start_date: formattedDate,
        month: +this.prevMonth,
        unitshift_id: this.prevUnitShift
      });
      this.items.push(newItem);
    }

    if (selectDayId === this.selectedItemId) {
      const index = this.items.value.findIndex((item: any) =>
        item.start_date === formattedDate && item.worker_id === this.selectedItemId
      );
      if (index !== -1) {
        this.items.removeAt(index);
      }
    }
  }

  getInitialName(fullName: string): string {
    if (!fullName) return '';

    const arrName = fullName.split(' ');
    if (arrName.length < 3) return '';

    const name = arrName[2];
    return name ? name.charAt(0) : '';
  }
}
