import { createMessage } from "$lib/db/messages";
import { createUser, getUserWithValidCredentials } from "$lib/db/users";
import { generateClientUuid } from "$lib/helpers";
import { getChatsAccessibleByUserId } from "$lib/db/chats";

export const GET = async ({ params }: { params: any }) => {
	const id = params?.id || 'none';

	/*
	const userId = await createUser({
		name: 'programmatic',
		ep_email: 'foo@bar.com2',
		password_unencrypted: 'hello', 
		user_type: 'ep',
	});


	const messageIds = [];
	for(let i = 0; i < 500000; i++) {
		const id = await createMessage({
			chat: 1,
			client_uuid: generateClientUuid(123),
			message: 'cool-message' + generateClientUuid(123),
		});

		messageIds.push(id);
	}
	*/

	const availableChats = await getChatsAccessibleByUserId(1);
	console.log(availableChats);

	return {
		status: 200,
		headers: {
		  'access-control-allow-origin': '*'
		},
		body: {
			availableChats
			//id,
			// messageIds,
			//user: userId,
			//isValidUserCredentials: await getUserWithValidCredentials('test', 'test'),
		}
	  };
};