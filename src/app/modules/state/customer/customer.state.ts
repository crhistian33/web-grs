import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { BaseState } from '@shared/state/base.state';
import { Customer, CustomerStateModel } from '@models/customer.model';
import { CustomerService } from '@services/customer.service';
import { CustomerActions } from './customer.action';
import { SetLoading } from '@shared/state/loading/loading.actions';

@State<CustomerStateModel>({
  name: 'customer',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  },
})
@Injectable()
export class CustomerState extends BaseState<Customer> {
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
    return state.trashedItems;
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

  @Action(CustomerActions.GetAll)
  getAll(ctx: StateContext<CustomerStateModel>) {
    return this.getItems(ctx, CustomerActions.GetAll.type);
  }

  @Action(CustomerActions.GetDeletes)
  getDeletes(ctx: StateContext<CustomerStateModel>) {
    return this.getItemsDelete(ctx, CustomerActions.GetDeletes.type);
  }

  @Action(CustomerActions.GetById)
  getByID(
    ctx: StateContext<CustomerStateModel>,
    { id }: CustomerActions.GetById
  ) {
    return this.getOne(ctx, id, CustomerActions.GetById.type);
  }

  @Action(CustomerActions.countDeletes)
  countTrasheds(ctx: StateContext<CustomerStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(CustomerActions.Filters)
  Filters(ctx: StateContext<CustomerStateModel>, { payload, columns }: CustomerActions.Filters<Customer>) {
    return super.filtersItems(ctx, CustomerActions.Filters.type, payload, columns);
  }

  @Action(CustomerActions.Create)
  create(
    ctx: StateContext<CustomerStateModel>,
    { payload }: CustomerActions.Create
  ) {
    return this.createItem(ctx, payload, CustomerActions.Create.type);
  }

  @Action(CustomerActions.Update)
  update(
    ctx: StateContext<CustomerStateModel>,
    { id, payload }: CustomerActions.Update
  ) {
    return this.updateItem(ctx, payload, id, CustomerActions.Update.type);
  }

  @Action(CustomerActions.Delete)
  delete(
    ctx: StateContext<CustomerStateModel>,
    { id, del }: CustomerActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, CustomerActions.Delete.type);
  }

  @Action(CustomerActions.Restore)
  restore(
    ctx: StateContext<CustomerStateModel>,
    { id }: CustomerActions.Restore
  ) {
    return this.restoreItem(ctx, id, CustomerActions.Restore.type);
  }

  @Action(CustomerActions.DeleteAll)
  deleteAll(
    ctx: StateContext<CustomerStateModel>,
    { payload, del, active }: CustomerActions.DeleteAll
  ) {
    return this.deleteAllItem(
      ctx,
      payload,
      del,
      active,
      CustomerActions.DeleteAll.type
    );
  }

  @Action(CustomerActions.RestoreAll)
  restoreAll(
    ctx: StateContext<CustomerStateModel>,
    { payload }: CustomerActions.RestoreAll
  ) {
    return this.restoreAllItem(ctx, payload, CustomerActions.RestoreAll.type);
  }

  @Action(CustomerActions.ToggleItemSelection)
  toggleSelection(
    ctx: StateContext<CustomerStateModel>,
    { id }: CustomerActions.ToggleItemSelection
  ) {
    return this.toggleSelectionItem(ctx, id);
  }

  @Action(CustomerActions.ToggleAllItems)
  toggleAll(
    ctx: StateContext<CustomerStateModel>,
    { selected }: CustomerActions.ToggleAllItems
  ) {
    return this.toggleAllItem(ctx, selected);
  }

  @Action(CustomerActions.clearEntity)
  clearItem(ctx: StateContext<CustomerStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(CustomerActions.ClearItemSelection)
  clearSelected(ctx: StateContext<CustomerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(CustomerActions.clearAll)
  clearAll(ctx: StateContext<CustomerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
