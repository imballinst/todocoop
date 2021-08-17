import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

export const appTheme = extendTheme(
  withDefaultColorScheme({ colorScheme: "teal" }),
  {
    fonts: {
      heading: "Montserrat",
      // body: 'Montserrat'
    },
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
    components: {
      FormLabel: {
        baseStyle: {
          marginBottom: "var(--chakra-space-1)",
          fontSize: "var(--chakra-fontSizes-sm)",
          fontWeight: "var(--chakra-fontWeights-bold)",
        },
      },
      Form: {
        baseStyle: {
          helperText: {
            marginTop: "var(--chakra-space-1)",
          },
        },
      },
      FormError: {
        baseStyle: {
          text: {
            marginTop: "var(--chakra-space-1)",
          },
        },
      },
    },
  }
);
