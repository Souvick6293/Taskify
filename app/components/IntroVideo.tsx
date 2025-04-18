'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

const IntroVideo = () => {
const router = useRouter()
  const { user, isUserLoading } = useAuth()

  const handleGetStartedClick = () => {
    if (!isUserLoading) {
      if (user) {
        router.push('/tasks')
      } else {
        router.push('/login')
      }
    }
  }

    return (
        <div className="w-full min-h-screen py-8 bg-gray-100 dark:bg-gray-800 flex items-center">
            <div className='container'>
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6 text-center">
                    Manage Your Tasks Like a Pro
                </h2>
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                    <div className="flex justify-center items-center mb-6 sm:h-[300px] md:h-[400px] lg:h-[500px]">
                        <ReactPlayer
                            url='https://youtu.be/HjNC-vB9X38?si=alph5yeKq4O2mrAx'
                            width="100%"
                            height="100%"
                            controls={true}
                            muted={false}
                            loop={true}
                            onReady={() => console.log('Video is ready to play!')}
                        />
                    </div>
                    <p className="md:text-md lg:text-lg text-gray-700 dark:text-gray-300 text-center mb-8">
                        With the Taskify app, you can easily manage your daily tasks. This video will show you how to use the app to create tasks, stay organized, and manage deadlines. You’ll also be able to track task statuses and categorize them with custom tags for easy access.
                        After watching the video, follow the simple steps to start creating, managing, and completing your tasks in the app.
                    </p>
                    <div className="flex justify-center">
                        <a 
                            onClick={handleGetStartedClick}
                            className="px-6 py-3 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 rounded-full text-xl dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                        >
                            Start Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IntroVideo
