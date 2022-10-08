export abstract class ConfigTransformer {
  /**
   * Transforms the given parameter into the ConfigTransformer.
   */
  public abstract __transform(
    somethingToTransform: string | object | object[]
  ): this;
}
