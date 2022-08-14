import { query } from "$lib/db";
import type { User, UserPublic } from "$lib/types/user";

export async function getUser(id: number) : Promise<User | null> {
    const userResults = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    const resultingUser = userResults?.rows?.[0] || null;

    return resultingUser;
}

export async function getUserPublic(id: number) : Promise<UserPublic | null> {
    const userResults = await query('SELECT id, name, avatar, biography FROM users WHERE id = $1 LIMIT 1', [id]);
    const resultingUser = userResults?.rows?.[0] || null;

    return resultingUser;
}