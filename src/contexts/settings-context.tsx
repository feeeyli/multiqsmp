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
    movableMode: false,
    headerItems: ['mute', 'fullscreen', 'chat', 'reload'],
  },
};

function extend(target: any, ...args: any[]) {
  for (var i = 1; i < arguments.length; ++i) {
    var from = arguments[i];
    if (typeof from !== 'object') continue;
    for (var j in from) {
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
  const [settings, setSettings] = useLocalStorage<SettingsType>(
    'settings',
    INITIAL_VALUE,
  );
  const [memory, setMemory] = useLocalStorage<{ setPurgatory: boolean }>(
    'memory',
    { setPurgatory: false },
  );

  useEffect(() => {
    let themed = { ...settings };

    if (settings.appearance.theme === 'purgatory' && !memory.setPurgatory) {
      themed.appearance.theme = 'dark';

      setMemory({ setPurgatory: true });

      window.location.reload();
    }

    setSettings(extend({}, INITIAL_VALUE, themed));
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

export const useSettingsContext = () => useContext(SettingsContext);
