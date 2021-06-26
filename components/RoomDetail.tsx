import React, {
  ChangeEvent,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState
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
  Link
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
  ExternalLinkIcon
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

import { generateHash } from '../lib/utils';
import { useRoomMutations } from '../lib/hooks';
import { BaseTodo, BaseRoom } from '../types/models';
import { leaveRoom } from '../query/rooms';

interface RoomProps {
  room: BaseRoom;
}

export function RoomDetail({ room }: RoomProps) {
  const { name, todos } = room;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBulkAddModalOpen,
    onOpen: onOpenBulkAddModal,
    onClose: onCloseBulkAddModal
  } = useDisclosure();

  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);
  const queryClient = useQueryClient();

  const [currentTodos, setCurrentTodos] = useState(resolveExistingTodos(todos));
  const previousRoom = useRef(room);

  useEffect(() => {
    if (previousRoom.current.__v !== room.__v) {
      setCurrentTodos(resolveExistingTodos(room.todos));
      previousRoom.current = room;
    }
  }, [room]);

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
              <MenuItem>Export list</MenuItem>
              <MenuItem onClick={onLeaveRoom}>Leave room</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Box mt={4}>
          <Table variant="simple" width="100%">
            <Tbody>
              {currentTodos.map((todo, index) => (
                <Tr key={todo._id}>
                  <TodoForm roomName={name} index={index} todo={todo} />
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
                    isPersisted: false,
                    is_checked: false,
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
                <Textarea placeholder="- [x] Do something" />
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
                <Button colorScheme="teal" onClick={onOpenBulkAddModal} mt={4}>
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
    index
  }: {
    roomName: string;
    todo: BaseTodo;
    index: number;
  }) => {
    const {
      control,
      formState: { errors },
      reset
    } = useForm({
      defaultValues: todo
    });

    useEffect(() => {
      previousValue.current = todo;
      reset(todo);
    }, [reset, todo]);

    const {
      isPersisted,
      _id: todoId,
      title,
      is_checked: isChecked
    } = useWatch({ control });
    const { addTodoMutation, updateTodoMutation, deleteTodoMutation } =
      useRoomMutations();

    const [isEditing, setIsEditing] = useState(!isPersisted);
    const previousValue = useRef<BaseTodo>(todo);

    function onSave() {
      // Finish save happens when the text field is blurred, or when
      // the checkbox tick is changed.
      if (!isPersisted) {
        addTodoMutation.mutate({
          name: roomName,
          todo: {
            title,
            is_checked: isChecked
          }
        });
      } else {
        updateTodoMutation.mutate({
          name: roomName,
          todo: {
            _id: todoId,
            isPersisted: true,
            title,
            is_checked: isChecked
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
          is_checked: e.target.checked
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
              name="is_checked"
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
          <Flex direction="row" justifyContent="flex-end">
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              colorScheme="teal"
              onClick={onSave}
              aria-label="Save"
              icon={<CheckIcon />}
            />
          </Flex>
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
            name="is_checked"
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

function resolveExistingTodos(todos: BaseTodo[]): BaseTodo[] {
  return todos.map((todo) => ({
    _id: generateHash(),
    isPersisted: true,
    ...todo
  }));
}
