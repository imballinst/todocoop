import { NextApiResponse } from 'next';
import { withDB, withSession } from '../../../lib/server/middlewares';
import { Room, RoomModel } from '../../../lib/models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../lib/server/types';

async function createRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<Room> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    const room = new RoomModel(req.body);
    const object = await room.save();

    req.session.roomId = object._id;
    await req.session.save();

    res.status(200);
    response.data = object;
  } catch (err) {
    console.error(err);
    res.status(400);
    response.errors = [
      {
        code: '10000',
        message:
          err.code === 11000
            ? 'Another room with the same name already exists.'
            : err.message
      }
    ];
  }

  res.json(response);
}

export default withSession(withDB(createRoomHandler));
