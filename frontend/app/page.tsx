'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { JobList } from '@/components/job-list'

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ScrapeFlow Dashboard</h1>
            <Button
              onClick={() => router.push('/jobs/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              New Scraping Job
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Create a new scraping job</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Enter a URL to scrape and get results in seconds.
                </p>
                <Button
                  onClick={() => router.push('/jobs/new')}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Job
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple 3-step process</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Enter a URL to scrape</li>
                  <li>Configure scraping options</li>
                  <li>Get results (HTML, text, screenshot)</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Jobs</CardTitle>
                <CardDescription>Recent scraping tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <JobList limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}