import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { BaseState } from '@shared/state/base.state';
import { Customer, CustomerRequest, CustomerStateModel } from '@models/customer.model';
import { CustomerService } from '@services/customer.service';
import { CustomerActions } from './customer.action';
import { SetLoading } from '@shared/state/loading/loading.actions';

@State<CustomerStateModel>({
  name: 'customer',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  },
})
@Injectable()
export class CustomerState extends BaseState<Customer, CustomerRequest> {
  constructor(private customerService: CustomerService) {
    super(customerService);
  }

  @Selector()
  static getItems(state: CustomerStateModel): Customer[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: CustomerStateModel): Customer | null {
    return state.selectedEntity;
  }

  @Selector()
  static getTrasheds(state: CustomerStateModel): Customer[] {
    return state.filterTrashedItems;
  }

  @Selector()
  static getSelectedItems(state: CustomerStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: CustomerStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: CustomerStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Selector()
  static getTrashedSelectedItems(state: CustomerStateModel) {
    return state.trashedItems.filter((entity) => entity.selected);
  }

  @Selector()
  static areTrashedAllSelected(state: CustomerStateModel) {
    return (
      state.trashedItems.length > 0 &&
      state.trashedItems.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasTrashedSelectedItems(state: CustomerStateModel) {
    return state.trashedItems.some((entity) => entity.selected);
  }

  @Action(CustomerActions.GetAll)
  getAll(ctx: StateContext<CustomerStateModel>, { id }: CustomerActions.GetTrasheds) {
    return this.getItemsAll(ctx, CustomerActions.GetAll.type, id);
  }

  @Action(CustomerActions.GetTrasheds)
  getTrasheds(ctx: StateContext<CustomerStateModel>, { id }: CustomerActions.GetTrasheds) {
    return this.getItemsTrasheds(ctx, CustomerActions.GetTrasheds.type, id);
  }

  @Action(CustomerActions.GetById)
  getByID(ctx: StateContext<CustomerStateModel>, { id }: CustomerActions.GetById) {
    return this.getOne(ctx, id, CustomerActions.GetById.type);
  }

  @Action(CustomerActions.Filters)
  Filters(ctx: StateContext<CustomerStateModel>, { payload, page, columns }: CustomerActions.Filters<Customer>) {
    return super.filtersItems(ctx, CustomerActions.Filters.type, payload, columns, page);
  }

  @Action(CustomerActions.Create)
  create(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.Create) {
    return this.createItem(ctx, payload, CustomerActions.Create.type);
  }

  @Action(CustomerActions.Update)
  update(ctx: StateContext<CustomerStateModel>, { id, payload }: CustomerActions.Update) {
    return this.updateItem(ctx, payload, id, CustomerActions.Update.type);
  }

  @Action(CustomerActions.Delete)
  delete(ctx: StateContext<CustomerStateModel>, { id, del, page }: CustomerActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, CustomerActions.Delete.type, page);
  }

  @Action(CustomerActions.Restore)
  restore(ctx: StateContext<CustomerStateModel>, { id }: CustomerActions.Restore) {
    return this.restoreItem(ctx, id, CustomerActions.Restore.type);
  }

  @Action(CustomerActions.DeleteAll)
  deleteAll(ctx: StateContext<CustomerStateModel>, { payload, del, active, page, id }: CustomerActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, CustomerActions.DeleteAll.type, page, id);
  }

  @Action(CustomerActions.RestoreAll)
  restoreAll(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, CustomerActions.RestoreAll.type);
  }

  @Action(CustomerActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<CustomerStateModel>, { id, page }: CustomerActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(CustomerActions.ToggleAllItems)
  toggleAll(ctx: StateContext<CustomerStateModel>, { selected, page }: CustomerActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(CustomerActions.clearEntity)
  clearItem(ctx: StateContext<CustomerStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(CustomerActions.ClearItemSelection)
  clearSelection(ctx: StateContext<CustomerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(CustomerActions.clearAll)
  clearAll(ctx: StateContext<CustomerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
