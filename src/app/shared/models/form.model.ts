export interface FieldForm {
  type: 'text' | 'email' | 'tel' | 'select' | 'table' | 'date' | 'hidden' | 'checkbox';
  name: string;
  label?: string;
  value?: string | boolean;
  validators?: IValidationForm[];
}

export interface IModule {
  name: string;
  fields: FieldForm[];
}

export interface IValidationForm {
  name: string;
  validator: string;
  message: string;
}
