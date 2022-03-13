import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../../lib/server/middlewares';
import { Room, RoomModel, Todo, TodoModel } from '../../../../lib/models';
import {
  ApiResponse,
  ExtendedNextApiRequest
} from '../../../../lib/server/types';
import { BaseTodo } from '../../../../lib/models/types';
import { mergeTodos } from '../../../../lib/todos';

async function syncTodosHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<Room> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    const roomQuery = RoomModel.findOne({
      name: req.query.name as string
    });
    const roomObject = await roomQuery.exec();

    if (roomObject === null) {
      throw new Error('Invalid room information.');
    }

    const { added, modified, removed } = req.body as {
      added: BaseTodo[];
      modified: BaseTodo[];
      removed: BaseTodo[];
    };
    const removedLocalIds = removed.map((todo) => todo.localId);
    let resolvedTodos = roomObject.todos;

    // Remove deleted todos.
    resolvedTodos = resolvedTodos.filter(
      (todo) => !removedLocalIds.includes(todo.localId)
    );

    // Modify modified todos.
    for (const todo of modified) {
      const serverTodo = resolvedTodos.find(
        (el) => el.localId === todo.localId
      );

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
    const addedTodoModels = added.map((todo) => new TodoModel(todo));
    roomObject.todos = mergeTodos({
      added: addedTodoModels,
      removed,
      modified,
      base: resolvedTodos
    });
    // Fix the order of the todos.
    for (let i = 0; i < roomObject.todos.length; i++) {
      roomObject.todos[i].indexOrder = i;
    }
    await roomObject.save();

    res.status(200);
    response.data = roomObject;
  } catch (err) {
    console.error(err);
    res.status(400);
    response.errors = [
      {
        code: '10000',
        message: err.message
      }
    ];
  }

  res.json(response);
}

export default withSession(withDB(syncTodosHandler));
