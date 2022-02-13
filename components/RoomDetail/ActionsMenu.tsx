import React, { useEffect, useState } from 'react';
import {
  Text,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  useToast,
  useMediaQuery
} from '@chakra-ui/react';
import {
  FormHelperText,
  FormControl,
  FormLabel
} from '@chakra-ui/form-control';
import { Box, Flex } from '@chakra-ui/layout';
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

import { copyTextToClipboard, getErrorMessage } from '../../lib/ui/utils';
import { leaveRoom } from '../../lib/ui/query/rooms';
import { BaseRoom, BaseTodo } from '../../lib/models/types';
import { useQueryClient } from 'react-query';

interface Props {
  currentTodos: BaseTodo[];
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
          <MenuItem onClick={onCopyToClipboard}>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
