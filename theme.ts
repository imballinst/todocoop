import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

import customInputTheme, { getInputFieldStyle } from './theme/input';
import customLinkTheme from './theme/link';

export const appTheme = extendTheme(
  {
    fonts: {
      heading: 'Montserrat'
      // body: 'Montserrat'
    },
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false
    },
    components: {
      FormLabel: {
        baseStyle: {
          marginBottom: 'var(--chakra-space-1)',
          fontSize: 'var(--chakra-fontSizes-sm)',
          fontWeight: 'var(--chakra-fontWeights-bold)'
        }
      },
      Form: {
        baseStyle: {
          helperText: {
            marginTop: 'var(--chakra-space-1)'
          }
        }
      },
      FormError: {
        baseStyle: {
          text: {
            marginTop: 'var(--chakra-space-1)'
          }
        }
      },
      Textarea: {
        variants: {
          outline: (props) => getInputFieldStyle(props)
        },
        defaultProps: {
          variant: 'outline'
        }
      },
      Input: {
        ...customInputTheme
      },
      Link: {
        ...customLinkTheme
      }
    }
  },
  withDefaultColorScheme({ colorScheme: 'teal' })
);
