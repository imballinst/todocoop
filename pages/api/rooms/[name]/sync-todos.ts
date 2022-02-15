import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../../lib/server/middlewares';
import { Room, RoomModel, Todo, TodoModel } from '../../../../lib/models';
import {
  ApiResponse,
  ExtendedNextApiRequest
} from '../../../../lib/server/types';
import { BaseTodo } from '../../../../lib/models/types';

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
      modified: Todo[];
      removed: Todo[];
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
          serverTodo.set(todo);
        }
      }
    }

    // Add added todos.
    const addedTodoModels = added.map((todo) => new TodoModel(todo));
    resolvedTodos = resolvedTodos
      .concat(addedTodoModels)
      .sort((a, b) => a.indexOrder - b.indexOrder)
      .map(
        (todo, idx) =>
          ({
            ...todo,
            indexOrder: idx + 1
          } as Todo)
      );

    roomObject.todos = resolvedTodos;
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
