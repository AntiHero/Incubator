export type WithId<T> = T extends Record<any, any>
  ? T & { readonly id: string }
  : T;

export type WithCount<T> = T extends Record<any, any>
  ? T & { count?: number }
  : Text;

export type OptionalKey<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & {
  [key in K]?: T[K];
};
