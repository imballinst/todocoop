import React from 'react';
import { Text, useMediaQuery } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
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

export function HelpMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery(['(min-width: 768px)']);

  return (
    <>
      {isLargerThan768 ? (
        <Button onClick={onOpen}>Help</Button>
      ) : (
        <IconButton
          aria-label="Help"
          onClick={onOpen}
          icon={<QuestionOutlineIcon />}
          variant="ghost"
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to Use</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4} px={6}>
            <Text></Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
