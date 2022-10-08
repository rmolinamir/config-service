import { ClassValidatorConfigValidator } from '../src/adapters/ClassValidatorConfigValidator';
import { NestedArrayTransformer } from './fixtures/nestedArray';

describe('ClassTransformerConfigTransformer_ClassValidatorConfigValidator', () => {
  describe('__transform & validateOrReject', () => {
    test('nestedArray should throw errors due to minimum amount of 1 element', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: []
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).rejects.toThrowError();
    });

    test('nestedArray should throw errors due to invalid baz property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: null
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).rejects.toThrowError();
    });

    test('nestedArray should throw errors due to invalid bar property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {},
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).rejects.toThrowError();
    });

    test('nestedArray should throw errors due to invalid foobar property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: null
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).rejects.toThrowError();
    });

    test('nestedArray should throw all of the previous `foo` errors', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: null
          },
          {
            bar: {},
            baz: 'lorem'
          },
          {
            bar: {
              foobar: null
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).rejects.toThrowError();
    });

    test('nestedArray should throw no errors with valid data', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const validData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(validData);

      await expect(
        new ClassValidatorConfigValidator().validateOrReject(transformedData)
      ).resolves.not.toThrowError();
    });
  });

  describe('__transform & validateOrRejectSync', () => {
    test('nestedArray should throw errors due to minimum amount of 1 element', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: []
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).toThrowError();
    });

    test('nestedArray should throw errors due to invalid baz property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: null
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).toThrowError();
    });

    test('nestedArray should throw errors due to invalid bar property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {},
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).toThrowError();
    });

    test('nestedArray should throw errors due to invalid foobar property', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: null
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).toThrowError();
    });

    test('nestedArray should throw all of the previous `foo` errors', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const invalidData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: null
          },
          {
            bar: {},
            baz: 'lorem'
          },
          {
            bar: {
              foobar: null
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(invalidData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).toThrowError();
    });

    test('nestedArray should throw no errors with valid data', async () => {
      const nestedArrayTransformer = new NestedArrayTransformer();

      const validData = {
        foo: [
          {
            bar: {
              foobar: 'ipsum'
            },
            baz: 'lorem'
          }
        ]
      };

      const transformedData = nestedArrayTransformer.__transform(validData);

      expect(() =>
        new ClassValidatorConfigValidator().validateOrRejectSync(
          transformedData
        )
      ).not.toThrowError();
    });
  });
});
