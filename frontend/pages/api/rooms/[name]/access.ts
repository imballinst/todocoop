import { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '../../../../middlewares';
import { Room, RoomModel } from '../../../../models';
import { ApiResponse } from '../../../../types';

const roomAccessHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let response: ApiResponse<Room> = {};

  if (req.method !== 'POST') {
    response.errors = [
      {
        code: '10000',
        message: 'Bad request'
      }
    ];

    return res.status(400).json(response);
  }

  try {
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

export default connectDB(roomAccessHandler);
