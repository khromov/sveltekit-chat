import type { RequestHandler } from "@sveltejs/kit";

export const GET = ({ params, locals }: { params: any }) => {
	let controller: any;

	console.log(params, locals.sseClients);

	const id = params?.id || 'none';

	return {
		// These headers are important for the browser to detect a SSE request
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache'
		},
		body: new ReadableStream({
			start: (_) => { 
				console.log(`✨ Starting stream for id!! ${id}`);
				controller = _;

				const existingClient = locals.sseClients.find((client) => client.id === id);
				/*
				if(existingClient) {
					throw new Error(`Existing client for ${id} found.`);
				}
				*/

				locals.sseClients.push({ id, controller });
			},
			cancel: () => {
				console.log(`💥 Stopping stream for id: ${id}`); 
				locals.sseClients = locals.sseClients.filter((client) => client.id !== id);
			}
		})
	};
};

export const POST = async ({ request, params, locals } : { request: any, params: any, locals: any }) => {
	const encoder = new TextEncoder();
	const message = await request.text();
	
	for (const { id, controller } of locals.sseClients) {
		// First format the message correctly with 'data: ' as prefix and 2 new lines as suffix
		// Then encode the message to a Uint8Array to be sent to the client
		try {
			controller.enqueue(encoder.encode('data: ' + (message) + '\n\n'));
		} catch(e) {
			console.error(e);
		}
	}

	return { status: 204 };
};