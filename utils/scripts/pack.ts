import { program } from 'commander';
import { createConsola } from 'consola';
import 'dotenv/config';
import { get } from 'radash';
import { type ILogMethod } from 'webext-buildtools-builder-types';
import { type IIntegratedOptions } from 'webext-buildtools-integrated-builder/declarations/options';
import { IntegratedBuilder } from 'webext-buildtools-integrated-builder/dist/builder.js';
import { meta } from '../package.ts';

const filename = `packages/${meta.name}-v${meta.version}`;
const consola = createConsola({ formatOptions: { date: false } });
const logger: ILogMethod = (level: string, message: string, ...meta: unknown[]) => {
  consola[level](message, ...meta);
};

const Builder = function (source: string, options: IIntegratedOptions) {
  const builder = new IntegratedBuilder(options, logger);

  builder.setInputDirPath(source);

  if (get(options, 'zipOptions.zipOutPath')) {
    builder.requireZip();
  }

  if (get(options, 'chromeCrx')) {
    builder.requireSignedCrx();
  }

  if (get(options, 'firefoxAddons.signXpi')) {
    builder.requireFirefoxAddonsSignedXpi();
  }

  this.run = async () => {
    const result = await builder.build();
    const errors: { targetName: string; error: Error }[] = get(result, 'errors');

    for (const error of errors) {
      consola.error(error);
    }
  };
};

const builders = {
  chrome: async (sign = false) => {
    const builder = new Builder('dist/chrome', {
      zipOptions: {
        zipOutPath: `${filename}-chrome.zip`,
      },
      ...(sign
        ? {
            chromeCrx: {
              privateKey: Buffer.from(process.env.CRX_PRIVATE_KEY, 'utf-8'),
              crxFilePath: `${filename}.crx`,
            },
          }
        : {}),
    });

    await builder.run();
  },
  firefox: async (sign = false) => {
    const builder = new Builder('dist/firefox', {
      zipOptions: {
        zipOutPath: `${filename}-firefox.zip`,
      },
      ...(sign
        ? {
            firefoxAddons: {
              api: {
                jwtIssuer: process.env.WEB_EXT_API_KEY,
                jwtSecret: process.env.WEB_EXT_API_SECRET,
              },
              // signXpi: {
              //   xpiOutPath: `${filename}.xpi`,
              // },
            },
          }
        : {}),
    });

    await builder.run();
  },
};

program.option('--sign', 'generate signed packages', false).parse(process.argv);

const options = program.opts();

consola.debug('call', process.argv);
consola.debug('opts', options);

for (const name in builders) {
  consola.start('Building ' + name);
  await builders[name](!!options.sign);
  consola.log('');
}
