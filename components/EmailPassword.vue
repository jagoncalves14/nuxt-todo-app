<script setup lang="ts">
defineProps<{
  callToAction: string
}>()
defineEmits(['submit'])
const email = ref('')
const password = ref('')
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="$emit('submit', email, password)">
    <input v-model="email" type="email" placeholder="Email" class="p-2 bg-gray-600 rounded">
    <input v-model="password" type="password" placeholder="Password" class="p-2 bg-gray-600 rounded">
    <button type="submit" class="p-2 text-white bg-green-500 rounded">
      {{ callToAction }}
    </button>
  </form>
</template>
