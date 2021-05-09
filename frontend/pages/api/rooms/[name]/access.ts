import { NextApiResponse } from 'next';
import { withDB } from '../../../../middlewares';
import { RoomDocument, RoomModel } from '../../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../../types';

async function roomAccessHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<RoomDocument> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    const roomQuery = RoomModel.findOne({
      name: req.query.name as string,
      password: req.body.json.password
    });
    const object = await roomQuery.exec();

    if (object === null) {
      throw new Error('Invalid room information.');
    }

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
}

export default withDB(roomAccessHandler);
