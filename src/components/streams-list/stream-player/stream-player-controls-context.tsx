'use client';

import { useSettings } from '@/contexts/settings-context';
// React Imports
import React, { createContext, useState } from 'react';

export const StreamPlayerControlsContext = createContext<{
  muted: {
    value: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  fullScreen: {
    value: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  captions: {
    value: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  refresh: {
    key: number;
    run: () => void;
  };
  index: number;
}>({
  muted: {
    value: false,
    set: () => {},
  },
  fullScreen: {
    value: false,
    set: () => {},
  },
  captions: {
    value: false,
    set: () => {},
  },
  refresh: {
    key: 0,
    run: () => {},
  },
  index: -1,
});

export const StreamPlayerControlsProvider = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const [
    {
      streams: { startMuted },
    },
  ] = useSettings();
  const [muted, setMuted] = useState(startMuted);
  const [fullScreen, setFullScreen] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = () => setRefreshCounter((old) => (old > 0 ? 0 : 1));

  const streamPlayerControls = {
    muted: {
      value: muted,
      set: setMuted,
    },
    fullScreen: {
      value: fullScreen,
      set: setFullScreen,
    },
    captions: {
      value: captions,
      set: setCaptions,
    },
    refresh: {
      key: refreshCounter,
      run: refresh,
    },
  };

  type t = typeof streamPlayerControls;

  return (
    <StreamPlayerControlsContext.Provider
      value={{ ...streamPlayerControls, index }}
    >
      {children}
    </StreamPlayerControlsContext.Provider>
  );
};
