import { BaseTodo } from './models/types';

export function mergeTodos<TModelTodo extends BaseTodo>({
  added,
  removed,
  modified,
  base
}: {
  base: TModelTodo[];
  added: TModelTodo[];
  removed: BaseTodo[];
  modified: BaseTodo[];
}) {
  const removedLocalIds = removed.map((todo) => todo.localId);
  let resolvedTodos = base;

  // Remove deleted todos.
  resolvedTodos = resolvedTodos.filter(
    (todo) => !removedLocalIds.includes(todo.localId)
  );

  // Modify modified todos.
  for (const todo of modified) {
    const serverTodo = resolvedTodos.find((el) => el.localId === todo.localId);

    if (serverTodo) {
      const serverUpdatedAt = new Date(serverTodo.updatedAt).getTime();
      const clientUpdatedAt = new Date(todo.updatedAt).getTime();

      if (clientUpdatedAt > serverUpdatedAt) {
        for (const key in todo) {
          serverTodo[key] = todo[key];
        }
      }
    }
  }

  // Add added todos.
  return resolvedTodos
    .concat(added)
    .sort((a, b) => a.indexOrder - b.indexOrder);
}
