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
  permissions: ['storage', 'activeTab', 'tabs', 'webRequest', 'clipboardWrite', 'clipboardRead'],
  host_permissions: ['*://*/*'],
  action: {
    default_icon: 'icon-48.png',
  },
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  icon: {
    source: 'src/assets/img/icon.svg',
    sizes: [16, 32, 48, 128, 152],
  },
  content_scripts: [],
  devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css'],
      matches: ['*://*/*'],
    },
  ],
  browser_specific_settings: {
    gecko: {
      id: '{93889b01-7bb3-5be0-acd7-a385e15b620d}',
      strict_min_version: '109.0',
    },
  },
};

export default manifest;
