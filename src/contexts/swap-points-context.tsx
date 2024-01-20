'use client';

import { useSearchParams } from 'next/navigation';

import { getLayoutKey } from '@/utils/getLayoutKey';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useLayout } from './layout-memory-context';
import { useSettings } from './settings-context';

export const SwapStreamsContext = createContext<{
  swapPoints: {
    value: number[];
    set: React.Dispatch<React.SetStateAction<number[]>>;
  };
  swap: (swapPointIndex: number, toSwap: number) => number;
}>({
  swapPoints: {
    value: [],
    set: () => {},
  },
  swap: () => 0,
});

export const SwapStreamsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const [
    {
      streams: { movableChat },
    },
  ] = useSettings();

  const [swapPointsMemory, setSwapPointsMemory] = useLocalStorage<{
    [url: string]: number[];
  }>('swap-points-memory', {});

  const {
    layoutMemory: [, setLayoutMemory],
    layout: [layout, setLayout],
  } = useLayout();

  const [swapPoints, setSwapPoints] = useState<number[]>(
    swapPointsMemory[getLayoutKey(searchParams, { movableChat })] || [],
  );

  useEffect(() => {
    setSwapPointsMemory((old) => {
      if (
        typeof old[getLayoutKey(searchParams, { movableChat })] !== 'undefined'
      ) {
        if (
          swapPoints.length === 0 &&
          old[getLayoutKey(searchParams, { movableChat })].length === 0
        )
          return old;
      }

      return {
        ...old,
        [getLayoutKey(searchParams, { movableChat })]: swapPoints,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapPoints]);

  useEffect(() => {
    setSwapPoints(
      swapPointsMemory[getLayoutKey(searchParams, { movableChat })] || [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function swap(swapPoint: number, toSwap: number) {
    const swapPointIndex = swapPoints[swapPoint];

    if (swapPointIndex === toSwap || swapPoint === -1 || toSwap === -1)
      return swapPointIndex;

    const swapPointLayout = layout.find(
      (lay) => lay.i === String(swapPointIndex),
    );
    const toSwapLayout = layout.find((lay) => lay.i === String(toSwap));

    if (!swapPointLayout || !toSwapLayout) return swapPointIndex;

    setLayout((old) => {
      const layoutCopy = [...old];

      layoutCopy[toSwap] = { ...swapPointLayout, i: String(toSwap) };
      layoutCopy[swapPointIndex] = {
        ...toSwapLayout,
        i: String(swapPointIndex),
      };

      setLayoutMemory((old) => {
        const n = { ...old };

        n[getLayoutKey(searchParams, { movableChat })] = layoutCopy;

        return n;
      });

      return layoutCopy;
    });

    setSwapPoints((old) => {
      const newSwapPoints = [...old];

      newSwapPoints[swapPoint] = toSwap;

      return newSwapPoints;
    });

    return toSwap;
  }

  return (
    <SwapStreamsContext.Provider
      value={{
        swapPoints: {
          value: swapPoints,
          set: setSwapPoints,
        },
        swap,
      }}
    >
      {children}
    </SwapStreamsContext.Provider>
  );
};

export const useSwapStreams = () => useContext(SwapStreamsContext);
