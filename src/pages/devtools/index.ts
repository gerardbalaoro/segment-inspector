import icon from '@assets/img/icon.svg';
import browser from 'webextension-polyfill';

try {
  browser.devtools.panels.create('Segment', icon, '/src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
