import { Button, ButtonProps } from '@/components/ui/button'
import { useDownload } from '@/lib/hooks'
import { Download } from 'lucide-react'

interface DownloadButtonProps extends ButtonProps {
  jobId: string
  resultType: 'html' | 'text' | 'screenshot'
}

export function DownloadButton({ jobId, resultType, children, ...props }: DownloadButtonProps) {
  const downloadMutation = useDownload()

  const handleClick = () => {
    downloadMutation.mutate({ id: jobId, type: resultType })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={downloadMutation.isPending}
      {...props}
    >
      {downloadMutation.isPending ? (
        <>
          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Downloading...
        </>
      ) : (
        children || (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download
          </>
        )
      )}
    </Button>
  )
}