import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import logger from './logger.js';
import Chad from './chad.js';

export default async function buildLatestChangelog() {
  try {
    let changelogs = await fs.readFile(
      path.resolve(path.join(process.cwd(), 'CHANGELOG.md')),
      'utf-8',
    );
    changelogs = changelogs
      .split(/###.*\([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]\)\n/)
      .slice(1)
      .slice(0, 1)
      .toString()
      .replace(/### /g, '')
      .replace(/\(.*\)/g, '');

    return changelogs;
  } catch (e) {
    logger.error(e);
    Chad.flex(e.message, e.stack);
  }
}

buildLatestChangelog();
