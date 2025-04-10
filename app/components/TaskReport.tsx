import React, { useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  status: 'completed' | 'pending'
}

const TaskReport = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTabs, setActiveTab] = useState<string>('Reports')

  useEffect(() => {
    // Here you should fetch the tasks data (from API, state, or props)
    // For demonstration, I'll use a mock list of tasks

    setTasks([
      { id: '1', title: 'Task 1', status: 'completed' },
      { id: '2', title: 'Task 2', status: 'pending' },
      { id: '3', title: 'Task 3', status: 'completed' },
      { id: '4', title: 'Task 4', status: 'pending' },
    ])
  }, [])

  const filteredTasks = tasks.filter((task) => {
    if (activeTabs === 'Reports') return task.status === 'completed'
    return true
  })

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Task Report</h2>
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setActiveTab('Reports')}
        >
          Reports Tab
        </button>
      </div>
      <div>
        <ul>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li key={task.id} className="border-b py-2">
                <h3 className="font-medium">{task.title}</h3>
                <p>Status: {task.status}</p>
              </li>
            ))
          ) : (
            <p>No tasks found for this status.</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default TaskReport
