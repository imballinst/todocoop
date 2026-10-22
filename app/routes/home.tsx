import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { AppLink } from '../../components/AppLink';
import { Layout } from '../../components/Layout';
import { RoomForm } from '../../components/RoomForm';
import { useCurrentRoom } from '../../lib/ui/hooks';
import { accessRoom } from '../../lib/ui/query/rooms';

export function meta() {
  return [
    { title: 'TodoCoop - Anonymous & Collaborative To-do List' },
    {
      name: 'description',
      content:
        'TodoCoop is a minimal web application for you to create and collaborate on to-do lists anonymously.'
    }
  ];
}

export default function HomeRoute() {
  const { room, isFetching, refetchRoom } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false
    },
    redirectToIfInsideRoom: '/room'
  });

  return (
    <Layout isFetching={isFetching} isLoggedInToARoom={room !== undefined}>
      <Flex flexDirection="column" alignItems="center" height="100%">
        <Box p={[4, 0]}>
          <Flex flexDirection="column" alignItems="center" mb={12}>
            <Heading as="h1" size="xl">
              TodoCoop
            </Heading>
            <Text as="p" fontSize="sm" textAlign="center">
              Synchronize tasks in a room. No account needed!
            </Text>
          </Flex>

          <RoomForm
            request={accessRoom}
            onSuccessfulAccess={refetchRoom}
            loadingButtonTitle="Accessing room..."
            title="Access existing room"
            buttonTitle="Access room"
            titleSize="md"
            titleTag="h2"
          />

          <Text mt={8} as="p" fontSize="sm" textAlign="center">
            Haven't created a room yet? Create one{' '}
            <AppLink href="/create" colorPalette="teal">
              in this page
            </AppLink>
            .
          </Text>
        </Box>
      </Flex>
    </Layout>
  );
}
