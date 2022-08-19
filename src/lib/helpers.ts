import cuid from 'cuid'

/**
 * Generates a unique id suitable for client-sida message uuid and similar. 
 * 
 * @param extraUniqueness Extra uniqueness like user ID, to avoid collisions in the same namespace
 * @returns 
 */
export function generateClientUuid(extraUniqueness: string | number = ''): string {
    return `${cuid()}-${extraUniqueness}`
}