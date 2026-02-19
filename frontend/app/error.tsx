'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Something went wrong!</h2>
          <p className="mt-2 text-sm text-gray-600">
            An unexpected error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 text-left rounded-md text-sm">
              <strong>Error:</strong> {error.message}<br />
              <strong>Digest:</strong> {error.digest}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => reset()}
            className="w-full"
          >
            Try again
          </Button>
          <Link href="/" passHref>
            <Button variant="outline" className="w-full">
              Go to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}