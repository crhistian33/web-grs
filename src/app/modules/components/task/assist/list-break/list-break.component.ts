import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataListComponent } from '@shared/components/data-list/data-list.component';
import { FilterDateComponent } from '@shared/components/filter-date/filter-date.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TitlePageComponent } from '@shared/components/title-page/title-page.component';
import { UpdateAssistComponent } from '../modals/update-assist/update-assist.component';
import { MONTHS, PARAMETERS, ROUTES, TITLES, TYPES } from '@shared/utils/constants';
import { filterConfig } from '@shared/models/filter-config.model';
import { DataListColumn } from '@shared/models/dataListColumn.model';
import { Assist } from '@models/assist.model';
import { HeaderDatalistService } from '@shared/services/header-datalist.service';
import { Observable } from 'rxjs';
import { AssistState } from '@state/assist/assist.state';
import { Store } from '@ngxs/store';
import { FilterStateModel } from '@shared/models/filter.model';
import { AssistActions } from '@state/assist/assist.actions';

@Component({
  selector: 'app-list-break',
  imports: [CommonModule, TitlePageComponent, FilterComponent, FilterDateComponent, DataListComponent, ModalComponent, UpdateAssistComponent],
  templateUrl: './list-break.component.html',
  styleUrl: './list-break.component.scss'
})
export class ListBreakComponent {
  private readonly store = inject(Store);
  private readonly headerDataListService = inject(HeaderDatalistService);

  readonly title: string = TITLES.ASSISTS;
  readonly titleModal: string = TITLES.ASSIST;
  readonly page: string = TYPES.ASSIST;
  readonly routeGo: string = ROUTES.ASSIST_LIST;
  readonly titleRouteGo: string = TITLES.ASSIST_TITULARS;
  readonly config: filterConfig = {
    search: true,
  }
  readonly columns: DataListColumn<Assist>[] = this.headerDataListService.getHeaderDataList(PARAMETERS.ASSIST_BREAKS);
  readonly colFiltered: string[] = this.headerDataListService.getFiltered(PARAMETERS.ASSIST_BREAKS);

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
      ? new AssistActions.GetAllBreaks({ date_from, date_to, company_id: companyId})
      : new AssistActions.GetAllBreaks({ date_from, date_to});

    this.store.dispatch(action);
  }

  filtersData(filter: FilterStateModel) {
    this.store.dispatch(new AssistActions.Filters(filter, TYPES.LIST, this.colFiltered));
  }

  onChangeValueDay(event: any) {
    const { id, date } = event;
    this.store.dispatch(new AssistActions.GetAssistDay(id, date));
    this.isOpen = true;
  }

  handleClose() {
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.store.dispatch(AssistActions.clearAll);
  }
}
