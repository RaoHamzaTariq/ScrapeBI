'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { JobStatus } from '@/components/job-status'
import { ResultsViewer } from '@/components/results-viewer'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const jobId = params.id

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Details
            </h1>
            <p className="text-gray-600 mt-1">Monitor and manage your scraping job</p>
          </div>
          <Button
            onClick={() => router.push('/jobs/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            New Job
          </Button>
        </div>

        <div className="mb-8">
          <JobStatus jobId={jobId} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              View and download the scraped content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsViewer jobId={jobId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}