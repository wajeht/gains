import logger from './logger.js';
import { cli } from './helpers.js';

// Simple in-memory cache to replace Redis
class MemoryCache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    return item;
  }

  async set(key, value, exFlag, exSeconds) {
    this.store.set(key, value);

    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set expiration if provided (EX flag)
    if (exFlag === 'EX' && exSeconds) {
      const timer = setTimeout(() => {
        this.store.delete(key);
        this.timers.delete(key);
      }, exSeconds * 1000);
      this.timers.set(key, timer);
    }

    return 'OK';
  }

  async del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.store.delete(key) ? 1 : 0;
  }

  keys(pattern, callback) {
    const allKeys = Array.from(this.store.keys());
    // Simple pattern matching (just * for now)
    const matchedKeys = pattern === '*'
      ? allKeys
      : allKeys.filter(k => k.includes(pattern.replace(/\*/g, '')));
    callback(null, matchedKeys);
  }

  async clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.store.clear();
  }
}

const cache = new MemoryCache();

if (!cli()) {
  logger.info('Memory cache started');
}

export default cache;
