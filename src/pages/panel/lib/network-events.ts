export type OnNavigateListener = typeof chrome.devtools.network.onNavigated.addListener;

export type OnRequestListener = typeof chrome.devtools.network.onRequestFinished.addListener;

export const onRequest: OnRequestListener = callback => {
  if (typeof callback !== 'function') {
    return;
  }

  const event = chrome?.devtools?.network?.onRequestFinished;

  if (typeof event?.addListener !== 'function') {
    throw new Error('Chrome API is not defined.');
  }

  event.addListener(callback);
};

export const onNavigate: OnNavigateListener = callback => {
  if (typeof callback !== 'function') {
    return;
  }

  const event = chrome?.devtools?.network?.onNavigated;

  if (typeof event?.addListener !== 'function') {
    throw new Error('Chrome API is not defined.');
  }

  event.addListener(callback);
};
