import { toast } from 'sonner';

// Define API error structure
export interface ApiError {
  detail?: string | { loc: string[]; msg: string; type: string }[];
  error_code?: string;
  message?: string;
}

// Parse error response from API
export function parseApiError(error: any): ApiError {
  if (!error) {
    return { detail: 'Unknown error occurred' };
  }

  // If it's already an ApiError object
  if (typeof error === 'object' && (error.detail || error.message)) {
    return error;
  }

  // If it's an axios error with response
  if (error.response && error.response.data) {
    return error.response.data as ApiError;
  }

  // If it's just a message
  if (error.message) {
    return { detail: error.message };
  }

  // Fallback
  return { detail: error.toString ? error.toString() : 'Unknown error occurred' };
}

// Show error toast
export function showError(error: any, title: string = 'Error'): void {
  const parsedError = parseApiError(error);
  const message = Array.isArray(parsedError.detail)
    ? parsedError.detail.map(err => err.msg).join(', ')
    : parsedError.detail || parsedError.message || 'An unknown error occurred';

  toast.error(title, {
    description: message,
  });
}

// Show success toast
export function showSuccess(message: string, title: string = 'Success'): void {
  toast.success(title, {
    description: message,
  });
}

// Handle API request with error handling
export async function handleApiRequest<T>(
  request: () => Promise<T>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    successTitle?: string;
    errorTitle?: string;
  } = {}
): Promise<T | null> {
  try {
    const result = await request();

    if (options.successMessage) {
      showSuccess(
        options.successMessage,
        options.successTitle || 'Success'
      );
    }

    return result;
  } catch (error) {
    const parsedError = parseApiError(error);
    const message = Array.isArray(parsedError.detail)
      ? parsedError.detail.map(err => err.msg).join(', ')
      : parsedError.detail || parsedError.message || options.errorMessage || 'Request failed';

    showError(
      { detail: message },
      options.errorTitle || 'Error'
    );

    return null;
  }
}