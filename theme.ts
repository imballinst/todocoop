import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Montserrat, sans-serif' }
      }
    }
  }
});

export const system = createSystem(defaultConfig, config);
