export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'date' | 'number' | 'relation-name' | 'relation-name-multi' | 'state' | 'models' | 'relation-unit' | 'relation-shift' | 'relations-unit' | 'relations-shift';
  format?: (value: any) => string;
  filtered?: boolean;
  internal?: boolean;
}

export interface RelationType {
  name: string;
  [key: string]: any;
}
