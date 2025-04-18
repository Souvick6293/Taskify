'use client'

import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import Profile from './Profile'
import { useAuth } from '@/hooks/useAuth'

const Header = () => {
  const { user } = useAuth()

  return (
    <div className="w-full py-4 bg-white dark:bg-gray-800 relative shadow z-[9]">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-1 px-2 md:px-5 shadow-line rounded-lg">
            <Image
              src="/assets/mylogo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="font-semibold leading-tight text-gray-800 dark:text-white text-md md:text-3xl">
              Taskify
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <ThemeToggle />

            {!user && (
              <div className="border flex items-center gap-3 rounded-3xl py-1  pl-2 md:pl-4 pr-1 cursor-pointer">
                <Link href="/login">Login</Link>
                <Link href="/signup" className="bg-[#0077ed] px-2 md:px-3 py-1 rounded-3xl text-white">
                  Signup
                </Link>
              </div>
            )}

            {user && <Profile />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
