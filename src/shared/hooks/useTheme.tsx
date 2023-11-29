import { get } from 'radash';
import { useEffect, useState } from 'react';
import { devtools } from 'webextension-polyfill';

export default function useTheme() {
  const [theme, setTheme] = useState<string>(devtools.panels.themeName);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const onThemeChanged =
      get(devtools.panels, 'onThemeChanged.addListener') || get(devtools.panels, 'setThemeChangeHandler');

    if (typeof onThemeChanged === 'function') {
      onThemeChanged(theme => {
        setTheme(theme);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isDarkMode };
}
