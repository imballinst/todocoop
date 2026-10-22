import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  HStack,
  IconButton,
  Menu,
  Portal,
  Text,
  Textarea,
  useMediaQuery
} from '@chakra-ui/react';
import { MdExpandMore, MdMoreVert, MdOpenInNew } from 'react-icons/md';
import { useQueryClient } from '@tanstack/react-query';
import type { UseFieldArrayAppend } from 'react-hook-form';

import {
  copyTextToClipboard,
  getErrorMessage,
  parseRawTodoText
} from '../../lib/utils';
import { leaveRoom } from '../../lib/ui/query/rooms';
import type { BaseRoom, UiTodo } from '../../lib/models/types';
import type { RoomFormState } from './types';
import { AppLink } from '../AppLink';
import { toaster } from '../Toaster';

interface Props {
  currentTodos: UiTodo[];
  room: BaseRoom;
  // For demo purposes.
  onLeaveRoom?: () => void;
  append: UseFieldArrayAppend<RoomFormState, 'todos'>;
}

const MODAL_CAPTIONS: {
  [index in 'roomInfo' | 'todoImport']: {
    title: string;
  };
} = {
  roomInfo: {
    title: 'Room Information'
  },
  todoImport: {
    title: 'Import to-dos'
  }
};

export function ActionsMenu({
  currentTodos,
  room,
  onLeaveRoom: onLeaveRoomProp,
  append
}: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    'roomInfo' | 'todoImport' | undefined
  >();
  const [bulkEntries, setBulkEntries] = useState('');
  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);

  async function copyListToClipboard() {
    const currentTodosText = currentTodos
      .map((todo) => `- [${todo.isChecked ? 'x' : ' '}] ${todo.title}`)
      .join('\n');
    try {
      await copyTextToClipboard(currentTodosText);
      toaster.create({
        description: 'Copied all todos to clipboard.',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Failed to copy to clipboard.',
        description: getErrorMessage(err),
        type: 'error'
      });
    }
  }

  async function copyRoomInformationToClipboard() {
    const currentTodosText = `Room name: ${room.name}\nRoom password: ${room.password}`;

    try {
      await copyTextToClipboard(currentTodosText);
      toaster.create({
        description: 'Copied room information to clipboard.',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Failed to copy to clipboard.',
        description: getErrorMessage(err),
        type: 'error'
      });
    }
  }

  async function onLeaveRoom() {
    try {
      await leaveRoom({ name: room.name });
      queryClient.invalidateQueries({ queryKey: ['room'] });
    } catch (err) {
      console.error(err);
    }
  }

  async function onCreateBulk() {
    const bulkTodos = bulkEntries.split('\n');

    try {
      if (bulkTodos.length === 0) {
        throw new Error('The bulk entry field is required.');
      }

      append(
        bulkTodos.map((str, idx) => ({
          ...parseRawTodoText(str),
          indexOrder: currentTodos.length + idx + 0.01,
          state: 'added'
        }))
      );
      setIsOpen(false);
      setBulkEntries('');
    } catch (err) {
      console.error(err);
      toaster.create({
        title: 'Failed to create bulk todos.',
        description: getErrorMessage(err),
        type: 'error'
      });
    }
  }

  const onLeaveRoomClick = onLeaveRoomProp || onLeaveRoom;

  function openModal(mode: 'roomInfo' | 'todoImport') {
    setModalMode(mode);
    setIsOpen(true);
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          {isLargerThan768 ? (
            <Button variant="outline">
              Actions <MdExpandMore />
            </Button>
          ) : (
            <IconButton aria-label="Actions" variant="ghost">
              <MdMoreVert />
            </IconButton>
          )}
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="room-info"
                onClick={() => openModal('roomInfo')}
              >
                Room information
              </Menu.Item>
              <Menu.Item value="copy-list" onClick={copyListToClipboard}>
                Copy list to clipboard
              </Menu.Item>
              <Menu.Item
                value="bulk-todos"
                onClick={() => openModal('todoImport')}
              >
                Add bulk to-dos
              </Menu.Item>
              <Menu.Item value="leave-room" onClick={onLeaveRoomClick}>
                Leave room
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => {
          if (!details.open) setIsOpen(false);
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {modalMode !== undefined &&
                    MODAL_CAPTIONS[modalMode].title}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body py={4} px={6}>
                {modalMode === 'roomInfo' ? (
                  <>
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
                    <HStack mt={4} display="flex" gap={2}>
                      <Button
                        variant="solid"
                        onClick={copyRoomInformationToClipboard}
                      >
                        Copy to clipboard
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <Box flex="1">
                    <Field.Root>
                      <Field.Label htmlFor="bulk-entries">
                        Entries to Add
                      </Field.Label>
                      <Textarea
                        id="bulk-entries"
                        placeholder="- [x] Do something"
                        onChange={(e) => setBulkEntries(e.target.value)}
                        value={bulkEntries}
                      />
                      <Field.HelperText>
                        By default, each line will be added as a new unchecked
                        entry unless specified as checked. For more information,
                        see the{' '}
                        <AppLink
                          href="/how-to-use#add-bulk-to-dos"
                          isExternal
                        >
                          how to use section{' '}
                          <MdOpenInNew style={{ display: 'inline' }} />
                        </AppLink>
                        .
                      </Field.HelperText>
                    </Field.Root>

                    <Flex flexDirection="row" justifyContent="flex-end">
                      <Button onClick={onCreateBulk} mt={4}>
                        Add Bulk List
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
