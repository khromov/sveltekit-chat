<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit'
  
    export const load: Load = ({ session, ...rest }) => {
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
    import { session } from '$app/stores'
    import ReconnectingEventSource from 'reconnecting-eventsource';
    import { v4 as uuidv4 } from 'uuid';

    import { onMount } from 'svelte';
    import type { Chat } from '$lib/types/chats';
    import ChatComponent from '$lib/components/Chat.svelte';

    let currentChat: undefined | number;

    const uuid = uuidv4();

    let messages: { name: string, message: string }[] = [];
 
    let currentMessage = '';

    const fetchChats = async() => { // TODO: Types
        const result: Chat[] = (await (await fetch(`/api/chat/getAvailable`)).json());

        if(result.error) {
            throw new Error(result.error);
        }

        if(result.length > 0) {
            currentChat = result[0].id;
        }
        return result;
    };

    // TODO: Make this possible to retry
    let fetchChatsInitial = (async(): Promise<Chat[]> => {
        return fetchChats();
    })();

    const retryChatFetch = () => {
        fetchChatsInitial = (async(): Promise<Chat[]> => {
            return fetchChats();
        })();
    }
    
    const setCurrentChat = (chat: number) => currentChat = chat;
</script>

{#await fetchChatsInitial}
    Loading chats...
{:then chatData}
    <ul>
        {#each chatData as chat}
            <li>
                <button on:click={() => setCurrentChat(chat.id)}>{chat.id}</button>
            </li>
        {/each}
    </ul>
{:catch error} <!-- todo: seems like this can randomly crash the server if something happens in fetchChatsInitial -->
    Could not fetch chats: {error.message} <br/><button on:click={retryChatFetch}>Try again</button> <!-- TODO fix error state -->
{/await}

<ChatComponent currentChat={currentChat} />