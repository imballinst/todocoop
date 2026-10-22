import type { ReactNode } from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';
import { MdInfoOutline, MdWarningAmber } from 'react-icons/md';

import { useColorModeValue } from '../../../lib/ui/color-mode';

// Admonitions.
type AdmonitionProps = {
  title: 'Tip' | 'Warning';
  Icon: typeof MdInfoOutline;
  bg: string;
  color: string;
  children?: ReactNode;
};

export function AdmonitionTip({ children }: BoxProps) {
  const bg = useColorModeValue('green.500', 'green.200');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Tip" Icon={MdInfoOutline}>
      {children}
    </Admonition>
  );
}

export function AdmonitionWarning({ children }: BoxProps) {
  const bg = useColorModeValue('orange.500', 'orange.300');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Warning" Icon={MdWarningAmber}>
      {children}
    </Admonition>
  );
}

function Admonition({ children, bg, color, title, Icon }: AdmonitionProps) {
  return (
    <Box my={6} borderWidth="thin" borderColor={bg} rounded="md">
      <Box
        mb={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        textTransform="uppercase"
        fontWeight={700}
        bg={bg}
        color={color}
        py={2}
        px={4}
      >
        <Icon style={{ marginRight: 4 }} />
        {title}
      </Box>

      <Box py={2} px={4} fontSize="0.875rem">
        {children}
      </Box>
    </Box>
  );
}
