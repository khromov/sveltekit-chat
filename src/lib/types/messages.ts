export type Timestamp = Date;

export type Message = {
    id: number,
    client_uuid: string,
    chat: number,
    message: string,
    created: Timestamp,
    last_updated: Timestamp,
    metadata: Record<string, any> | null,
}

/**
 * A message before it has been inserted into the DB
 */
export interface NewMessage extends Omit<Message, 'id' | 'created' | 'last_updated' | 'metadata'> {
    created?: Timestamp,
    last_updated?: Timestamp,
    metadata?: Record<string, any> | null,
}