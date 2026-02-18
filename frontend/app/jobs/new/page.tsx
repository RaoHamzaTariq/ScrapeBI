'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function CreateJobPage() {
  const router = useRouter()

  const [url, setUrl] = useState('')
  const [waitTime, setWaitTime] = useState(0)
  const [renderStrategy, setRenderStrategy] = useState('auto')
  const [waitForSelector, setWaitForSelector] = useState('')
  const [extractText, setExtractText] = useState(true)
  const [extractHtml, setExtractHtml] = useState(true)
  const [captureScreenshot, setCaptureScreenshot] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.post('/api/v1/jobs', {
        url,
        wait_time: parseInt(waitTime.toString()),
        render_strategy: renderStrategy,
        wait_for_selector: renderStrategy === 'wait_for_element' ? waitForSelector : null,
        extract_text: extractText,
        extract_html: extractHtml,
        capture_screenshot: captureScreenshot
      })

      toast.success('Scraping job created successfully!')
      router.push(`/jobs/${response.data.id}`)
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast.error(error.response?.data?.detail || 'Failed to create scraping job')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Scraping Job</h1>
          <p className="mt-2 text-gray-600">
            Configure your web scraping task and get results in seconds.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scraping Configuration</CardTitle>
            <CardDescription>
              Enter the URL and configure how to scrape the page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL to Scrape</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  The URL of the page you want to scrape
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="render-strategy">Render Strategy</Label>
                  <Select value={renderStrategy} onValueChange={setRenderStrategy}>
                    <SelectTrigger id="render-strategy">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Wait for network idle)</SelectItem>
                      <SelectItem value="fixed_delay">Fixed Delay</SelectItem>
                      <SelectItem value="wait_for_element">Wait for Element</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    How to wait for page content to load
                  </p>
                </div>

                {renderStrategy === 'fixed_delay' && (
                  <div className="space-y-2">
                    <Label htmlFor="wait-time">Wait Time (seconds)</Label>
                    <Input
                      id="wait-time"
                      type="number"
                      min="0"
                      max="60"
                      value={waitTime}
                      onChange={(e) => setWaitTime(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-500">
                      Time to wait before capturing content (0-60 seconds)
                    </p>
                  </div>
                )}

                {renderStrategy === 'wait_for_element' && (
                  <div className="space-y-2">
                    <Label htmlFor="wait-for-selector">CSS Selector to Wait For</Label>
                    <Input
                      id="wait-for-selector"
                      type="text"
                      placeholder=".content, #main"
                      value={waitForSelector}
                      onChange={(e) => setWaitForSelector(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      The element that should be present before capturing content
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content to Extract</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="extract-text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Extract Text
                    </Label>
                    <p className="text-sm text-gray-500">
                      Extract visible text content from the page
                    </p>
                  </div>
                  <Switch
                    id="extract-text"
                    checked={extractText}
                    onCheckedChange={setExtractText}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="extract-html" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Extract HTML
                    </Label>
                    <p className="text-sm text-gray-500">
                      Extract the full HTML of the page
                    </p>
                  </div>
                  <Switch
                    id="extract-html"
                    checked={extractHtml}
                    onCheckedChange={setExtractHtml}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="capture-screenshot" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Capture Screenshot
                    </Label>
                    <p className="text-sm text-gray-500">
                      Capture a full-page screenshot
                    </p>
                  </div>
                  <Switch
                    id="capture-screenshot"
                    checked={captureScreenshot}
                    onCheckedChange={setCaptureScreenshot}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Job...' : 'Create Scraping Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}