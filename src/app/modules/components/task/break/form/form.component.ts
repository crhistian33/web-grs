import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { UnitShift } from '@models/unitshift.model';
import { Worker } from '@models/worker.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { CalendarAction } from '@shared/state/calendar/calendar.actions';
import { CalendarState } from '@shared/state/calendar/calendar.state';
import { MONTHS, WEEKDAYS } from '@shared/utils/constants';
import { UnitShiftActions } from '@state/unitshift/unitshift.actions';
import { UnitshiftState } from '@state/unitshift/unitshift.state';
import { WorkerActions } from '@state/worker/worker.action';
import { WorkerState } from '@state/worker/worker.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [CommonModule, NgSelectModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly sweetalertService = inject(SweetalertService);

  myFormBreak = this.fb.group({
    items: this.fb.array([])
  });

  get items() {
    return this.myFormBreak.get('items') as FormArray;
  }

  workers = [
    { id: 1, name: 'Juan Perez' },
    { id: 2, name: 'Luis Rojas' },
    { id: 3, name: 'David Villa' },
  ]

  months = MONTHS;
  weekdays = WEEKDAYS;
  calendarDays: (Date | null)[] = [];
  selectedItemId: number | null = null;
  selectedDays: { [key: string]: number } = {};
  isChange: boolean = false;
  initialItem = null;
  initialMonth = null;

  selectedItemId$: Observable<number | null> = this.store.select(CalendarState.selectedtemId);
  selectedDays$: Observable<{ [key: string]: number }> = this.store.select(CalendarState.selectedDays);
  unitshifts$: Observable<UnitShift[]> = this.store.select(UnitshiftState.getAssigns);
  workers$: Observable<Worker[]> = this.store.select(WorkerState.getItems);

  constructor() {
    this.selectedItemId$.subscribe(id => (this.selectedItemId = id));
    this.selectedDays$.subscribe(days => (this.selectedDays = days));
  }

  ngOnInit() {
    this.store.dispatch(new UnitShiftActions.GetAll);
    this.myFormBreak.get('items')?.valueChanges.subscribe(value =>
      this.isChange = true
    );
    this.items.get('unit_shift_id')?.setValue(1, { emitEvent: false });
  }

  selectedUnits(event: any) {
    if(this.isChange)
      this.sweetalertService.confirmAction('Datos por guardar', 'Hay datos por guardar. Si no lo guarda se perderán. ¿Desea continuar?', 'Aceptar', () => {
        this.store.dispatch(new CalendarAction.ClearCalendar);
        this.store.dispatch(new WorkerActions.GetUnassignment(event.id));
        this.myFormBreak.reset();
        this.isChange = false;
        return;
      }, () => {
        if(this.initialItem)
          this.items.get('month')?.setValue(this.initialItem, { emitEvent: false });
      })
    else
      this.store.dispatch(new WorkerActions.GetUnassignment(event.id));

    this.initialItem = event.id;
  }

  selectedMonth(event: any) {
    if(this.isChange)
      this.sweetalertService.confirmAction('Datos por guardar', 'Hay datos por guardar. Si no lo guarda se perderán. ¿Desea continuar?', 'Aceptar', () => {
        this.store.dispatch(new CalendarAction.ClearCalendar);
        this.generateCalendar(event.id, 2025);
        this.myFormBreak.reset();
        this.isChange = false;
        return;
      }, () => {
        if(this.initialMonth)
          this.items.get('unit_shift_id')?.setValue(this.initialItem, { emitEvent: false })
      })
    else
      this.generateCalendar(event.id, 2025);

    this.initialMonth = event.id;
  }

  selectItem(id: number) {
    this.store.dispatch(new CalendarAction.SelectItem(id));
  }

  isDaySelected(day: Date): number {
    const formattedDate = day.toISOString().split('T')[0];
    const selectDayId = this.selectedDays[formattedDate];
    if(!selectDayId)
      return 0
    if(selectDayId === this.selectedItemId)
      return 1
    else
      return 2
  }

  generateCalendar(month: number, year: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const totalDays = daysInMonth + startingDay;
    const numArray = totalDays <= 35 ? 35 : 42;

    this.calendarDays = Array(numArray).fill(null).map((_, index) => {
      const dayOfMonth = index - startingDay + 1;
      return dayOfMonth > 0 && dayOfMonth <= daysInMonth
        ? new Date(year, month, dayOfMonth)
        : null;
    });
  }

  onDateSelect(day: Date, i: number) {
    if (!this.selectedItemId) {
      this.notificationService.show(['Seleccione un trabajador'], 'error');
      return;
    }

    const formattedDate = day.toISOString().split('T')[0];
    const selectDayId = this.selectedDays[formattedDate];
    this.store.dispatch(new CalendarAction.ToggleDaySelection(formattedDate));

    if(!selectDayId) {
      const newItem = this.fb.group({
        unit_shift_id: this.initialItem,
        workerassignment_id: this.selectedItemId,
        month: this.initialMonth,
        start_date: formattedDate,
      });
      this.items.push(newItem);
    }

    if(selectDayId === this.selectedItemId) {
      const index = this.items.value.findIndex((item: any) => item.start_date === formattedDate);
      this.items.removeAt(index);
    }
  }
}
