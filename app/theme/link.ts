import { mode } from '@chakra-ui/theme-tools';
import { StyleObjectOrFn } from '@chakra-ui/styled-system';

// Mostly copied from https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/input.ts.
const variantNormal: StyleObjectOrFn = (props) => {
  return {
    color: mode('teal.500', 'teal.300')(props),
    bg: 'transparent',
    _hover: {
      textDecoration: 'underline'
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    }
  };
};

const variants = {
  normal: variantNormal
};

const defaultProps = {
  variant: 'normal',
  colorScheme: 'teal'
};

const customLinkTheme = {
  variants,
  defaultProps
};

export default customLinkTheme;
