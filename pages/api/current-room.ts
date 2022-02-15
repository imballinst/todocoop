import { NextApiResponse } from 'next';

import { withDB, withSession } from '../../lib/server/middlewares';
import { Room, RoomModel } from '../../lib/models';
import { ApiResponse, ExtendedNextApiRequest } from '../../lib/server/types';

async function getCurrentRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const roomId = req.session.roomId;
  let response: ApiResponse<Room> = {};

  if (roomId) {
    const roomQuery = RoomModel.findOne({
      _id: roomId
    });
    const roomFromDb = await roomQuery.exec();

    if (roomFromDb) {
      response.data = roomFromDb;
      return res.status(200).json(response);
    }
  }

  res.status(401).end();
}

export default withSession(withDB(getCurrentRoomHandler));
