import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/toaster';
import JobForm from '@/components/job-form';

// Create a test query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the API functions
jest.mock('@/lib/api', () => ({
  createJob: jest.fn(),
}));

const mockedCreateJob = jest.requireMock('@/lib/api').createJob;

describe('JobForm', () => {
  const setup = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <JobForm />
        <Toaster />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    setup();

    expect(screen.getByLabelText(/URL to scrape/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wait time \(seconds\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Render strategy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Extract text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Extract HTML/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capture screenshot/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required URL field', async () => {
    setup();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/URL is required/i)).toBeInTheDocument();
    });
  });

  it('validates URL format', async () => {
    setup();

    const urlInput = screen.getByLabelText(/URL to scrape/i);
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid URL format/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    const mockJobResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com',
      status: 'pending',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      wait_time: 2,
      render_strategy: 'auto',
      extract_text: true,
      extract_html: true,
      capture_screenshot: true,
    };

    mockedCreateJob.mockResolvedValue(mockJobResponse);

    setup();

    // Fill in the form
    const urlInput = screen.getByLabelText(/URL to scrape/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const waitTimeInput = screen.getByLabelText(/Wait time \(seconds\)/i);
    fireEvent.change(waitTimeInput, { target: { value: '3' } });

    const strategySelect = screen.getByLabelText(/Render strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'fixed_delay' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateJob).toHaveBeenCalledWith({
        url: 'https://example.com',
        wait_time: 3,
        render_strategy: 'fixed_delay',
        extract_text: true,
        extract_html: true,
        capture_screenshot: true,
      });
    });
  });

  it('shows success message on successful submission', async () => {
    const mockJobResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com',
      status: 'pending',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      wait_time: 0,
      render_strategy: 'auto',
      extract_text: true,
      extract_html: true,
      capture_screenshot: true,
    };

    mockedCreateJob.mockResolvedValue(mockJobResponse);

    setup();

    const urlInput = screen.getByLabelText(/URL to scrape/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Job created successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failed submission', async () => {
    const errorMessage = 'Invalid URL or site not accessible';
    mockedCreateJob.mockRejectedValue(new Error(errorMessage));

    setup();

    const urlInput = screen.getByLabelText(/URL to scrape/i);
    fireEvent.change(urlInput, { target: { value: 'https://invalid-site.com' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    const mockJobResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com',
      status: 'pending',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      wait_time: 0,
      render_strategy: 'auto',
      extract_text: true,
      extract_html: true,
      capture_screenshot: true,
    };

    mockedCreateJob.mockResolvedValue(mockJobResponse);

    setup();

    const urlInput = screen.getByLabelText(/URL to scrape/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(urlInput).toHaveValue('');
    });
  });

  it('has default values for optional fields', () => {
    setup();

    const waitTimeInput = screen.getByLabelText(/Wait time \(seconds\)/i);
    expect(waitTimeInput).toHaveValue(0);

    const strategySelect = screen.getByLabelText(/Render strategy/i);
    expect(strategySelect).toHaveValue('auto');

    expect(screen.getByLabelText(/Extract text/i)).toBeChecked();
    expect(screen.getByLabelText(/Extract HTML/i)).toBeChecked();
    expect(screen.getByLabelText(/Capture screenshot/i)).toBeChecked();
  });
});