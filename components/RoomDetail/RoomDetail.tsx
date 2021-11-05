import React, { useEffect, useRef, useState } from 'react';
import { Textarea, Link, useToast } from '@chakra-ui/react';
import {
  FormHelperText,
  FormControl,
  FormLabel
} from '@chakra-ui/form-control';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/button';
import { Table, Tbody, Tr } from '@chakra-ui/table';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';
import { useQueryClient } from 'react-query';

import {
  deepClone,
  generateHash,
  getErrorMessage,
  parseRawTodoText
} from '../../lib/utils';
import { useMutateRoom } from '../../lib/hooks';
import { BaseTodo, BaseRoom } from '../../types/models';
import { createTodos } from '../../query/rooms';
import { Dictionary } from '../../types';
import { TodoForm } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { AddTodoButtons } from './AddTodoButtons';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;
  const toast = useToast();
  const {
    isOpen: isBulkAddModalOpen,
    onOpen: onOpenBulkAddModal,
    onClose: onCloseBulkAddModal
  } = useDisclosure();

  const queryClient = useQueryClient();

  const [resolvedInitialTodos] = useState(resolveExistingTodos(todos));
  const [currentTodos, setCurrentTodos] = useState(resolvedInitialTodos.todos);

  const localIdToEditedListElementMap = useRef<Dictionary<BaseTodo>>({});
  const previousRoomRef = useRef(room);

  const [bulkEntries, setBulkEntries] = useState('');

  useEffect(() => {
    if (
      previousRoomRef.current.__v !== room.__v ||
      previousRoomRef.current.todos.length !== room.todos.length
    ) {
      const cloned = deepClone(localIdToEditedListElementMap.current);
      const { todos, submittedLocalTodoIds } = resolveExistingTodos(
        room.todos,
        cloned
      );

      setCurrentTodos(todos);
      previousRoomRef.current = room;

      for (const id of submittedLocalTodoIds) {
        localIdToEditedListElementMap.current[id] = undefined;
      }
    }
  }, [room]);

  const addBulkMutation = useMutateRoom(
    createTodos,
    async ({ todos: newTodos }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries('room');

      // Snapshot the previous value.
      const previousRoom = queryClient.getQueryData<BaseRoom>('room');

      // Optimistically update to the new value.
      if (previousRoom) {
        const newPersistedTodos = newTodos.map((todo) => ({
          isPersisted: true,
          isChecked: todo.isChecked,
          title: todo.title
        }));

        queryClient.setQueryData<BaseRoom>('room', {
          ...previousRoom,
          todos: [...previousRoom.todos, ...newPersistedTodos]
        });
      }

      return { previousRoom };
    }
  );

  async function onCreateBulk() {
    const bulkTodos = bulkEntries.split('\n');

    try {
      await addBulkMutation.mutate({
        name,
        todos: bulkTodos.map(parseRawTodoText)
      });
      onCloseBulkAddModal();
      setBulkEntries('');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to create bulk todos.',
        description: await getErrorMessage(err),
        status: 'error'
      });
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <Flex px={3} flexDirection="row" justifyContent="space-between">
          <Heading
            as="h1"
            size="md"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            {name}
          </Heading>
          <div>
            <ActionsMenu room={room} currentTodos={currentTodos} />
          </div>
        </Flex>
        <Box mt={4}>
          <Table variant="simple" width="100%">
            <Tbody>
              {currentTodos.map((todo, index) => (
                <Tr key={todo.localId}>
                  <TodoForm
                    roomName={name}
                    index={index}
                    todo={todo}
                    localIdToEditedListElementMap={
                      localIdToEditedListElementMap
                    }
                    setCurrentTodos={setCurrentTodos}
                  />
                </Tr>
              ))}
            </Tbody>
          </Table>

          <AddTodoButtons
            onSingleAdd={() =>
              setCurrentTodos((oldTodos) =>
                oldTodos.concat({
                  localId: generateHash(),
                  isPersisted: false,
                  isChecked: false,
                  title: ''
                })
              )
            }
            onBulkAdd={onOpenBulkAddModal}
          />
        </Box>
      </form>

      <Modal isOpen={isBulkAddModalOpen} onClose={onCloseBulkAddModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bulk from List</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4} px={6}>
            <Box flex="1">
              <FormControl>
                <FormLabel htmlFor="name">Entries to Add</FormLabel>
                <Textarea
                  placeholder="- [x] Do something"
                  onChange={(e) => setBulkEntries(e.target.value)}
                  value={bulkEntries}
                />
                <FormHelperText>
                  By default, each line will be added as a new unchecked entry
                  unless specified as checked. For more information, see the{' '}
                  <Link
                    href="https://www.markdownguide.org/basic-syntax/"
                    isExternal
                    color="blue.400"
                  >
                    Markdown syntax <ExternalLinkIcon mx="2px" />
                  </Link>
                  .
                </FormHelperText>
              </FormControl>

              <Flex flexDirection="row" justifyContent="flex-end">
                <Button colorScheme="teal" onClick={onCreateBulk} mt={4}>
                  Add Bulk List
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// Helper functions/components.
function resolveExistingTodos(
  apiTodos: BaseTodo[],
  currentlyEditedTodosDictionary: Dictionary<BaseTodo> = {}
) {
  const submittedLocalTodoIds: string[] = [];
  const resultTodo: BaseTodo[] = apiTodos.map((todo) => ({
    ...todo,
    isPersisted: true
  }));
  const localIds = resultTodo.map((el) => el.localId);

  for (const key in currentlyEditedTodosDictionary) {
    const todo = currentlyEditedTodosDictionary[key];
    const existsInApi = localIds.includes(todo.localId);

    if (!existsInApi) {
      // Exists locally but not in API, because it's not submitted yet.
      // This is usually the case when we are creating a new todo but not submitted yet,
      // but the UI already re-fetches from the interval.
      resultTodo.push(todo);
    } else {
      // Covers 3 cases:
      // 1. Exists locally and in API.
      // 2. Exists locally and in API, but not yet submitted.
      // 3. Exists locally but not in API. This is usually because of form errors.
      submittedLocalTodoIds.push(todo.localId);
    }
  }

  return {
    todos: resultTodo,
    submittedLocalTodoIds
  };
}
