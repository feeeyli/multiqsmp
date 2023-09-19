import { Dispatch, SetStateAction, useState } from 'react';

export type ListReturnProps<T> = [
  T[],
  {
    addItem: (item: T, index: number) => void;
    removeItem: (index: number) => void;
    moveItem: (index: number, direction: 'up' | 'down') => void;
    updateList: Dispatch<SetStateAction<T[]>>;
    toggleItem: (item: T, index: number) => void;
  },
];

export function useList<T>(initial: T[] = []): ListReturnProps<T> {
  const [list, setList] = useState<T[]>(initial);

  function addItem(item: T, index: number) {
    if (list.includes(item)) return;

    if (index === -1) {
      setList((old) => [...old, item]);
    } else {
      setList((old) => {
        const beforeIndex = old.slice(0, index);

        const afterIndex = old.slice(index);

        return [...beforeIndex, item, ...afterIndex];
      });
    }
  }

  function removeItem(index: number) {
    if (index === -1) {
      setList((old) => old.slice(0, -1));
    } else {
      setList((old) => {
        const beforeIndex = old.slice(0, index);

        const afterIndex = old.slice(index + 1);

        return [...beforeIndex, ...afterIndex];
      });
    }
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    if (
      (index <= 0 && direction === 'down') ||
      (index >= list.length && direction === 'up')
    )
      return;

    if (direction === 'down') {
      setList((old) => {
        const itemOnIndex = old[index];

        const itemAfter = old[index - 1];

        const result = [...old];

        result[index] = itemAfter;

        result[index - 1] = itemOnIndex;

        return result;
      });
    }

    if (direction === 'up') {
      setList((old) => {
        const itemOnIndex = old[index];

        const itemBefore = old[index + 1];

        const result = [...old];

        result[index] = itemBefore;

        result[index + 1] = itemOnIndex;

        return result;
      });
    }
  }

  function toggleItem(item: T, index: number) {
    if (list.includes(item)) {
      removeItem(list.indexOf(item));
    } else {
      addItem(item, index);
    }
  }

  return [
    list,
    { addItem, removeItem, moveItem, updateList: setList, toggleItem },
  ];
}
