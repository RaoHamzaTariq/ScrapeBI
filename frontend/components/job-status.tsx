import { cn } from '@/lib/utils'

interface JobStatusIndicatorProps {
  status: string
}

export function JobStatusIndicator({ status }: JobStatusIndicatorProps) {
  const statusConfig = {
    pending: {
      text: 'Pending',
      color: 'bg-gray-100 text-gray-800',
    },
    running: {
      text: 'Running',
      color: 'bg-yellow-100 text-yellow-800',
    },
    completed: {
      text: 'Completed',
      color: 'bg-green-100 text-green-800',
    },
    failed: {
      text: 'Failed',
      color: 'bg-red-100 text-red-800',
    },
    timeout: {
      text: 'Timeout',
      color: 'bg-red-100 text-red-800',
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    text: status.charAt(0).toUpperCase() + status.slice(1),
    color: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
      config.color
    )}>
      {config.text}
    </span>
  )
}