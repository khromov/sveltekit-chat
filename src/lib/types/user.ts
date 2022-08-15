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
    name?: string,
    avatar?: UserAvatar,
    biography?: string,
}

export type User = {
    id: number,
    name?: string,
    status?: string,
    avatar?: UserAvatar,
    settings?: UserSettings,
    primary_chat?: number,
    firebase_uid?: string,
    phone?: string,
    user_type: 'firebase' | 'ep' | 'magiclink', // ep = email+password
    biography?: string,
    ep_email?: string,
    ep_password: string,
    ep_secret_token: string,
}

export interface NewUser extends Omit<User, 'id'|'ep_secret_token'|'ep_password'> {
    password_unencrypted: string;
}