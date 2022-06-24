import { describe, it, expect } from 'vitest';
import { database } from '../../config/env.js';

describe('database credentials', () => {
  it('should have host name defined', () => {
    const host = database.host.length != '';
    expect(host).toBe(true);
  });

  it('should have db username defined', () => {
    const username = database.username.length != '';
    expect(username).toBe(true);
  });

  it('should have db password defined', () => {
    const password = database.password.length != '';
    expect(password).toBe(true);
  });

  it('should have db name defined', () => {
    const dbName = database.database.length != '';
    expect(dbName).toBe(true);
  });

  it('should have db port defined', () => {
    const port = database.port.length != '';
    expect(port).toBe(true);
  });

  it('should have db client defined', () => {
    const client = database.client.length != '';
    expect(client).toBe(true);
  });
});
