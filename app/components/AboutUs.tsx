'use client'

import { motion } from 'framer-motion'

const AboutUs = () => {
  return (
    <section className="py-12 px-6 md:px-12 bg-gray-200 dark:bg-gray-700 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
          About Us
        </h2>

        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-[700] m-auto">
          We provide an easy-to-use task management solution designed to help you stay organized, productive, and on top of your daily tasks. With TaskFlow Manager, you can effortlessly manage tasks, collaborate with teams, and get notifications so nothing falls through the cracks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Fast and Easy Task Creation
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Add new tasks and set deadlines in just seconds. Our intuitive interface allows you to create, edit, and manage your tasks effortlessly, keeping you on track without wasting time.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Secure Login
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Sign in easily with Google or custom credentials. Our secure authentication system ensures that your account is always protected while offering a seamless login experience.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Stay on Track
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Receive notifications and reminders so you never miss a deadline. Stay updated with your tasks, track progress, and remain productive throughout the day.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Easy to Use
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Our simple and intuitive design makes managing tasks a breeze. Whether you are an individual or part of a team, you can start using the tool right away with minimal setup.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Admin Features
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Admins have full control over tasks and users. They can assign tasks, monitor progress, and even moderate task-related activities to ensure smooth operations within the team.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Beyond Tasks
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {`It's not just about tasks. With our platform, you can manage deadlines, track project milestones, and collaborate seamlessly with your team to ensure success at every stage.`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
