<script setup lang="ts">
useHead({
  title: 'Nuxt3 Todo App'
})

const user = useSupabaseUser()
</script>

<template>
  <main>
    <h1 class="text-3xl font-black text-white">
      Hi 👋
    </h1>
    <p class="mt-4">
      Welcome to the Homepage.
    </p>
    <p class="mt-4">
      I'm going to play around with Nuxt here. This app uses Supabase for Authentication and
      Nuxt's Content Module for Blog Posts content.
    </p>

    <div class="flex gap-4 mt-8">
      <NuxtLink v-if="user" to="/todos" class="px-4 py-2 rounded bg-charcoal-600 hover:bg-charcoal-500">
        Check your Todos
      </NuxtLink>
      <NuxtLink v-else to="/login" class="px-4 py-2 rounded bg-charcoal-600 hover:bg-charcoal-500">
        Login
      </NuxtLink>
    </div>
  </main>
</template>
