import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Company } from '@models/company.model';
import { Customer } from '@models/customer.model';
import { Shift } from '@models/shift.model';
import { TypeWorker } from '@models/type-worker.model';
import { Unit } from '@models/unit.model';
import { NgIconsModule } from '@ng-icons/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngxs/store';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterStateModel } from '@shared/models/filter.model';
import { FilterActions } from '@shared/state/filter/filter.actions';
import { FilterState } from '@shared/state/filter/filter.state';
import { CompanyActions } from '@state/company/company.actions';
import { CompanyState } from '@state/company/company.state';
import { CustomerActions } from '@state/customer/customer.action';
import { CustomerState } from '@state/customer/customer.state';
import { ShiftActions } from '@state/shift/shift.action';
import { ShiftState } from '@state/shift/shift.state';
import { TypeWorkerActions } from '@state/typeworker/typeworker.action';
import { TypeworkerState } from '@state/typeworker/typeworker.state';
import { UnitActions } from '@state/unit/unit.actions';
import { UnitState } from '@state/unit/unit.state';
import { combineLatest, distinctUntilChanged, map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgIconsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        height: 0,
        opacity: 0
      })),
      transition('void => *', [
        animate('300ms ease-in-out', style({
          height: '*',
          opacity: 1
        }))
      ]),
      transition('* => void', [
        animate('300ms ease-in-out', style({
          height: 0,
          opacity: 0
        }))
      ])
    ])
  ]
})
export class FilterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  @Input() config!: filterConfig;
  @Output() filters = new EventEmitter<FilterStateModel>();
  filterForm: FormGroup;
  isExpanded: boolean = true;
  isShown = false;

  companies$: Observable<Company[]> = this.store.select(CompanyState.getItems);
  typeworkers$: Observable<TypeWorker[]> = this.store.select(TypeworkerState.getItems);
  filteredCustomers$: Observable<Customer[]>;
  filteredUnits$: Observable<Unit[]>;
  filteredShifts$: Observable<Shift[]>;

  constructor() {
    this.filterForm = this.fb.group({
      companyId: [null],
      customerId: [null, { disabled: true }],
      unitId: [null, { disabled: true }],
      shiftId: [null, { disabled: true }],
      typeworkerId: [null, { disabled: true }],
      fromDate: [null],
      toDate: [null],
      searchTerm: [null],
    });

    this.filteredCustomers$ = combineLatest([
      this.store.select(CustomerState.getItems),
      this.store.select(FilterState.getSelectedCompanyId)
    ]).pipe(
      map(([customers, selectedCompanyId]) => {
        if (selectedCompanyId)
          return customers.filter(customer => customer.company.id === selectedCompanyId);
        return customers;
      })
    );

    this.filteredUnits$ = combineLatest([
      this.store.select(UnitState.getItems),
      this.store.select(FilterState.getSelectedCompanyId),
      this.store.select(FilterState.getSelectedCustomerId),
      this.filteredCustomers$
    ]).pipe(
      map(([units, selectedCompanyId, selectedCustomerId, filteredCustomers]) => {
        if (selectedCustomerId) {
          return units.filter(unit => unit.customer.id === selectedCustomerId);
        }
        if (selectedCompanyId) {
          const customerIds = filteredCustomers.map(customer => customer.id);
          return units.filter(unit => customerIds.includes(Number(unit.customer.id)));
        }
        return units;
      })
    );

    this.filteredShifts$ = combineLatest([
      this.store.select(ShiftState.getItems),
      this.store.select(FilterState.getSelectedUnitId),
      this.filteredUnits$
    ]).pipe(
      map(([shifts, selectedUnitId, filteredUnits]) => {
        if (selectedUnitId) {
          const unit = filteredUnits.find(unit => unit.id === selectedUnitId);
          return unit?.shifts || [];
        }
        return shifts;
      })
    );
  }

  toggle() {
    this.isShown = !this.isShown;
  }

  ngOnInit() {
    if(this.config.company)
      this.store.dispatch(new CompanyActions.GetAll);
    if(this.config.customer)
      this.store.dispatch(new CustomerActions.GetAll);
    if(this.config.unit)
      this.store.dispatch(new UnitActions.GetAll);
    if(this.config.shift)
      this.store.dispatch(new ShiftActions.GetAll);
    if(this.config.typeworker)
      this.store.dispatch(new TypeWorkerActions.GetAll);
  }

  onChangeSelect(event: any, field: string) {
    switch(field) {
      case 'company':
        this.onSelectCompany(event);
        break;
      case 'customer':
        this.onSelectCustomer(event);
        break;
      case 'unit':
        this.onSelectUnit(event);
        break;
      case 'shift':
        this.onSelectShift(event);
        break;
      case 'typeworker':
        this.onSelectTypeWorker(event);
        break;
    }
  }

  onSelectCompany(event: any) {
    const id = event?.id || null;
    this.filterForm.patchValue({
      companyId: id,
      customerId: null,
      unitId: null,
      shiftId: null,
    });
    if (id) {
      this.store.dispatch(new FilterActions.SelectCompany(id));
    } else {
      this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    }
    this.filters.emit(this.filterForm.value);
  }

  onSelectCustomer(event: any) {
    const id = event?.id || null;
    this.filterForm.patchValue({
      customerId: id,
      unitId: null,
      shiftId: null,
    });
    if (id) {
      this.store.dispatch(new FilterActions.SelectCustomer(id));
    } else {
      this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    }
    this.filters.emit(this.filterForm.value);
  }

  onSelectUnit(event: any) {
    const id = event?.id || null;
    this.filterForm.patchValue({
      unitId: id,
      shiftId: null
    });
    if (id) {
      this.store.dispatch(new FilterActions.SelectUnit(id));
    } else {
      this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    }
    this.filters.emit(this.filterForm.value);
  }

  onSelectShift(event: any) {
    const id = event?.id || null;
    this.filterForm.patchValue({
      shiftId: id,
    });
    if (id) {
      this.store.dispatch(new FilterActions.SelectShift(id));
    } else {
      this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    }
    this.filters.emit(this.filterForm.value);
  }

  onSelectTypeWorker(event: any) {
    const id = event?.id || null;
    this.filterForm.patchValue({
      typeworkerId: id,
    });
    if (id) {
      this.store.dispatch(new FilterActions.SelectTypeWorker(id));
    } else {
      this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    }
    this.filters.emit(this.filterForm.value);
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filterForm.patchValue({
      searchTerm: searchTerm
    });
    this.filters.emit(this.filterForm.value);
  }

  onClear() {
    this.filterForm.reset();
    this.store.dispatch(new FilterActions.updateFilters(this.filterForm.value));
    this.filters.emit(this.filterForm.value);
  }

  expandedSearch() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
