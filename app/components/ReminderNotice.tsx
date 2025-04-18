'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { supabase } from '@/lib/supabaseClient'
import clsx from 'clsx'

const ReminderNotice = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [todayReminders, setTodayReminders] = useState<string[]>([])
  const [showReminders, setShowReminders] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (user) setUserId(user.id)
      if (error) console.error('Error fetching user:', error.message)
    }

    getUser()
  }, [])

  const { fetchTasks, refetch } = useTasks(userId ?? '')

  useEffect(() => {
    if (!fetchTasks || fetchTasks.length === 0) return

    const now = new Date()

    const reminders = fetchTasks
      .filter((task) => task.reminder)
      .filter((task) => {
        const reminderDate = new Date(task.reminder as string)
        const diff = Math.abs(reminderDate.getTime() - now.getTime())
        return diff <= 60000 
      })
      .map((task) => task.task_name)

    setTodayReminders(reminders)

    console.log('Fetched Tasks:', fetchTasks)
    console.log('Filtered Reminders:', reminders)
  }, [fetchTasks]) 


  useEffect(() => {
    const interval = setInterval(async () => {
      if (refetch) {
        console.log('Refetching tasks...')
        await refetch()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [refetch])

  const toggleReminders = () => setShowReminders((prev) => !prev)
  const closeReminders = () => setShowReminders(false)

  const handleDismiss = (task: string) => {
    setDismissed((prev) => [...prev, task])
    setTimeout(() => {
      setTodayReminders((prev) => prev.filter((t) => t !== task))
    }, 300)
  }

  const visibleReminders = todayReminders.filter((task) => !dismissed.includes(task))

  const hasReminders = visibleReminders.length > 0

  return (
    <div className="relative">
      <button
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-200"
        onClick={toggleReminders}
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {hasReminders && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {showReminders && (
        <div className="relative">
          <div className="absolute top-[10px] right-4 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-600 z-20"></div>

          <div className="absolute right-0 mt-4 w-64 md:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg p-4 z-10 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700 dark:text-gray-100">Reminders</h3>
              <button
                onClick={closeReminders}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {visibleReminders.length > 0 ? (
              <ul className="space-y-2">
                {visibleReminders.map((task, index) => (
                  <li
                    key={index}
                    className={clsx(
                      'flex justify-between items-start text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded transition-all duration-300',
                      {
                        'opacity-100 translate-x-0': !dismissed.includes(task),
                        'opacity-0 -translate-x-full': dismissed.includes(task),
                      }
                    )}
                  >
                    <span>{task}</span>
                    <button
                      onClick={() => handleDismiss(task)}
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      <X className="w-3 h-3 mt-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No reminders for now.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReminderNotice
