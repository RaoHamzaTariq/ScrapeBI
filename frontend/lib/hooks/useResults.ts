import { useMutation } from '@tanstack/react-query';
import { downloadResult, previewResult } from '../api';

export const useDownload = () => {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'html' | 'text' | 'screenshot' }) =>
      downloadResult(id, type),
    onSuccess: (blob, { type }) => {
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Set appropriate filename
      let filename = '';
      switch (type) {
        case 'html':
          filename = `job_${Date.now()}_page.html`;
          break;
        case 'text':
          filename = `job_${Date.now()}_content.txt`;
          break;
        case 'screenshot':
          filename = `job_${Date.now()}_screenshot.png`;
          break;
        default:
          filename = `job_${Date.now()}_result`;
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export const usePreview = () => {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'html' | 'text' | 'screenshot' }) =>
      previewResult(id, type),
    onSuccess: (url) => {
      // Open the preview in a new tab/window
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
};