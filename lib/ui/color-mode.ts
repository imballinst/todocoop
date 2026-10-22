import { useTheme } from 'next-themes';

/**
 * Chakra UI v3 no longer ships `useColorModeValue`; it relies on
 * `next-themes` for color mode. This keeps the previous call sites readable.
 */
export function useColorModeValue<T>(light: T, dark: T): T {
  const { resolvedTheme } = useTheme();

  return resolvedTheme === 'dark' ? dark : light;
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return {
    colorMode,
    toggleColorMode: () =>
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  };
}
