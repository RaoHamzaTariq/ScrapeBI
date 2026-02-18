import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
  getJob,
  listJobs,
  createJob,
  cancelJob,
  createEventSource
} from '../api';
import { JobResponse, JobListResponse, JobCreateRequest, SSEUpdate } from '../types';

export const useJob = (id: string) => {
  return useQuery<JobResponse, Error>({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    refetchInterval: (data) => {
      // Only refetch while job is running or pending
      if (data && ['pending', 'running'].includes(data.status)) {
        return 3000; // Refetch every 3 seconds
      }
      return false; // Don't refetch when job is complete
    },
    staleTime: 1000, // Refresh immediately
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useJobs = (page: number = 1, limit: number = 10) => {
  return useQuery<JobListResponse, Error>({
    queryKey: ['jobs', page, limit],
    queryFn: () => listJobs(page, limit),
    staleTime: 5000, // Refresh every 5 seconds
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobCreateRequest) => createJob(data),
    onSuccess: (data) => {
      // Update cache with the new job
      queryClient.setQueryData(['job', data.id], data);

      // Invalidate and refetch the jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelJob(id),
    onSuccess: (_, id) => {
      // Update the specific job in cache
      queryClient.setQueryData(['job', id], (old: JobResponse) => ({
        ...old,
        status: 'failed' as const,
        error_message: 'Job was canceled by user'
      }));

      // Invalidate and refetch the jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useJobSSE = (id: string, onMessage: (data: SSEUpdate) => void) => {
  const queryClient = useQueryClient();

  const connect = () => {
    const eventSource = createEventSource(id);

    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data) as SSEUpdate;
        onMessage(data);

        // Update the job in cache
        queryClient.setQueryData(['job', id], (old: JobResponse) => ({
          ...old!,
          status: data.status,
          ...(data.message && { error_message: data.message }),
        }));
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    });

    eventSource.addEventListener('error', (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    });

    return eventSource;
  };

  return { connect };
};