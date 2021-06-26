import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../../../middlewares';
import { RoomModel, Todo, TodoModel } from '../../../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../../../types';

async function createTodoHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<Todo> = {};

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

    const todos = req.body.todos;
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

export default withSession(withDB(createTodoHandler));
