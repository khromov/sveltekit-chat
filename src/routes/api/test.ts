import { createUser, getUserWithValidCredentials } from "$lib/db/users";

export const GET = async ({ params }: { params: any }) => {
	const id = params?.id || 'none';

	const userId = await createUser({
		name: 'programmatic',
		ep_email: 'foo@bar.com2',
		password_unencrypted: 'hello', 
		user_type: 'ep',
	})

	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			id,
			user: userId,
			isValidUserCredentials: await getUserWithValidCredentials('test', 'test'),
		}
	  };
};