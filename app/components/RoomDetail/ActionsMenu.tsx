import React, { useEffect, useState } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useMediaQuery,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  Portal
} from '@chakra-ui/react';
import { Box, Flex, HStack } from '@chakra-ui/layout';
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal';
import { MdMoreVert } from 'react-icons/md';
import { UseFieldArrayAppend } from 'react-hook-form';

import { copyTextToClipboard, parseRawTodoText } from '~/lib/utils';
import { BaseRoom, UiTodo } from '~/lib/models/types';
import { RoomFormState } from './types';
import { AppLink } from '../AppLink';
import { useFetcher } from 'remix';

interface Props {
  currentTodos: UiTodo[];
  room: BaseRoom;
  // For demo purposes.
  onLeaveRoom?: () => void;
  append: UseFieldArrayAppend<RoomFormState, 'todos'>;
}

const MENU_BUTTON_MD = (
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    Actions
  </MenuButton>
);
const MENU_BUTTON_SM = (
  <MenuButton
    as={IconButton}
    aria-label="Actions"
    icon={<MdMoreVert />}
    variant="ghost"
  />
);

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [modalMode, setModalMode] = useState<
    'roomInfo' | 'todoImport' | undefined
  >();
  const [bulkEntries, setBulkEntries] = useState('');
  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);

  // Need to store the button in a state, because otherwise there will be styling
  // mismatch(es). Read more about it here: https://github.com/vercel/next.js/discussions/17443#discussioncomment-87097.
  const [menuButton, setMenuButton] = useState(MENU_BUTTON_MD);

  useEffect(() => {
    setMenuButton(isLargerThan768 ? MENU_BUTTON_MD : MENU_BUTTON_SM);
  }, [isLargerThan768]);

  async function copyListToClipboard() {
    const currentTodosText = currentTodos
      .map((todo) => `- [${todo.isChecked ? 'x' : ' '}] ${todo.title}`)
      .join('\n');
    try {
      await copyTextToClipboard(currentTodosText);
      toast({
        description: 'Copied all todos to clipboard.',
        status: 'success'
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Failed to copy to clipboard.',
        description: err.message,
        status: 'error'
      });
    }
  }

  async function copyRoomInformationToClipboard() {
    const currentTodosText = `Room name: ${room.name}\nRoom password: ${room.password}`;

    try {
      await copyTextToClipboard(currentTodosText);
      toast({
        description: 'Copied room information to clipboard.',
        status: 'success'
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Failed to copy to clipboard.',
        description: err.message,
        status: 'error'
      });
    }
  }

  const leaveRoomFether = useFetcher();

  async function onLeaveRoom() {
    try {
      leaveRoomFether.submit(
        { body: JSON.stringify({ name: room.name }) },
        { method: 'post' }
      );
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
      onClose();
      setBulkEntries('');
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Failed to create bulk todos.',
        description: err.message,
        status: 'error'
      });
    }
  }

  const onLeaveRoomClick = onLeaveRoomProp || onLeaveRoom;

  return (
    <>
      <Menu>
        {menuButton}

        <Portal>
          <MenuList>
            <MenuItem
              onClick={() => {
                onOpen();
                setModalMode('roomInfo');
              }}
            >
              Room information
            </MenuItem>
            <MenuItem onClick={copyListToClipboard}>
              Copy list to clipboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                onOpen();
                setModalMode('todoImport');
              }}
            >
              Add bulk to-dos
            </MenuItem>
            <MenuItem onClick={onLeaveRoomClick}>Leave room</MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalMode !== undefined && MODAL_CAPTIONS[modalMode].title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4} px={6}>
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
                <HStack mt={4} display="flex" spacing={2}>
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
                    <AppLink href="/how-to-use#add-bulk-to-dos" isExternal>
                      how to use section <ExternalLinkIcon mx="2px" />
                    </AppLink>
                    .
                  </FormHelperText>
                </FormControl>

                <Flex flexDirection="row" justifyContent="flex-end">
                  <Button onClick={onCreateBulk} mt={4}>
                    Add Bulk List
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
