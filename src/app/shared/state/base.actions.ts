// import { BaseModel } from "@shared/models/base.model";

import { BaseModel } from "@shared/models/base.model";

// export interface ActionType<T = void> {
//   readonly type: string;
//   entity: string;
//   payload?: T;
// }

// export abstract class BaseActions<T extends BaseModel> {
//   protected constructor(protected readonly entity: string) {}

//   protected createAction<P>(type: string, payload?: P): ActionType<P> {
//     return {
//       type: `[${this.entity}] ${type}`,
//       entity: this.entity,
//       payload
//     };
//   }

//   getAll(): ActionType {
//     return this.createAction('Get All');
//   }

//   getAllFilter(): ActionType {
//     return this.createAction('Get All Filter');
//   }

//   create(payload: Partial<T>): ActionType<Partial<T>> {
//     return this.createAction('Create', payload);
//   }

//   update(payload: Partial<T>): ActionType<Partial<T>> {
//     return this.createAction('Update', payload);
//   }

//   delete(id: number): ActionType<number> {
//     return this.createAction('Delete', id);
//   }
// }

// // import { BaseModel } from '@shared/models/base.model';

// // // export namespace BaseActions {
// // //   export const type = '[Base]';

// // //   export class GetAll {
// // //     static readonly type = `${BaseActions.type} Get All`;
// // //   }

// // //   export class GetAllFilter<T> {
// // //     static readonly type = `${BaseActions.type} Get All filter`;
// // //     constructor(public searchTerm: string, public columns: (keyof T)[]) {}
// // //   }

// // //   export class GetById {
// // //     static readonly type = `${BaseActions.type} Get By Id`;
// // //     constructor(public id: string | number) {}
// // //   }

// // //   export class Create<T> {
// // //     static readonly type = `${BaseActions.type} Add`;
// // //     constructor(public payload: T) {}
// // //   }

// // //   export class Update<T> {
// // //     static readonly type = `${BaseActions.type} Update`;
// // //     constructor(public payload: T) {}
// // //   }

// // //   export class Delete {
// // //     static readonly type = `${BaseActions.type} Delete`;
// // //     constructor(public id: string | number) {}
// // //   }
// // // }

// // export abstract class BaseActions<T extends BaseModel> {
// //   static readonly type = '[Base] Action';

// //   abstract namespace: string;

// //   GetAll() {
// //     return { type: `[${this.namespace}] Get All` };
// //   }

// //   GetAllFilter(searchTerm: string, columns: (keyof T)[]) {
// //      return { type: `[${this.namespace}] Get All filter`, payload: {searchTerm, columns} };
// //   }

// //   Create(payload: Partial<T>) {
// //     return { type: `[${this.namespace}] Create`, payload };
// //   }

// //   Update(payload: Partial<T>) {
// //     return { type: `[${this.namespace}] Update`, payload };
// //   }

// //   Delete(id: number) {
// //     return { type: `[${this.namespace}] Delete`, payload: id };
// //   }
// // }

// // export namespace BaseActions {
// //   export class FetchAll {
// //     static readonly type = '[Base] Fetch All';
// //   }

// //   export class FetchOne {
// //     static readonly type = '[Base] Fetch One';
// //     constructor(public id: number) {}
// //   }

// //   export class FetchAllFilter<T> {
// //     static readonly type = '[Base] Fetch Filter All';
// //     constructor(public searchTerm: string, public columns: (keyof T)[]) {}
// //   }

// //   export class Create<T> {
// //     static readonly type = '[Base] Create';
// //     constructor(public payload: T) {}
// //   }

// //   export class Update<T> {
// //     static readonly type = '[Base] Update';
// //     constructor(public id: number, public payload: Partial<T>) {}
// //   }

// //   export class Delete {
// //     static readonly type = '[Base] Delete';
// //     constructor(public id: number) {}
// //   }
// // }

export interface BaseActionType {
  readonly type: string;
  readonly entity: string;
  payload?: any;
}

// base.actions.ts
export abstract class BaseActions<T extends BaseModel> {
  protected constructor(protected readonly entity: string) {}

  protected createAction<P = void>(type: string, payload?: P): BaseActionType & { payload?: P } {
    return {
      type: `[${this.entity}] ${type}`,
      entity: this.entity,
      payload
    };
  }

  getAll() {
    return this.createAction('Get All');
  }

  // getById(id: string) {
  //   return this.createAction('Get By Id', id);
  // }

  // create(payload: Partial<T>) {
  //   return this.createAction('Create', payload);
  // }
}
