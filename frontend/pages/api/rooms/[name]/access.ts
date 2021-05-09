import { NextApiRequest, NextApiResponse } from 'next';

import { withDB } from '../../../../middlewares';
import { RoomDocument, RoomModel } from '../../../../models';
import { ApiResponse } from '../../../../types';

const roomAccessHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default withDB(roomAccessHandler);
