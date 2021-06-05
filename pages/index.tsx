import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { useCurrentRoom } from '../lib/hooks';
import { TaskyLink } from '../components/TaskyLink';
import { Layout } from '../components/Layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const { room } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    }
  });
  const router = useRouter();

  useEffect(() => {
    console.log(room);
    if (room) {
      // Redirect to room page if the user is logged into a room.
      router.push('/room');
    }
  }, [router, room]);

  return (
    <Layout title="Home">
      <Box height="calc(100vh - 48px)">
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
      </Box>
    </Layout>
  );
}
