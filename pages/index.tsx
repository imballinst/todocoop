import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { AppLink } from "../components/AppLink";
import { Layout } from "../components/Layout";
import { useCurrentRoom } from "../lib/hooks";

export default function IndexPage() {
  const { room, isFetching } = useCurrentRoom({
    queryOptions: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
    redirectToIfInsideRoom: "/room",
  });

  return (
    <Layout isFetching={isFetching} isLoggedInToARoom={room !== undefined}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Box height="50%" width={{ base: "100%", md: "50%" }}>
          <Flex flexDirection="column" alignItems="center" mb={8}>
            <Heading as="h1" size="xl">
              TodoCoop
            </Heading>
            <Text as="p" size="sm">
              Synchronize tasks in a room. No account needed!
            </Text>
          </Flex>

          <VStack spacing={4}>
            <AppLink href="/access">
              <Button>Access Room</Button>
            </AppLink>
            <AppLink href="/create">
              <Button colorScheme="gray">Create Room</Button>
            </AppLink>
          </VStack>
        </Box>
      </Flex>
    </Layout>
  );
}
