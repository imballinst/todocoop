import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  CheckIcon,
  DeleteIcon,
  EditIcon,
  SmallCloseIcon
} from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  HStack,
  IconButton,
  Input,
  TableCellProps,
  Td
} from '@chakra-ui/react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo
} from '../../lib/ui/hooks';
import { replaceArrayElementAtIndex } from '../../lib/utils';
import { BaseTodo } from '../../lib/models/types';
import { createTodo, deleteTodo, updateTodo } from '../../lib/ui/query/rooms';

interface TodoFormBaseProps {
  roomName: string;
  todo: BaseTodo;
  index: number;
  localIdToEditedListElementMap: MutableRefObject<Record<string, BaseTodo>>;
  setCurrentTodos: Dispatch<SetStateAction<BaseTodo[]>>;
}

export function TodoForm(props: TodoFormBaseProps) {
  const createTodoMutation = useCreateTodo(createTodo);
  const updateTodoMutation = useUpdateTodo(updateTodo);
  const deleteTodoMutation = useDeleteTodo(deleteTodo);

  return (
    <TodoFormRaw
      {...props}
      createTodoMutation={createTodoMutation}
      updateTodoMutation={updateTodoMutation}
      deleteTodoMutation={deleteTodoMutation}
    />
  );
}

export function TodoFormRaw({
  roomName,
  todo,
  index,
  localIdToEditedListElementMap,
  setCurrentTodos,
  createTodoMutation,
  updateTodoMutation,
  deleteTodoMutation
}: TodoFormBaseProps & {
  // These are from `useRoomMutations`.
  createTodoMutation: ReturnType<typeof useCreateTodo>;
  updateTodoMutation: ReturnType<typeof useUpdateTodo>;
  deleteTodoMutation: ReturnType<typeof useDeleteTodo>;
}) {
  const {
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: todo
  });

  const {
    isPersisted,
    _id: todoId,
    localId,
    title,
    isChecked
  } = useWatch({ control });

  const [isEditing, setIsEditing] = useState(!isPersisted);
  const previousValue = useRef<BaseTodo>(todo);

  useEffect(() => {
    if (!isEditing) {
      previousValue.current = todo;
      reset(todo);
    }
  }, [isEditing, todo, reset]);

  useEffect(() => {
    if (isEditing) {
      localIdToEditedListElementMap.current[localId] = {
        isPersisted,
        _id: todoId,
        localId,
        title,
        isChecked
      };
    }
  }, [
    localIdToEditedListElementMap,
    localId,
    isEditing,
    isPersisted,
    todoId,
    isChecked,
    title
  ]);

  function onSave() {
    // Finish save happens when the text field is blurred, or when
    // the checkbox tick is changed.
    if (!isPersisted) {
      createTodoMutation.mutate({
        name: roomName,
        todo: {
          title,
          localId,
          isChecked,
          isPersisted: true
        }
      });
    } else {
      updateTodoMutation.mutate({
        name: roomName,
        todo: {
          _id: todoId,
          localId,
          isPersisted: true,
          title,
          isChecked
        }
      });
    }

    previousValue.current = todo;
    setIsEditing(false);
  }

  function onChangeTick(e: ChangeEvent<HTMLInputElement>) {
    previousValue.current = todo;
    updateTodoMutation.mutate({
      name: roomName,
      todo: {
        _id: todoId,
        localId,
        isPersisted: true,
        title,
        isChecked: e.target.checked
      }
    });
  }

  function onDelete() {
    deleteTodoMutation.mutate({ name: roomName, todoId: todo._id });
  }

  return isEditing ? (
    <>
      <TableColumn colSpan={2}>
        <Box display="flex">
          <Controller
            render={({ field }) => (
              <Checkbox
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                isChecked={field.value}
                ref={field.ref}
              />
            )}
            name="isChecked"
            control={control}
          />

          <FormControl ml={2}>
            <Controller
              render={({ field }) => <Input {...field} />}
              name="title"
              control={control}
            />

            {errors[index]?.title && (
              <FormHelperText>{errors[index]?.title}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </TableColumn>

      <TableColumn width={1}>
        <HStack spacing={2} direction="row" justifyContent="flex-end">
          <IconButton
            minWidth="var(--chakra-sizes-6)"
            height="var(--chakra-sizes-6)"
            variant="ghost"
            colorScheme="teal"
            onClick={() => {
              localIdToEditedListElementMap.current[localId] = undefined;

              if (todo.isPersisted) {
                setIsEditing(false);
              } else {
                setCurrentTodos((oldState) => {
                  const idxToDelete = oldState.findIndex(
                    (el) => el.localId === todo.localId
                  );
                  return replaceArrayElementAtIndex(oldState, idxToDelete);
                });
              }
            }}
            aria-label="Cancel"
            icon={<SmallCloseIcon />}
          />
          <IconButton
            minWidth="var(--chakra-sizes-6)"
            height="var(--chakra-sizes-6)"
            variant="ghost"
            colorScheme="teal"
            onClick={onSave}
            aria-label="Save"
            icon={<CheckIcon />}
          />
        </HStack>
      </TableColumn>
    </>
  ) : (
    <>
      <TableColumn colSpan={2}>
        <Controller
          render={({ field }) => (
            <Checkbox
              name={field.name}
              onBlur={field.onBlur}
              isChecked={field.value}
              ref={field.ref}
              onChange={(e) => {
                field.onChange(e);
                onChangeTick(e);
              }}
              colorScheme="teal"
            >
              {todo.title || title}
            </Checkbox>
          )}
          name="isChecked"
          control={control}
        />
      </TableColumn>
      <TableColumn width={1}>
        <HStack spacing={2} direction="row" justifyContent="flex-end">
          <IconButton
            minWidth="var(--chakra-sizes-6)"
            height="var(--chakra-sizes-6)"
            variant="ghost"
            colorScheme="teal"
            onClick={() => setIsEditing(true)}
            aria-label="Edit"
            icon={<EditIcon />}
          />
          <IconButton
            minWidth="var(--chakra-sizes-6)"
            height="var(--chakra-sizes-6)"
            variant="ghost"
            colorScheme="teal"
            onClick={onDelete}
            aria-label="Edit"
            icon={<DeleteIcon />}
          />
        </HStack>
      </TableColumn>
    </>
  );
}

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return <Td {...props} paddingInline={3} py={2} />;
}
