import { createUser, userWithEmailExists } from '$lib/db/user';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name')?.toString()?.trim();
	const email = form.get('email')?.toString()?.trim();
	const password = form.get('password')?.toString()?.trim();

	if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
		return {
			status: 400,
			body: {
				error: 'Something went horribly wrong.'
			}
		};
	}

	if (!name || !email || !password) {
		return {
			status: 400,
			body: {
				error: 'Name, email and password are required.'
			}
		};
	}

	try {
		if (await userWithEmailExists(email)) {
			return {
				status: 400,
				body: {
					error: 'User already exists'
				}
			};
		}
		
		const userId = await createUser({
			name,
			ep_email: email,
			password_unencrypted: password,
			user_type: 'ep'
		});

		return {
			status: 200,
			body: { success: 'Success.', userId }
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
