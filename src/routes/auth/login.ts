import { getUserPublic, getUserWithValidCredentials } from '$lib/db/user';
import type { UserPublic } from '$lib/types/user';
import type { RequestHandler } from '@sveltejs/kit';

import { serialize } from 'cookie';

// https://github.com/sveltejs/kit/issues/1997
// https://github.com/sveltejs/kit/issues/5468#issuecomment-1182231341
interface PostOutput { user?: UserPublic | null }

export const POST: RequestHandler<Record<string, string>, PostOutput> = async ({ request }) => {
  const form = await request.formData();
  
  const email = form.get('email')?.toString()?.trim();
  const password = form.get('password')?.toString()?.trim();

  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return {
      status: 400,
      body: {
        error: 'Enter a valid email and password.',
      },
    }
  }

  if (!email || !password) {
    return {
      status: 400,
      body: {
        error: 'Email and password are required.',
      },
    }
  }

  const matchedUser = await getUserWithValidCredentials(email, password);

  if (!matchedUser) {
    return {
      status: 400,
      body: {
        error: 'You entered the wrong credentials.',
      },
    }
  }

  const matchedUserPublic = await getUserPublic(matchedUser.id);

  return {
    status: 200,
    body: { // User will be set as the session var in SvelteKit,
      user: matchedUserPublic, // TODO: Typing this seems hard, see https://kit.svelte.dev/docs/types#generated-types
      success: 'Success!',
    },
    headers: {
      'Set-Cookie': serialize(
        'session',
        matchedUser.ep_secret_token,
        {
          // send cookie for every page
          path: '/',
          // server side only cookie so you can't use `document.cookie`
          httpOnly: true,
          // only requests from same site can send cookies
          // and serves to protect from CSRF
          // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
          sameSite: 'strict',
          // only sent over HTTPS
          secure: process.env.NODE_ENV === 'production',
          // set cookie to expire after a month
          maxAge: 60 * 60 * 24 * 30,
        }
      ),
    },
  }
}
