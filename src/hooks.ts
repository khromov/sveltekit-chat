import { getClients, initialize as initializeSse } from '$lib/sse';

initializeSse();

/*
setInterval(() => {
	console.log('Logging sseClients', getClients());
}, 3000);
*/

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve } : { event: any, resolve: any }) {
  const response = await resolve(event);
  return response;
}