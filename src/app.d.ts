/// <reference types="@sveltejs/kit" />
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User, UserPublic } from "$lib/types/user";

declare global {
  namespace App {
    interface Locals {
      user?: User;
    }

    interface Session {
      user?: UserPublic
    }
  }
}