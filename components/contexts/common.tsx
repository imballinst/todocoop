import { createContext, useContext } from 'react';

/**
 * Creates a context with a type, but without default value, returning a tuple of [useCtx, Provider].
 * Source: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#context.
 */
export function createCtx<T>() {
  const ctx = createContext<T | undefined>(undefined);

  function useCtx() {
    const context = useContext(ctx);

    if (!context) {
      throw new Error('useCtx must be inside a Provider with a value.');
    }

    return context;
  }

  return [useCtx, ctx.Provider] as const; // make TypeScript infer a tuple, not an array of union types.
}
