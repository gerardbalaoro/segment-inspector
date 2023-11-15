import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

const store = {
  theme: atomWithStorage<Theme>('theme', 'auto'),
  isDarkMode: atomWithStorage('theme.dark', false),
};

export default function useTheme() {
  const [theme, setTheme] = useAtom(store.theme);
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') {
      return true;
    }

    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  }, [theme]);

  const setAuto = () => setTheme('auto');
  const setLight = () => setTheme('light');
  const setDark = () => setTheme('dark');

  return { isDarkMode, setAuto, setDark, setLight };
}
