'use client';

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { useLocalStorage } from 'usehooks-ts';
import { useLayoutMemory } from './layout-memory-context';

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
  layout,
  getLayoutKey,
}: {
  children: React.ReactNode;
  layout: {
    value: Layout[];
    set: React.Dispatch<React.SetStateAction<Layout[]>>;
  };
  getLayoutKey: (searchParams: ReadonlyURLSearchParams) => string;
}) => {
  const searchParams = useSearchParams();

  const [swapPointsMemory, setSwapPointsMemory] = useLocalStorage<{
    [url: string]: number[];
  }>('swap-points-memory', {});

  const [_, setLayoutMemory] = useLayoutMemory();

  const [swapPoints, setSwapPoints] = useState<number[]>(
    swapPointsMemory[getLayoutKey(searchParams)] || [],
  );

  useEffect(() => {
    setSwapPointsMemory((old) => {
      if (
        swapPoints.length === 0 &&
        old[getLayoutKey(searchParams)].length === 0
      )
        return old;

      return { ...old, [getLayoutKey(searchParams)]: swapPoints };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapPoints]);

  useEffect(() => {
    setSwapPoints(swapPointsMemory[getLayoutKey(searchParams)] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function swap(swapPoint: number, toSwap: number) {
    const swapPointIndex = swapPoints[swapPoint];

    if (swapPointIndex === toSwap || swapPoint === -1 || toSwap === -1)
      return swapPointIndex;

    const swapPointLayout = layout.value.find(
      (lay) => lay.i === String(swapPointIndex),
    );
    const toSwapLayout = layout.value.find((lay) => lay.i === String(toSwap));

    if (!swapPointLayout || !toSwapLayout) return swapPointIndex;

    layout.set((old) => {
      const layoutCopy = [...old];

      layoutCopy[toSwap] = { ...swapPointLayout, i: String(toSwap) };
      layoutCopy[swapPointIndex] = {
        ...toSwapLayout,
        i: String(swapPointIndex),
      };

      setLayoutMemory((old) => {
        const n = { ...old };

        n[getLayoutKey(searchParams)] = layoutCopy;

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
