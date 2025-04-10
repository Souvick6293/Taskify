'use client'

import { useTasks } from '@/hooks/useTasks'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AddTaskModal from './AddTaskModal'
import { FaEdit, FaTrash, FaHeart, FaCheckCircle, FaClock } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'

type TaskListProps = {
  activeTab: string
}

export default function TaskList({ activeTab }: TaskListProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editTaskData, setEditTaskData] = useState<any | null>(null)
  const [isNewModal, isSetNewModal] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUserId(data.user.id)
    }
    getUser()

    const storedFavorites = localStorage.getItem('favoriteTasks')
    if (storedFavorites) {
      setFavoriteIds(JSON.parse(storedFavorites))
    }
  }, [])

  const toggleFavorite = (taskId: string) => {
    const updated = favoriteIds.includes(taskId)
      ? favoriteIds.filter((id) => id !== taskId)
      : [...favoriteIds, taskId]

    setFavoriteIds(updated)
    localStorage.setItem('favoriteTasks', JSON.stringify(updated))
  }

  const {
    fetchTasks,
    isLoading,
    error,
    deleteTask,
    refetch
  } = useTasks(userId ?? undefined)

  
  const filteredTasks = fetchTasks?.filter((task) => {
    if (activeTab === 'Completed') return task.status === 'completed'
    if (activeTab === 'Pending') return task.status === 'pending'
    if (activeTab === 'Favorites') return favoriteIds.includes(task.id)
    return true
  })

  if (isLoading) return <p>Loading tasks...</p>
  if (error) return <p>Error loading tasks</p>

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Custom Box for "All" Tab only */}
      {activeTab.toLowerCase().includes('all') && (
        <div
          className="border-2 border-dashed border-gray-500 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-center items-center"
          onClick={() => isSetNewModal(true)}
        >
          <h3 className="text-6xl font-semibold text-blue-700 dark:text-blue-300">+</h3>
          <p className="text-md text-blue-500 dark:text-blue-400">Add Task</p>
        </div>
      )}

      {/* Task Cards */}
      {filteredTasks?.map((task) => (
        <div
          key={task.id}
          className="bg-gray-200 dark:bg-gray-700 p-5 rounded-lg shadow-md relative"
        >
          <div className='flex flex-col content-between min-h-40'>
            <div className='absolute right-2 top-2'>
              {task.status === 'completed' ? (
                <FaCheckCircle className="text-green-500 text-lg" title="Completed" />
              ) : (
                <FaClock className="text-yellow-500 text-lg" title="Pending" />
              )}
            </div>

            <h3 className="text-lg font-semibold">{task.task_name}</h3>
            <p className="text-sm text-gray-500">{task.description}</p>

            {/* Tags */}
            {task.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(Array.isArray(task.tags) ? task.tags : JSON.parse(task.tags)).map(
                  (tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-blue-500 dark:bg-blue-600 text-white text-sm px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
              {/* Left side: Priority & Time */}
              <div className="flex items-center gap-4">
                <span className="capitalize text-sm">{task.priority}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(task.created_at), { addSuffix: true }).replace('about ', '')}
                </span>
              </div>

              {/* Right side: Favorite + Edit + Delete */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => toggleFavorite(task.id)}
                  className={`transition ${
                    favoriteIds.includes(task.id)
                      ? 'text-pink-500 scale-110'
                      : 'text-gray-400'
                  }`}
                >
                  <FaHeart />
                </button>
                <button
                  className="text-blue-500 hover:scale-110 transition"
                  onClick={() => {
                    setEditTaskData(task)
                    setIsModalOpen(true)
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditTaskData(null)
          refetch()
        }}
        editTaskData={editTaskData}
        // setEditTaskData={setEditTaskData}
      />
      <AddTaskModal
        isOpen={isNewModal}
        onClose={() => {
          isSetNewModal(false)
          refetch()
        }}
      />
    </div>
  )
}