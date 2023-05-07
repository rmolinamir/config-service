import { Uri } from '../src/uri';

describe('Uri', () => {
  test('protocol is parsed correctly', () => {
    const uri = new Uri(
      'mongodb://127.0.0.1:27017/some-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    );
    expect(uri.protocol).toBe('mongodb');
  });

  test('SRV protocol is parsed correctly', () => {
    const uri = new Uri(
      'mongodb+srv://127.0.0.1:27017/some-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    );
    expect(uri.protocol).toBe('mongodb+srv');
  });

  test('slashes are parsed correctly', () => {
    const uri = new Uri(
      'mongodb://127.0.0.1:27017/some-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    );
    expect(uri.slashes).toBe('//');
  });

  test('authority is parsed correctly', () => {
    const uri = new Uri(
      'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin'
    );
    expect(uri.authority).toBe('username:password');
  });

  test('host is parsed correctly', () => {
    const uri = new Uri(
      'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin'
    );
    expect(uri.host).toBe('mongodb0.example.com');
  });

  test('port is parsed correctly', () => {
    const uri = new Uri(
      'mongodb://username:password@mongodb0.example.com:27017/?authSource=admin'
    );
    expect(uri.port).toBe('27017');
  });

  test('path is parsed correctly', () => {
    const uri = new Uri(
      'https://docs.mongodb.com/manual/reference/connection-string/#connections-connection-examples'
    );
    expect(uri.path).toBe('/manual/reference/connection-string/');
  });

  test('query is parsed correctly', () => {
    const uri = new Uri(
      'mongodb://127.0.0.1:27017/some-api?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    );
    expect(uri.query).toBe(
      'readPreference=primary&appname=MongoDB%20Compass&ssl=false'
    );
  });

  test('hash is parsed correctly', () => {
    const uri = new Uri(
      'https://docs.mongodb.com/manual/reference/connection-string/#connections-connection-examples'
    );
    expect(uri.hash).toBe('connections-connection-examples');
  });
});
