export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'date' | 'number' | 'relation-name' | 'relation-name-multi' | 'state' | 'models';
  format?: (value: any) => string;
  filtered?: boolean;
  display?: boolean;
}

export interface RelationType {
  name: string;
  [key: string]: any;
}
