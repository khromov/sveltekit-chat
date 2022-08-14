let clients: { [key: string]: ReadableStreamDefaultController};

export function initialize() {
    console.log(`🌱 Initializing SSE`)
    clients = {};
}

export function addClient(id: string, client:  ReadableStreamDefaultController) {
    console.log(`✨ Starting stream for id! ${id}`);
    if(clients[id]) {
        const error = `Client with id ${id} is already connected`;
        console.error(error);
        throw new Error(error);
    } else {
        clients[id] = client;
    }
}

export function removeClient(id: string) {
    console.log(`💥 Stopping stream for id: ${id}`); 
    delete clients[id];
}

export function getClient(id: string) {
    return clients[id] ?? null;
}

export function getClients() {
    return Object.entries(clients);
}

export function clearClients() {
    clients = {}
}