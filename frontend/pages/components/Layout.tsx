import { ReactNode } from 'react';
import Head from 'next/head';

import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Head>
        <title>Tasky - {title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box as="header" boxShadow="sm" p={1}>
        <Flex flexDirection="row" justifyContent="flex-end">
          <IconButton
            aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'}`}
            onClick={toggleColorMode}
            borderRadius="50%"
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Flex>
      </Box>

      {children}
    </div>
  );
}
