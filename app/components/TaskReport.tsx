'use client'

import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTasks } from '@/hooks/useTasks'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'

ChartJS.register(ArcElement, Tooltip, Legend)

const TaskReport = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const { fetchTasks } = useTasks(userId ?? '')
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  })

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

  useEffect(() => {
    if (!fetchTasks) return

    const totalTasks = fetchTasks.length
    const completedTasks = fetchTasks.filter((task) => task.status === 'completed').length
    const pendingTasks = fetchTasks.filter((task) => task.status === 'pending').length

    setTaskStats({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
    })
  }, [fetchTasks])

  const chartData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        label: 'Task Status',
        data: [taskStats.completed, taskStats.pending],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#ef5350'],
      },
    ],
  }

  return (
    <motion.div>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 pt-5">
      Total Tasks: <span className="font-bold text-gray-800 dark:text-white">{taskStats.total}</span><br />
      Completed Tasks: <span className="font-bold text-gray-800 dark:text-white">{taskStats.completed}</span><br />
      Pending Tasks: <span className="font-bold text-gray-800 dark:text-white">{taskStats.pending}</span>
    </p>
      <motion.div
        className="mb-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >

      </motion.div>
      {taskStats.total > 0 ? (
        <div className="relative max-w-[400px] min-h-[400px] m-auto">
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No tasks available to display.</p>
      )}
    </motion.div>
  )
}

export default TaskReport
