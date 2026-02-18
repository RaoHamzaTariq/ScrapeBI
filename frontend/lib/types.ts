// Enums
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
}

export enum RenderStrategy {
  AUTO = 'auto',
  FIXED_DELAY = 'fixed_delay',
  WAIT_FOR_ELEMENT = 'wait_for_element',
}

// Interfaces
export interface JobCreateRequest {
  url: string;
  wait_time?: number;
  render_strategy?: RenderStrategy;
  wait_for_selector?: string | null;
  extract_text?: boolean;
  extract_html?: boolean;
  capture_screenshot?: boolean;
}

export interface JobResponse {
  id: string;
  url: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  wait_time: number;
  render_strategy: RenderStrategy;
  wait_for_selector: string | null;
  extract_text: boolean;
  extract_html: boolean;
  capture_screenshot: boolean;
  screenshot_path: string | null;
  html_path: string | null;
  text_content: string | null;
  page_title: string | null;
  final_url: string | null;
  http_status: number | null;
  error_message: string | null;
  retry_count: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface JobListResponse {
  items: JobResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SSEUpdate {
  job_id: string;
  status: JobStatus;
  message?: string;
  progress?: number;
  timestamp: string;
}