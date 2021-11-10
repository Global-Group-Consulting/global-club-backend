export interface FilterOptions {
  query?: (value: any) => string | RegExp | number | boolean;
  castValue?: (value) => any;
}

export type FilterMap<T> = Record<keyof T, FilterOptions>
