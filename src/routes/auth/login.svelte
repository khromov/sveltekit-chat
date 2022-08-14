<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ session, props }) => {
    if (session.user) {
      return {
        status: 302,
        redirect: '/',
      }
    }

    return { props }
  }
</script>


<script lang="ts">
    import { session } from '$app/stores'
    import { send } from '$lib/api'
  
    export let error: string
  
    async function login(event: SubmitEvent) {
      const formEl = event.target as HTMLFormElement
      const response = await send(formEl)
  
      if (response.error) {
        error = response.error
      }
      
      // Why is this needed exactly?
      $session.user = response.user
  
      formEl.reset()
    }
  </script>
  
  <form on:submit|preventDefault={login} method="post">
    <div>
      <label for="email">E-mail</label>
      <input
        id="email"
        name="email"
        type="text"
        required
      />
    </div>
  
    <div>
      <label for="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
      />
    </div>
  
    {#if error}
      <p class="error">{error}</p>
    {/if}
  
    <button type="submit">Sign In</button>
  </form>
  
  <style>
    .error {
      color: tomato;
    }
  </style>
  