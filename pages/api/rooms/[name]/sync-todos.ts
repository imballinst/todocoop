import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../../lib/server/middlewares';
import { Room, RoomModel, Todo, TodoModel } from '../../../../lib/models';
import {
  ApiResponse,
  ExtendedNextApiRequest
} from '../../../../lib/server/types';

// TODO(imballinst): I think this is lost cause.
// We need to track which todos are added, modified, and removed in the client.
// Then, we pass it to this API, then this API resolves it.
async function syncTodosHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<{
    room: Room;
    conflictingTodos: Todo[];
  }> = {};

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

    response.data = { room: roomObject, conflictingTodos: [] };

    const clientTodos: Todo[] = req.body.todos;
    const serverTodos = roomObject.todos;
    const resolvedTodos: Todo[] = [];
    const conflictingTodos: Todo[] = [];

    for (let i = 0; i < clientTodos.length; i++) {
      const clientTodo = clientTodos[i];

      const serverTodoIndex = serverTodos.findIndex(
        (todo) => todo.localId === clientTodo.localId
      );
      if (serverTodoIndex > -1) {
        // Found.
        const serverTodo = serverTodos[serverTodoIndex];

        if (clientTodo.localId === serverTodo.localId) {
          if (clientTodo.__v === serverTodo.__v) {
            // If same, check the version.
            resolvedTodos.push(clientTodo);
          } else {
            // Assuming server will always be updated, then
            // the only option here is that the client is out-of-date.
            conflictingTodos.push(clientTodo);
          }
        }
      } else {
        // Not found.
        // Doesn't exist in server, but exists in client.
        // Check if the client doesn't have `_id` just yet, because models are created in the server.
        // If it exists, then it has been deleted in the server. Do nothing.
        if (clientTodo._id === undefined) {
          resolvedTodos.push(new TodoModel(clientTodo));
        }
      }

      // Iterate over the server todos
    }

    const todoModels = todos.map((todo) => new TodoModel(todo));

    roomObject.todos = [...roomObject.todos, ...todoModels];
    await roomObject.save();

    res.status(200);
    response.data = todoModels;
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
