import { ConfigModule } from '../ConfigModule';
import { ConfigTransformer } from '../ConfigTransformer';

/**
 * Groups the transformers of an array of ConfigModule by their respective
 * transformers' key properties.
 */
export type TransformersByKey<Modules extends ConfigModule[]> = {
  [Key in Unpack<Modules>['key']]: TransformerProps<
    TransformerByKeyOf<Modules, Key>
  >;
};

/**
 * Utility type to get (unpack) the element type of an array.
 */
type Unpack<T> = T extends (infer U)[] ? U : never;

type TransformerProps<T extends ConfigTransformer> = Omit<T, '__transform'>;

/**
 *
 */
type TransformerByKeyOf<Modules extends ConfigModule[], Key> = Extract<
  Unpack<Modules>,
  { key: Key }
>['transformer'];
