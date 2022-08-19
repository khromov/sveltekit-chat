import { query } from '$lib/db';
import type { Message, NewMessage } from '$lib/types/messages';

export async function getMessages(chat: number, limit = 20, order: 'ascending' | 'descending' = 'descending'): Promise<Message[] | null> {
    const resolvedOrder = order === 'ascending' ? 'ASC' : 'DESC';
	try {
        const userResults = await query(`SELECT * FROM messages WHERE chat = $1 ORDER BY last_updated ${resolvedOrder} LIMIT ${limit}`, [chat]);
        const messages = userResults?.rows || null;
    
        return messages;
    } catch(e) {
        console.error(`❌ Could not getMessages`, e);
        return null;
    }
}

// Todo: Needs some basic unit tests
const isClientTimestampFresh = (clientTimestamp: Date, thresholdSeconds = 5) => {
    const serverTimestamp = new Date();
    const difference = (serverTimestamp.getTime() - clientTimestamp.getTime()) / 1000;

    // console.log('isClientTimestampFresh', serverTimestamp, clientTimestamp, difference);

    if(difference > thresholdSeconds || difference < thresholdSeconds) {
        return false;
    }

    return true;
}

export async function createMessage(message: NewMessage): Promise<number | false> {

    let messageTimestamp = new Date();

    if(message.created) {
        messageTimestamp = new Date(message.created);
    }

    const resolvedTimestamp = isClientTimestampFresh(messageTimestamp) ? messageTimestamp : new Date();

    try {
        const result = await query(
            `INSERT INTO messages(client_uuid, chat, message, created, last_updated, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
            [
                message.client_uuid,
                message.chat, // This of course has to be verified before calling createMessage
                message.message,
                resolvedTimestamp, 
                resolvedTimestamp,
                message.metadata || null,
            ]
        );

        // console.log(`✅ Created message with id ${result?.rows?.[0]?.id}`);
        return result?.rows?.[0]?.id || false;
    } catch(e) {
        console.error(`❌ Could not create message`, e);
        return false;
    }
}