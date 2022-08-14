import { query } from "$lib/db";
import type { User } from "$lib/types/user";

export async function getUser(id: number) : Promise<User | null> {
    const userResults = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    const resultingUser = userResults?.rows?.[0];

    return resultingUser;
}