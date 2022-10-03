<script setup lang="ts">
useHead({
  title: 'Todos'
})

definePageMeta({
  middleware: ['auth']
})

const user = useSupabaseUser()
onMounted(() => {
  watchEffect(async () => {
    if (!user.value) {
      navigateTo('/login')
    } else {
      await getTodosList()
    }
  })
})

type Todo = {
  id: number;
  inserted_at: string;
  task: string;
  user_id: string;
  is_complete: boolean;
}

const todoName = ref('')
const todosList = ref<Todo[]>([])

const isLoadingCreateTodo = ref(null)
const createTodo = async () => {
  try {
    isLoadingCreateTodo.value = true

    const { data, error } = await useSupabaseClient()
      .from<Todo>('todos')
      .insert([
        { user_id: user.value.id, task: todoName.value }
      ])

    if (error) {
      throw error
    }
    todosList.value.push(data[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating todo: ', error.message)
  } finally {
    isLoadingCreateTodo.value = false
  }
}

const isLoadingGetTodos = ref(null)
const getTodosList = async () => {
  try {
    isLoadingGetTodos.value = true

    const { data, error } = await useSupabaseClient()
      .from<Todo>('todos')
      .select('*')
      .range(0, 9)

    if (error) {
      throw error
    }
    todosList.value = data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching todos: ', error.message)
  } finally {
    isLoadingGetTodos.value = false
  }
}

const toggleTodo = async (id: number, value: boolean) => {
  try {
    const { data, error } = await useSupabaseClient()
      .from<Todo>('todos')
      .update({ is_complete: value })
      .match({ id })

    if (error) {
      throw error
    }

    const todoToUpdate = todosList.value.find(todo => todo.id === id)
    Object.assign(todoToUpdate, data[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error toggling todo: ', error.message)
  }
}

const deleteTodo = async (id: number) => {
  try {
    const { error } = await useSupabaseClient()
      .from<Todo>('todos')
      .delete()
      .match({ id })

    if (error) {
      throw error
    }

    const updatedTodosList = todosList.value = todosList.value.filter(todo => todo.id !== id)
    Object.assign(todosList, updatedTodosList)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting todo: ', error.message)
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-32">
    <p class="mt-8 mb-16">
      Hello {{ user?.email }}
    </p>

    <h1 class="text-2xl font-black text-white">
      Create a new Todo
    </h1>
    <form class="flex flex-col gap-2 mt-4" @submit.prevent="() => createTodo()">
      <input v-model="todoName" :disabled="isLoadingCreateTodo" placeholder="Name your task" class="p-2 text-white rounded bg-charcoal-600 disabled:opacity-50">
      <button :disabled="isLoadingCreateTodo || !todoName?.length" type="submit" class="p-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 disabled:opacity-50">
        <LoadingSpinner v-if="isLoadingCreateTodo" class="mx-auto" colors="fill-green-500 text-white" />
        <span v-else>Submit</span>
      </button>
    </form>

    <h1 class="mt-8 text-2xl font-semibold text-white">
      Your todos
    </h1>

    <div class="flex flex-col gap-4 mt-4" :class="{ 'opacity-50': isLoadingGetTodos }">
      <LoadingSpinner v-if="isLoadingGetTodos || isLoadingGetTodos === null" class="mx-auto" />
      <div v-for="todo in todosList" v-else :key="todo.id" class="p-2 px-4 bg-gray-700 rounded cursor-pointer hover:opacity-70 d-flex justify-space-between">
        <span class="block" :class="{ 'line-through': todo.is_complete }" @click="toggleTodo(todo.id, !todo.is_complete)">
          {{ todo.task }}
        </span>
        <button class="text-white hover:opacity-70" @click="deleteTodo(todo.id)">
          <v-icon :size="16" icon="mdi:mdi-close" />
        </button>
      </div>
    </div>
  </div>
</template>
