import { getUserWithValidCredentials } from "$lib/db/user";

export const GET = async ({ params }: { params: any }) => {
	const id = params?.id || 'none';

	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			isValidUserCredentials: await getUserWithValidCredentials('test', 'test'),
		}
	  };
};