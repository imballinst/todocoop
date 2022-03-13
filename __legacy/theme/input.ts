import { mode, getColor } from '@chakra-ui/theme-tools';
import { StyleObjectOrFn } from '@chakra-ui/styled-system';

// Mostly copied from https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/input.ts.
const variantOutline: StyleObjectOrFn = (props) => {
  return {
    field: getInputFieldStyle(props),
    addon: {
      border: '1px solid',
      borderColor: mode('inherit', 'whiteAlpha.50')(props),
      bg: mode('gray.100', 'whiteAlpha.300')(props)
    }
  };
};

const variants = {
  outline: variantOutline
};

const defaultProps = {
  variant: 'outline',
  colorScheme: 'teal'
};

const customInputTheme = {
  variants,
  defaultProps
};

// Exported for other inputs, e.g. text area.
export function getInputFieldStyle(props: any) {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaults(props);

  return {
    border: '1px solid',
    borderColor: mode('gray.200', 'whiteAlpha.300')(props),
    bg: 'transparent',
    _hover: {
      borderColor: mode('gray.300', 'whiteAlpha.400')(props)
    },
    _readOnly: {
      boxShadow: 'none !important',
      userSelect: 'all'
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    },
    _invalid: {
      borderColor: getColor(theme, ec),
      boxShadow: `0 0 0 1px ${getColor(theme, ec)}`
    },
    _focus: {
      zIndex: 1,
      borderColor: getColor(theme, fc),
      boxShadow: `0 0 0 1px ${getColor(theme, fc)}`
    }
  };
}
// Default input theme.
export default customInputTheme;

function getDefaults(props: Record<string, any>) {
  const { focusBorderColor: fc, errorBorderColor: ec } = props;
  return {
    focusBorderColor: fc || mode('teal.500', 'teal.300')(props),
    errorBorderColor: ec || mode('red.500', 'red.300')(props)
  };
}
