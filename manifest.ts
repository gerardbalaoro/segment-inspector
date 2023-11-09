import packageJson from './package.json';
import { Manifest } from './utils/manifest-parser';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: Manifest = {
  manifest_version: 3,
  name: 'Segment Inspector',
  version: packageJson.version,
  description: packageJson.description,
  permissions: ['storage'],
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-48.png',
  },
  chrome_url_overrides: {
    newtab: 'src/pages/newtab/index.html',
  },
  icon: {
    source: 'src/assets/img/icon.svg',
    sizes: [16, 32, 48, 128, 152],
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/content/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
