'use client'

import Image from 'next/image'

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Image
        src="/assets/loading.gif"        
        alt="Loading..."
        width={200}     
        height={200}
        priority
      />
    </div>
  )
}
