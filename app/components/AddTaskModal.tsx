'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  editTaskData?: FormData & { id?: string } | null
}

interface FormData {
  task_name: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  description: string
  deadline?: string
  reminder?: string
  tags?: string[]
}

const AddTaskModal = ({ isOpen, onClose, editTaskData = null }: AddTaskModalProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      task_name: '',
      priority: 'low',
      status: 'pending',
      description: '',
      deadline: '',
      reminder: '',
    },
  })

  const { addTask, editTask, refetch } = useTasks()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [user_id, setUserId] = useState<string | null>(null)

  const status = watch('status')

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
      } else {
        setUserId(data?.user?.id || null)
      }
    }
    fetchUser()
  }, [])


  useEffect(() => {
    if (editTaskData && isOpen) {
      console.log("Full editTaskData:", editTaskData)
  
      let tagData = editTaskData.tags
  
    
      if (typeof tagData === "string") {
        try {
          tagData = JSON.parse(tagData)
        } catch (err) {
          console.error("Tag parsing error:", err)
          tagData = []
        }
      }
  
      reset({
        ...editTaskData,
        tags: undefined,
      })
  
      setTags(Array.isArray(tagData) ? tagData : [])
    }
  }, [editTaskData, isOpen, reset])
  
  
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const onSubmit = (data: FormData) => {
    if (!user_id) {
      console.error('User not logged in.')
      return
    }

    const finalData = {
      ...data,
      deadline: data.deadline?.trim() === '' ? undefined : data.deadline,
      reminder: data.reminder?.trim() === '' ? undefined : data.reminder,
      tags,
      user_id,
    }

    if (editTaskData?.id) {
      editTask.mutate(
        { id: editTaskData.id, ...finalData },
        {
          onSuccess: () => {
            toast.success('Task updated successfully')
            refetch()
            reset()
            setTags([])
            onClose()
          },
          onError: (error) => {
            console.error('Failed to update task:', error)
            toast.error('Failed to update task')
          },
        }
      )
    } else {
      addTask.mutate(finalData, {
        onSuccess: () => {
          toast.success('Task added successfully')
          refetch()
          reset()
          setTags([])
          onClose()
        },
        onError: (error) => {
          console.error('Failed to add task:', error)
          toast.error('Failed to add task')
        },
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          {editTaskData ? 'Edit Task' : 'Add New Task'}
        </h2>

        <div className="mb-4">
          <label htmlFor="task_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Task Name
          </label>
          <input
            id="task_name"
            {...register('task_name', { required: 'Task name is required' })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter task name"
          />
          {errors.task_name && <p className="text-red-500 text-xs mt-1">{errors.task_name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
              maxLength: { value: 200, message: 'Max 200 characters allowed' },
            })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Write description (max 200 chars)"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Tags</label>
          <div className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 flex flex-wrap gap-2">
            {
              tags?.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-indigo-500 text-white px-3 py-1 rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="text-white hover:text-gray-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            <input
              type="text"
              placeholder="Type tag here"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 min-w-[120px] outline-none p-1 bg-transparent text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {status !== 'completed' && (
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              {...register('deadline')}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>}
          </div>
        )}

        {status !== 'completed' && (
          <div className="mb-4">
            <label htmlFor="reminder" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Reminder
            </label>
            <input
              type="datetime-local"
              id="reminder"
              {...register('reminder', {
                validate: (value) => {
                  const deadline = getValues('deadline')
                  if (!value) return true
                  if (!deadline) return 'Please select a deadline first'
                  return new Date(value).getTime() < new Date(deadline).getTime()
                    || 'Reminder must be before the deadline'
                },
              })}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.reminder && <p className="text-red-500 text-xs mt-1">{errors.reminder.message}</p>}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              reset()
              setTags([])
            }}
            className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-500"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {editTaskData ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal
