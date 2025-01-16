// export abstract class resourceModel<T> {
//   public id?: number;

//   constructor(model?: Partial<T>) {
//     if (model) {
//       Object.assign(this, model);
//     }
//   }
// }

export interface BaseModel {
  id: number;
  selected?: boolean;
}
