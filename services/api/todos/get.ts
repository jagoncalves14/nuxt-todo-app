
const getTodos = async () =>
  await useSupabaseClient()
    .from('todos')
    .select('*')
    .range(0, 9)

export default getTodos
