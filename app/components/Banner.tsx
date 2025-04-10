'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Banner = () => {
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
    <section className="relative">
      <div className='container'>
        <div className='flex flex-col md:grid md:grid-cols-2 items-center justify-center min-h-screen text-white text-center'>
          
          <motion.div
            className="max-w-3xl md:text-left"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-black dark:text-white">
              Manage Your Tasks <span className="text-yellow-500">Effortlessly</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-black dark:text-white">
              Stay on top of your work with our powerful and easy-to-use task management tool.
              Organize your daily tasks, collaborate with your team, and track progress in real-time.
              TaskFlow Manager helps you stay productive, efficient, and stress-free!
            </p>

            <div className="mt-6">
              <button
                onClick={handleGetStartedClick}
                className="px-6 py-3 rounded-full text-lg font-semibold dark:bg-white text-gray-900 shadow-md bg-gray-300 transition duration-300 cursor-pointer"
              >
                {`Get Started – It's Free!`}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 md:mt-0 md:pl-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/assets/banner-right.png"
              alt="Task Management"
              width={500}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Banner
