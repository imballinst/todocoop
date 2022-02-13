import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { BaseTodo } from './models/types';

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

export function getErrorMessage(error: AxiosError) {
  if (error?.response) {
    if (error.response.data.errors) {
      return error.response.data.errors.map((el) => el.message).join('; ');
    }

    return error.response.statusText;
  }

  return 'Unexpected error occurred. Please check your connection and try again.';
}

export function parseRawTodoText(str: string): BaseTodo {
  let title = str.trim();
  let isChecked = false;

  if (title.startsWith('- [ ] ')) {
    title = title.slice('- [ ] '.length).trim();
  } else if (title.startsWith('- [x] ')) {
    title = title.slice('- [x] '.length).trim();
    isChecked = true;
  } else if (title.startsWith('[ ] ')) {
    title = title.slice('[ ] '.length).trim();
  } else {
    const match = title.match(/^([-*]|(\d+\.))/);

    if (match !== null) {
      title = title.slice(match[0].length).trim();
    }
  }

  return {
    isChecked,
    title,
    localId: generateHash()
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Copied from https://stackoverflow.com/a/30810322.
// Not using document.execCommand('copy') because it's obsolete.
export async function copyTextToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}
