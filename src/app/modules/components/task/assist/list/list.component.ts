import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Assist } from '@models/assist.model';
import { Store } from '@ngxs/store';
import { ActionsComponent } from '@shared/components/actions/actions.component';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { FilterDateComponent } from '@shared/components/filter-date/filter-date.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { filterConfig } from '@shared/models/filter-config.model';
import { FilterStateModel } from '@shared/models/filter.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { NotificationService } from '@shared/services/notification.service';
import { SweetalertService } from '@shared/services/sweetalert.service';
import { MESSAGES, MONTHS, PARAMETERS, ROUTES, TITLES, TYPES } from '@shared/utils/constants';
import { AssistActions } from '@state/assist/assist.actions';
import { AssistState } from '@state/assist/assist.state';
import { Observable, Subject, take } from 'rxjs';
import { UpdateAssistComponent } from '../modals/update-assist/update-assist.component';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TitlePageComponent, DataListComponent, FilterComponent, FilterDateComponent, ModalComponent, UpdateAssistComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly sweetalertService = inject(SweetalertService);
  private readonly headerDataListService = inject(HeaderDatalistService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroy$ = new Subject<void>();

  readonly title: string = TITLES.ASSISTS;
  readonly titleModal: string = TITLES.ASSIST;
  readonly page: string = TYPES.ASSIST;
  readonly routeGo: string = ROUTES.ASSIST_LIST_BREAKS;
  readonly titleRouteGo: string = TITLES.ASSIST_BREAKS;
  readonly typeworker: number = 1;
  readonly config: filterConfig = {
    search: true,
    company: true,
    customer: true,
    unit: true,
    shift: true,
  }
  readonly columns: DataListColumn<Assist>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.ASSIST);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.ASSIST);

  titleDays!: string;
  isOpen: boolean = false;
  assists$: Observable<Assist[]> = this.store.select(AssistState.getItems);

  ngOnInit(): void {
    const today = new Date();
    const month = MONTHS.find((_, index) => index === today.getMonth());
    this.titleDays = month ? month : '';
  }

  filterDateAction(event: any) {
    const { date_from, date_to, companyId } = event;

    const action = companyId
      ? new AssistActions.GetAll({ date_from, date_to, company_id: companyId})
      : new AssistActions.GetAll({ date_from, date_to});

    this.store.dispatch(action);
  }

  onChangeValueDay(event: any) {
    const { id, date } = event;
    this.store.dispatch(new AssistActions.GetAssistDay(id, date));
    this.isOpen = true;
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new AssistActions.Filters(filter, TYPES.LIST, this.colFiltered));
  }


  handleClose() {
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.store.dispatch(new AssistActions.clearAll);
  }
}
