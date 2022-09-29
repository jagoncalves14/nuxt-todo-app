<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const client = useSupabaseClient()
const isLoading = ref(false)
const formError = ref(null)

const signUp = async () => {
  isLoading.value = true

  // eslint-disable-next-line
  const { user, error } = await client.auth.signUp({
    email: email.value,
    password: password.value
  })

  formError.value = error
  isLoading.value = false
}

const login = async () => {
  isLoading.value = true

  // eslint-disable-next-line
  const { user, error } = await client.auth.signIn({
    email: email.value,
    password: password.value
  })

  formError.value = error
  isLoading.value = false
}

const user = useSupabaseUser()
onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      navigateTo('/todos')
    }
  })

  watch(isSignUp, () => {
    formError.value = null
  })
})
</script>

<template>
  <div class="max-w-lg mx-auto mt-32">
    <h1 class="text-3xl font-black text-white">
      {{ isSignUp ? 'Register' : 'Log in' }}
    </h1>
    <form class="flex flex-col gap-2 mt-8" @submit.prevent="() => (isSignUp ? signUp() : login())">
      <input v-model="email" :disabled="isLoading" type="email" placeholder="Email" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
      <input v-model="password" :disabled="isLoading" type="password" placeholder="Password" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
      <button :disabled="isLoading" type="submit" class="p-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 disabled:opacity-50">
        <span v-if="isSignUp">Sign up</span>
        <span v-else>Log in</span>
      </button>
    </form>

    <button class="mt-2 text-sm text-center underline text-slate-300 hover:opacity-70" @click="isSignUp = !isSignUp">
      <span v-if="isSignUp">Have an account? Log in instead</span>
      <span v-else>Create a new account</span>
    </button>

    <v-alert v-if="formError" type="error" dismissible class="mt-4">
      {{ formError.message }}
    </v-alert>
  </div>
</template>
