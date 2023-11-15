import { mkdir } from 'fs/promises';
import { globbySync as glob } from 'globby';
import { dirname, relative, resolve } from 'path';
import { cwd } from 'process';
import { zip } from 'zip-a-folder';
import packageJson from '../../package.json' assert { type: 'json' };

const main = async () => {
  const directory = {
    dist: resolve(cwd(), 'dist'),
    packages: resolve(cwd(), 'packages'),
  };
  const builds = glob('*', { onlyDirectories: true, deep: 1, cwd: directory.dist });

  console.info('\nZipping build packages...\n');

  await Promise.all(
    builds.map(async build => {
      const filename = resolve(directory.packages, `${packageJson.name}-v${packageJson.version}-${build}.zip`);

      await mkdir(dirname(filename), { recursive: true });
      await zip(resolve(directory.dist, build), filename);

      console.info('- ' + relative(cwd(), filename));
    }),
  );
};

main();
