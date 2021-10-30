import { mode } from '@chakra-ui/theme-tools';
import { StyleObjectOrFn } from '@chakra-ui/styled-system';

const variantOutline: StyleObjectOrFn = (props) => {
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);
  const borderFocusedColor = mode(`teal.200`, `teal.500`)(props);

  return {
    field: {
      border: '1px solid',
      borderColor: 'gray.200',
      boxShadow: 'none',
      _focus: {
        borderColor: borderFocusedColor
      }
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

export default customInputTheme;
