'use client'

import { useState } from 'react'
import { useJobs } from '@/lib/hooks'
import { JobStatus, JobListResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface JobListProps {
  initialPage?: number
  limit?: number
}

export function JobList({ initialPage = 1, limit = 10 }: JobListProps) {
  const [page, setPage] = useState(initialPage)
  const { data, isLoading, isError, refetch } = useJobs(page, limit)
  const jobListData = data as JobListResponse | undefined

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Jobs</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load jobs. Please try again.</p>
          <Button className="mt-4" onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading && !jobListData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!jobListData || !jobListData.items || jobListData.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No scraping jobs found</p>
        </CardContent>
      </Card>
    )
  }

  // Status badge color based on job status
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case JobStatus.RUNNING:
        return 'bg-amber-100 text-amber-800'
      case JobStatus.FAILED:
      case JobStatus.TIMEOUT:
        return 'bg-red-100 text-red-800'
      case JobStatus.PENDING:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Jobs</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobListData.items.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {job.page_title || new URL(job.url).hostname}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{job.url}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(job.created_at), 'PPpp')}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination controls */}
        {jobListData && jobListData.pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= jobListData.pages}
                onClick={() => setPage(prev => Math.min(prev + 1, jobListData.pages))}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * limit, jobListData.total)}
                  </span>{' '}
                  of <span className="font-medium">{jobListData.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    disabled={page <= 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(jobListData.pages, 5) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, jobListData.pages - 4)) + i;
                    if (pageNum > jobListData.pages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === pageNum
                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    disabled={page >= jobListData.pages}
                    onClick={() => setPage(prev => Math.min(prev + 1, jobListData.pages))}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}