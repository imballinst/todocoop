import React, { useEffect, useState } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useMediaQuery
} from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/layout';
import { ChevronDownIcon } from '@chakra-ui/icons';
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

import { copyTextToClipboard, getErrorMessage } from '../../lib/utils';
import { leaveRoom } from '../../lib/ui/query/rooms';
import { BaseRoom, UiTodo } from '../../lib/models/types';
import { useQueryClient } from 'react-query';

interface Props {
  currentTodos: UiTodo[];
  room: BaseRoom;
  // For demo purposes.
  onLeaveRoom?: () => void;
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

export function ActionsMenu({
  currentTodos,
  room,
  onLeaveRoom: onLeaveRoomProp
}: Props) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to copy to clipboard.',
        description: getErrorMessage(err),
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
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to copy to clipboard.',
        description: getErrorMessage(err),
        status: 'error'
      });
    }
  }

  async function onLeaveRoom() {
    try {
      await leaveRoom({ name: room.name });
      queryClient.invalidateQueries('room');
    } catch (err) {
      console.error(err);
    }
  }

  const onLeaveRoomClick = onLeaveRoomProp || onLeaveRoom;

  return (
    <>
      <Menu>
        {menuButton}

        <MenuList>
          <MenuItem onClick={onOpen}>Room information</MenuItem>
          <MenuItem onClick={copyListToClipboard}>
            Copy list to clipboard
          </MenuItem>
          <MenuItem onClick={onLeaveRoomClick}>Leave room</MenuItem>
        </MenuList>
      </Menu>

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
            <HStack mt={4} display="flex" spacing={2}>
              <Button variant="solid" onClick={copyRoomInformationToClipboard}>
                Copy to clipboard
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
