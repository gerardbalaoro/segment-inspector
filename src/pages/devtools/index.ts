import icon from '@assets/img/icon.svg';
import { devtools } from '@src/shared/browser';

try {
  devtools.panel('Segment', icon, '/src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
