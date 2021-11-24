export interface FilterOptions {
  query?: (value: any) => string | RegExp | number | boolean | object;
  castValue?: (value: any) => any;
  keyFormat?: (value: string) => string;
}

export type FilterMap<T> = Record<keyof T, FilterOptions>
