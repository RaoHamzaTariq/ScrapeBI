'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useJob, useCancelJob, useJobSSE } from '@/lib/hooks'
import { JobResponse, JobStatus as JobStatusType, SSEUpdate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface JobStatusProps {
  jobId: string
  onStatusChange?: (status: JobStatusType) => void
}

// Status badge color based on job status
const getStatusColor = (status: JobStatusType) => {
  switch (status) {
    case JobStatusType.COMPLETED:
      return 'bg-green-100 text-green-800'
    case JobStatusType.RUNNING:
      return 'bg-amber-100 text-amber-800'
    case JobStatusType.FAILED:
    case JobStatusType.TIMEOUT:
      return 'bg-red-100 text-red-800'
    case JobStatusType.PENDING:
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

interface JobStatusIndicatorProps {
  status: JobStatusType;
}

export function JobStatusIndicator({ status }: JobStatusIndicatorProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function JobStatus({ jobId, onStatusChange }: JobStatusProps) {
  const router = useRouter()
  const { data: jobData, isLoading, isError, refetch, isRefetching } = useJob(jobId)
  const job = jobData as JobResponse | undefined
  const cancelMutation = useCancelJob()
  const [isSSEConnected, setIsSSEConnected] = useState(false)
  const sseRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle SSE connection
  const handleSSEMessage = (data: SSEUpdate) => {
    if (onStatusChange && data.status) {
      onStatusChange(data.status)
    }
  }

  const { connect } = useJobSSE(jobId, handleSSEMessage)

  // Setup SSE connection
  useEffect(() => {
    // Try to connect to SSE
    try {
      sseRef.current = connect()
      setIsSSEConnected(true)

      // Clean up on unmount
      return () => {
        if (sseRef.current) {
          sseRef.current.close()
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
      }
    } catch (error) {
      console.error('SSE connection failed, falling back to polling:', error)
      setIsSSEConnected(false)
    }
  }, [jobId])

  // Handle job status changes
  useEffect(() => {
    if (job?.status && onStatusChange) {
      onStatusChange(job.status)
    }
  }, [job?.status, onStatusChange])

  // Cancel job
  const handleCancel = async () => {
    if (!job || job.status !== 'pending') return

    cancelMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success('Job cancelled successfully')
        router.refresh()
      },
      onError: (error) => {
        console.error('Error cancelling job:', error)
        toast.error('Failed to cancel job', {
          description: error.message || 'Please try again'
        })
      }
    })
  }

  // Calculate duration
  const calculateDuration = () => {
    if (!job) return '0s'

    if (job.started_at && job.completed_at) {
      const start = new Date(job.started_at)
      const end = new Date(job.completed_at)
      const duration = Math.floor((end.getTime() - start.getTime()) / 1000)
      return `${duration}s`
    } else if (job.started_at) {
      const start = new Date(job.started_at)
      const now = new Date()
      const duration = Math.floor((now.getTime() - start.getTime()) / 1000)
      return `${duration}s`
    }

    return '0s'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !job) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Job</CardTitle>
          <CardDescription>Failed to load job details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => refetch()}>
              <RotateCcw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Retrying...' : 'Retry'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                {job.page_title || 'Job Details'}
              </CardTitle>
              <JobStatusIndicator status={job.status} />
            </div>
            <CardDescription className="mt-1 break-all">
              {job.url}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            {job.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="flex items-center gap-1"
              >
                {cancelMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Canceling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-1"
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">{format(new Date(job.created_at), 'PPpp')}</p>
          </div>

          {job.started_at && (
            <div>
              <p className="text-sm text-gray-500">Started</p>
              <p className="font-medium">{format(new Date(job.started_at), 'PPpp')}</p>
            </div>
          )}

          {job.completed_at && (
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-medium">{format(new Date(job.completed_at), 'PPpp')}</p>
            </div>
          )}

          {job.started_at && (
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{calculateDuration()}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Render Strategy</p>
            <p className="font-medium capitalize">
              {job.render_strategy.replace('_', ' ')}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Content Types</p>
            <p className="font-medium">
              {job.extract_text && 'Text, '}
              {job.extract_html && 'HTML, '}
              {job.capture_screenshot && 'Screenshot'}
            </p>
          </div>
        </div>

        {job.status === 'running' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Processing...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Page is being scraped. Results will appear when complete.</p>
          </div>
        )}

        {job.error_message && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-800">Error Message</p>
            <p className="text-sm text-red-600 mt-1 break-words">{job.error_message}</p>
          </div>
        )}

        {isSSEConnected && (
          <div className="mt-4 text-xs text-green-600 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Connected to real-time updates
          </div>
        )}
      </CardContent>
    </Card>
  )
}