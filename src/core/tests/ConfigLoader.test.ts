import { ConfigLoader } from '../src/core/ConfigLoader';
import path from 'path';
import assert from 'assert';

describe('ConfigLoader', () => {
  describe('load', () => {
    test('loads file protocol file', async () => {
      const filePath = `file://${path
        .resolve(__dirname, 'fixtures', 'db.json')
        .replace(/\\/g, '/')}`;

      assert(filePath, 'Path not found.');

      const loader = new ConfigLoader(filePath);

      const jsonObject = await loader.load();

      expect(jsonObject).toBeTruthy();
    });
  });
});
