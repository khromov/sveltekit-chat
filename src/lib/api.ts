import type { UserPublic } from './types/users';

// TODO: This should really be refactored out into a user-specific fetch function
type Send = Promise<{
	error?: string;
	success?: string;
	user?: UserPublic;
}>;

export async function send(form: HTMLFormElement): Send {
	const response = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: 'application/json' }
	});
	return await response.json();
}
