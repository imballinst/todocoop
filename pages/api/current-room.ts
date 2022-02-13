import { NextApiResponse } from 'next';

import { withDB, withSession } from '../../lib/server/middlewares';
import { RoomModel } from '../../lib/models';
import { ExtendedNextApiRequest } from '../../lib/server/types';

async function getCurrentRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const roomId = req.session.roomId;

  if (roomId) {
    const roomQuery = RoomModel.findOne({
      _id: roomId
    });
    const roomFromDb = await roomQuery.exec();

    if (roomFromDb) {
      return res.status(200).json(roomFromDb);
    }
  }

  res.status(401).end();
}

export default withSession(withDB(getCurrentRoomHandler));
