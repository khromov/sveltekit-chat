import type { GetSession, Handle } from '@sveltejs/kit'
import * as cookie from 'cookie'
import { initialize as initializeSse } from '$lib/sse';
import { getUser } from '$lib/db/users';

// import { db } from '$lib/database'

initializeSse();

export const handle: Handle = async ({ event, resolve }) => {
  const cookieHeader = event.request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader ?? '')

  if (!cookies.session) {
    return await resolve(event)
  }

  const user = await getUser(cookies.session, 'ep_secret_token');

  if (user) {
    event.locals.user = user;
  }

  return await resolve(event)
}

/**
 * Warning: This value gets sent down to the client!
 */
export const getSession: GetSession = ({ locals }) => {
  if (!locals.user) {
    return {};
  }

  return {
    user: {
      id: locals.user.id,
      name: locals.user.name,
    },
  }
}
