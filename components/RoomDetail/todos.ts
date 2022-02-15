import { useCallback, useEffect, useRef } from 'react';
import { useFieldArray, UseFieldArrayInsert, useForm } from 'react-hook-form';
import { UiRoom, UiTodo } from '../../lib/models/types';
import { RoomFormState } from './types';

interface UseTodoParams {
  roomTodos: UiTodo[];
  limit?: number;
}

export function useTodos({ roomTodos, limit }: UseTodoParams) {
  const { control, handleSubmit, setFocus, reset } = useForm<RoomFormState>({
    mode: 'onBlur',
    defaultValues: {
      todos: roomTodos
    }
  });
  const {
    fields: todos,
    remove: fieldArrayRemove,
    insert: fieldArrayInsert,
    append,
    update
  } = useFieldArray({ control, name: 'todos' });
  const lastIndexRef = useRef(todos.length);
  const removedTodosRef = useRef<UiTodo[]>([]);

  useEffect(() => {
    reset({ todos: roomTodos });
    lastIndexRef.current = roomTodos.length - 1;
  }, [reset, roomTodos]);

  const remove = useCallback(
    (todo: UiTodo, index: number) => {
      removedTodosRef.current.push(todo);
      fieldArrayRemove(index);
    },
    [fieldArrayRemove]
  );

  const insert = useCallback<UseFieldArrayInsert<UiRoom>>(
    (...args) => {
      if (limit === undefined || lastIndexRef.current + 1 < limit) {
        fieldArrayInsert(...args);
      }
    },
    [limit, fieldArrayRemove]
  );

  const fieldArrayActions = { remove, insert, setFocus, update, append };

  return {
    control,
    handleSubmit,
    reset,
    todos,
    lastIndexRef,
    removedTodosRef,
    fieldArrayActions
  };
}
