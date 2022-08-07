console.log("Running hooks.ts");

// TODO: Run initSseClients() here, which will initialize the client array.
// Also, once we throw an error for TypeError [ERR_INVALID_STATE]: Invalid state: Controller is already closed
// Just remove the client from the array using clients.remove(id);
let sseClients = [];

setInterval(() => {
	console.log('Logging sseClients', sseClients);
}, 3000);

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.sseClients = sseClients;
  const response = await resolve(event);
  return response;
}