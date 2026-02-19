'use client'

import { useState, useEffect } from 'react'
import { useJob, useDownload, usePreview } from '@/lib/hooks'
import { JobResponse } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Eye, Copy, MonitorSmartphone } from 'lucide-react'
import { JobStatusIndicator } from './job-status'
import { Skeleton } from './ui/skeleton'
import { DownloadButton } from './download-button'

interface ResultsViewerProps {
  jobId: string
}

export function ResultsViewer({ jobId }: ResultsViewerProps) {
  const { data: jobData, isLoading, isError } = useJob(jobId)
  const job = jobData as JobResponse | undefined
  const [activeTab, setActiveTab] = useState<string | undefined>()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const downloadMutation = useDownload()
  const previewMutation = usePreview()
  const [copied, setCopied] = useState(false)

  // Set default active tab based on available content
  useEffect(() => {
    if (job) {
      if (job.capture_screenshot) setActiveTab('screenshot')
      else if (job.extract_text) setActiveTab('text')
      else if (job.extract_html) setActiveTab('html')
    }
  }, [job])

  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Error Loading Results</h3>
        <p className="mt-1 text-sm text-gray-500">
          Failed to load job results. Please try again.
        </p>
      </div>
    )
  }

  // Download result
  const handleDownload = async (type: 'html' | 'text' | 'screenshot') => {
    downloadMutation.mutate({ id: job.id, type })
  }

  // Preview result (open in new tab)
  const handlePreview = async (type: 'html' | 'text' | 'screenshot') => {
    previewMutation.mutate({ id: job.id, type })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <JobStatusIndicator status={job.status} />
          {job.status === 'completed' && (
            <span className="text-sm text-gray-600">
              Results available
            </span>
          )}
        </div>
      </div>

      {job.status === 'completed' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {job.extract_html && (
              <TabsTrigger value="html">HTML</TabsTrigger>
            )}
            {job.extract_text && (
              <TabsTrigger value="text">Text</TabsTrigger>
            )}
            {job.capture_screenshot && (
              <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
            )}
          </TabsList>

          {job.extract_html && (
            <TabsContent value="html" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <MonitorSmartphone className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Code View' : 'Preview'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => job.text_content && copyToClipboard(job.text_content)}
                  disabled={!job.text_content}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <DownloadButton
                  jobId={job.id}
                  resultType="html"
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DownloadButton>
              </div>
              {isPreviewMode ? (
                <Card className="p-0 overflow-hidden">
                  <iframe
                    src={`/api/v1/jobs/${job.id}/preview?result_type=html`}
                    className="w-full h-[500px] border-0"
                    title="HTML Preview"
                  />
                </Card>
              ) : (
                <Card className="p-0 overflow-hidden">
                  <pre className="text-xs p-4 max-h-[500px] overflow-auto bg-gray-900 text-gray-100">
                    {job.text_content && (job.text_content.length < 100000)
                      ? job.text_content
                      : 'HTML content too large to display. Use Download to view.'}
                  </pre>
                </Card>
              )}
            </TabsContent>
          )}

          {job.extract_text && (
            <TabsContent value="text" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => job.text_content && copyToClipboard(job.text_content)}
                  disabled={!job.text_content}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <DownloadButton
                  jobId={job.id}
                  resultType="text"
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DownloadButton>
              </div>
              <Card className="p-0 overflow-hidden">
                <pre className="text-sm p-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-words bg-gray-50">
                  {job.text_content ? (
                    job.text_content
                  ) : (
                    <p className="text-gray-500 italic">No text content extracted</p>
                  )}
                </pre>
              </Card>
            </TabsContent>
          )}

          {job.capture_screenshot && (
            <TabsContent value="screenshot" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview('screenshot')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open in Tab
                </Button>
                <DownloadButton
                  jobId={job.id}
                  resultType="screenshot"
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DownloadButton>
              </div>
              <div className="flex justify-center">
                {job.screenshot_path ? (
                  <img
                    src={`/api/v1/jobs/${job.id}/preview?result_type=screenshot`}
                    alt="Screenshot result"
                    className="max-w-full h-auto border rounded shadow-sm object-contain max-h-[600px]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
                    <p className="text-gray-500">No screenshot captured</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 rounded-full">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {job.status === 'pending'
              ? 'Job is pending'
              : job.status === 'running'
                ? 'Job is running'
                : 'Job not completed'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {job.status === 'pending'
              ? 'Your scraping job is queued and will start soon.'
              : job.status === 'running'
                ? 'The page is being scraped. Results will appear here when complete.'
                : 'Results will be available when the job is completed.'}
          </p>
        </div>
      )}
    </div>
  )
}