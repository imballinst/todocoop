import { MutableRefObject, ReactNode } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  IconButton,
  Textarea,
  TableCellProps,
  Td
} from '@chakra-ui/react';
import {
  Control,
  useController,
  UseFieldArrayInsert,
  UseFieldArrayReturn,
  UseFormSetFocus
} from 'react-hook-form';
import { generateHash } from '../../lib/utils';
import { UiTodo } from '../../lib/models/types';
import { RoomFormState } from './types';

interface TodoFormBaseProps {
  todo: UiTodo;
  index: number;
  control: Control<{ todos: UiTodo[] }, object>;
  lastIndexRef: MutableRefObject<number>;
  // Field array actions.
  setFocus: UseFormSetFocus<RoomFormState>;
  remove: (todo: UiTodo, index: number) => void;
  // TODO(imballinst): update this after https://github.com/react-hook-form/react-hook-form/issues/7821
  // is responded.
  update: UseFieldArrayReturn<RoomFormState, 'todos', 'id'>['update'];
  insert: UseFieldArrayInsert<RoomFormState, 'todos'>;
}

export function TodoForm({
  todo,
  index,
  control,
  lastIndexRef,
  setFocus,
  remove,
  insert,
  update
}: TodoFormBaseProps) {
  const checkboxController = useController({
    control,
    name: `todos.${index}.isChecked`
  });
  const textareaController = useController({
    control,
    name: `todos.${index}.title`,
    rules: {
      required: 'This field is required'
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
            onChange={(e) => {
              checkboxController.field.onChange(e);
              update(index, {
                ...todo,
                isChecked: e.target.checked,
                updatedAt: new Date().toISOString(),
                state: todo.state === 'added' ? 'added' : 'modified'
              });
            }}
          />

          <FormControl
            ml={2}
            isInvalid={textareaController.fieldState.error !== undefined}
          >
            <Textarea
              {...textareaController.field}
              resize="none"
              // isInvalid={textareaController.fieldState.error !== undefined}
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
                update(index, {
                  ...todo,
                  title: e.target.value,
                  updatedAt: new Date().toISOString(),
                  state: todo.state === 'added' ? 'added' : 'modified'
                });

                // Make the height scale.
                e.target.style.overflow = 'hidden';
                e.target.style.height = '0';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'ArrowUp' &&
                  e.currentTarget.selectionStart === 0
                ) {
                  // Arrow up and start of the text area, go to the previous text input.
                  if (index > 0) {
                    e.preventDefault();
                    setFocus(`todos.${index - 1}.title`);
                  }
                } else if (
                  e.key === 'ArrowDown' &&
                  e.currentTarget.selectionStart === todo.title.length
                ) {
                  // Arrow down and at the end of the text area, go to the next text input.
                  if (index < lastIndexRef.current) {
                    e.preventDefault();
                    setFocus(`todos.${index + 1}.title`);
                  }
                } else if (
                  textareaController.field.value === '' &&
                  e.key === 'Backspace' &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  if (index > 0) {
                    remove(todo, index);
                    // Only set focus to the previous input if exists.
                    setFocus(`todos.${index - 1}.title`);
                  }
                } else if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();

                  insert(
                    index + 1,
                    {
                      localId: generateHash(),
                      state: 'added',
                      isChecked: false,
                      indexOrder: index + 1,
                      title: ''
                    },
                    {
                      focusName: `todos.${index + 1}.title`
                    }
                  );
                }
              }}
            />

            {textareaController.fieldState.error && (
              <FormErrorMessage>
                {textareaController.fieldState.error.message}
              </FormErrorMessage>
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
          onClick={() => remove(todo, index)}
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

export function TodoFormPlaceholder({
  insert
}: Pick<TodoFormBaseProps, 'insert'>) {
  return (
    <>
      <TableColumn colSpan={2}>
        <Box display="flex">
          <Checkbox aria-hidden={true} visibility="hidden" />

          <FormControl ml={2}>
            <Textarea
              onFocus={() => {
                insert(
                  0,
                  {
                    indexOrder: 0,
                    isChecked: false,
                    localId: generateHash(),
                    state: 'added',
                    title: '',
                    updatedAt: new Date().toISOString()
                  },
                  {
                    focusName: `todos.0.title`
                  }
                );
              }}
              rows={1}
              ref={(node) => {
                if (node) {
                  // Make the height scale.
                  node.style.overflow = 'hidden';
                  node.style.height = '0';
                  node.style.height = node.scrollHeight + 'px';
                }
              }}
            />
          </FormControl>
        </Box>
      </TableColumn>

      <TableColumn width={1}>
        <IconButton
          minWidth="var(--chakra-sizes-6)"
          height="var(--chakra-sizes-6)"
          aria-label="Edit"
          icon={<DeleteIcon />}
          aria-hidden={true}
          visibility="hidden"
        />
      </TableColumn>
    </>
  );
}

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return (
    <Td
      {...props}
      paddingInline={3}
      py={2}
      borderBottom="0"
      borderColor="transparent"
    />
  );
}
