import { ReactNode } from 'react';
import Head from 'next/head';
import { Spinner } from '@chakra-ui/spinner';
import { useColorModeValue } from '@chakra-ui/react';

import { useColorMode } from '@chakra-ui/color-mode';
import { IconButton } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

import { AppLink } from './AppLink';
import { EFFECTIVE_WIDTHS } from '../lib/constants';

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
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <div>
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
          <AppLink href="/" fontWeight={700}>
            Home
          </AppLink>
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
        height="calc(100vh - 56px)"
        display="flex"
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
    </div>
  );
}
