'use client';

// React Imports
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Types Imports
import { SettingsType } from '@/components/dialogs/settings-dialog';
import { useTheme } from 'next-themes';

const INITIAL_VALUE: SettingsType = {
  appearance: {
    theme: 'dark',
    streamersAvatar: 'twitch',
    streamStatus: {
      offline: true,
      noPlaying: true,
    },
  },
  streams: {
    alwaysShowHeader: false,
    startMuted: true,
    headerItems: ['mute', 'fullscreen', 'chat', 'reload'],
  },
};

export const SettingsContext = createContext<
  [SettingsType, Dispatch<SetStateAction<SettingsType>>]
>([INITIAL_VALUE, () => {}]);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useLocalStorage<SettingsType>('settings', INITIAL_VALUE);

  const { setTheme } = useTheme();

  const theme = settings[0].appearance.theme;

  const updateTheme = useCallback(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  useEffect(updateTheme, [theme, updateTheme]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettingsContext = () => useContext(SettingsContext);
