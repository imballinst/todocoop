import { NextApiResponse } from 'next';
import { replaceArrayElementAtIndex } from '../../../../../lib/utils';
import { withDB, withSession } from '../../../../../middlewares';
import { RoomModel, Todo } from '../../../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../../../types';

async function updateAndDeleteTodoHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<Todo> = {};

  try {
    if (req.method !== 'PUT' && req.method !== 'DELETE') {
      throw new Error('Bad request');
    }

    if (req.method === 'PUT') {
      response.data = await updateTodo({
        name: req.query.name as string,
        todoId: req.query.todoId as string,
        todo: req.body
      });
    } else {
      deleteTodo({
        name: req.query.name as string,
        todoId: req.query.todoId as string
      });
    }

    res.status(200);
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

export default withSession(withDB(updateAndDeleteTodoHandler));

// Child method routes.
async function updateTodo({
  name,
  todoId,
  todo
}: {
  name: string;
  todoId: string;
  todo: Todo;
}) {
  const object = await RoomModel.findOne({
    name,
    'todos._id': todoId
  });

  if (object === null) {
    throw new Error('Invalid room or todo information.');
  }

  const idx = object.todos.findIndex((item) => item._id === todoId);

  object.todos = replaceArrayElementAtIndex(object.todos, idx, todo);
  const x = await object.save();

  return todo;
}

async function deleteTodo({ name, todoId }: { name: string; todoId: string }) {
  const object = await RoomModel.findOne({
    name,
    'todos._id': todoId
  });

  if (object === null) {
    throw new Error('Invalid room or todo information.');
  }

  const idx = object.todos.findIndex((item) => item._id === todoId);

  object.todos = replaceArrayElementAtIndex(object.todos, idx, undefined);
  await object.save();
}
