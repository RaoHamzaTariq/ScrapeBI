'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { Download, RotateCcw, ExternalLink } from 'lucide-react'
import { JobStatusIndicator } from '@/components/job-status'
import { ResultsViewer } from '@/components/results-viewer'

interface Job {
  id: string
  url: string
  status: string
  created_at: string
  updated_at: string
  wait_time: number
  render_strategy: string
  wait_for_selector: string | null
  extract_text: boolean
  extract_html: boolean
  capture_screenshot: boolean
  screenshot_path: string | null
  html_path: string | null
  text_content: string | null
  page_title: string | null
  final_url: string | null
  http_status: number | null
  error_message: string | null
  retry_count: number
  started_at: string | null
  completed_at: string | null
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const jobId = params.id
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/api/v1/jobs/${jobId}`)
        setJob(response.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch job details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()

    // Set up polling for status updates if job is not complete
    let pollInterval: NodeJS.Timeout | null = null
    if (!['completed', 'failed', 'timeout'].includes(job?.status || '')) {
      pollInterval = setInterval(async () => {
        try {
          const response = await api.get(`/api/v1/jobs/${jobId}`)
          setJob(response.data)

          // Stop polling if job is complete
          if (['completed', 'failed', 'timeout'].includes(response.data.status)) {
            clearInterval(pollInterval!)
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, 3000) // Poll every 3 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [jobId])

  // Download result
  const downloadResult = async (type: 'html' | 'text' | 'screenshot') => {
    try {
      window.open(`/api/v1/jobs/${jobId}/download/${type}`, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load job details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              <div className="mt-4 flex space-x-3">
                <Button onClick={() => router.back()}>Go Back</Button>
                <Button variant="outline" onClick={() => router.refresh()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {job.page_title || job.url}
            </h1>
            <p className="text-gray-600 mt-1">{job.url}</p>
          </div>
          <Button
            onClick={() => router.push('/jobs/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Configuration and status information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <JobStatusIndicator status={job.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="mt-1">{format(new Date(job.created_at), 'PPpp')}</p>
                </div>
                {job.started_at && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Started</p>
                      <p className="mt-1">{format(new Date(job.started_at), 'PPpp')}</p>
                    </div>
                    {job.completed_at && (
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="mt-1">{format(new Date(job.completed_at), 'PPpp')}</p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-500">Render Strategy</p>
                  <p className="mt-1 capitalize">{job.render_strategy.replace('_', ' ')}</p>
                </div>
                {job.wait_for_selector && (
                  <div>
                    <p className="text-sm text-gray-500">Wait Selector</p>
                    <p className="mt-1 font-mono text-sm">{job.wait_for_selector}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Final URL</p>
                  <p className="mt-1 break-all">{job.final_url || job.url}</p>
                </div>
              </div>

              {job.error_message && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800">Error Message</p>
                  <p className="text-sm text-red-600 mt-1">{job.error_message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Download or view results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.status === 'completed' ? (
                <>
                  {job.extract_html && job.html_path && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => downloadResult('html')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download HTML
                    </Button>
                  )}
                  {job.extract_text && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => downloadResult('text')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Text
                    </Button>
                  )}
                  {job.capture_screenshot && job.screenshot_path && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => downloadResult('screenshot')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Screenshot
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Results will be available when the job is completed.
                </p>
              )}

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.refresh()}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              View and download the scraped content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsViewer job={job} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}