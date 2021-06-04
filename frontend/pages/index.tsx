import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { useCurrentRoom } from '../lib/hooks';
import { RoomDetail } from './Room';
import { TaskyLink } from '../components/TaskyLink';
import { Layout } from '../components/Layout';

export default function IndexPage() {
  const { room } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });

  return (
    <Layout title="Home">
      <Box height="calc(100vh - 48px)">
        {room === undefined ? (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Box height="50%" width={{ base: '100%', md: '50%' }}>
              <Flex flexDirection="column" alignItems="center" mb={8}>
                <Heading as="h1" size="xl">
                  Tasky
                </Heading>
                <Text as="p" size="sm">
                  Synchronize tasks with everyone in a room. Choose an action:
                </Text>
              </Flex>

              <VStack spacing={4}>
                <TaskyLink href="/access">
                  <Button colorScheme="blue">Access Room</Button>
                </TaskyLink>
                <TaskyLink href="/create">
                  <Button>Create Room</Button>
                </TaskyLink>
              </VStack>
            </Box>
          </Flex>
        ) : (
          <RoomDetail room={room} />
        )}
      </Box>
    </Layout>
  );
}
