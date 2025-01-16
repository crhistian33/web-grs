import { Component, Input, Output, EventEmitter, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DataTableComponent } from '../../../../../shared/components/data-table/data-table.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { PARAMETERS, TITLES, TYPES } from '@shared/utils/constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { Store } from '@ngxs/store';
import { AssignmentActions } from '@state/assignment/assignment.actions';
import { map, Observable } from 'rxjs';
import { Assignment } from '@models/assignment.model';
import { AssignmentState } from '@state/assignment/assignment.state';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { FilterStateModel } from '@shared/models/filter.model';
import { filterConfig } from '@shared/models/filter-config.model';
import { Worker } from '@models/worker.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, FilterComponent, DataListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private store = inject(Store);
  private headerDataListService = inject(HeaderDatalistService);

  title: string = TITLES.ASSIGNMENTS;
  page: string = TYPES.LIST;
  assignments: Assignment[] = [];
  filterAssignments: Assignment[] = [];
  config: filterConfig = {
    company: true,
    customer: true,
    unit: true,
    shift: true,
  }
  columns: DataListColumn<Assignment>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.ASSIGNMENT);
  nestedColumns: DataListColumn<Worker>[] = [
    { key: 'name', label: 'Nombres y apellidos', type: 'text', filtered: true, },
    { key: 'dni', label: 'DNI', type: 'text', filtered: true, },
  ];

  assignments$: Observable<Assignment[]> = this.store.select(AssignmentState.getItems);

  getWorkers = (assignment: Assignment) => assignment.workers;

  ngOnInit() {
    this.store.dispatch(new AssignmentActions.GetAll);
    // this.inData = this.columns.find(item => item.type === 'models');
    // if(this.inData) {
    //   this.subtable = this.assignments$.pipe(
    //     map(assignments => ({
    //       assignments: assignments.map(assignment => ({
    //         id: assignment.id,
    //         models: assignment.workers.map(worker => ({
    //           name: worker.name,
    //           dni: worker.dni
    //         }))
    //       }))
    //     }))
    //   )
    // }
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new AssignmentActions.DropFilter(filter));
  }
}
