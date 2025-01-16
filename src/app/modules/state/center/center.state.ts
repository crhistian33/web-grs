import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Center, CenterStateModel } from '@models/center.model';
import { CenterService } from '@services/center.service';
import { BaseState } from '@shared/state/base.state';
import { CenterActions } from './center.action';

@State<CenterStateModel>({
  name: 'center',
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
export class CenterState extends BaseState<Center> {
  constructor(private centerService: CenterService) {
    super(centerService);
  }

  @Selector()
  static getItems(state: CenterStateModel): Center[] {
    return state.filteredItems;
  }

  @Selector()
  static getTrasheds(state: CenterStateModel): Center[] {
    return state.trashedItems;
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

  @Action(CenterActions.GetAll)
  getAll(ctx: StateContext<CenterStateModel>) {
    return this.getItems(ctx, CenterActions.GetAll.type);
  }

  @Action(CenterActions.GetDeletes)
  getDeletes(ctx: StateContext<CenterStateModel>) {
    return this.getItemsDelete(ctx, CenterActions.GetDeletes.type);
  }

  @Action(CenterActions.GetById)
  getByID(
    ctx: StateContext<CenterStateModel>,
    { id }: CenterActions.GetById
  ) {
    return this.getOne(ctx, id, CenterActions.GetById.type);
  }

  @Action(CenterActions.GetAllFilter)
  getAllFilter(
    ctx: StateContext<CenterStateModel>,
    { searchTerm, columns }: CenterActions.GetAllFilter<Center>
  ) {
    return this.getItemsFilter(ctx, searchTerm, columns);
  }

  @Action(CenterActions.countDeletes)
  countTrasheds(ctx: StateContext<CenterStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(CenterActions.Create)
  create(
    ctx: StateContext<CenterStateModel>,
    { payload }: CenterActions.Create
  ) {
    return this.createItem(ctx, payload, CenterActions.Create.type);
  }

  @Action(CenterActions.Update)
  update(
    ctx: StateContext<CenterStateModel>,
    { id, payload }: CenterActions.Update
  ) {
    return this.updateItem(ctx, payload, id, CenterActions.Update.type);
  }

  @Action(CenterActions.Delete)
  delete(
    ctx: StateContext<CenterStateModel>,
    { id, del }: CenterActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, CenterActions.Delete.type);
  }

  @Action(CenterActions.Restore)
  restore(
    ctx: StateContext<CenterStateModel>,
    { id }: CenterActions.Restore
  ) {
    return this.restoreItem(ctx, id, CenterActions.Restore.type);
  }

  @Action(CenterActions.DeleteAll)
  deleteAll(
    ctx: StateContext<CenterStateModel>,
    { payload, del }: CenterActions.DeleteAll
  ) {
    return this.deleteAllItem(
      ctx,
      payload,
      del,
      CenterActions.DeleteAll.type
    );
  }

  @Action(CenterActions.RestoreAll)
  restoreAll(
    ctx: StateContext<CenterStateModel>,
    { payload }: CenterActions.RestoreAll
  ) {
    return this.restoreAllItem(ctx, payload, CenterActions.RestoreAll.type);
  }

  @Action(CenterActions.ToggleItemSelection)
  toggleSelection(
    ctx: StateContext<CenterStateModel>,
    { id }: CenterActions.ToggleItemSelection
  ) {
    return this.toggleSelectionItem(ctx, id);
  }

  @Action(CenterActions.ToggleAllItems)
  toggleAll(
    ctx: StateContext<CenterStateModel>,
    { selected }: CenterActions.ToggleAllItems
  ) {
    return this.toggleAllItem(ctx, selected);
  }
}
