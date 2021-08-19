import {
  ChangeEvent,
  Dispatch,
  memo,
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
import { useRoomMutations } from '../../lib/hooks';
import { replaceArrayElementAtIndex } from '../../lib/utils';
import { Dictionary } from '../../types';
import { BaseTodo } from '../../types/models';

export const TodoForm = memo(
  ({
    roomName,
    todo,
    index,
    localIdToEditedListElementMap,
    setCurrentTodos
  }: {
    roomName: string;
    todo: BaseTodo;
    index: number;
    localIdToEditedListElementMap: MutableRefObject<Dictionary<BaseTodo>>;
    setCurrentTodos: Dispatch<SetStateAction<BaseTodo[]>>;
  }) => {
    const {
      control,
      formState: { errors },
      reset
    } = useForm({
      defaultValues: todo
    });

    const { isPersisted, _id: todoId, localId, title, isChecked } = useWatch({
      control
    });

    const {
      addTodoMutation,
      updateTodoMutation,
      deleteTodoMutation
    } = useRoomMutations();

    const [isEditing, setIsEditing] = useState(!isPersisted);
    const previousValue = useRef<BaseTodo>(todo);

    useEffect(() => {
      if (
        !isEditing &&
        !addTodoMutation.isError &&
        !updateTodoMutation.isError
      ) {
        previousValue.current = todo;
        reset(todo);
      }
    }, [
      addTodoMutation.isError,
      updateTodoMutation.isError,
      isEditing,
      todo,
      reset
    ]);

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
        addTodoMutation.mutate({
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
        <TableColumn colSpan={2} borderColor="teal">
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
              onClick={onSave}
              aria-label="Save"
              icon={<CheckIcon />}
            />
          </HStack>
        </TableColumn>
      </>
    ) : (
      <>
        <TableColumn colSpan={2} borderColor="teal">
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
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
              icon={<EditIcon />}
            />
            <IconButton
              minWidth="var(--chakra-sizes-6)"
              height="var(--chakra-sizes-6)"
              variant="ghost"
              onClick={onDelete}
              aria-label="Edit"
              icon={<DeleteIcon />}
            />
          </HStack>
        </TableColumn>
      </>
    );
  }
);

function TableColumn(props: { children: ReactNode } & TableCellProps) {
  return <Td {...props} paddingInline={3} py={2} />;
}
