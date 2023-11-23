import * as fs from 'fs';
import { resolve } from 'path';
import type { PluginOption } from 'vite';
import colorLog from '../log';
import ManifestParser, { Manifest } from '../manifest-parser';
import IconSource from '../manifest-parser/icon-source';

export default function makeManifest(
  manifest: Manifest,
  config: {
    isDev: boolean;
    contentScriptCssKey?: string;
    icon?: Manifest['icon'];
  },
): PluginOption {
  let root: string | null = null;
  let output: string | null = null;

  async function generate() {
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true });
    }

    const manifestPath = resolve(output, 'manifest.json');

    // Naming change for cache invalidation
    if (config.contentScriptCssKey) {
      manifest.content_scripts.forEach(script => {
        if (!Array.isArray(script.css)) {
          script.css = [];
        }
        script.css = script.css.map(css => css.replace('<KEY>', config.contentScriptCssKey));
      });
    }

    if (typeof manifest.icon !== 'undefined') {
      config.icon = manifest.icon;
      delete manifest.icon;
    }

    if (typeof config.icon !== 'undefined') {
      const iconSource = new IconSource(resolve(root, config.icon.source), config.icon.sizes);
      const icons = await iconSource.generate(output, {
        desaturate: config.isDev,
      });

      manifest.icons = icons;
      manifest.web_accessible_resources = (manifest.web_accessible_resources ?? []).concat({
        resources: Object.values(icons),
        matches: ['*://*/*'],
      });

      colorLog(`Generated icons: ${Object.values(icons).join(', ')}`, 'success');
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    config(config) {
      root = config.root || process.cwd();
      output = config.build.outDir;
    },
    closeBundle() {
      generate();
    },
  };
}
