try {
  chrome.devtools.panels.create('Segment', 'icon-48.png', 'src/pages/panel/index.html');
} catch (e) {
  console.error(e);
}
