import type { MutableRefObject, ReactNode } from 'react';
import {
  Box,
  Checkbox,
  Field,
  IconButton,
  Table,
  Textarea,
  type TableCellProps
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import {
  type Control,
  useController,
  type UseFieldArrayInsert,
  type UseFieldArrayReturn,
  type UseFormSetFocus
} from 'react-hook-form';
import { generateHash } from '../../lib/utils';
import type { UiTodo } from '../../lib/models/types';
import type { RoomFormState } from './types';

interface TodoFormBaseProps {
  todo: UiTodo;
  index: number;
  control: Control<{ todos: UiTodo[] }, object>;
  lastIndexRef: MutableRefObject<number>;
  // Field array actions.
  setFocus: UseFormSetFocus<RoomFormState>;
  remove: (todo: UiTodo, index: number) => void;
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
        <Box display="flex" alignItems="center">
          <Checkbox.Root
            checked={checkboxController.field.value}
            name={checkboxController.field.name}
            onCheckedChange={(details) => {
              const isChecked = details.checked === true;

              checkboxController.field.onChange(isChecked);
              update(index, {
                ...todo,
                isChecked,
                updatedAt: new Date().toISOString(),
                state: todo.state === 'added' ? 'added' : 'modified'
              });
            }}
          >
            <Checkbox.HiddenInput ref={checkboxController.field.ref} />
            <Checkbox.Control />
          </Checkbox.Root>

          <Field.Root
            ml={2}
            invalid={textareaController.fieldState.error !== undefined}
          >
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
              onFocus={(e) => {
                e.currentTarget.selectionStart = e.currentTarget.value.length;
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
                      // Instead of adding this by 1, add by 0.01 instead.
                      // The intention is that, the other devices will always see the same order. Perhpas.
                      indexOrder: index + 0.01,
                      title: '',
                      updatedAt: new Date().toISOString()
                    },
                    {
                      focusName: `todos.${index + 1}.title`
                    }
                  );
                }
              }}
            />

            {textareaController.fieldState.error && (
              <Field.ErrorText>
                {textareaController.fieldState.error.message}
              </Field.ErrorText>
            )}
          </Field.Root>
        </Box>
      </TableColumn>

      <TableColumn width={1}>
        <IconButton
          minWidth={6}
          height={6}
          variant="ghost"
          colorPalette="teal"
          onClick={() => remove(todo, index)}
          aria-label="Delete"
          // Hide the first button for screen readers.
          aria-hidden={index === 0}
          // Visually hide the first button for non-screen readers.
          visibility={index > 0 ? 'unset' : 'hidden'}
        >
          <MdDelete />
        </IconButton>
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
        <Box display="flex" alignItems="center">
          <Checkbox.Root aria-hidden={true} visibility="hidden" tabIndex={-1}>
            <Checkbox.Control />
          </Checkbox.Root>

          <Field.Root ml={2}>
            <Textarea
              resize="none"
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
          </Field.Root>
        </Box>
      </TableColumn>

      <TableColumn width={1}>
        <IconButton
          minWidth={6}
          height={6}
          aria-label="Delete"
          aria-hidden={true}
          visibility="hidden"
        >
          <MdDelete />
        </IconButton>
      </TableColumn>
    </>
  );
}

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return (
    <Table.Cell
      {...props}
      paddingInline={3}
      py={2}
      borderBottom="0"
      borderColor="transparent"
    />
  );
}
