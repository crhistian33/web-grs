import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Center, CenterRequest, CenterStateModel } from '@models/center.model';
import { CenterService } from '@services/center.service';
import { BaseState } from '@shared/state/base.state';
import { CenterActions } from './center.action';

@State<CenterStateModel>({
  name: 'center',
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
export class CenterState extends BaseState<Center, CenterRequest> {
  constructor(private centerService: CenterService) {
    super(centerService);
  }

  @Selector()
  static getItems(state: CenterStateModel): Center[] {
    return state.filteredItems;
  }

  @Selector()
  static getEntity(state: CenterStateModel): Center | null {
    return state.selectedEntity;
  }

  @Selector()
  static getTrasheds(state: CenterStateModel): Center[] {
    return state.filterTrashedItems;
  }

  @Selector()
  static getSelectedItems(state: CenterStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: CenterStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: CenterStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Selector()
  static getTrashedSelectedItems(state: CenterStateModel) {
    return state.trashedItems.filter(entity => entity.selected);
  }

  @Selector()
  static areTrashedAllSelected(state: CenterStateModel) {
    return state.trashedItems.length > 0 && state.trashedItems.every(entity => entity.selected);
  }

  @Selector()
  static hasTrashedSelectedItems(state: CenterStateModel) {
    return state.trashedItems.some(entity => entity.selected);
  }

  @Action(CenterActions.GetAll)
  getAll(ctx: StateContext<CenterStateModel>) {
    return this.getItems(ctx, CenterActions.GetAll.type);
  }

  @Action(CenterActions.GetTrasheds)
  getTrasheds(ctx: StateContext<CenterStateModel>) {
    return this.getItemsTrasheds(ctx, CenterActions.GetTrasheds.type);
  }

  @Action(CenterActions.GetById)
  getByID(ctx: StateContext<CenterStateModel>, { id }: CenterActions.GetById) {
    return this.getOne(ctx, id, CenterActions.GetById.type);
  }

  @Action(CenterActions.Filters)
  Filters(ctx: StateContext<CenterStateModel>, { payload, columns, page }: CenterActions.Filters<Center>) {
    return super.filtersItems(ctx, CenterActions.Filters.type, payload, columns, page);
  }

  @Action(CenterActions.Create)
  create(ctx: StateContext<CenterStateModel>, { payload }: CenterActions.Create) {
    return this.createItem(ctx, payload, CenterActions.Create.type);
  }

  @Action(CenterActions.Update)
  update(ctx: StateContext<CenterStateModel>, { id, payload }: CenterActions.Update) {
    return this.updateItem(ctx, payload, id, CenterActions.Update.type);
  }

  @Action(CenterActions.Delete)
  delete(ctx: StateContext<CenterStateModel>, { id, del, page }: CenterActions.Delete) {
    return this.deleteItem(ctx, id, del, CenterActions.Delete.type, page);
  }

  @Action(CenterActions.DeleteAll)
  deleteAll(ctx: StateContext<CenterStateModel>, { payload, del, active, page }: CenterActions.DeleteAll) {
    return this.deleteAllItem(ctx, payload, del, active, CenterActions.DeleteAll.type, page);
  }

  @Action(CenterActions.Restore)
  restore(ctx: StateContext<CenterStateModel>, { id }: CenterActions.Restore) {
    return this.restoreItem(ctx, id, CenterActions.Restore.type);
  }

  @Action(CenterActions.RestoreAll)
  restoreAll(ctx: StateContext<CenterStateModel>, { payload }: CenterActions.RestoreAll) {
    return this.restoreAllItem(ctx, payload, CenterActions.RestoreAll.type);
  }

  @Action(CenterActions.ToggleItemSelection)
  toggleSelection(ctx: StateContext<CenterStateModel>, { id, page }: CenterActions.ToggleItemSelection) {
    return this.toggleSelectionItem(ctx, id, page);
  }

  @Action(CenterActions.ToggleAllItems)
  toggleAll(ctx: StateContext<CenterStateModel>, { selected, page }: CenterActions.ToggleAllItems) {
    return this.toggleAllItem(ctx, selected, page);
  }

  @Action(CenterActions.clearEntity)
  clearItem(ctx: StateContext<CenterStateModel>) {
    return this.clearEntity(ctx);
  }

  @Action(CenterActions.ClearItemSelection)
  clearSelection(ctx: StateContext<CenterStateModel>) {
    return this.clearSelectionItem(ctx);
  }

  @Action(CenterActions.clearAll)
  clearAll(ctx: StateContext<CenterStateModel>) {
    return this.clearAllItems(ctx);
  }
}
