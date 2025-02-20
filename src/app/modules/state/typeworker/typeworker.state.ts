import { Injectable } from '@angular/core';
import { TypeWorker, TypeWorkerRequest, TypeWorkerStateModel } from '@models/type-worker.model';
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
    filterTrashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    loaded: false,
    result: null,
  },
})
@Injectable()
export class TypeworkerState extends BaseState<TypeWorker, TypeWorkerRequest> {
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
    return state.filterTrashedItems;
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

  @Selector()
  static getTrashedSelectedItems(state: TypeWorkerStateModel) {
    return state.trashedItems.filter(entity => entity.selected);
  }

  @Selector()
  static areTrashedAllSelected(state: TypeWorkerStateModel) {
    return state.trashedItems.length > 0 && state.trashedItems.every(entity => entity.selected);
  }

  @Selector()
  static hasTrashedSelectedItems(state: TypeWorkerStateModel) {
    return state.trashedItems.some(entity => entity.selected);
  }

  @Action(TypeWorkerActions.GetAll)
  getAll(ctx: StateContext<TypeWorkerStateModel>) {
    return this.getItems(ctx, TypeWorkerActions.GetAll.type);
  }

  @Action(TypeWorkerActions.GetTrasheds)
  getTrasheds(ctx: StateContext<TypeWorkerStateModel>) {
    return this.getItemsTrasheds(ctx, TypeWorkerActions.GetTrasheds.type);
  }

  @Action(TypeWorkerActions.GetById)
  getByID(
    ctx: StateContext<TypeWorkerStateModel>,
    { id }: TypeWorkerActions.GetById
  ) {
    return this.getOne(ctx, id, TypeWorkerActions.GetById.type);
  }

  @Action(TypeWorkerActions.Filters)
  Filters(ctx: StateContext<TypeWorkerStateModel>, { payload, columns, page }: TypeWorkerActions.Filters<TypeWorker>) {
    return super.filtersItems(ctx, TypeWorkerActions.Filters.type, payload, columns, page);
  }

  @Action(TypeWorkerActions.Create)
  create(ctx: StateContext<TypeWorkerStateModel>, { payload }: TypeWorkerActions.Create) {
    return this.createItem(ctx, payload, TypeWorkerActions.Create.type);
  }

  @Action(TypeWorkerActions.Update)
  update(ctx: StateContext<TypeWorkerStateModel>, { id, payload }: TypeWorkerActions.Update) {
    return this.updateItem(ctx, payload, id, TypeWorkerActions.Update.type);
  }

  @Action(TypeWorkerActions.Delete)
  delete(ctx: StateContext<TypeWorkerStateModel>, { id, del, page }: TypeWorkerActions.Delete) {
    return this.deleteItem(ctx, id, del, TypeWorkerActions.Delete.type, page);
  }

  @Action(TypeWorkerActions.Restore)
  restore(ctx: StateContext<TypeWorkerStateModel>, { id }: TypeWorkerActions.Restore) {
    return this.restoreItem(ctx, id, TypeWorkerActions.Restore.type);
  }

  @Action(TypeWorkerActions.DeleteAll)
  deleteAll(ctx: StateContext<TypeWorkerStateModel>, { payload, del, active, page }: TypeWorkerActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, TypeWorkerActions.DeleteAll.type, page);
  }

  @Action(TypeWorkerActions.RestoreAll)
  restoreAll(ctx: StateContext<TypeWorkerStateModel>, { payload }: TypeWorkerActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, TypeWorkerActions.RestoreAll.type);
  }

  @Action(TypeWorkerActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<TypeWorkerStateModel>, { id, page }: TypeWorkerActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(TypeWorkerActions.ToggleAllItems)
  toggleAll(ctx: StateContext<TypeWorkerStateModel>, { selected, page }: TypeWorkerActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(TypeWorkerActions.clearEntity)
  clearItem(ctx: StateContext<TypeWorkerStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(TypeWorkerActions.ClearItemSelection)
  clearSelection(ctx: StateContext<TypeWorkerStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(TypeWorkerActions.clearAll)
  clearAll(ctx: StateContext<TypeWorkerStateModel>) {
    return this.clearAllItems(ctx);
  }
}
