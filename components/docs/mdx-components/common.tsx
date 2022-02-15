import { useColorModeValue } from '@chakra-ui/color-mode';
import { InfoOutlineIcon, IconProps, WarningTwoIcon } from '@chakra-ui/icons';
import { Box, BoxProps } from '@chakra-ui/layout';
import { ComponentWithAs } from '@chakra-ui/system';

// Admonitions.
type AdmonitionProps = BoxProps & {
  title: 'Tip' | 'Warning';
  Icon: ComponentWithAs<'svg', IconProps>;
};

export function AdmonitionTip({ children }: BoxProps) {
  const bg = useColorModeValue('green.500', 'green.200');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Tip" Icon={InfoOutlineIcon}>
      {children}
    </Admonition>
  );
}

export function AdmonitionWarning({ children }: BoxProps) {
  const bg = useColorModeValue('orange.500', 'orange.300');
  const color = useColorModeValue('white', 'black');

  return (
    <Admonition bg={bg} color={color} title="Warning" Icon={WarningTwoIcon}>
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
        <Icon mr={1} />
        {title}
      </Box>

      <Box py={2} px={4} fontSize="0.875rem">
        {children}
      </Box>
    </Box>
  );
}
