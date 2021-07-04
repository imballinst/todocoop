import React, {
  ChangeEvent,
  Dispatch,
  memo,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
  SetStateAction
} from 'react';
import { Checkbox } from '@chakra-ui/checkbox';
import {
  Text,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  Link,
  useToast
} from '@chakra-ui/react';
import {
  FormHelperText,
  FormControl,
  FormLabel
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, HStack } from '@chakra-ui/layout';
import {
  CheckIcon,
  DeleteIcon,
  EditIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  SmallCloseIcon
} from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/button';
import { Table, TableCellProps, Tbody, Td, Tr } from '@chakra-ui/table';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
import { MdMoreVert } from 'react-icons/md';

import {
  copyTextToClipboard,
  deepClone,
  generateHash,
  getErrorMessage,
  parseRawTodoText,
  replaceArrayElementAtIndex
} from '../lib/utils';
import { useMutateRoom, useRoomMutations } from '../lib/hooks';
import { BaseTodo, BaseRoom } from '../types/models';
import { createTodos, leaveRoom } from '../query/rooms';
import { Dictionary } from '../types';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    isOpen: isBulkAddModalOpen,
    onOpen: onOpenBulkAddModal,
    onClose: onCloseBulkAddModal
  } = useDisclosure();

  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);
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

  async function onCopyToClipboard() {
    const currentTodosText = currentTodos
      .map((todo) => `- [${todo.isChecked ? 'x' : ' '}] ${todo.title}`)
      .join('\n');
    try {
      await copyTextToClipboard(currentTodosText);
      toast({
        description: 'Copied all todos to clipboard.',
        status: 'success'
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to copy to clipboard.',
        description: await getErrorMessage(err),
        status: 'error'
      });
    }
  }

  async function onLeaveRoom() {
    try {
      await leaveRoom({ name });
      queryClient.invalidateQueries('room');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <Flex px={3} flexDirection="row" justifyContent="space-between">
          <Heading as="h1" size="md">
            {name}
          </Heading>
          <Menu>
            {isLargerThan768 ? (
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
              </MenuButton>
            ) : (
              <MenuButton
                as={IconButton}
                aria-label="Actions"
                icon={<MdMoreVert />}
                variant="ghost"
              />
            )}
            <MenuList>
              <MenuItem onClick={onOpen}>Room information</MenuItem>
              <MenuItem onClick={onCopyToClipboard}>
                Copy list to clipboard
              </MenuItem>
              <MenuItem onClick={onLeaveRoom}>Leave room</MenuItem>
            </MenuList>
          </Menu>
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

          <HStack spacing={2} direction="row" mt={3} ml={3}>
            <Button
              colorScheme="teal"
              onClick={() =>
                setCurrentTodos((oldTodos) =>
                  oldTodos.concat({
                    localId: generateHash(),
                    isPersisted: false,
                    isChecked: false,
                    title: ''
                  })
                )
              }
            >
              Add New...
            </Button>

            <Button colorScheme="teal" onClick={onOpenBulkAddModal}>
              Add Bulk from List...
            </Button>
          </HStack>
        </Box>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4} px={6}>
            <Box display="flex">
              <Text mr={2} fontWeight={700}>
                Room name:
              </Text>{' '}
              {room.name}
            </Box>
            <Box display="flex">
              <Text mr={2} fontWeight={700}>
                Room password:
              </Text>{' '}
              {room.password}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

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
const TodoForm = memo(
  ({
    roomName,
    todo,
    index,
    localIdToEditedListElementMap,
    setCurrentTodos
  }: {
    roomName: string;
    todo: BaseTodo;
    index: number;
    localIdToEditedListElementMap: MutableRefObject<Dictionary<BaseTodo>>;
    setCurrentTodos: Dispatch<SetStateAction<BaseTodo[]>>;
  }) => {
    const {
      control,
      formState: { errors },
      reset
    } = useForm({
      defaultValues: todo
    });

    const {
      isPersisted,
      _id: todoId,
      localId,
      title,
      isChecked
    } = useWatch({ control });

    const { addTodoMutation, updateTodoMutation, deleteTodoMutation } =
      useRoomMutations();

    const [isEditing, setIsEditing] = useState(!isPersisted);
    const previousValue = useRef<BaseTodo>(todo);

    useEffect(() => {
      if (!isEditing) {
        previousValue.current = todo;
        reset(todo);
      }
    }, [isEditing, todo, reset]);

    useEffect(() => {
      if (isEditing) {
        localIdToEditedListElementMap.current[localId] = {
          isPersisted,
          _id: todoId,
          localId,
          title,
          isChecked
        };
      }
    }, [
      localIdToEditedListElementMap,
      localId,
      isEditing,
      isPersisted,
      todoId,
      isChecked,
      title
    ]);

    function onSave() {
      // Finish save happens when the text field is blurred, or when
      // the checkbox tick is changed.
      if (!isPersisted) {
        addTodoMutation.mutate({
          name: roomName,
          todo: {
            title,
            localId,
            isChecked,
            isPersisted: true
          }
        });
      } else {
        updateTodoMutation.mutate({
          name: roomName,
          todo: {
            _id: todoId,
            localId,
            isPersisted: true,
            title,
            isChecked
          }
        });
      }

      previousValue.current = todo;
      setIsEditing(false);
    }

    function onChangeTick(e: ChangeEvent<HTMLInputElement>) {
      previousValue.current = todo;
      updateTodoMutation.mutate({
        name: roomName,
        todo: {
          _id: todoId,
          isPersisted: true,
          title,
          isChecked: e.target.checked
        }
      });
    }

    function onDelete() {
      deleteTodoMutation.mutate({ name: roomName, todoId: todo._id });
    }

    return isEditing ? (
      <>
        <TableColumn colSpan={2}>
          <Box display="flex">
            <Controller
              render={({ field }) => (
                <Checkbox
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  isChecked={field.value}
                  ref={field.ref}
                />
              )}
              name="isChecked"
              control={control}
            />

            <FormControl ml={2}>
              <Controller
                render={({ field }) => <Input {...field} />}
                name="title"
                control={control}
              />

              {errors[index]?.title && (
                <FormHelperText>{errors[index]?.title}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </TableColumn>

        <TableColumn width={1}>
          <HStack spacing={2} direction="row" justifyContent="flex-end">
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              colorScheme="teal"
              onClick={() => {
                localIdToEditedListElementMap.current[localId] = undefined;

                if (todo.isPersisted) {
                  setIsEditing(false);
                } else {
                  setCurrentTodos((oldState) => {
                    const idxToDelete = oldState.findIndex(
                      (el) => el.localId === todo.localId
                    );
                    return replaceArrayElementAtIndex(oldState, idxToDelete);
                  });
                }
              }}
              aria-label="Cancel"
              icon={<SmallCloseIcon />}
            />
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              colorScheme="teal"
              onClick={onSave}
              aria-label="Save"
              icon={<CheckIcon />}
            />
          </HStack>
        </TableColumn>
      </>
    ) : (
      <>
        <TableColumn colSpan={2}>
          <Controller
            render={({ field }) => (
              <Checkbox
                name={field.name}
                onBlur={field.onBlur}
                isChecked={field.value}
                ref={field.ref}
                onChange={onChangeTick}
                colorScheme="teal"
              >
                {todo.title || title}
              </Checkbox>
            )}
            name="isChecked"
            control={control}
          />
        </TableColumn>
        <TableColumn width={1}>
          <HStack spacing={2} direction="row" justifyContent="flex-end">
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              colorScheme="teal"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              icon={<EditIcon />}
            />
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              colorScheme="teal"
              onClick={onDelete}
              aria-label="Edit"
              icon={<DeleteIcon />}
            />
          </HStack>
        </TableColumn>
      </>
    );
  }
);

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return <Td {...props} paddingInline={3} py={2} />;
}

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
