export type WithId<T> = T extends Record<any, any>
  ? T & { readonly id: string }
  : T;

export type WithCount<T> = T extends Record<any, any>
  ? T & { count?: number }
  : Text;
