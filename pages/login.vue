<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const client = useSupabaseClient()

const signUp = async () => {
  // eslint-disable-next-line
  const { user, error } = await client.auth.signUp({
    email: email.value,
    password: password.value
  })
}

const login = async () => {
  // eslint-disable-next-line
  const { user, error } = await client.auth.signIn({
    email: email.value,
    password: password.value
  })
}

const user = useSupabaseUser()
onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      navigateTo('/notes')
    }
  })
})
</script>

<template>
  <div class="max-w-lg mx-auto mt-32">
    <h1 class="text-3xl font-black text-white">
      {{ isSignUp ? 'Register' : 'Log in' }}
    </h1>
    <form class="flex flex-col gap-2 mt-8" @submit.prevent="() => (isSignUp ? signUp() : login())">
      <input v-model="email" type="email" placeholder="Email" class="p-2 text-white rounded bg-charcoal-600">
      <input v-model="password" type="password" placeholder="Password" class="p-2 text-white rounded bg-charcoal-600">
      <button type="submit" class="p-2 font-medium text-white bg-green-500 rounded hover:bg-green-400">
        <span v-if="isSignUp">Sign up</span>
        <span v-else>Log in</span>
      </button>
    </form>

    <button class="mt-2 text-sm text-center underline text-slate-300 hover:opacity-70" @click="isSignUp = !isSignUp">
      <span v-if="isSignUp">Have an account? Log in instead</span>
      <span v-else>Create a new account</span>
    </button>
  </div>
</template>
