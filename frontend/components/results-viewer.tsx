import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Eye } from 'lucide-react'
import { JobStatusIndicator } from './job-status'

interface Job {
  id: string
  status: string
  screenshot_path: string | null
  html_path: string | null
  text_content: string | null
  extract_text: boolean
  extract_html: boolean
  capture_screenshot: boolean
}

interface ResultsViewerProps {
  job: Job
}

export function ResultsViewer({ job }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState('preview')

  // Download result
  const downloadResult = async (type: 'html' | 'text' | 'screenshot') => {
    try {
      window.open(`/api/v1/jobs/${job.id}/download/${type}`, '_blank')
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  // Preview result (open in new tab)
  const previewResult = async (type: 'html' | 'text' | 'screenshot') => {
    try {
      window.open(`/api/v1/jobs/${job.id}/preview?result_type=${type}`, '_blank')
    } catch (err) {
      console.error('Preview error:', err)
    }
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
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewResult('html')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResult('html')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <Card className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
                <pre className="text-xs">
                  {job.text_content && (job.text_content.length < 10000)
                    ? job.text_content
                    : 'HTML content too large to display. Use Preview or Download to view.'}
                </pre>
              </Card>
            </TabsContent>
          )}

          {job.extract_text && (
            <TabsContent value="text" className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewResult('text')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResult('text')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <Card className="p-4 bg-gray-50 min-h-[200px] whitespace-pre-wrap">
                {job.text_content ? (
                  <>{job.text_content}</>
                ) : (
                  <p className="text-gray-500">No text content extracted</p>
                )}
              </Card>
            </TabsContent>
          )}

          {job.capture_screenshot && (
            <TabsContent value="screenshot" className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewResult('screenshot')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResult('screenshot')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex justify-center">
                {job.screenshot_path ? (
                  <img
                    src={`/api/v1/jobs/${job.id}/preview?result_type=screenshot`}
                    alt="Screenshot result"
                    className="max-w-full h-auto border rounded"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 w-full border-2 border-dashed rounded-md">
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