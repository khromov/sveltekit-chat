import { getUserWithValidCredentials } from '$lib/db/user';
import type { RequestHandler } from '@sveltejs/kit';

import { compare } from 'bcrypt';
import { serialize } from 'cookie';

export const POST: RequestHandler = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')?.toString()?.trim();
  const password = form.get('password')?.toString()?.trim();

  if (
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    return {
      status: 400,
      body: {
        error: 'Enter a valid username and password.',
      },
    }
  }

  if (!username || !password) {
    return {
      status: 400,
      body: {
        error: 'Username and password are required.',
      },
    }
  }

  const matchedUser = await getUserWithValidCredentials(username, password);

  if (!matchedUser) {
    return {
      status: 400,
      body: {
        error: 'You entered the wrong credentials.',
      },
    }
  }

  return {
    status: 200,
    body: {
      user: { foo: 'bar' },
      success: 'Success.',
    },
    headers: {
      'Set-Cookie': serialize(
        'session',
        matchedUser.secret_token,
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
