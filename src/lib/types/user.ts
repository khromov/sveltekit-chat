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

export interface User {
    id: number,
    name?: string,
    status?: string,
    avatar?: UserAvatar,
    settings?: UserSettings,
    primaryChat?: number,
    firebaseUid?: string,
    phone?: string,
    email?: string,
    user_type: 'firebase' | 'email',
    biography?: string,
    secretToken: string,
}