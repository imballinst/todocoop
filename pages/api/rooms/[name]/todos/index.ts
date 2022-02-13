import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../../../lib/server/middlewares';
import { RoomModel, Todo, TodoModel } from '../../../../../lib/models';
import {
  ApiResponse,
  ExtendedNextApiRequest
} from '../../../../../lib/server/types';

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

    const todo = new TodoModel(req.body);

    roomObject.todos = [...roomObject.todos, todo];
    await roomObject.save();

    res.status(200);
    response.data = todo;
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
