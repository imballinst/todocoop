import { getIronSession, webCookies, type SessionOptions } from 'iron-session';

export interface SessionData {
  roomId?: string;
}

function getSessionOptions(): SessionOptions {
  const password = process.env.SECRET_COOKIE_PASSWORD;

  if (!password) {
    throw new Error(
      'Please define the SECRET_COOKIE_PASSWORD environment variable for the API function'
    );
  }

  return {
    password,
    cookieName: 'todocoop',
    cookieOptions: {
      // Enables the session in non-HTTPS environments such as local dev.
      secure: process.env.NODE_ENV === 'production',
      // 1 hour max age.
      maxAge: 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }
  };
}

export async function getSession(request: Request) {
  const headers = new Headers();
  const session = await getIronSession<SessionData>(
    webCookies(request, headers),
    getSessionOptions()
  );

  return { session, headers };
}
