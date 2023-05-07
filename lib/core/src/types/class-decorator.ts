import { ClassConstructor } from './class-type';

export type ClassDecorator = (
  Class: ClassConstructor,
  context: ClassDecoratorContext
) => Function | void;
