import asyncio
import random
from contextlib import asynccontextmanager
from typing import Optional
from uuid import UUID
import re

from playwright.async_api import async_playwright, Browser, Page
from playwright_stealth import stealth_async

from app.config import settings
from app.core.exceptions import BrowserError, NetworkError, TimeoutError, ScrapingError
from app.models.job import RenderStrategy


class Scraper:
    def __init__(self, navigation_timeout: int = None, rendering_timeout: int = None):
        self.navigation_timeout = navigation_timeout or settings.default_navigation_timeout
        self.rendering_timeout = rendering_timeout or settings.default_rendering_timeout
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.playwright = None

    @asynccontextmanager
    async def context(self):
        """Async context manager for the scraper"""
        try:
            await self.setup_browser()
            yield self
        finally:
            await self.cleanup()

    async def setup_browser(self):
        """Launch browser with stealth configuration"""
        try:
            self.playwright = await async_playwright().start()

            # Random user agent to avoid detection
            user_agents = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
            ]

            # Launch browser with stealth options
            self.browser = await self.playwright.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                    "--disable-extensions",
                    "--disable-background-timer-throttling",
                    "--disable-backgrounding-occluded-windows",
                    "--disable-renderer-backgrounding"
                ]
            )

            # Create new browser context
            context = await self.browser.new_context(
                user_agent=random.choice(user_agents),
                viewport={'width': 1920, 'height': 1080},
                extra_http_headers={
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                }
            )

            # Create new page
            self.page = await context.new_page()

            # Apply stealth techniques
            await stealth_async(self.page)

            # Block unnecessary resources to speed up loading
            await self.page.route("**/*", self._block_resources)

        except Exception as e:
            raise BrowserError(f"Failed to setup browser: {str(e)}")

    async def _block_resources(self, route):
        """Block unnecessary resources like images, fonts, etc."""
        if route.request.resource_type in ["image", "stylesheet", "font", "media"]:
            return await route.abort()
        return await route.continue_()

    async def navigate_and_wait(self, url: str, render_strategy: str, wait_time: int = 0, wait_for_selector: Optional[str] = None):
        """Navigate to URL and wait according to strategy"""
        try:
            # Navigate to the URL with timeout
            response = await self.page.goto(url, timeout=self.navigation_timeout * 1000)

            # Apply rendering strategy
            if render_strategy == RenderStrategy.AUTO:
                # Wait for network to be idle
                await self.page.wait_for_load_state("networkidle", timeout=self.rendering_timeout * 1000)
            elif render_strategy == RenderStrategy.FIXED_DELAY:
                # Wait for specified time
                await self.page.wait_for_timeout(wait_time * 1000)
            elif render_strategy == RenderStrategy.WAIT_FOR_ELEMENT and wait_for_selector:
                # Wait for specific element to appear
                await self.page.wait_for_selector(wait_for_selector, timeout=self.rendering_timeout * 1000)
            else:
                # Default to networkidle
                await self.page.wait_for_load_state("networkidle", timeout=self.rendering_timeout * 1000)

        except Exception as e:
            raise NetworkError(f"Failed to navigate to URL or apply wait strategy: {str(e)}")

    async def extract_data(self, capture_screenshot: bool = True, extract_html: bool = True, extract_text: bool = True):
        """Extract data based on toggles"""
        result = {}

        try:
            # Capture screenshot if requested
            if capture_screenshot:
                screenshot = await self.page.screenshot(type="png", full_page=True)
                result["screenshot"] = screenshot

            # Extract HTML if requested
            if extract_html:
                html = await self.page.content()
                result["html"] = html.encode("utf-8")

            # Extract text if requested
            if extract_text:
                text = await self.page.inner_text("body")
                result["text"] = text.encode("utf-8")

            # Get additional metadata
            result["page_title"] = await self.page.title()
            result["final_url"] = self.page.url
            # Note: playwright doesn't directly provide HTTP status for main page, but we can get it for requests if needed

            return result

        except Exception as e:
            raise ScrapingError(f"Failed to extract data: {str(e)}")

    async def cleanup(self):
        """Clean up browser and context"""
        try:
            if self.page:
                await self.page.close()
                self.page = None
            if self.browser:
                await self.browser.close()
                self.browser = None
            if self.playwright:
                await self.playwright.stop()
                self.playwright = None
        except Exception as e:
            # Log the error but don't raise to avoid masking the original error
            print(f"Error during cleanup: {str(e)}")


def retry_async(max_retries: int = 3, backoff: list = [5, 15, 45]):
    """Decorator for retrying async functions with exponential backoff"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except (BrowserError, NetworkError, TimeoutError) as e:
                    last_exception = e
                    if attempt < max_retries:
                        wait_time = backoff[attempt % len(backoff)]
                        print(f"Attempt {attempt + 1} failed: {str(e)}. Retrying in {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    else:
                        print(f"Max retries exceeded after {max_retries + 1} attempts")
                        raise last_exception
                except Exception as e:
                    # For other exceptions, don't retry
                    raise e

            return last_exception
        return wrapper
    return decorator


async def scrape_url(
    url: str,
    render_strategy: str = RenderStrategy.AUTO,
    wait_time: int = 0,
    wait_for_selector: Optional[str] = None,
    capture_screenshot: bool = True,
    extract_html: bool = True,
    extract_text: bool = True
):
    """Main scraping function with retry logic"""
    async with Scraper().context() as scraper:
        # The scraper is already set up by the context manager
        # Navigate and wait based on strategy
        await scraper.navigate_and_wait(
            url=url,
            render_strategy=render_strategy,
            wait_time=wait_time,
            wait_for_selector=wait_for_selector
        )

        # Extract the requested data
        result = await scraper.extract_data(
            capture_screenshot=capture_screenshot,
            extract_html=extract_html,
            extract_text=extract_text
        )

        return result


# Apply the retry decorator to the function
scrape_url = retry_async()(scrape_url)