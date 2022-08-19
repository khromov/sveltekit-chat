import { getUser, getUserPublic } from "$lib/db/users";

export const GET = async ({ params }: { params: any }) => {
	const id = params?.id || 'none';
	const user = await getUser(id);
	const userPublic = await getUserPublic(id);
	const nonExistingUser = await getUser(0);
	const nonExistingUserPublic = await getUserPublic(0);
	
	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			user, 
			userPublic,
			nonExistingUser,
			nonExistingUserPublic
		}
	  };
};