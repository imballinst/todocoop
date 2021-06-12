// Source: https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/session.js.
import { withIronSession } from 'next-iron-session';
import { NextHandler } from '../types';

export function withSession(handler: NextHandler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'todocoop',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000).
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 1000 * 60,
      httpOnly: true,
      sameSite: true
    }
  });
}
