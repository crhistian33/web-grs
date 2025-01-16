import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';

import { Company, CompanyStateModel } from '@models/company.model';
import { CompanyService } from '@services/company.service';
import { BaseState } from '@shared/state/base.state';
import { CompanyActions } from './company.actions';

@State<CompanyStateModel>({
  name: 'company',
  defaults: {
    entities: [],
    filteredItems: [],
    trashedItems: [],
    selectedEntity: null,
    searchTerm: '',
    result: null,
  }
})
@Injectable()
export class CompanyState extends BaseState<Company> {
  constructor(private companyService: CompanyService) {
    super(companyService);
  }

  @Selector()
  static getItems(state: CompanyStateModel): Company[] {
    return state.filteredItems;
  }

  @Selector()
  static getTrasheds(state: CompanyStateModel): Company[] {
    return state.trashedItems;
  }

  @Selector()
  static getSelectedItems(state: CompanyStateModel) {
    return state.entities.filter((entity) => entity.selected);
  }

  @Selector()
  static areAllSelected(state: CompanyStateModel) {
    return (
      state.entities.length > 0 &&
      state.entities.every((entity) => entity.selected)
    );
  }

  @Selector()
  static hasSelectedItems(state: CompanyStateModel) {
    return state.entities.some((entity) => entity.selected);
  }

  @Action(CompanyActions.GetAll)
  getAll(ctx: StateContext<CompanyStateModel>) {
    return this.getItems(ctx, CompanyActions.GetAll.type);
  }

  @Action(CompanyActions.GetDeletes)
  getDeletes(ctx: StateContext<CompanyStateModel>) {
    return this.getItemsDelete(ctx, CompanyActions.GetDeletes.type);
  }

  @Action(CompanyActions.GetById)
  getByID(
    ctx: StateContext<CompanyStateModel>,
    { id }: CompanyActions.GetById
  ) {
    return this.getOne(ctx, id, CompanyActions.GetById.type);
  }

  @Action(CompanyActions.GetAllFilter)
  getAllFilter(
    ctx: StateContext<CompanyStateModel>,
    { searchTerm, columns }: CompanyActions.GetAllFilter<Company>
  ) {
    return this.getItemsFilter(ctx, searchTerm, columns);
  }

  @Action(CompanyActions.countDeletes)
  countTrasheds(ctx: StateContext<CompanyStateModel>) {
    return this.countItemsTrashed(ctx);
  }

  @Action(CompanyActions.Create)
  create(
    ctx: StateContext<CompanyStateModel>,
    { payload }: CompanyActions.Create
  ) {
    return this.createItem(ctx, payload, CompanyActions.Create.type);
  }

  @Action(CompanyActions.Update)
  update(
    ctx: StateContext<CompanyStateModel>,
    { id, payload }: CompanyActions.Update
  ) {
    return this.updateItem(ctx, payload, id, CompanyActions.Update.type);
  }

  @Action(CompanyActions.Delete)
  delete(
    ctx: StateContext<CompanyStateModel>,
    { id, del }: CompanyActions.Delete
  ) {
    return this.deleteItem(ctx, id, del, CompanyActions.Delete.type);
  }

  @Action(CompanyActions.Restore)
  restore(
    ctx: StateContext<CompanyStateModel>,
    { id }: CompanyActions.Restore
  ) {
    return this.restoreItem(ctx, id, CompanyActions.Restore.type);
  }

  @Action(CompanyActions.DeleteAll)
  deleteAll(
    ctx: StateContext<CompanyStateModel>,
    { payload, del }: CompanyActions.DeleteAll
  ) {
    return this.deleteAllItem(
      ctx,
      payload,
      del,
      CompanyActions.DeleteAll.type
    );
  }

  @Action(CompanyActions.RestoreAll)
  restoreAll(
    ctx: StateContext<CompanyStateModel>,
    { payload }: CompanyActions.RestoreAll
  ) {
    return this.restoreAllItem(ctx, payload, CompanyActions.RestoreAll.type);
  }

  @Action(CompanyActions.ToggleItemSelection)
  toggleSelection(
    ctx: StateContext<CompanyStateModel>,
    { id }: CompanyActions.ToggleItemSelection
  ) {
    return this.toggleSelectionItem(ctx, id);
  }

  @Action(CompanyActions.ToggleAllItems)
  toggleAll(
    ctx: StateContext<CompanyStateModel>,
    { selected }: CompanyActions.ToggleAllItems
  ) {
    return this.toggleAllItem(ctx, selected);
  }
}
