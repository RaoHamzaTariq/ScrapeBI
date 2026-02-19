import { createJob, getJob, getJobResults, downloadResult, cancelJob } from '@/lib/api';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('API Client', () => {
  const mockJobData = {
    url: 'https://example.com',
    wait_time: 2,
    render_strategy: 'auto' as const,
    extract_text: true,
    extract_html: true,
    capture_screenshot: true,
  };

  const mockJobResponse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    url: 'https://example.com',
    status: 'pending' as const,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    wait_time: 2,
    render_strategy: 'auto',
    extract_text: true,
    extract_html: true,
    capture_screenshot: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should create a job successfully', async () => {
      mockedAxios.post.mockResolvedValue({ data: mockJobResponse });

      const result = await createJob(mockJobData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/jobs', mockJobData);
      expect(result).toEqual(mockJobResponse);
    });

    it('should handle error when creating job', async () => {
      const errorMessage = 'Invalid URL';
      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(createJob(mockJobData)).rejects.toThrow(errorMessage);
    });
  });

  describe('getJob', () => {
    it('should get job by ID successfully', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      mockedAxios.get.mockResolvedValue({ data: mockJobResponse });

      const result = await getJob(jobId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/v1/jobs/${jobId}`);
      expect(result).toEqual(mockJobResponse);
    });

    it('should handle error when getting job', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const errorMessage = 'Job not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getJob(jobId)).rejects.toThrow(errorMessage);
    });
  });

  describe('getJobResults', () => {
    it('should get job results successfully', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResults = {
        html: '<html>test</html>',
        text: 'test text',
        screenshot_url: 'http://example.com/screenshot.png'
      };
      mockedAxios.get.mockResolvedValue({ data: mockResults });

      const result = await getJobResults(jobId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/v1/jobs/${jobId}/results`);
      expect(result).toEqual(mockResults);
    });

    it('should handle error when getting job results', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const errorMessage = 'Results not available';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getJobResults(jobId)).rejects.toThrow(errorMessage);
    });
  });

  describe('downloadResult', () => {
    it('should download result file successfully', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const resultType = 'screenshot';
      const mockBlob = new Blob(['content'], { type: 'image/png' });

      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      const result = await downloadResult(jobId, resultType);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/jobs/${jobId}/download/${resultType}`,
        { responseType: 'blob' }
      );
      expect(result).toEqual(mockBlob);
    });

    it('should handle error when downloading result', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const resultType = 'screenshot';
      const errorMessage = 'File not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(downloadResult(jobId, resultType)).rejects.toThrow(errorMessage);
    });
  });

  describe('cancelJob', () => {
    it('should cancel job successfully', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      mockedAxios.delete.mockResolvedValue({ data: { ...mockJobResponse, status: 'cancelled' } });

      const result = await cancelJob(jobId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/v1/jobs/${jobId}`);
      expect(result.status).toBe('cancelled');
    });

    it('should handle error when cancelling job', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const errorMessage = 'Cannot cancel running job';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(cancelJob(jobId)).rejects.toThrow(errorMessage);
    });
  });
});