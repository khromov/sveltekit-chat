import { getChatsAccessibleByUserId } from "$lib/db/chats";
import { apiResponse, apiErrorResponse, apiNoAccessResponse } from "$lib/helpers";

export const GET = async ({ locals } : { locals: App.Locals }) => {
    const loggedInUser = locals.user;

    // TODO: Maybe a more hardcore check here? isLoggedInUser(locals.user)
    if(loggedInUser) {
        const chats = await getChatsAccessibleByUserId(loggedInUser.id);

        if(chats === null) {
            return apiErrorResponse('Could not fetch chats for user');
        }

        return apiResponse(chats)
    }

    return apiNoAccessResponse();
};