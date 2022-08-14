import { createUser, userWithEmailExists } from '$lib/db/user';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const username = form.get('username')?.toString()?.trim();
	const password = form.get('password')?.toString()?.trim();

	if (typeof username !== 'string' || typeof password !== 'string') {
		return {
			status: 400,
			body: {
				error: 'Something went horribly wrong.'
			}
		};
	}

	if (!username || !password) {
		return {
			status: 400,
			body: {
				error: 'Username and password is required.'
			}
		};
	}

	if (await userWithEmailExists(username)) {
		return {
			status: 400,
			body: {
				error: 'User already exists'
			}
		};
	}

	try {
		await createUser({
			email: username,
			password_unencrypted: password,
			user_type: 'email'
		});

		return {
			status: 200,
			body: { success: 'Success.' }
		};
	} catch (error) {
		console.error(error);
		return {
			status: 400,
			body: {
				error: 'Database error, please try again.'
			}
		};
	}
};
