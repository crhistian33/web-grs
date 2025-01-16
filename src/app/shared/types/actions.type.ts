import { BaseModel } from "../models/base.model";

export interface ActionsType<T extends BaseModel> {
  GetAll: { type: string };
  GetOne: { type: string; id: T['id'] };
  Create: { type: string; payload: Omit<T, 'id'> };
  Update: { type: string; id: T['id']; payload: Partial<T> };
  Delete: { type: string; id: T['id'] };
  SetSelected: { type: string; payload: T | null };
  SetError: { type: string; error: string };
}
