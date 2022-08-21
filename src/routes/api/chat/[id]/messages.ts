import { getUser, getUserPublic } from "$lib/db/users";

export const GET = async ({ params }: { params: any }) => {
	
	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			status: 404,
		}
	  };
};