import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { BaseState } from '@shared/state/base.state';
import { Shift, ShiftStateModel } from '@models/shift.model';
import { ShiftService } from '@services/shift.service';
import { ShiftActions } from './shift.action';

@State<ShiftStateModel>({
  name: 'shift',
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
export class ShiftState extends BaseState<Shift> {
  constructor(private shiftService: ShiftService) {
    super(shiftService);
  }

  @Selector()
  static getItems(state: ShiftStateModel): Shift[] {
    return state.filteredItems;
  }

  @Selector()
  static getTrasheds(state: ShiftStateModel): Shift[] {
    return state.trashedItems;
  }

  @Selector()
  static getSelectedItems(state: ShiftStateModel) {
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

  @Action(ShiftActions.GetAll)
  getAll(ctx: StateContext<ShiftStateModel>) {
    return this.getItems(ctx, ShiftActions.GetAll.type);
  }

  @Action(ShiftActions.GetDeletes)
  getDeletes(ctx: StateContext<ShiftStateModel>) {
    return this.getItemsDelete(ctx, ShiftActions.GetDeletes.type);
  }

  @Action(ShiftActions.GetById)
  getByID(
    ctx: StateContext<ShiftStateModel>,
    { id }: ShiftActions.GetById
  ) {
    return this.getOne(ctx, id, ShiftActions.GetById.type);
  }

  @Action(ShiftActions.GetAllFilter)
  getAllFilter(
    ctx: StateContext<ShiftStateModel>,
    { searchTerm, columns }: ShiftActions.GetAllFilter<Shift>
  ) {
    return this.getItemsFilter(ctx, searchTerm, columns);
  }

  @Action(ShiftActions.countDeletes)
  countTrasheds(ctx: StateContext<ShiftStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(ShiftActions.Create)
  create(
    ctx: StateContext<ShiftStateModel>,
    { payload }: ShiftActions.Create
  ) {
    return this.createItem(ctx, payload, ShiftActions.Create.type);
  }

  @Action(ShiftActions.Update)
  update(
    ctx: StateContext<ShiftStateModel>,
    { id, payload }: ShiftActions.Update
  ) {
    return this.updateItem(ctx, payload, id, ShiftActions.Update.type);
  }

  @Action(ShiftActions.Delete)
  delete(
    ctx: StateContext<ShiftStateModel>,
    { id, del }: ShiftActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, ShiftActions.Delete.type);
  }

  @Action(ShiftActions.Restore)
  restore(
    ctx: StateContext<ShiftStateModel>,
    { id }: ShiftActions.Restore
  ) {
    return this.restoreItem(ctx, id, ShiftActions.Restore.type);
  }

  @Action(ShiftActions.DeleteAll)
  deleteAll(
    ctx: StateContext<ShiftStateModel>,
    { payload, del }: ShiftActions.DeleteAll
  ) {
    return this.deleteAllItem(
      ctx,
      payload,
      del,
      ShiftActions.DeleteAll.type
    );
  }

  @Action(ShiftActions.RestoreAll)
  restoreAll(
    ctx: StateContext<ShiftStateModel>,
    { payload }: ShiftActions.RestoreAll
  ) {
    return this.restoreAllItem(ctx, payload, ShiftActions.RestoreAll.type);
  }

  @Action(ShiftActions.ToggleItemSelection)
  toggleSelection(
    ctx: StateContext<ShiftStateModel>,
    { id }: ShiftActions.ToggleItemSelection
  ) {
    return this.toggleSelectionItem(ctx, id);
  }

  @Action(ShiftActions.ToggleAllItems)
  toggleAll(
    ctx: StateContext<ShiftStateModel>,
    { selected }: ShiftActions.ToggleAllItems
  ) {
    return this.toggleAllItem(ctx, selected);
  }
}
