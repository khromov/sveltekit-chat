export type Chat = {
    id: number,
    status: 'assembling' | 'active' | 'finished' | 'cancelled' | 'deleted', // TODO: Decide final states
    nickname: string,
    created: Date,
    last_message: Date,
    participants: number[],
    removed_participants: number[],
}

/**
 * An item before it has been inserted into the DB, typically
 * received by the create method
 */
export interface NewChat extends Omit<Chat, 'x'> {
    foo: string;
}