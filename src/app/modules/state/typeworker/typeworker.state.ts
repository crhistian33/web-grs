import { Injectable } from '@angular/core';
import { TypeWorker, TypeWorkerStateModel } from '@models/type-worker.model';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { TypeWorkerService } from '@services/type-worker.service';
import { BaseState } from '@shared/state/base.state';
import { TypeWorkerActions } from './typeworker.action';

@State<TypeWorkerStateModel>({
  name: 'typeworker',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  },
})
@Injectable()
export class TypeworkerState extends BaseState<TypeWorker> {
  constructor(private typeWorkerService: TypeWorkerService) {
    super(typeWorkerService);
  }

  @Selector()
  static getItems(state: TypeWorkerStateModel): TypeWorker[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: TypeWorkerStateModel): TypeWorker | null {
    return state.selectedEntity;
  }

  @Selector()
  static getTrasheds(state: TypeWorkerStateModel): TypeWorker[] {
    return state.trashedItems;
  }

  @Selector()
  static getSelectedItems(state: TypeWorkerStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: TypeWorkerStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: TypeWorkerStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Action(TypeWorkerActions.GetAll)
  getAll(ctx: StateContext<TypeWorkerStateModel>) {
    return this.getItems(ctx, TypeWorkerActions.GetAll.type);
  }

  @Action(TypeWorkerActions.GetDeletes)
  getDeletes(ctx: StateContext<TypeWorkerStateModel>) {
    return this.getItemsDelete(ctx, TypeWorkerActions.GetDeletes.type);
  }

  @Action(TypeWorkerActions.GetById)
  getByID(
    ctx: StateContext<TypeWorkerStateModel>,
    { id }: TypeWorkerActions.GetById
  ) {
    return this.getOne(ctx, id, TypeWorkerActions.GetById.type);
  }

  @Action(TypeWorkerActions.countDeletes)
  countTrasheds(ctx: StateContext<TypeWorkerStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(TypeWorkerActions.Filters)
  Filters(ctx: StateContext<TypeWorkerStateModel>, { payload, columns }: TypeWorkerActions.Filters<TypeWorker>) {
    return super.filtersItems(ctx, TypeWorkerActions.Filters.type, payload, columns);
  }

  @Action(TypeWorkerActions.Create)
  create(
    ctx: StateContext<TypeWorkerStateModel>,
    { payload }: TypeWorkerActions.Create
  ) {
    return this.createItem(ctx, payload, TypeWorkerActions.Create.type);
  }

  @Action(TypeWorkerActions.Update)
  update(
    ctx: StateContext<TypeWorkerStateModel>,
    { id, payload }: TypeWorkerActions.Update
  ) {
    return this.updateItem(ctx, payload, id, TypeWorkerActions.Update.type);
  }

  @Action(TypeWorkerActions.Delete)
  delete(
    ctx: StateContext<TypeWorkerStateModel>,
    { id, del }: TypeWorkerActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, TypeWorkerActions.Delete.type);
  }

  @Action(TypeWorkerActions.Restore)
  restore(
    ctx: StateContext<TypeWorkerStateModel>,
    { id }: TypeWorkerActions.Restore
  ) {
    return this.restoreItem(ctx, id, TypeWorkerActions.Restore.type);
  }

  @Action(TypeWorkerActions.DeleteAll)
  deleteAll(
    ctx: StateContext<TypeWorkerStateModel>,
    { payload, del, active }: TypeWorkerActions.DeleteAll
  ) {
    return this.deleteAllItem(
      ctx,
      payload,
      del,
      active,
      TypeWorkerActions.DeleteAll.type
    );
  }

  @Action(TypeWorkerActions.RestoreAll)
  restoreAll(
    ctx: StateContext<TypeWorkerStateModel>,
    { payload }: TypeWorkerActions.RestoreAll
  ) {
    return this.restoreAllItem(ctx, payload, TypeWorkerActions.RestoreAll.type);
  }

  @Action(TypeWorkerActions.ToggleItemSelection)
  toggleSelection(
    ctx: StateContext<TypeWorkerStateModel>,
    { id }: TypeWorkerActions.ToggleItemSelection
  ) {
    return this.toggleSelectionItem(ctx, id);
  }

  @Action(TypeWorkerActions.ToggleAllItems)
  toggleAll(
    ctx: StateContext<TypeWorkerStateModel>,
    { selected }: TypeWorkerActions.ToggleAllItems
  ) {
    return this.toggleAllItem(ctx, selected);
  }

  @Action(TypeWorkerActions.clearEntity)
  clearItem(ctx: StateContext<TypeWorkerStateModel>) {
    return this.clearEntity(ctx);
  }

  // @Action(TypeWorkerActions.ClearItemSelection)
  // clearSelected(ctx: StateContext<TypeWorkerStateModel>) {
  //   return this.clearSelectionItem(ctx);
  // }

  @Action(TypeWorkerActions.clearAll)
  clearAll(ctx: StateContext<TypeWorkerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
