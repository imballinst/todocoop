import { NextApiResponse } from 'next';

import { withSession } from '../../middlewares';
import { ExtendedNextApiRequest } from '../../types';

async function getCurrentRoomHandler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const room = req.session.get('room');
  console.log('getCurrentRoomHandler', room);
  if (room) {
    // in a real world application you might read the room id from the session and then do a database request
    // to get more information on the room if needed
    return res.status(200).json(room);
  }

  res.status(401).end();
}

export default withSession(getCurrentRoomHandler);
