'use client'

'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateJob } from '@/lib/hooks'
import { JobStatus, RenderStrategy } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { Controller } from 'react-hook-form'

// Define the form schema
const jobFormSchema = z.object({
  url: z.string().url('Please enter a valid URL').min(1, 'URL is required'),
  wait_time: z.number().min(0).max(60).optional(),
  render_strategy: z.nativeEnum(RenderStrategy),
  wait_for_selector: z.string().optional(),
  extract_text: z.boolean().default(true),
  extract_html: z.boolean().default(true),
  capture_screenshot: z.boolean().default(true),
})

type JobFormValues = z.infer<typeof jobFormSchema>

interface JobFormProps {
  onSubmit?: (jobId: string) => void
}

export function JobForm({ onSubmit }: JobFormProps) {
  const router = useRouter()
  const mutation = useCreateJob()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      url: '',
      wait_time: 0,
      render_strategy: RenderStrategy.AUTO,
      wait_for_selector: '',
      extract_text: true,
      extract_html: true,
      capture_screenshot: true,
    },
  })

  const renderStrategy = watch('render_strategy')

  const onSubmitHandler = async (data: JobFormValues) => {
    try {
      const response = await mutation.mutateAsync({
        url: data.url,
        wait_time: data.wait_time,
        render_strategy: data.render_strategy,
        wait_for_selector: data.wait_for_selector || null,
        extract_text: data.extract_text,
        extract_html: data.extract_html,
        capture_screenshot: data.capture_screenshot,
      })

      toast.success('Scraping job created successfully!')

      if (onSubmit) {
        onSubmit(response.id)
      } else {
        router.push(`/jobs/${response.id}`)
      }
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast.error(error.response?.data?.detail || 'Failed to create scraping job')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url">URL to Scrape *</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          {...register('url')}
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? "url-error" : undefined}
        />
        {errors.url && (
          <p id="url-error" className="text-sm text-red-600 mt-1">
            {errors.url.message}
          </p>
        )}
        <p className="text-sm text-gray-500">
          The URL of the page you want to scrape
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="render-strategy">Render Strategy *</Label>
          <Controller
            name="render_strategy"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="render-strategy" aria-label="Select render strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RenderStrategy.AUTO}>
                    Auto (Wait for network idle)
                  </SelectItem>
                  <SelectItem value={RenderStrategy.FIXED_DELAY}>
                    Fixed Delay
                  </SelectItem>
                  <SelectItem value={RenderStrategy.WAIT_FOR_ELEMENT}>
                    Wait for Element
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-sm text-gray-500">
            How to wait for page content to load
          </p>
        </div>

        {renderStrategy === RenderStrategy.FIXED_DELAY && (
          <div className="space-y-2">
            <Label htmlFor="wait-time">Wait Time (seconds)</Label>
            <Controller
              name="wait_time"
              control={control}
              render={({ field }) => (
                <Slider
                  id="wait-time"
                  min={0}
                  max={60}
                  step={1}
                  value={[field.value || 0]}
                  onValueChange={(value) => field.onChange(value[0])}
                  aria-label="Wait time in seconds"
                />
              )}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0s</span>
              <span>{watch('wait_time') || 0}s</span>
              <span>60s</span>
            </div>
          </div>
        )}

        {renderStrategy === RenderStrategy.WAIT_FOR_ELEMENT && (
          <div className="space-y-2">
            <Label htmlFor="wait-for-selector">CSS Selector to Wait For</Label>
            <Input
              id="wait-for-selector"
              placeholder=".content, #main"
              {...register('wait_for_selector')}
              aria-invalid={!!errors.wait_for_selector}
              aria-describedby={errors.wait_for_selector ? "selector-error" : undefined}
            />
            {errors.wait_for_selector && (
              <p id="selector-error" className="text-sm text-red-600 mt-1">
                {errors.wait_for_selector.message}
              </p>
            )}
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
          <Controller
            name="extract_text"
            control={control}
            render={({ field }) => (
              <Switch
                id="extract-text"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
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
          <Controller
            name="extract_html"
            control={control}
            render={({ field }) => (
              <Switch
                id="extract-html"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
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
          <Controller
            name="capture_screenshot"
            control={control}
            render={({ field }) => (
              <Switch
                id="capture-screenshot"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating Job...' : 'Create Scraping Job'}
        </Button>
      </div>
    </form>
  )
}