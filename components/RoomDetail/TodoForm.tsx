import { ReactNode } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  Textarea,
  TableCellProps,
  Td
} from '@chakra-ui/react';
import {
  Control,
  useController,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormSetFocus
} from 'react-hook-form';
import { generateHash } from '../../lib/utils';
import { BaseTodo } from '../../lib/models/types';
import { RoomFormState } from './types';

interface TodoFormBaseProps {
  todo: BaseTodo;
  index: number;
  control: Control<{ todos: BaseTodo[] }, object>;
  setFocus: UseFormSetFocus<RoomFormState>;
  // Field array actions.
  remove: UseFieldArrayRemove;
  insert: UseFieldArrayInsert<RoomFormState, 'todos'>;
}

export function TodoForm({
  todo,
  index,
  setFocus,
  control,
  remove,
  insert
}: TodoFormBaseProps) {
  const checkboxController = useController({
    control,
    name: `todos.${index}.isChecked`
  });
  const textareaController = useController({
    control,
    name: `todos.${index}.title`,
    rules: {
      required: true
    }
  });

  return (
    <>
      <TableColumn colSpan={2}>
        <Box display="flex">
          <Checkbox
            {...checkboxController.field}
            isChecked={checkboxController.field.value}
            value={todo.localId}
            autoFocus={false}
          />

          <FormControl ml={2}>
            <Textarea
              {...textareaController.field}
              resize="none"
              rows={1}
              ref={(node) => {
                textareaController.field.ref(node);

                if (node) {
                  // Make the height scale.
                  node.style.overflow = 'hidden';
                  node.style.height = '0';
                  node.style.height = node.scrollHeight + 'px';
                }
              }}
              onChange={(e) => {
                textareaController.field.onChange(e);

                // Make the height scale.
                e.target.style.overflow = 'hidden';
                e.target.style.height = '0';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (
                  textareaController.field.value === '' &&
                  e.key === 'Backspace' &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (index > 0) {
                    remove(index);
                    // Only set focus to the previous input if exists.
                    setFocus(`todos.${index - 1}.title`);
                  }
                } else if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();

                  insert(index + 1, {
                    localId: generateHash(),
                    isPersisted: false,
                    isChecked: false,
                    title: ''
                  });

                  setTimeout(() => {
                    // Wait until the next input mounts.
                    setFocus(`todos.${index + 1}.title`);
                  }, 100);
                }
              }}
            />

            {textareaController.fieldState.error && (
              <FormHelperText>
                {textareaController.fieldState.error.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      </TableColumn>

      <TableColumn width={1}>
        <IconButton
          minWidth="var(--chakra-sizes-6)"
          height="var(--chakra-sizes-6)"
          variant="ghost"
          colorScheme="teal"
          onClick={() => remove(index)}
          aria-label="Edit"
          icon={<DeleteIcon />}
          // Hide the first button for screen readers.
          aria-hidden={index === 0}
          // Visually hide the first button for non-screen readers.
          visibility={index > 0 ? 'unset' : 'hidden'}
        />
      </TableColumn>
    </>
  );
}

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return <Td {...props} paddingInline={3} py={2} />;
}
