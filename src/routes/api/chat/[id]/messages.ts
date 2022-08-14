import { getUser } from "$lib/db/user";

export const GET = async ({ params }: { params: any }) => {
	const id = params?.id || 'none';
	const user = await getUser(id);

	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			user
		}
	  };
};