export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'date' | 'number' | 'relation' | 'relation-name' | 'relation-dni' | 'relation-name-multi' | 'state' | 'models' | 'relation-unit' | 'relation-shift' | 'relations-unit' | 'relations-shift' | 'dynamic' | 'month';
  format?: (value: any) => string;
  filtered?: boolean;
  internal?: boolean;
}

export interface RelationType {
  name: string;
  [key: string]: any;
}
