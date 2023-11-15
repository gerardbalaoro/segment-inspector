import { resolve } from 'path';
import { cwd } from 'process';
import { zip } from 'zip-a-folder';

const main = async () => {
  await zip(resolve(cwd(), 'dist'));
};

main();
