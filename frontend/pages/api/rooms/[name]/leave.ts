import { NextApiResponse } from 'next';
import { withDB } from '../../../../middlewares';
import { RoomDocument, RoomModel } from '../../../../models';
import { ApiResponse, ExtendedNextApiRequest } from '../../../../types';

async function roomLeaveHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  let response: ApiResponse<RoomDocument> = {};

  try {
    if (req.method !== 'POST') {
      throw new Error('Bad request');
    }

    req.session.destroy();
    res.status(204);
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

export default withDB(roomLeaveHandler);
