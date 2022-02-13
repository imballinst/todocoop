import React, { useEffect, useRef, useState } from 'react';
import { Textarea, Link } from '@chakra-ui/react';
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

import { deepClone, generateHash, parseRawTodoText } from '../../lib/utils';
import { useMutateRoom } from '../../lib/ui/hooks';
import { BaseTodo, BaseRoom } from '../../lib/models/types';
import { createTodos } from '../../lib/ui/query/rooms';
import { TodoForm } from './TodoForm';
import { ActionsMenu } from './ActionsMenu';
import { AddTodoButtons } from './AddTodoButtons';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { RoomFormState } from './types';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos: roomTodos } = room;
  const queryClient = useQueryClient();

  const { control, handleSubmit, setFocus } = useForm<RoomFormState>({
    mode: 'onBlur',
    defaultValues: {
      todos: roomTodos
    }
  });
  const {
    fields: todos,
    remove,
    insert
  } = useFieldArray({ control, name: 'todos' });
  // const previousRoomRef = useRef(room);
  const submitButtonRef = useRef<HTMLButtonElement>();

  // useEffect(() => {
  //   if (previousRoomRef.current.__v !== room.__v) {
  //     const cloned = deepClone(localIdToEditedListElementMap.current);
  //     const { todos, submittedLocalTodoIds } = resolveExistingTodos(
  //       room.todos,
  //       cloned
  //     );

  //     reset(todos);
  //     previousRoomRef.current = room;
  //   }
  // }, [room]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Every 10 seconds, if it's idle, then sync.
    }, 10000);

    return () => {
      // When it's changed, the previous interval is cleared.
      clearInterval(interval);
    };
  }, [todos]);

  // const addBulkMutation = useMutateRoom({
  //   mutationFn: createTodos,
  //   onMutate: async ({ todos: newTodos }) => {
  //     // Cancel any outgoing refetches (so they don't overwrite our optimistic update).
  //     await queryClient.cancelQueries('room');

  //     // Snapshot the previous value.
  //     const previousRoom = queryClient.getQueryData<BaseRoom>('room');

  //     // Optimistically update to the new value.
  //     if (previousRoom) {
  //       const newPersistedTodos = newTodos.map((todo) => ({
  //         isPersisted: true,
  //         isChecked: todo.isChecked,
  //         title: todo.title
  //       }));

  //       queryClient.setQueryData<BaseRoom>('room', {
  //         ...previousRoom,
  //         todos: [...previousRoom.todos, ...newPersistedTodos]
  //       });
  //     }

  //     return { previousRoom };
  //   },
  //   errorTitle: 'Failed to add todos',
  //   onSettled: () => {
  //     onCloseBulkAddModal();
  //     setBulkEntries('');
  //   }
  // });

  function onDataValid(data: RoomFormState) {
    console.log(data);
  }

  const fieldArrayActions = { remove, insert, setFocus };

  return (
    <>
      <form onSubmit={handleSubmit(onDataValid)}>
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
          <Box position="relative">
            <ActionsMenu room={room} currentTodos={todos} />
          </Box>
        </Flex>
        <Box mt={4}>
          <Table variant="simple" width="100%">
            <Tbody>
              {todos.map((todo, index) => (
                <Tr key={todo.localId}>
                  <TodoForm
                    index={index}
                    todo={todo}
                    control={control}
                    {...fieldArrayActions}
                  />
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button hidden type="submit" ref={submitButtonRef} />
        </Box>
      </form>
    </>
  );
}

// Helper functions/components.
function resolveExistingTodos(
  apiTodos: BaseTodo[],
  currentlyEditedTodosDictionary: Record<string, BaseTodo> = {}
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
