<script lang="ts">
    import ReconnectingEventSource from 'reconnecting-eventsource';

    import { onMount } from 'svelte';
    import type { Chat } from '$lib/types/chats';

    import { generateClientUuid } from '$lib/helpers';

    export let currentChat: number;

    const clientUuidForChatSubscriptions =  generateClientUuid(); // TODO add user id

    let messages: { name: string, message: string }[] = [];
 
    let currentMessage = '';

	onMount(() => {
		const events = new ReconnectingEventSource(`/events/${clientUuidForChatSubscriptions}`);
		events.onmessage = (event) => {
            messages = [
                ...messages,
                JSON.parse(event.data)
            ]
		};
        // events.close();
	});

    const onSubmitMessage = async () => {
        if(!currentMessage) {
            return;
        }

        try {
            await fetch(`/events/${clientUuidForChatSubscriptions}`, {
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

<h3>Current chat: {currentChat}</h3>
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