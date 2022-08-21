import { query } from '$lib/db';
import type { Chat, NewChat } from '$lib/types/chats';
import sleep from 'sleep-promise';

export async function getChatsAccessibleByUserId(userId: number): Promise<Chat[] | null> {
	try {
        // TODO: This query might be more performant
        //const results = await query(`SELECT * FROM chats WHERE participants @> $1;`, [[userId]]);
        //await sleep(1000);
        const results = await query(`SELECT * FROM chats WHERE $1 = ANY(participants);`, [userId]);

        return results?.rows || null;
    } catch(e) {
        console.error(`❌ Could not getChatsAccessibleByUserId`, e);
        return null;
    }
}