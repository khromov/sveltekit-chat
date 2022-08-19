export interface UserAvatar {
    /* Todo
    head: string,
    torso: string,
    hair: string,
    */
    avatar: string,
}

export interface UserSettings {
    timezone: string,
}

export interface UserPublic {
    id: number,
    name?: string | null,
    avatar?: UserAvatar | null,
    biography?: string | null,
}

export type User = {
    id: number,
    name?: string | null,
    status?: string | null,
    avatar?: UserAvatar | null,
    settings?: UserSettings | null,
    primary_chat?: number | null,
    firebase_uid?: string | null,
    phone?: string | null,
    user_type: 'firebase' | 'ep' | 'magiclink', // ep = email+password
    biography?: string | null,
    ep_email?: string | null,
    ep_password: string,
    ep_secret_token: string,
}

export interface NewUser extends Omit<User, 'id'|'ep_secret_token'|'ep_password'> {
    password_unencrypted: string;
}