export type Message = {
    id: number,
    client_uuid: string,
    chat: number,
    message: string,
    created: Date,
    last_updated: Date,
    metadata: Record<string, any> | null,
}

/**
 * An item before it has been inserted into the DB, typically
 * received by the create method
 */
export interface NewMessage extends Omit<Message, 'id' | 'created' | 'last_updated' | 'metadata'> {
    created?: Date,
    last_updated?: Date,
    metadata?: Record<string, any> | null,
}