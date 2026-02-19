'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white border-gray-200 shadow-lg rounded-lg',
          title: 'text-gray-900 font-medium',
          description: 'text-gray-500 text-sm',
          error: 'bg-red-50 border-red-200',
          success: 'bg-green-50 border-green-200',
          warning: 'bg-amber-50 border-amber-200',
          info: 'bg-blue-50 border-blue-200',
        },
      }}
    />
  )
}