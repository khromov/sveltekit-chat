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
    import { send } from '$lib/api'

    let username: string;
    let password: string;
  
    // these props are passed from the page endpoint
    // so the user can get feedback if JavaScript doesn't work
    export let error: string;
    export let success: string;
  
    // this runs on the client when JavaScript is available
    // so we can just reuse the existing `error` and `success` props
    async function register(event: SubmitEvent) {
      error = ''
  
      const formEl = event.target as HTMLFormElement
      const response = await send(formEl)
  
      if (response.error) {
        error = response.error
      }
  
      if (response.success) {
        success = response.success;
        formEl.reset();
      }
    }
  </script>

  <form on:submit|preventDefault={register} method="post">
    <div>
      <label for="username">E-mail</label>
      <input
        id="username"
        name="username"
        type="text"
        required
        bind:value={username}
      />
    </div>
  
    <div>
      <label for="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        bind:value={password}
      />
    </div>
  
    {#if error}
      <p class="error">{error}</p>
    {/if}
  
    {#if success}
      <p>Thank you for signing up!</p>
      <p><a href="/auth/login">You can log in.</a></p>
    {/if}
  
    <button type="submit">Sign Up</button>
  </form>
  
  <style>
    .error {
      color: tomato;
    }
  </style>
  