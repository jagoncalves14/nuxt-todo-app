<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

definePageMeta({
  middleware: ['auth']
})

interface Profiles {
  id: string
  updated_at: string
  avatar_url: string
  website: string
  username: string
  first_name: string
  last_name: string
  birth_date: string
}
const user = useSupabaseUser()
const hasProfileData = ref(false)
const showSuccess = ref(false)
const isLoading = ref(false)

const formData = reactive({
  username: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  website: ''
})

const formRules = computed(() => ({
  username: { required },
  firstName: { required },
  lastName: { required },
  birthDate: { required }
}))

const v$ = useVuelidate(formRules, formData)

const getUserData = async () => {
  isLoading.value = true

  const { data } = await useSupabaseClient()
    .from<Profiles>('profiles')
    .select('*')
    .match({ id: user.value.id })

  if (data?.[0]?.username) {
    hasProfileData.value = true
  }

  formData.username = data?.[0]?.username || ''
  formData.firstName = data?.[0]?.first_name || ''
  formData.lastName = data?.[0]?.last_name || ''
  formData.birthDate = data?.[0]?.birth_date || ''
  formData.website = data?.[0]?.website || ''

  isLoading.value = false
}

const saveChanges = async () => {
  isLoading.value = true

  await v$.value.$validate().then((data) => {
    window.console.log('Validate', { data })
    if (v$.value.$error) {
      return false
    }
  })

  if (hasProfileData.value) {
    await useSupabaseClient()
      .from<Profiles>('profiles')
      .update({
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        website: formData.website
      })
      .match({ id: user.value.id })
  } else {
    await useSupabaseClient()
      .from<Profiles>('profiles')
      .insert({
        id: user.value.id,
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate,
        website: formData.website
      })
  }

  showSuccess.value = true
  isLoading.value = false
}

onMounted(() => {
  watchEffect(async () => {
    if (user.value) {
      await getUserData()
    }
  })
})
</script>

<template>
  <div class="max-w-lg mx-auto mt-32">
    <h1 class="text-3xl font-black text-white">
      Personal Settings
    </h1>

    <form class="flex flex-col gap-2 mt-8" @submit.prevent="saveChanges">
      <div class="d-flex flex-col mb-2">
        <span>Username</span>
        <input v-model="formData.username" :disabled="isLoading" type="text" placeholder="Username" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
        <div v-if="v$?.username?.$error" class="text-red">
          <span v-if="v$.username.$error"> {{ v$.username.$errors[0].$message }}</span>
        </div>
      </div>

      <div class="d-flex flex-col mb-2">
        <span>First Name</span>
        <input v-model="formData.firstName" :disabled="isLoading" type="text" placeholder="First Name" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
        <div v-if="v$?.firstName?.$error" class="text-red">
          <span v-if="v$.firstName.$error"> {{ v$.firstName.$errors[0].$message }}</span>
        </div>
      </div>

      <div class="d-flex flex-col mb-2">
        <span>Last Name</span>
        <input v-model="formData.lastName" :disabled="isLoading" type="text" placeholder="Last Name" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
        <div v-if="v$?.lastName?.$error" class="text-red">
          <span v-if="v$.lastName.$error"> {{ v$.lastName.$errors[0].$message }}</span>
        </div>
      </div>

      <div class="d-flex flex-col mb-2">
        <span>Birth Date</span>
        <input v-model="formData.birthDate" :disabled="isLoading" type="date" placeholder="Birth Date" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
        <div v-if="v$?.birthDate?.$error" class="text-red">
          <span v-if="v$.birthDate.$error"> {{ v$.birthDate.$errors[0].$message }}</span>
        </div>
      </div>

      <button :disabled="isLoading" type="submit" class="p-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 disabled:opacity-50">
        <span>Submit</span>
      </button>

      <v-alert v-if="showSuccess" type="success" dismissible class="mt-4">
        Profile has successfully been saved
      </v-alert>
    </form>
  </div>
</template>
