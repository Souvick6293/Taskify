'use client'

import './globals.css'
import './style/common.css'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import CustomThemeProvider from './components/CustomThemeProvider'
import { Toaster } from 'react-hot-toast'
import Loader from './components/Loader'

const pagesWithLoader = ['/','/tasks', '/dashboard', '/admin']

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pagesWithLoader.includes(pathname)) {
      setLoading(true)

      const timer = setTimeout(() => {
        setLoading(false)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setLoading(false) 
    }
  }, [pathname])

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          <CustomThemeProvider>
            {loading && <Loader />}
            {children}
          </CustomThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
