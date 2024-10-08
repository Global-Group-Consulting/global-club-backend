export interface FilterOptions {
  query?: (value: any) => string | RegExp | number | boolean | object;
  castValue?: (value: any) => any;
  keyFormat?: (value: string, elValue: any) => string;
}

export type FilterMap<T> = Record<keyof T, FilterOptions>
