import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../middlewares';
import { RoomDocument, RoomModel } from '../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../types';

async function createRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<RoomDocument> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    const room = new RoomModel(req.body);
    const object = await room.save();
    console.log('createRoomHandler', object);
    req.session.set('room', object);
    console.log('createRoomHandler get', req.session.get('room'));
    res.status(200);
    response.data = object;
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

export default withSession(withDB(createRoomHandler));
