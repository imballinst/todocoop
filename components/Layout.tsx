import { ReactNode } from 'react';
import Head from 'next/head';
import { Spinner } from '@chakra-ui/spinner';

import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

import { AppLink } from './AppLink';
import { useCurrentRoom } from '../lib/hooks';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  const { room, isFetching } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    },
    redirectToIfInsideRoom: '/room'
  });

  return (
    <div>
      <Head>
        <title>{title} - We Just Did</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box as="header" boxShadow="sm" p={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row">
            <AppLink href="/" p={2} fontWeight={700}>
              Home
            </AppLink>
          </Flex>
          <IconButton
            aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'}`}
            onClick={toggleColorMode}
            borderRadius="50%"
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Flex>
      </Box>

      <Box height="calc(100vh - 48px)">
        {children}

        {!room && isFetching ? (
          <Spinner
            size="lg"
            position="absolute"
            bottom={0}
            right={0}
            mr={4}
            mb={4}
          />
        ) : null}
      </Box>
    </div>
  );
}
