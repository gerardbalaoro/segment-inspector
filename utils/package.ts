import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const json: () => typeof import('../package.json') = () => {
  const filename = resolve(__dirname, '../package.json');
  const contents = readFileSync(filename, 'utf8');

  try {
    return JSON.parse(contents);
  } catch {
    return {};
  }
};

export const path = __dirname;
export const meta = json();
