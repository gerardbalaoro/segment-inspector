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
  permissions: ['activeTab', 'webRequest', 'clipboardWrite', 'clipboardRead'],
  action: {
    default_icon: 'icon-48.png',
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
};

export default manifest;
