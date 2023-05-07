import { ClassConstructor } from './types/class-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config<Type extends object = object> = ClassConstructor<Type, []>;
