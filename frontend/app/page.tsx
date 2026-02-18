'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import Link from 'next/link'

interface Job {
  id: string
  url: string
  status: string
  created_at: string
  page_title?: string
}

export default function Dashboard() {
  const router = useRouter()

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await api.get('/api/v1/jobs?page=1&limit=10')
      return response.data.items as Job[]
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  })

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
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Your latest scraping tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                ) : jobs && jobs.length > 0 ? (
                  <div className="space-y-2">
                    {jobs.slice(0, 3).map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="block p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium truncate">{job.page_title || job.url}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(job.created_at), 'MMM dd, HH:mm')} • {job.status}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent jobs</p>
                )}
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
          </div>

          {jobs && jobs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <Link href={`/jobs/${job.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {job.page_title || job.url}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  job.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                                  job.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'}`}
                              >
                                {job.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {job.url}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>{format(new Date(job.created_at), 'MMM dd, HH:mm')}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}