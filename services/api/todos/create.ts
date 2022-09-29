const user = useSupabaseUser()

const createTodo = async (payload) => {
  const { data, error } = await useSupabaseClient()
    .from('todos')
    .insert([
      { user_id: user.value.id, task: payload.todoName.value }
    ])

  return { data, error }
}

export default createTodo
