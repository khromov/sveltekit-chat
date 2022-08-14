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
    import { session } from '$app/stores';
  </script>
  
  <h1>Protected</h1>
  
  <p>Welcome {$session.user?.name}!</p>
  