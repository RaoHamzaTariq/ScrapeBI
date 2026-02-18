class ScrapingError(Exception):
    """Base exception for scraping-related errors"""
    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(ScrapingError):
    """Exception raised for validation errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="VALIDATION_ERROR")


class TimeoutError(ScrapingError):
    """Exception raised for timeout errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="TIMEOUT_ERROR")


class StorageError(ScrapingError):
    """Exception raised for storage-related errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="STORAGE_ERROR")


class BrowserError(ScrapingError):
    """Exception raised for browser automation errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="BROWSER_ERROR")


class NetworkError(ScrapingError):
    """Exception raised for network-related errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="NETWORK_ERROR")


class SSLError(ScrapingError):
    """Exception raised for SSL-related errors"""
    def __init__(self, message: str):
        super().__init__(message, error_code="SSL_ERROR")