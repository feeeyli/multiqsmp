import { useSwapStreams } from '@/contexts/swap-points-context';
import { Layout } from 'react-grid-layout';

function split(arr: Layout[], perChunk: number): Layout[][] {
  return arr.reduce((all: Layout[][], one, i) => {
    const ch = Math.floor(i / perChunk);
    all[ch] = ([] as Layout[]).concat(all[ch] || [], one);
    return all;
  }, []);
}

type Streams = {
  twitch_name: string;
  group_name?: string;
  is_chat: boolean;
}[];

export function useLayoutPresets(
  cols: number,
  rows: number,
  rowsInScreen: number,
): {
  focus: (layout: Layout[], focusedAmount?: 1 | 2 | 4) => Layout[];
  tiles: (layout: Layout[]) => Layout[];
  generateBlankLayout: (list: Streams | string[]) => Layout[];
} {
  const { swapPoints } = useSwapStreams();

  function generateBlankLayout(list: Streams | string[]) {
    return list.map((_, i) => ({
      i: String(i),
      w: 0,
      x: 0,
      h: 0,
      y: 0,
    })) as Layout[];
  }

  function focus(layout: Layout[], focusedAmount: 1 | 2 | 4 = 1) {
    layout = layout.sort((a, b) => parseFloat(a.i) - parseFloat(b.i));

    const focused = layout.slice(0, focusedAmount);
    const layRows = split(layout.slice(focusedAmount), 6);

    if (layRows.length > 6) return layout;

    const unfocusedHeight = [5, 5, 4, 4, 3, 3][layRows.length - 1];
    const focusOptions = {
      1: { w: 1, h: 1 },
      2: { w: 0.5, h: 1 },
      4: { w: 0.5, h: 0.5 },
    };

    swapPoints.set(focused.map((_, i) => i));
    // if (swapPoints.value.length === 0) {
    // }

    return [
      focused.map((focus, i) => {
        // const divideHorizontal = [2, 4].includes(focusedAmount);
        // const divideVertical = focusedAmount === 4;

        const w = cols * 10;
        const h = rowsInScreen - unfocusedHeight * layRows.length;

        return {
          ...focus,
          w: Math.floor(w * focusOptions[focusedAmount].w),
          x: w * (i % 2),
          h: Math.floor(h * focusOptions[focusedAmount].h),
          y: h * Math.floor(i / 2),
        };
      }),
      layRows.flatMap((row, ii) => {
        const diff =
          Math.ceil((cols * 10) / row.length) * row.length - cols * 10;

        return row.map((item, i) => {
          const w = Math.ceil((cols * 10) / row.length);

          return {
            ...item,
            h: unfocusedHeight,
            y: unfocusedHeight * focusedAmount * (ii + 1),
            w: i > row.length - diff - 1 ? w - 1 : w,
            x: w * i,
          };
        });
      }),
    ].flat();
  }

  function tiles(layout: Layout[]): Layout[] {
    const layRows = split(layout, cols).reverse();

    const height = Math.floor(rowsInScreen / rows);

    return layRows.flatMap((row, ii) => {
      const diff = Math.ceil((cols * 10) / row.length) * row.length - cols * 10;

      return row.map((item, i) => {
        const w = Math.ceil((cols * 10) / row.length);

        return {
          ...item,
          h: height,
          y: rowsInScreen - height * (ii + 1),
          w: i > row.length - diff - 1 ? w - 1 : w,
          x: w * i,
        };
      });
    });
  }

  return { focus, tiles, generateBlankLayout };
}
