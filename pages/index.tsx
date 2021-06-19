import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { AppLink } from '../components/AppLink';
import { Layout } from '../components/Layout';

export default function IndexPage() {
  return (
    <Layout title="Home">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Box height="50%" width={{ base: '100%', md: '50%' }}>
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
              <Button colorScheme="blue">Access Room</Button>
            </AppLink>
            <AppLink href="/create">
              <Button>Create Room</Button>
            </AppLink>
          </VStack>
        </Box>
      </Flex>
    </Layout>
  );
}
