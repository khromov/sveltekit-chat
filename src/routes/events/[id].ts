import { addClient, getClients, removeClient } from "$lib/sse";

export const GET = ({ params, locals }: { params: any, locals: any }) => {
	const id = params?.id || 'none';

	return {
		// These headers are important for the browser to detect a SSE request
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache'
		},
		body: new ReadableStream({
			start: (controller) => { 
				addClient(id, controller)
			},
			cancel: () => {
				removeClient(id);
			}
		})
	};
};

export const POST = async ({ request, params, locals } : { request: any, params: any, locals: any }) => {
	const encoder = new TextEncoder();
	const message = await request.text();
	
	for (const [, controller] of getClients()) {
		// First format the message correctly with 'data: ' as prefix and 2 new lines as suffix
		// Then encode the message to a Uint8Array to be sent to the client
		try {
			controller.enqueue(encoder.encode('data: ' + (message) + '\n\n'));
		} catch(e) {
			console.error(`Failed sending message to client.`, e);
		}
	}

	return { status: 204 };
};