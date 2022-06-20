import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// export const root = path.resolve(path.join(process.cwd()));

const __dirname = dirname(fileURLToPath(import.meta.url));

export const root = path.resolve(path.join(__dirname, '../../'));
