export type ClassConstructor<
  Type extends object = object,
  Arguments extends Array<unknown> = unknown[]
> = {
  new (...args: Arguments): Type;
};
