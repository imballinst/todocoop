import { createCookie } from 'remix';

if (process.env.SECRET_COOKIE_PASSWORD === undefined) {
  throw new Error(`process.env.SECRET_COOKIE_PASSWORD cannot be undefined.`);
}

export const userPrefs = createCookie('todocoop', {
  secrets: [process.env.SECRET_COOKIE_PASSWORD],
  secure: process.env.NODE_ENV === 'production',
  // 1 hour max age.
  maxAge: 60 * 60,
  httpOnly: true,
  sameSite: true
});
