import type { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text
} from '@chakra-ui/react';
import { MdDarkMode, MdLightMode, MdOpenInNew } from 'react-icons/md';

import { AppLink } from './AppLink';
import { EFFECTIVE_WIDTHS } from '../lib/ui/constants';
import { useColorMode, useColorModeValue } from '../lib/ui/color-mode';
import { useClientState } from './contexts/ClientStateContext';

interface LayoutProps {
  children: ReactNode;
  isLoggedInToARoom: boolean;
  isFetching: boolean;
}

export function Layout({
  children,
  isLoggedInToARoom,
  isFetching
}: LayoutProps) {
  const { isAccessingRoom } = useClientState();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box display="flex" flexDirection="column" height="100vh">
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
          <HStack gap={4}>
            <AppLink variant="plain" href={isAccessingRoom ? '/room' : '/'}>
              Home
            </AppLink>
            <AppLink variant="plain" href="/how-to-use">
              How to Use
            </AppLink>
          </HStack>
          <IconButton
            aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'}`}
            variant="ghost"
            onClick={toggleColorMode}
            borderRadius="50%"
          >
            {colorMode === 'light' ? <MdDarkMode /> : <MdLightMode />}
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
            View this project on GitHub <MdOpenInNew style={{ display: 'inline' }} />
          </AppLink>
        </Text>
      </Box>
    </Box>
  );
}
