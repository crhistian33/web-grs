import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { BaseState } from '@shared/state/base.state';
import { Shift, ShiftRequest, ShiftStateModel } from '@models/shift.model';
import { ShiftService } from '@services/shift.service';
import { ShiftActions } from './shift.action';

@State<ShiftStateModel>({
  name: 'shift',
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
export class ShiftState extends BaseState<Shift, ShiftRequest> {
  constructor(private shiftService: ShiftService) {
    super(shiftService);
  }

  @Selector()
  static getItems(state: ShiftStateModel): Shift[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: ShiftStateModel): Shift | null {
    return state.selectedEntity;
  }

  @Selector()
  static getTrasheds(state: ShiftStateModel): Shift[] {
    return state.filterTrashedItems;
  }

  @Selector()
  static getSelectedItems(state: ShiftStateModel) {
    console.log('Selected shifts', state.entities.filter((entity) => entity.selected));
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: ShiftStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: ShiftStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Selector()
  static getTrashedSelectedItems(state: ShiftStateModel) {
    return state.trashedItems.filter((entity) => entity.selected);
  }

  @Selector()
  static areTrashedAllSelected(state: ShiftStateModel) {
    return (
      state.trashedItems.length > 0 &&
      state.trashedItems.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasTrashedSelectedItems(state: ShiftStateModel) {
    return state.trashedItems.some((entity) => entity.selected);
  }

  @Action(ShiftActions.GetAll)
  getAll(ctx: StateContext<ShiftStateModel>) {
    return this.getItems(ctx, ShiftActions.GetAll.type);
  }

  @Action(ShiftActions.GetTrasheds)
  getTrasheds(ctx: StateContext<ShiftStateModel>) {
    return this.getItemsTrasheds(ctx, ShiftActions.GetTrasheds.type);
  }

  @Action(ShiftActions.GetById)
  getByID(ctx: StateContext<ShiftStateModel>, { id }: ShiftActions.GetById) {
    return this.getOne(ctx, id, ShiftActions.GetById.type);
  }

  @Action(ShiftActions.Filters)
  Filters(ctx: StateContext<ShiftStateModel>, { payload, page, columns }: ShiftActions.Filters<Shift>) {
    return super.filtersItems(ctx, ShiftActions.Filters.type, payload, columns, page);
  }

  @Action(ShiftActions.Create)
  create(ctx: StateContext<ShiftStateModel>, { payload }: ShiftActions.Create) {
    return this.createItem(ctx, payload, ShiftActions.Create.type);
  }

  @Action(ShiftActions.Update)
  update(ctx: StateContext<ShiftStateModel>, { id, payload }: ShiftActions.Update) {
    return this.updateItem(ctx, payload, id, ShiftActions.Update.type);
  }

  @Action(ShiftActions.Delete)
  delete(ctx: StateContext<ShiftStateModel>, { id, del, page }: ShiftActions.Delete) {
    return this.deleteItem(ctx, id, del, ShiftActions.Delete.type, page);
  }

  @Action(ShiftActions.Restore)
  restore(ctx: StateContext<ShiftStateModel>, { id }: ShiftActions.Restore) {
    return this.restoreItem(ctx, id, ShiftActions.Restore.type);
  }

  @Action(ShiftActions.DeleteAll)
  deleteAll(ctx: StateContext<ShiftStateModel>, { payload, del, active, page }: ShiftActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, ShiftActions.DeleteAll.type, page);
  }

  @Action(ShiftActions.RestoreAll)
  restoreAll(ctx: StateContext<ShiftStateModel>, { payload }: ShiftActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, ShiftActions.RestoreAll.type);
  }

  @Action(ShiftActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<ShiftStateModel>, { id, page }: ShiftActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(ShiftActions.ToggleAllItems)
  toggleAll(ctx: StateContext<ShiftStateModel>, { selected, page }: ShiftActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(ShiftActions.clearEntity)
  clearItem(ctx: StateContext<ShiftStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(ShiftActions.ClearItemSelection)
  clearSelection(ctx: StateContext<ShiftStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(ShiftActions.clearAll)
  clearAll(ctx: StateContext<ShiftStateModel>) {
    return this.clearAllItems(ctx);
  }
}
