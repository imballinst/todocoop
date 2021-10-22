import { NextApiResponse } from 'next';

import { withDB, withSession } from '../../middlewares';
import { RoomModel } from '../../models';
import { ExtendedNextApiRequest } from '../../types';

async function getCurrentRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const roomId = req.session.get('roomId');

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
