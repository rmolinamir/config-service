import { ClassConstructor } from './class-type.js';

export type ClassDecorator = (
  Class: ClassConstructor,
  context: ClassDecoratorContext
) => Function | void;
