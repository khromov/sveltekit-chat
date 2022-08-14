import { USER } from "$env/static/private";
import type { RequestHandlerOutput } from "@sveltejs/kit";

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
    email?: string,
    user_type: 'firebase' | 'email',
    biography?: string,
    secret_token: string,
    password: string,
}

export interface NewUser extends Omit<User, 'id'|'secret_token'|'password'> {
    password_unencrypted: string;
}