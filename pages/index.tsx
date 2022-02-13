import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { AppLink } from '../components/AppLink';
import { Layout } from '../components/Layout';
import { RoomForm } from '../components/RoomForm';
import { useCurrentRoom } from '../lib/ui/hooks';
import { accessRoom } from '../lib/ui/query/rooms';

export default function IndexPage() {
  const { room, isFetching, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    },
    redirectToIfInsideRoom: '/room'
  });

  return (
    <Layout isFetching={isFetching} isLoggedInToARoom={room !== undefined}>
      <Flex flexDirection="column" alignItems="center" height="100%" pt={4}>
        <Box p={[4, 0]}>
          <Flex flexDirection="column" alignItems="center" mb={8}>
            <Heading as="h1" size="xl">
              TodoCoop
            </Heading>
            <Text as="p" size="sm" textAlign="center">
              Synchronize tasks in a room. No account needed!
            </Text>
          </Flex>

          <Box
            px={[0, 0, 4]}
            py={[0, 0, 8]}
            borderStyle="solid"
            borderWidth={[0, 0, 1]}
            borderColor="gray.750"
            borderRadius="md"
          >
            <RoomForm
              request={accessRoom}
              onSuccessfulAccess={refetchRoom}
              loadingButtonTitle="Accessing room..."
              title="Access existing room"
              buttonTitle="Access room"
              titleSize="md"
              titleTag="h2"
            />
          </Box>

          <Text mt={8} as="p" size="sm" textAlign="center">
            Haven't created a room yet? Create one{' '}
            <AppLink href="/create" colorScheme="teal">
              in this page
            </AppLink>
            .
          </Text>
        </Box>
      </Flex>
    </Layout>
  );
}
