import { ReactNode } from 'react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { InfoOutlineIcon, IconProps, WarningTwoIcon } from '@chakra-ui/icons';
import { Box, BoxProps } from '@chakra-ui/layout';
import { ComponentWithAs } from '@chakra-ui/system';
import { MDXProvider } from '@mdx-js/react';

const Heading1 = (props: any) => (
  <Box
    as="h1"
    {...props}
    fontWeight={700}
    fontSize="1.625rem"
    mb={4}
    id={
      props.children
        ? props.children.toString().toLowerCase().replace(/\s+/g, '-')
        : undefined
    }
  />
);
const Heading2 = (props: any) => (
  <Box
    as="h2"
    {...props}
    fontWeight={700}
    fontSize="1.5rem"
    my={4}
    id={
      props.children
        ? props.children.toString().toLowerCase().replace(/\s+/g, '-')
        : undefined
    }
  />
);
const Heading3 = (props: any) => (
  <Box
    as="h3"
    {...props}
    fontWeight={700}
    fontSize="1.25rem"
    my={4}
    id={
      props.children
        ? props.children.toString().toLowerCase().replace(/\s+/g, '-')
        : undefined
    }
  />
);
const Paragraph = (props: any) => <Box as="p" {...props} mb={3} />;
const Pre = (props: any) => (
  <Demo as="pre" {...props} p={6} fontSize="0.875rem" />
);
const Ol = (props: any) => <Box as="ol" {...props} ml={9} />;

const components = {
  Demo,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  pre: Pre,
  ol: Ol,
  // Admonitions.
  AdmonitionTip,
  AdmonitionWarning
};

export function CommonMdxComponentsProvider({
  children
}: {
  children: ReactNode;
}) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

// Admonitions.
type AdmonitionProps = BoxProps & {
  title: 'Tip' | 'Warning';
  Icon: ComponentWithAs<'svg', IconProps>;
};

function AdmonitionTip({ children }: BoxProps) {
  const bg = useColorModeValue('green.500', 'green.200');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Tip" Icon={InfoOutlineIcon}>
      {children}
    </Admonition>
  );
}

function AdmonitionWarning({ children }: BoxProps) {
  const bg = useColorModeValue('orange.500', 'orange.300');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Warning" Icon={WarningTwoIcon}>
      {children}
    </Admonition>
  );
}

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
        <Icon mr={1} />
        {title}
      </Box>

      <Box py={2} px={4} fontSize="0.875rem">
        {children}
      </Box>
    </Box>
  );
}
