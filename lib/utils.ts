import { useEffect } from 'react';

export function generateHash(length = 5) {
  const timestampHash = Date.now().toString(36);
  const randomHash = Math.random().toString().slice(0, length);

  return `${timestampHash}${randomHash}`;
}

export function replaceArrayElementAtIndex<T>(
  arr: T[],
  idx: number,
  newElement?: T
) {
  const newArray = [...arr];

  if (newElement === undefined) {
    newArray.splice(idx, 1);
    return newArray;
  }

  newArray.splice(idx, 1, newElement);
  return newArray;
}

export function useDebugEffect<T>(name: string, val: T) {
  useEffect(() => {
    console.debug('-----');
    console.debug(`${name} changed: ${val}`);
  }, [val]);
}