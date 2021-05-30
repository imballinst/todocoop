import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  IconButton,
  useColorMode
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

import { RoomForm } from './RoomForm';
import { createRoom } from './query/rooms';
import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from './Room';
import { taskyTheme } from './theme';

function IndexPage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { room, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });

  return (
    <Box>
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

      <Box height="calc(100vh - 48px)">
        {room === undefined ? (
          <RoomForm request={createRoom} onSuccessfulAccess={refetchRoom} />
        ) : (
          <RoomDetail room={room} />
        )}
      </Box>
    </Box>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={taskyTheme}>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
