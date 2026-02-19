'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/components/job-form'

export default function CreateJobPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mr-4"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Scraping Job</h1>
            <p className="mt-2 text-gray-600">
              Configure your web scraping task and get results in seconds.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scraping Configuration</CardTitle>
            <CardDescription>
              Enter the URL and configure how to scrape the page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}