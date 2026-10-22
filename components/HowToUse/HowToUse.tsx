import type { ComponentType, ReactNode } from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';

import HowToUseMdx from '../docs/how-to-use.mdx';
import {
  HowToUseActionsMenu,
  HowToModifyTodos,
  HowToUseRoomAccess
} from '../docs/mdx-components/how-to-use';
import {
  AdmonitionTip,
  AdmonitionWarning
} from '../docs/mdx-components/common';
import { useColorModeValue } from '../../lib/ui/color-mode';

const Heading1 = (props) => (
  <Box
    as="h1"
    {...props}
    fontWeight={700}
    fontSize="1.625rem"
    mb={4}
    id={String(props.children).toLowerCase().replace(/\s+/g, '-')}
  />
);
const Heading2 = (props) => (
  <Box
    as="h2"
    {...props}
    fontWeight={700}
    fontSize="1.5rem"
    my={4}
    id={String(props.children).toLowerCase().replace(/\s+/g, '-')}
  />
);
const Heading3 = (props) => (
  <Box
    as="h3"
    {...props}
    fontWeight={700}
    fontSize="1.25rem"
    my={4}
    id={String(props.children).toLowerCase().replace(/\s+/g, '-')}
  />
);
const Paragraph = (props) => <Box as="p" {...props} mb={3} />;
const Pre = (props) => <Demo as="pre" {...props} p={6} fontSize="0.875rem" />;
const Ol = (props) => <Box as="ol" {...props} ml={9} />;

// Custom components/renderers to pass to MDX.
const components: Record<string, ComponentType<any>> = {
  HowToUseRoomAccess,
  HowToUseActionsMenu,
  HowToModifyTodos,
  Demo,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  pre: Pre,
  ol: Ol,
  Tip: AdmonitionTip,
  Warning: AdmonitionWarning
};

export function HowToUse() {
  return (
    <Box px={3} py={2} as="article">
      <HowToUseMdx components={components} />
    </Box>
  );
}

// Components.
function Demo({ children, ...props }: BoxProps & { children?: ReactNode }) {
  const borderColor = useColorModeValue('gray.800', 'gray.600');

  return (
    <Box
      my={4}
      p={4}
      borderColor={borderColor}
      borderWidth={1}
      borderStyle="dotted"
      rounded="md"
      {...props}
    >
      {children}
    </Box>
  );
}
