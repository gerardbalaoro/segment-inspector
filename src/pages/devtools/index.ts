import { createPanel } from '@root/src/shared/browser';

try {
  createPanel('Segment', '/icon-48.png', '/src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
