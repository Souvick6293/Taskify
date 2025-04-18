'use client'

import { useTasks } from '@/hooks/useTasks'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AddTaskModal from './AddTaskModal'
import { FaEdit, FaTrash, FaHeart, FaCheckCircle, FaClock } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import TaskReport from './TaskReport'

type TaskListProps = {
  activeTab: string
}

type Task = {
  id?: string
  task_name: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  description: string
  deadline?: string
  reminder?: string
  tags?: string[]

}


const priorityMap: { [key: string]: number } = {
  high: 3,
  medium: 2,
  low: 1
};

export default function TaskList({ activeTab: initialTab }: TaskListProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [editTaskData, setEditTaskData] = useState<Task | null>(null)
  const [isNewModal, setIsNewModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('default')
  const [filteredSuggestions, setFilteredSuggestions] = useState<Task[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  
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
    if (initialTab === 'Completed') return task.status === 'completed'
    if (initialTab === 'Pending') return task.status === 'pending'
    if (initialTab === 'Favorites') return favoriteIds.includes(task.id)
    if (initialTab === 'Task Reports') return false
    return true
  }).filter((task) =>
    task.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []


  const sortedTasks = () => {
    switch (selectedFilter) {
      case 'az':
        return [...filteredTasks].sort((a, b) => a.task_name.localeCompare(b.task_name))
      case 'za':
        return [...filteredTasks].sort((a, b) => b.task_name.localeCompare(a.task_name))
      case 'created_asc':
        return [...filteredTasks].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'created_desc':
        return [...filteredTasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'priority_high':
        return [...filteredTasks].sort(
          (a, b) => priorityMap[b.priority] - priorityMap[a.priority]
        )
      case 'priority_low':
        return [...filteredTasks].sort(
          (a, b) => priorityMap[a.priority] - priorityMap[b.priority]
        )
      default:
        return filteredTasks
    }
  }

  // Handle search query change and update suggestions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsDropdownOpen(true)

    const suggestions = fetchTasks?.filter((task) => {
      const taskTags = Array.isArray(task.tags) ? task.tags : JSON.parse(task.tags || '[]')
      return (
        task.task_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        task.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
        taskTags.some((tag: string) => tag.toLowerCase().includes(e.target.value.toLowerCase()))
      )
    })
    setFilteredSuggestions(suggestions ?? [])
  }

  const handleSuggestionClick = (task: Task) => {
    setSearchQuery(task.task_name)
    setIsDropdownOpen(false)
  }

  if (isLoading) return <p>Loading tasks...</p>
  if (error) return <p>Error loading tasks</p>
  if (initialTab === 'Task Reports') return <TaskReport />


  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md"
          />
          {isDropdownOpen && searchQuery && filteredSuggestions.length > 0 ? (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-60 overflow-y-auto z-10">
              {filteredSuggestions.map((task) => (
                <li
                  key={task.id}
                  className="cursor-pointer py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleSuggestionClick(task)}
                >
                  {task.task_name}
                </li>
              ))}
            </ul>
          ) : searchQuery && filteredSuggestions.length === 0 ? (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-60 z-10 p-2 text-center text-gray-500">
              No search available
            </div>
          ) : null}
        </div>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-md"
        >
          <option value="default">Default</option>
          <option value="az">Name (A-Z)</option>
          <option value="za">Name (Z-A)</option>
          <option value="created_asc">Created Date (Oldest)</option>
          <option value="created_desc">Created Date (Newest)</option>
          <option value="priority_high">Priority (High to Low)</option>
          <option value="priority_low">Priority (Low to High)</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
       
        {initialTab.toLowerCase().includes('all') && (
          <div
            className="border-2 border-dashed border-gray-500 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-center items-center"
            onClick={() => setIsNewModal(true)}
          >
            <h3 className="text-6xl font-semibold text-blue-700 dark:text-blue-300">+</h3>
            <p className="text-md text-blue-500 dark:text-blue-400">Add Task</p>
          </div>
        )}

        
        {sortedTasks().length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-10">
            No task available
          </div>
        ) : (
          sortedTasks().map((task) => (
            <div
              key={task.id}
              className="bg-gray-200 dark:bg-gray-700 p-5 rounded-lg shadow-md relative"
            >
              <div className="flex flex-col content-between min-h-50">
                <div className="absolute right-2 top-2">
                  {task.status === 'completed' ? (
                    <FaCheckCircle className="text-green-500 text-lg" title="Completed" />
                  ) : (
                    <FaClock className="text-yellow-500 text-lg" title="Pending" />
                  )}
                </div>

                <h3 className="text-lg font-semibold">{task.task_name}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-sm text-gray-500 py-2 font-bold">
                  Deadline: {task.deadline ? new Date(task.deadline).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }) : 'No deadline'}
                </p>

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
                  <div className="flex items-center gap-4">
                    <span className="capitalize text-sm">{task.priority}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(task.created_at), { addSuffix: true }).replace('about ', '')}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => toggleFavorite(task.id)}
                      className={`transition ${favoriteIds.includes(task.id)
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
          )))}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditTaskData(null)
            refetch()
          }}
          editTaskData={editTaskData}
        />
        <AddTaskModal
          isOpen={isNewModal}
          onClose={() => {
            setIsNewModal(false)
            refetch()
          }}
        />
      </div>
    </>
  )
}
