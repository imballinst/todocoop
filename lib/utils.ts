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

export async function getErrorMessage(error: any) {
  if (error?.response) {
    if (error.response.data.errors) {
      return error.response.data.errors.map((el) => el.message).join('; ');
    }

    return error.response.statusText;
  }

  return 'Unexpected error occurred. Please check your connection and try again.';
}

export function parseRawTodoText(str: string) {
  let trimmed = str.trim();
  let isTicked = true;

  if (trimmed.startsWith('- [ ] ')) {
    trimmed.slice('- [ ] '.length);
    isTicked = false;
  } else if (trimmed.startsWith('- [x] ')) {
    trimmed.slice('- [x] '.length);
  } else {
    const match = trimmed.match(/^[-*\d]\.?\s+/);

    if (match !== null) {
      trimmed = trimmed.slice(match[0].length);
      isTicked = false;
    }
  }

  return {
    is_checked: isTicked,
    title: trimmed
  };
}
