import { inject, Injectable } from '@angular/core';
import { StateContext, Store } from '@ngxs/store';
import { BaseStateModel } from '@shared/models/base-state.model';
import { BaseModel } from '@shared/models/base.model';
import { BaseCrudService } from '@shared/services/base-crud.service';
import { finalize, tap } from 'rxjs';
import { SetLoading } from './loading/loading.actions';
import { FilterStateModel } from '@shared/models/filter.model';
import { TYPES } from '@shared/utils/constants';
import { CompanyState } from '@state/company/company.state';

const initialValues = {
  entities: [],
  filteredItems: [],
  trashedItems: [],
  filterTrashedItems: [],
  selectedEntity: null,
  searchTerm: '',
  result: null,
  loaded: false,
}

@Injectable()
export class BaseState<T extends BaseModel, TRequest> {
  constructor(
    protected service: BaseCrudService<T, TRequest>,
  ) {}

  protected getItems(ctx: StateContext<BaseStateModel<T>>, type: string) {
    ctx.dispatch(new SetLoading(type, true));

    return this.service.getItems().pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: (error) => {
          ctx.dispatch(new SetLoading(type, false));
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getItemsAll(ctx: StateContext<BaseStateModel<T>>, type: string, id?: number) {
    ctx.dispatch(new SetLoading(type, true));
    const service = id
      ? this.service.getAll(id)
      : this.service.getAll();

    return service.pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: response.data,
            filteredItems: response.data,
          })
        },
        error: (error) => {
          ctx.dispatch(new SetLoading(type, false));
          const errors: string[] = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getItemsTrasheds(ctx: StateContext<BaseStateModel<T>>, type: string, id?: number) {
    ctx.dispatch(new SetLoading(type, true));
    const service = id
      ? this.service.getTrashed(id)
      : this.service.getTrashed();

    return service.pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            trashedItems: response.data,
            filterTrashedItems: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected getOne(ctx: StateContext<BaseStateModel<T>>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.getById(id).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            selectedEntity: response.data,
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    );
  }

  protected filtersItems(ctx: StateContext<BaseStateModel<T>>, type:string, payload: Partial<FilterStateModel>, columns?: (keyof T)[], page?: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const { centerId, companyId, customerId, shiftId, typeworkerId, unitId, fromDate, toDate, searchTerm } = payload;

    const data = page === TYPES.LIST ? state.entities : state.trashedItems;
    const filtered = data.filter((item: any) => {
      const matchDrop =
        (!typeworkerId || item.typeworker.id === typeworkerId) &&
        (!companyId || (item.customer ? item.customer.company.id === companyId : (item.assignment
          ? item.assignment.unitshift.unit.customer.company.id === companyId
          : (item.unitshift ? item.unitshift.unit.customer.company.id === companyId : item.company.id === companyId)))) &&
        (!customerId || (item.assignment
          ? item.assignment.unitshift.unit.customer.id === customerId
          : (item.unitshift ? item.unitshift.unit.customer.id === customerId : (item.unit ? item.unit.customer.id === customerId : item.customer.id === customerId)))) &&
        (!unitId || (item.assignment
          ? item.assignment.unitshift.unit.id === unitId
          : (item.unitshift ? item.unitshift.unit.id === unitId : item.unit.id === unitId)
        )) &&
        (!shiftId || (item.shifts ? item.shifts.some((shift: any) => shift.id === shiftId) : (item.assignment
          ? item.assignment.unitshift.shift.id === shiftId
          : (item.unitshift ? item.unitshift.shift.id === shiftId : item.shift.id === shiftId)
         ))) &&
        (!centerId || item.center.id === centerId) &&
        (!fromDate || new Date(item.start_date) >= new Date(fromDate)) &&
        (!toDate || new Date(item.start_date) <= new Date(toDate))

      if(!searchTerm)
        return matchDrop;

      const matchSearch = !columns || columns.some((column) => {
        const value = typeof item[column] === 'object' && item[column] !== null
          ? item[column].name?.toString().toLowerCase() || ''
          : item[column]?.toString().toLowerCase() || '';
        return value.includes(searchTerm.toLowerCase());
      });

      return matchDrop && matchSearch;
    })

    page === TYPES.LIST
      ? ctx.patchState({ filteredItems: filtered })
      : ctx.patchState({ filterTrashedItems: filtered });

    ctx.dispatch(new SetLoading(type, false));
  }

  protected createItem(ctx: StateContext<BaseStateModel<T>>, payload: TRequest, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.create(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: [...ctx.getState().entities, response.data],
            filteredItems: [...ctx.getState().filteredItems, response.data],
            result: { title: response.title, message: response.message },
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected createManyItem(ctx: StateContext<BaseStateModel<T>>, payload: TRequest[], type: string) {
    ctx.dispatch(new SetLoading(type, true));
    return this.service.createMany(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: [...ctx.getState().entities, ...response.data],
            filteredItems: [...ctx.getState().filteredItems, ...response.data],
            result: { title: response.title, message: response.message },
          })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected updateItem(ctx: StateContext<BaseStateModel<T>>, payload: Partial<TRequest>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    return this.service.update(id, payload)
    .pipe(
      tap({
        next: (response: any) => {
          const updatedEntities = state.entities.map(entity =>
            entity.id === Number(id) ? { ...entity, ...response.data } : entity
          );
          ctx.patchState({
            entities: updatedEntities,
            filteredItems: updatedEntities,
            selectedEntity: response.data,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected deleteItem(ctx: StateContext<BaseStateModel<T>>, id: number, del: boolean, type: string, page?: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const data = page === TYPES.LIST ? state.entities : state.trashedItems;
    const entities = data.filter(item => item.id !== id);

    return this.service.delete(id, del).pipe(
      tap({
        next: (response: any) => {
          page === TYPES.LIST
            ? ctx.patchState({ entities, filteredItems: entities, result: { title: response.title, message: response.message } })
            : ctx.patchState({ trashedItems: entities, filterTrashedItems: entities, result: { title: response.title, message: response.message } })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected deleteAllItem(ctx: StateContext<BaseStateModel<T>>, payload: T[], del: boolean, active: boolean, type: string, page?: string, id?: number) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const service = id
      ? this.service.deleteAll(payload, del, active, id)
      : this.service.deleteAll(payload, del, active);

    return service.pipe(
      tap({
        next: (response: any) => {
          const data = page === TYPES.LIST ? state.entities : state.trashedItems;
          const entities = response.data
            ? response.data.map((entity: any) => ({
              ...entity,
              selected: false
            }))
            : data.filter(item => !payload.some(element => element.id === item.id))

          page === TYPES.LIST
            ? ctx.patchState({ entities, filteredItems: entities, result: { title: response.title, message: response.message } })
            : ctx.patchState({ trashedItems: entities, filterTrashedItems: entities, result: { title: response.title, message: response.message } })
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected restoreItem(ctx: StateContext<BaseStateModel<T>>, id: number, type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    return this.service.restore(id).pipe(
      tap({
        next: (response: any) => {
          const entities = state.trashedItems.filter(item => item.id !== id);
          ctx.patchState({
            entities: [...ctx.getState().entities, response.data],
            filteredItems: [...ctx.getState().entities, response.data],
            trashedItems: entities,
            filterTrashedItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        },
        finalize: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      })
    )
  }

  protected restoreAllItem(ctx: StateContext<BaseStateModel<T>>, payload: T[], type: string) {
    ctx.dispatch(new SetLoading(type, true));
    const state = ctx.getState();
    const entities = state.trashedItems.filter(item =>
      !payload.some(element => element.id === item.id)
    );
    return this.service.restoreAll(payload).pipe(
      tap({
        next: (response: any) => {
          ctx.patchState({
            entities: [...ctx.getState().entities, ...response.data],
            filteredItems: [...ctx.getState().filteredItems, ...response.data],
            trashedItems: entities,
            filterTrashedItems: entities,
            result: { title: response.title, message: response.message },
          });
        },
        error: () => {
          ctx.dispatch(new SetLoading(type, false));
        }
      }),
      finalize(() => {
        ctx.dispatch(new SetLoading(type, false));
      })
    )
  }

  protected toggleSelectionItem(ctx: StateContext<BaseStateModel<T>>, id: number, page?: string) {
    const state = ctx.getState();
    const data = page === TYPES.LIST ? state.entities : state.trashedItems;
    //const value = state.entities.filter(item => item.id === id);

    const entities = data.map(entity =>
      entity.id === id
        ? { ...entity, selected: !entity.selected }
        : entity
    );

    page === TYPES.LIST
      ? ctx.patchState({ entities, filteredItems: entities })
      : ctx.patchState({ trashedItems: entities, filterTrashedItems: entities })
  }

  protected toggleAllItem(ctx: StateContext<BaseStateModel<T>>, selected: boolean, page?: string) {
    const state = ctx.getState();
    const data = page === TYPES.LIST ? state.entities : state.trashedItems;

    const entities = data.map(entity => ({
      ...entity,
      selected: selected
    }));
    page === TYPES.LIST
      ? ctx.patchState({ entities, filteredItems: entities })
      : ctx.patchState({ trashedItems: entities, filterTrashedItems: entities })
  }

  // //Agregar PAGE
  protected clearSelectionItem(ctx: StateContext<BaseStateModel<T>>) {
    const state = ctx.getState();
    const entities = state.entities.map(entity => ({
      ...entity,
      selected: false
    }));
    ctx.patchState({ entities, filteredItems: entities });
  }

  protected clearEntity(ctx: StateContext<BaseStateModel<T>>) {
    ctx.patchState({ selectedEntity: null });
  }

  protected clearAllItems(ctx: StateContext<BaseStateModel<T>>) {
    ctx.patchState(initialValues);
  }


}
