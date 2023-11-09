import * as fs from 'fs';
import * as path from 'path';
import colorLog from '../log';
import ManifestParser, { Manifest } from '../manifest-parser';
import IconSource from '../manifest-parser/icon-source';
import type { PluginOption } from 'vite';

const { resolve } = path;

const rootDir = resolve(__dirname, '..', '..');
const distDir = resolve(rootDir, 'dist');
const publicDir = resolve(rootDir, 'public');

export default function makeManifest(
  manifest: Manifest,
  config: { isDev: boolean; contentScriptCssKey?: string; icon?: Manifest['icon'] },
): PluginOption {
  async function makeManifest(to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }

    const manifestPath = resolve(to, 'manifest.json');

    // Naming change for cache invalidation
    if (config.contentScriptCssKey) {
      manifest.content_scripts.forEach(script => {
        script.css = script.css.map(css => css.replace('<KEY>', config.contentScriptCssKey));
      });
    }

    if (typeof manifest.icon !== 'undefined') {
      config.icon = manifest.icon;
      delete manifest.icon;
    }

    if (typeof config.icon !== 'undefined') {
      const iconSource = new IconSource(resolve(rootDir, config.icon.source), config.icon.sizes);
      const icons = await iconSource.generate(to, {
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
    buildStart() {
      if (config.isDev) {
        makeManifest(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest(publicDir);
    },
  };
}
