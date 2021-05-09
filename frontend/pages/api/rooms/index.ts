import { NextApiResponse } from 'next';
import { RoomDocument, RoomModel } from '../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../types';

const createRoomHandler = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  let response: ApiResponse<RoomDocument> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    const room = new RoomModel(req.body);
    const object = await room.save();

    req.session.set('room', object);
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
};

export default createRoomHandler;
