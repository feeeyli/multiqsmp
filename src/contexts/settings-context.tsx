/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { SettingsType } from '@/components/dialogs/settings/settings-dialog';
import { useLocalStorage } from '@mantine/hooks';
import { useTheme } from 'next-themes';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

const INITIAL_VALUE: SettingsType = {
  appearance: {
    theme: 'dark',
    dialogTriggersPosition: 'right',
    hideDialog: false,
  },
  streamers: {
    streamersAvatar: 'twitch',
    streamStatus: {
      offline: true,
      noPlaying: true,
    },
    outro: {
      hideOffline: false,
      hideNotPlaying: false,
      showOpposite: false,
    },
  },
  streams: {
    alwaysShowHeader: false,
    startMuted: true,
    movableChat: false,
    useHandleAsHeader: false,
    headerItems: ['mute', 'fullscreen', 'chat', 'captions'],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extend(target: any, ...args: any[]) {
  for (let i = 0; i < args.length; ++i) {
    const from = args[i];
    if (typeof from !== 'object') continue;
    for (const j in from) {
      if (from.hasOwnProperty(j)) {
        target[j] =
          typeof from[j] === 'object' && !Array.isArray(from[j])
            ? extend({}, target[j], from[j])
            : from[j];
      }
    }
  }
  return target;
}

export const SettingsContext = createContext<
  [SettingsType, Dispatch<SetStateAction<SettingsType>>]
>([INITIAL_VALUE, () => {}]);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<SettingsType>({
    key: 'settings',
    defaultValue: INITIAL_VALUE,
  });
  const [memory, setMemory] = useLocalStorage<{ setPurgatory: boolean }>({
    key: 'memory',
    defaultValue: { setPurgatory: false },
  });

  useEffect(() => {
    const themed = { ...settings };

    if (settings.appearance.theme === 'purgatory' && !memory.setPurgatory) {
      themed.appearance.theme = 'dark';

      setMemory({ setPurgatory: true });

      window.location.reload();
    }

    // setSettings(extend({}, INITIAL_VALUE, themed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setTheme } = useTheme();

  const theme = settings.appearance.theme;

  const updateTheme = useCallback(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  useEffect(updateTheme, [theme, updateTheme]);

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
