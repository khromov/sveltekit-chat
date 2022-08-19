<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit'
  
    export const load: Load = ({ session }) => {

      if (!session.user) {
        return {
          status: 302,
          redirect: '/auth/login',
        }
      }
  
      return {
        status: 200,
      }
    }
</script>

<script lang="ts">
    // import { session } from '$app/stores'
    import ReconnectingEventSource from 'reconnecting-eventsource';
    import { v4 as uuidv4 } from 'uuid';

    import { onMount } from 'svelte';

    const uuid = uuidv4();

    let messages: { name: string, message: string }[] = [];
 
    let currentMessage = '';

	onMount(() => {
		const events = new ReconnectingEventSource(`/events/${uuid}`);
		events.onmessage = (event) => {
            console.log('eventx', event.data);
            messages = [
                ...messages,
                JSON.parse(event.data)
            ]
		};
	});

    const onSubmitMessage = async () => {
        try {
            await fetch(`/events/${uuid}`, {
				method: 'POST',
				body: JSON.stringify({
                    message: currentMessage,
                }),
            });

            currentMessage = '';
        } catch(e) {
            console.error('Something went wrong, try again!');
        }
    }
</script>

{#if messages.length > 0}
<ul>
    {#each messages as message}
        <li>
            <strong>
                {message?.name}
            </strong> :
            <span>
                {message?.message}
            </span>
        </li>
    {/each}
</ul>
{:else}
    No messages yet...
{/if}

<form on:submit|preventDefault={onSubmitMessage}>
<h2>Messages</h2>
<label for="message">Message</label>
<!-- svelte-ignore a11y-autofocus -->
<input type="text" name="message" bind:value={currentMessage} autofocus><br><br>
<input type="submit" value="Send message" />
</form>