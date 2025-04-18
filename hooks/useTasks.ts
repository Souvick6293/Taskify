import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

interface Task {
  id: string
  task_name: string
  description: string
  priority: 'low' | 'medium' | 'high' 
   status: 'pending' | 'completed'
  deadline?: string
  reminder?: string
  tags?: string[]
  user_id: string
  created_at: string
}

export const useTasks = (user_id?: string) => {
  const queryClient = useQueryClient()

  // ✅ Fetch tasks
  const {
    data: fetchTasks,
    isLoading,
    error,
    refetch
  } = useQuery<Task[]>({
    queryKey: ['tasks', user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user_id)
        .order('order', { ascending: true })

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user_id,
  })

  // ✅ Add Task
  const addTask = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('tasks').insert([taskData])
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
    },
  })

  // ✅ Delete Task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
    },
  })

  // ✅ Edit Task
  interface EditTaskData extends Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>> {
    id: string;
  }
  
  const editTask = useMutation({
    mutationFn: async ({ id, ...updatedData }: EditTaskData) => {
      // If tags exist, stringify them
      const payload = {
        ...updatedData,
        ...(updatedData.tags && { tags: JSON.stringify(updatedData.tags) }),
      }
  
      const { data, error } = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
  
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
    },
  })


  // updateOrder

  const updateOrder = useMutation({
    mutationFn: async (orderedTasks: { id: string, order: number }[]) => {
      for (const task of orderedTasks) {
        const { error } = await supabase
          .from('tasks')
          .update({ order: task.order })
          .eq('id', task.id)
        if (error) throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user_id] })
    },
  })
  
  

  return {
    fetchTasks,
    isLoading,
    error,
    addTask,
    deleteTask,
    editTask,
    refetch,
    updateOrder
  }
}
