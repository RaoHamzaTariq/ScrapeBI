-- Initialize database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    wait_time INTEGER DEFAULT 0,
    render_strategy VARCHAR(20) DEFAULT 'auto',
    wait_for_selector TEXT,
    extract_text BOOLEAN DEFAULT true,
    extract_html BOOLEAN DEFAULT true,
    capture_screenshot BOOLEAN DEFAULT true,
    screenshot_path TEXT,
    html_path TEXT,
    text_content TEXT,
    page_title TEXT,
    final_url TEXT,
    http_status INTEGER,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_at ON scraping_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_url ON scraping_jobs(url);