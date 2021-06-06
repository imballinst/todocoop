import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { TaskyLink } from '../components/TaskyLink';
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
    </Layout>
  );
}
