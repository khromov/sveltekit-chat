import { compare, hash } from 'bcrypt';
import cuid from 'cuid';
import { query } from '$lib/db';
import type { User, UserPublic, NewUser } from '$lib/types/users';

export async function getUser(value: number | string, by: 'id' | 'ep_email' | 'ep_secret_token' = 'id'): Promise<User | null> {
	try {
        const userResults = await query(`SELECT * FROM users WHERE ${by} = $1 LIMIT 1`, [value]);
        const resultingUser = userResults?.rows?.[0] || null;
    
        return resultingUser;
    } catch(e) {
        console.error(`❌ Could not getUser`, e);
        return null;
    }
}

export async function getUserPublic(id: number): Promise<UserPublic | null> {
	const userResults = await query(
		'SELECT id, name, avatar, biography FROM users WHERE id = $1 LIMIT 1',
		[id]
	);
	const resultingUser = userResults?.rows?.[0] || null;

	return resultingUser;
}

/**
 * TODO: Refactor this into separate tables:
 * users_ep, users_firebase + users_metadata that can reference both tables or something
 * @param user 
 * @returns userId or false if user was not created
 */
export async function createUser(user: NewUser): Promise<number | false> {

    if(!user.password_unencrypted) {
        console.error('❌ createUser: No password passed to createUser');
        return false;
    }

    // Check if user already exists so we can bail.
    if(user.user_type === 'ep') {

        if(!user.ep_email) {
            console.error('❌ createUser: Password required for ep user type');
            return false;
        }

        if (await userWithEmailExists(user.ep_email)) {
            console.error('❌ createUser: User already exists error');
			return false;
		}

    }

    try {
        const result = await query(
            `INSERT INTO users(name, status, avatar, settings, primary_chat, firebase_uid, phone, ep_email, user_type, biography, ep_secret_token, ep_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;`,
            [
                user.name,
                user.status,
                user.avatar,
                user.settings,
                user.primary_chat,
                user.firebase_uid,
                user.phone,
                user.ep_email,
                user.user_type,
                user.biography,
                cuid(), // secretToken,
                (await hash(user.password_unencrypted, 10))
            ]
        );

        console.log(`✅ Created user with id ${result?.rows?.[0]?.id}`);
        return result?.rows?.[0]?.id || false;
    } catch(e) {
        console.error(`❌ Could not create user`, e);
        return false;
    }
}

export async function userWithEmailExists(email: string): Promise<boolean> {
    const queryResult = await query('SELECT id FROM users WHERE ep_email = $1;', [email]);
    return queryResult?.rows ? queryResult.rows.length > 0 : false;
}

/**
 * @returns If a user with valid email and password is found, returns the user, else false
 */
export async function getUserWithValidCredentials(email: string, password: string): Promise<User | false> {
    const foundUser = await getUser(email, 'ep_email') as User;

    if(foundUser && (await compare(password, foundUser.ep_password))) {
        return foundUser;
    }

    return false;
}

