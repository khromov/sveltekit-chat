import cuid from 'cuid'

/**
 * Generates a unique id suitable for client-sida message uuid and similar. 
 * 
 * @param extraUniqueness Extra uniqueness like user ID, to avoid collisions in the same namespace
 * @returns 
 */
export function generateClientUuid(extraUniqueness: string | number = ''): string {
    return `${cuid()}${extraUniqueness ? `-${extraUniqueness}` : ''}`;
}

export function apiResponse(body: Record<string, any>, status = 200, headers = {}) {
    return {
        status,
        headers: {
        'access-control-allow-origin': '*', //TODO: Do we want this?
          ...headers,
        },
        body
    }    
}

export function apiErrorResponse(error: string, status = 500) {
    return apiResponse({
        error,
    }, status);
}

export function apiNoAccessResponse(message = 'You do not have access to this resource') {
    return apiResponse({
        error: message,
    }, 403);
}