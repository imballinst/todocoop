import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, BoxProps } from '@chakra-ui/layout';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import HowToUseMdx from '../docs/how-to-use.mdx';

const Heading1 = (props) => (
  <Box
    as="h1"
    {...props}
    fontWeight={700}
    fontSize="1.625rem"
    mb={4}
    id={props.children.toString().toLowerCase().replace(/\s+/g, '-')}
  />
);
const Heading2 = (props) => (
  <Box
    as="h2"
    {...props}
    fontWeight={700}
    fontSize="1.5rem"
    my={4}
    id={props.children.toString().toLowerCase().replace(/\s+/g, '-')}
  />
);
const Heading3 = (props) => (
  <Box
    as="h3"
    {...props}
    fontWeight={700}
    fontSize="1.25rem"
    my={4}
    id={props.children.toString().toLowerCase().replace(/\s+/g, '-')}
  />
);
const Paragraph = (props) => <Box as="p" {...props} mb={3} />;
const Pre = (props) => <Demo as="pre" {...props} p={6} fontSize="0.875rem" />;
const Ol = (props) => <Box as="ol" {...props} ml={9} />;

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  HowToUseRoomAccess: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseRoomAccess
    )
  ),
  HowToUseActionsMenu: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseActionsMenu
    )
  ),
  HowToModifyTodos: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToModifyTodos
    )
  ),
  Demo,
  Head,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  pre: Pre,
  ol: Ol,
  // Admonitions.
  Tip: dynamic(() =>
    import('../docs/mdx-components/common').then((all) => all.AdmonitionTip)
  ),
  Warning: dynamic(() =>
    import('../docs/mdx-components/common').then((all) => all.AdmonitionWarning)
  )
};

export function HowToUse() {
  return (
    <Box px={3} py={2} as="article">
      <HowToUseMdx components={components} />
    </Box>
  );
}

// Components.
function Demo({ children, ...props }: BoxProps) {
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
