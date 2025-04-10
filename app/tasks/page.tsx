'use client'

import { useEffect, useState } from 'react'
import {
  FaTasks,
  FaCog,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import {
  IoCheckmarkDoneCircle
} from 'react-icons/io5'
import {
  MdPendingActions,
  MdOutlineFavorite
} from 'react-icons/md'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Profile from '../components/Profile'
import ThemeToggle from '../components/ThemeToggle'
import AddTaskModal from '../components/AddTaskModal'
import TaskList from '../components/TaskList'

const tabs = [
  { name: 'All Tasks', icon: FaTasks },
  { name: 'Completed', icon: IoCheckmarkDoneCircle },
  { name: 'Pending', icon: MdPendingActions },
  { name: 'Favorites', icon: MdOutlineFavorite },
]

export default function TaskManage() {
  const [activeTab, setActiveTab] = useState('All Tasks')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  return (
    <div className="flex h-screen relative overflow-hidden dark:bg-gray-900 bg-gray-200">

      {/* Mobile collapsed sidebar (icons only) */}
      {isMobile && !showMobileSidebar && (
        <div className="w-16 bg-indigo-700 text-white dark:bg-gray-900 flex flex-col items-center py-4 space-y-6">
          <button onClick={() => setShowMobileSidebar(true)}>
            <FaBars className="h-6 w-6" />
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                'p-2 rounded-md hover:bg-indigo-600',
                activeTab === tab.name && 'bg-indigo-800'
              )}
            >
              <tab.icon className="h-5 w-5" />
            </button>
          ))}
          <FaCog className="h-5 w-5 mt-auto" />
        </div>
      )}

      {/* Full sidebar for md+ and sliding mobile sidebar */}
      {(!isMobile || showMobileSidebar) && (
        <div
          className={cn(
            'bg-gray-200 text-black dark:text-white dark:bg-gray-900 p-4 flex flex-col transition-all duration-300',
            isMobile
              ? 'fixed z-50 top-0 left-0 h-full w-64 shadow-xl'
              : 'w-64 h-full'
          )}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-5 py-1 px-5 shadow-line rounded-lg">
              <Image
                src="/assets/mylogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="font-semibold leading-tight text-gray-800 dark:text-white">
                Taskflow
                <br />
                Manage
              </div>
            </div>
            {isMobile && (
              <button onClick={() => setShowMobileSidebar(false)}>
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name)
                  if (isMobile) setShowMobileSidebar(false)
                }}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 dark:hover:bg-gray-600 transition',
                  activeTab === tab.name && 'bg-yellow-400 dark:bg-gray-800'
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 text-gray-900 dark:text-white overflow-y-auto w-full">
        <div className=' px-6 py-4 bg-gray-200 dark:bg-gray-900 flex justify-end items-center gap-4'>
          <div className='flex bg-gray-300 dark:bg-gray-800 py-1 pr-4 gap-3 items-center rounded-3xl cursor-pointer'
            onClick={() => setIsModalOpen(true)}
          >
            <div className='text-md md:text-4xl bg-white dark:bg-gray-500 w-10 h-10 flex justify-center items-center rounded-full'>
              +
            </div>
            <div className='text-sm sm:text-base md:text-lg lg:text-xl'>
              Add New Task
            </div>
          </div>
          <div>
            <ThemeToggle />
          </div>
          <div>
            <Profile />
          </div>
        </div>
        <div className='p-6 min-h-screen bg-white dark:bg-gray-800 rounded-t-4xl'>
          <h1 className="text-2xl font-semibold mb-4">{activeTab}</h1>
          <div>
            <TaskList activeTab={activeTab} />
          </div>
        </div>
      </div>
      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
