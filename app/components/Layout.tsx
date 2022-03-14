import { ReactNode } from 'react';
import Head from 'next/head';
import { Spinner } from '@chakra-ui/spinner';
import { useColorModeValue, Text } from '@chakra-ui/react';

import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import { Box, Flex, HStack } from '@chakra-ui/layout';
import { ExternalLinkIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

import { AppLink } from './AppLink';
import { EFFECTIVE_WIDTHS } from '../lib/ui/constants';
import { useClientState } from './contexts/ClientStateContext';

interface LayoutProps {
  children: ReactNode;
  isLoggedInToARoom: boolean;
  title?: string;
  isFetching: boolean;
}

export function Layout({
  children,
  isLoggedInToARoom,
  title,
  isFetching
}: LayoutProps) {
  const { isAccessingRoom } = useClientState();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Head>
        <title>{title ? `${title} - ` : ''}TodoCoop</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        as="header"
        boxShadow="sm"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        position="fixed"
        top={0}
        width="100%"
        background={bg}
        zIndex={1}
      >
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width={EFFECTIVE_WIDTHS}
          px={3}
          py={2}
        >
          <HStack spacing={4}>
            <AppLink variant="none" href={isAccessingRoom ? '/room' : '/'}>
              Home
            </AppLink>
            <AppLink variant="none" href="/how-to-use">
              How to Use
            </AppLink>
          </HStack>
          <IconButton
            aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'}`}
            variant="ghost"
            onClick={toggleColorMode}
            borderRadius="50%"
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Flex>
      </Box>

      <Box
        display="flex"
        flex="1"
        flexDirection="row"
        justifyContent="center"
        mt="56px"
        pt={2}
      >
        <Box width={EFFECTIVE_WIDTHS}>
          {children}

          {!isLoggedInToARoom && isFetching ? (
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
      </Box>

      <Box textAlign="center" fontWeight={700} mt={12} py={2}>
        <Text as="small" display="block">
          Copyright © 2020-{new Date().getFullYear()}, Try Ajitiono
        </Text>
        <Text as="small" display="block">
          <AppLink href="https://github.com/imballinst/todocoop" isExternal>
            View this project on GitHub <ExternalLinkIcon mx="2px" />
          </AppLink>
        </Text>
      </Box>
    </Box>
  );
}
