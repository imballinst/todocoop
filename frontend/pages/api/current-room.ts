import { withSession } from '../../middlewares';

export default withSession(async (req, res) => {
  const room = req.session.get('room');

  if (room) {
    // in a real world application you might read the room id from the session and then do a database request
    // to get more information on the room if needed
    return res.status(200).json(room);
  }

  res.status(401).end();
});
