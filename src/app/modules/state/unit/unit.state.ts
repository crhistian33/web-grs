import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { BaseState } from '@shared/state/base.state';
import { Unit, UnitStateModel } from '@models/unit.model';
import { UnitService } from '@services/unit.service';
import { UnitActions } from './unit.actions';
import { SetLoading } from '@shared/state/loading/loading.actions';
import { tap } from 'rxjs';

@State<UnitStateModel>({
  name: 'unit',
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
export class UnitState extends BaseState<Unit> {
  constructor(private unitService: UnitService) {
    super(unitService);
  }

  @Selector()
  static getItems(state: UnitStateModel): Unit[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: UnitStateModel): Unit | null {
    return state.selectedEntity;
  }

  @Selector()
  static getTrasheds(state: UnitStateModel): Unit[] {
    return state.trashedItems;
  }

  @Selector()
  static getSelectedItems(state: UnitStateModel) {
    return state.entities.filter(entity => entity.selected);
  }

  @Selector()
  static areAllSelected(state: UnitStateModel) {
    return state.entities.length > 0 && state.entities.every(entity => entity.selected);
  }

  @Selector()
  static hasSelectedItems(state: UnitStateModel) {
    return state.entities.some(entity => entity.selected);
  }

  @Action(UnitActions.GetAll)
  getAll(ctx: StateContext<UnitStateModel>) {
    return this.getItems(ctx, UnitActions.GetAll.type)
  }

  @Action(UnitActions.GetDeletes)
  getDeletes(ctx: StateContext<UnitStateModel>) {
    return this.getItemsDelete(ctx, UnitActions.GetDeletes.type)
  }

  @Action(UnitActions.GetById)
  getByID(ctx: StateContext<UnitStateModel>, { id }: UnitActions.GetById) {
    return this.getOne(ctx, id, UnitActions.GetById.type)
  }

  @Action(UnitActions.countDeletes)
  countTrasheds(ctx: StateContext<UnitStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(UnitActions.Filters)
  Filters(ctx: StateContext<UnitStateModel>, { payload, columns }: UnitActions.Filters<Unit>) {
    return super.filtersItems(ctx, UnitActions.Filters.type, payload, columns);
  }

  @Action(UnitActions.Create)
  create(ctx: StateContext<UnitStateModel>, { payload }: UnitActions.Create) {
    return this.createItem(ctx, payload, UnitActions.Create.type)
  }

  @Action(UnitActions.Update)
  update(ctx: StateContext<UnitStateModel>, { id, payload }: UnitActions.Update) {
    return this.updateItem(ctx, payload, id, UnitActions.Update.type)
  }

  @Action(UnitActions.Delete)
  delete(ctx: StateContext<UnitStateModel>, { id, del }: UnitActions.Delete) {
    return this.deleteItem(ctx, id, del, UnitActions.Delete.type)
  }

  @Action(UnitActions.Restore)
  restore(ctx: StateContext<UnitStateModel>, { id }: UnitActions.Restore) {
    return this.restoreItem(ctx, id, UnitActions.Restore.type)
  }

  @Action(UnitActions.DeleteAll)
  deleteAll(ctx: StateContext<UnitStateModel>, { payload, del, active }: UnitActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, UnitActions.DeleteAll.type)
  }

  @Action(UnitActions.RestoreAll)
  restoreAll(ctx: StateContext<UnitStateModel>, { payload }: UnitActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, UnitActions.RestoreAll.type)
  }

  @Action(UnitActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<UnitStateModel>, { id }: UnitActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id)
  }

  @Action(UnitActions.ToggleAllItems)
  toggleAll(ctx: StateContext<UnitStateModel>, { selected }: UnitActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected)
  }

  @Action(UnitActions.GetAllToShift)
  getUnitToShift(ctx: StateContext<UnitStateModel>) {
    return this.unitService.GetAllToShift().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
      })
    );
  }

  @Action(UnitActions.clearEntity)
  clearItem(ctx: StateContext<UnitStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(UnitActions.ClearItemSelection)
  clearSelected(ctx: StateContext<UnitStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(UnitActions.clearAll)
  clearAll(ctx: StateContext<UnitStateModel>) {
    return this.clearAllItems(ctx);
  }
}
